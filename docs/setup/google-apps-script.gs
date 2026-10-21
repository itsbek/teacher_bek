/**
 * Teacher Bek - lead storage for Google Sheets (v2, powers the Telegram bot).
 *
 * Paste this whole file into Extensions > Apps Script of a Google Sheet,
 * change SECRET below, then Deploy > Manage deployments > edit > New version
 * (or Deploy > New deployment > Web app the very first time).
 * See docs/setup/leads-setup.md for the full walkthrough.
 *
 * Requests are JSON: { secret, action, ... }
 *   append    { lead }
 *   update    { id, status, updatedAt? }              -> { lead }
 *   addNote   { id, text, at? }                       -> { lead }
 *   get       { id }                                  -> { lead }
 *   list      { statuses?, from?, to?, offset?, limit? } -> { leads, total }  (newest first)
 *   search    { query, offset?, limit? }              -> { leads, total }
 *   stats     { from?, to?, all? }                    -> { stats }
 * Responses are JSON: { ok: true, ... } or { ok: false, error: '...' }
 *
 * Backward compatible: existing rows keep working. Two columns, "notes" and
 * "history", are added at the END of the header row the first time a write happens.
 */

// Must match LEADS_SHEET_SECRET in Vercel. Use a long random string.
var SECRET = 'CHANGE_ME_TO_A_LONG_RANDOM_STRING';
var SHEET_NAME = 'Leads';

var HEADERS = [
  'id', 'createdAt', 'updatedAt', 'status', 'source', 'locale',
  'name', 'phone', 'email', 'program', 'forWhom', 'level', 'goal', 'message',
  'consentText', 'consentAt', 'page', 'referrer',
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
  'notes', 'history'
];
var STATUSES = ['new', 'contacted', 'trial', 'enrolled', 'lost'];
var MAX_PAGE = 50;

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

/** Returns the header row; appends any missing known columns at the end. Call inside a lock. */
function ensureHeaders_(sheet) {
  var width = Math.max(sheet.getLastColumn(), 1);
  var headers = sheet.getRange(1, 1, 1, width).getValues()[0].map(String);
  HEADERS.forEach(function (h) {
    if (headers.indexOf(h) === -1) {
      headers.push(h);
      sheet.getRange(1, headers.length).setValue(h).setFontWeight('bold');
    }
  });
  return headers;
}

function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);
    if (!body || body.secret !== SECRET) return json_({ ok: false, error: 'unauthorized' });
    switch (body.action) {
      case 'append':  return json_(append_(body.lead));
      case 'update':  return json_(update_(body.id, body.status, body.updatedAt));
      case 'addNote': return json_(addNote_(body.id, body.text, body.at));
      case 'get':     return json_(get_(body.id));
      case 'list':    return json_(list_(body));
      case 'search':  return json_(search_(body));
      case 'stats':   return json_(stats_(body));
      default:        return json_({ ok: false, error: 'unknown action' });
    }
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

// Opening the web app URL in a browser should not reveal anything.
function doGet() {
  return json_({ ok: false, error: 'POST only' });
}

// ---------- helpers ----------

function str_(v) {
  if (v === null || v === undefined) return '';
  if (Object.prototype.toString.call(v) === '[object Date]') return v.toISOString();
  return String(v);
}

function parseJsonArray_(v) {
  if (!v) return [];
  try {
    var a = JSON.parse(String(v));
    return Array.isArray(a) ? a : [];
  } catch (err) {
    return [];
  }
}

function ts_(iso) {
  var t = Date.parse(str_(iso));
  return isNaN(t) ? 0 : t;
}

/** Reads every data row as an object keyed by header name; missing columns become ''. */
function readAll_() {
  var sheet = getSheet_();
  var last = sheet.getLastRow();
  var cols = sheet.getLastColumn();
  if (last < 2 || cols < 1) return [];
  var headers = sheet.getRange(1, 1, 1, cols).getValues()[0].map(String);
  var values = sheet.getRange(2, 1, last - 1, cols).getValues();
  return values.map(function (v, idx) {
    var o = { _row: idx + 2 };
    for (var i = 0; i < headers.length; i++) o[headers[i]] = v[i];
    return o;
  });
}

function rowSummary_(r) {
  return {
    id: str_(r.id), createdAt: str_(r.createdAt), status: str_(r.status),
    name: str_(r.name), phone: str_(r.phone), program: str_(r.program),
    source: str_(r.source), locale: str_(r.locale), forWhom: str_(r.forWhom)
  };
}

function rowFull_(r) {
  var s = rowSummary_(r);
  s.updatedAt = str_(r.updatedAt);
  s.email = str_(r.email);
  s.level = str_(r.level);
  s.goal = str_(r.goal);
  s.message = str_(r.message);
  s.notes = parseJsonArray_(r.notes);
  s.history = parseJsonArray_(r.history);
  return s;
}

function findRow_(sheet, headers, id) {
  var last = sheet.getLastRow();
  if (last < 2) return -1;
  var col = headers.indexOf('id') + 1;
  var ids = sheet.getRange(2, col, last - 1, 1).getValues();
  for (var i = 0; i < ids.length; i++) {
    if (str_(ids[i][0]) === id) return i + 2;
  }
  return -1;
}

function setCell_(sheet, headers, row, name, value) {
  var range = sheet.getRange(row, headers.indexOf(name) + 1);
  range.setNumberFormat('@');
  range.setValue(value);
}

function getCell_(sheet, headers, row, name) {
  return sheet.getRange(row, headers.indexOf(name) + 1).getValue();
}

function fullRow_(sheet, headers, row) {
  var values = sheet.getRange(row, 1, 1, headers.length).getValues()[0];
  var o = { _row: row };
  for (var i = 0; i < headers.length; i++) o[headers[i]] = values[i];
  return rowFull_(o);
}

// ---------- writes (locked) ----------

function append_(lead) {
  if (!lead || !lead.id) return { ok: false, error: 'missing lead' };
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var sheet = getSheet_();
    var headers = ensureHeaders_(sheet);
    var utm = lead.utm || {};
    var status = lead.status || 'new';
    var data = {
      id: lead.id, createdAt: lead.createdAt, updatedAt: '', status: status,
      source: lead.source, locale: lead.locale, name: lead.name, phone: lead.phone,
      email: lead.email || '', program: lead.program || '', forWhom: lead.forWhom || '',
      level: lead.level || '', goal: lead.goal || '', message: lead.message || '',
      consentText: lead.consentText || '', consentAt: lead.consentAt || '',
      page: lead.page || '', referrer: lead.referrer || '',
      utm_source: utm.source || '', utm_medium: utm.medium || '',
      utm_campaign: utm.campaign || '', utm_term: utm.term || '', utm_content: utm.content || '',
      notes: '[]',
      history: JSON.stringify([{ status: status, at: lead.createdAt }])
    };
    var row = headers.map(function (h) { return data.hasOwnProperty(h) ? data[h] : ''; });
    var target = sheet.getLastRow() + 1;
    var range = sheet.getRange(target, 1, 1, headers.length);
    // Plain-text format so phone numbers like +84... are stored exactly as typed
    // and nothing a visitor types can be interpreted as a formula.
    range.setNumberFormat('@');
    range.setValues([row]);
    SpreadsheetApp.flush();
    return { ok: true };
  } finally {
    lock.releaseLock();
  }
}

function update_(id, status, updatedAt) {
  if (!id || STATUSES.indexOf(status) === -1) return { ok: false, error: 'bad input' };
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var sheet = getSheet_();
    var headers = ensureHeaders_(sheet);
    var row = findRow_(sheet, headers, id);
    if (row === -1) return { ok: false, error: 'lead not found' };
    var at = updatedAt || new Date().toISOString();
    var current = str_(getCell_(sheet, headers, row, 'status'));
    if (current !== status) {
      var history = parseJsonArray_(getCell_(sheet, headers, row, 'history'));
      history.push({ status: status, at: at });
      setCell_(sheet, headers, row, 'history', JSON.stringify(history));
      setCell_(sheet, headers, row, 'status', status);
    }
    setCell_(sheet, headers, row, 'updatedAt', at);
    SpreadsheetApp.flush();
    return { ok: true, lead: fullRow_(sheet, headers, row) };
  } finally {
    lock.releaseLock();
  }
}

function addNote_(id, text, at) {
  var clean = String(text || '').slice(0, 1000);
  if (!id || !clean) return { ok: false, error: 'bad input' };
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var sheet = getSheet_();
    var headers = ensureHeaders_(sheet);
    var row = findRow_(sheet, headers, id);
    if (row === -1) return { ok: false, error: 'lead not found' };
    var notes = parseJsonArray_(getCell_(sheet, headers, row, 'notes'));
    var when = at || new Date().toISOString();
    notes.push({ at: when, text: clean });
    setCell_(sheet, headers, row, 'notes', JSON.stringify(notes));
    setCell_(sheet, headers, row, 'updatedAt', when);
    SpreadsheetApp.flush();
    return { ok: true, lead: fullRow_(sheet, headers, row) };
  } finally {
    lock.releaseLock();
  }
}

// ---------- reads ----------

function get_(id) {
  if (!id) return { ok: false, error: 'bad input' };
  var rows = readAll_();
  for (var i = 0; i < rows.length; i++) {
    if (str_(rows[i].id) === id) return { ok: true, lead: rowFull_(rows[i]) };
  }
  return { ok: false, error: 'lead not found' };
}

function page_(rows, body) {
  var limit = Math.min(Math.max(Number(body.limit) || 10, 1), MAX_PAGE);
  var offset = Math.max(Number(body.offset) || 0, 0);
  rows.sort(function (a, b) { return ts_(b.createdAt) - ts_(a.createdAt) || b._row - a._row; }); // newest first
  return { ok: true, total: rows.length, leads: rows.slice(offset, offset + limit).map(rowSummary_) };
}

function list_(body) {
  // Default (old behaviour): open leads only. Pass statuses: [] for "all".
  var wanted = Array.isArray(body.statuses) ? body.statuses : ['new', 'contacted'];
  var from = body.from ? ts_(body.from) : 0;
  var to = body.to ? ts_(body.to) : 0;
  var rows = readAll_().filter(function (r) {
    if (wanted.length && wanted.indexOf(str_(r.status)) === -1) return false;
    var t = ts_(r.createdAt);
    if (from && t < from) return false;
    if (to && t >= to) return false;
    return true;
  });
  return page_(rows, body);
}

function fold_(s) {
  return String(s || '').toLowerCase()
    .replace(/đ/g, 'd').normalize('NFD').replace(/[̀-ͯ]/g, '');
}

function search_(body) {
  var q = fold_(body.query).trim();
  if (!q) return { ok: true, total: 0, leads: [] };
  var digits = q.replace(/\D/g, '');
  var needle = digits.length >= 3 ? digits.replace(/^0/, '') : '';
  var rows = readAll_().filter(function (r) {
    if (fold_(r.name).indexOf(q) !== -1) return true;
    if (fold_(r.email).indexOf(q) !== -1) return true;
    if (needle && String(r.phone || '').replace(/\D/g, '').indexOf(needle) !== -1) return true;
    return false;
  });
  return page_(rows, body);
}

function stats_(body) {
  var from = 0;
  var to = 0;
  var label = 'all';
  if (body.all !== true) {
    if (body.from) {
      from = ts_(body.from);
      to = body.to ? ts_(body.to) : 0;
      label = str_(body.from).slice(0, 10);
    } else {
      // Old behaviour: current month (UTC).
      var month = new Date().toISOString().slice(0, 7);
      from = Date.parse(month + '-01T00:00:00Z');
      label = month;
    }
  }
  var counts = { 'new': 0, contacted: 0, trial: 0, enrolled: 0, lost: 0 };
  var byProgram = {};
  var byLocale = {};
  var total = 0;
  var respSum = 0;
  var respN = 0;
  readAll_().forEach(function (r) {
    var t = ts_(r.createdAt);
    if (from && t < from) return;
    if (to && t >= to) return;
    total++;
    var status = str_(r.status);
    if (counts.hasOwnProperty(status)) counts[status]++;
    var p = str_(r.program) || '-';
    byProgram[p] = (byProgram[p] || 0) + 1;
    var l = str_(r.locale) || 'unknown';
    byLocale[l] = (byLocale[l] || 0) + 1;
    var history = parseJsonArray_(r.history);
    for (var i = 0; i < history.length; i++) {
      if (history[i] && history[i].status !== 'new') {
        var diff = ts_(history[i].at) - t;
        if (t && diff >= 0) { respSum += diff; respN++; }
        break;
      }
    }
  });
  return {
    ok: true,
    stats: {
      month: label, total: total, counts: counts,
      byProgram: byProgram, byLocale: byLocale,
      avgResponseMinutes: respN ? Math.round(respSum / respN / 60000) : null,
      responseSamples: respN
    }
  };
}
