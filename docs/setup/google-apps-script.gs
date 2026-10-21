/**
 * Teacher Bek - lead storage for Google Sheets.
 *
 * Paste this whole file into Extensions > Apps Script of a Google Sheet,
 * change SECRET below, then Deploy > New deployment > Web app.
 * See docs/setup/leads-setup.md for the full walkthrough.
 *
 * Requests are JSON: { secret, action: 'append' | 'update' | 'list' | 'stats', ... }
 * Responses are JSON: { ok: true, ... } or { ok: false, error: '...' }
 */

// Must match LEADS_SHEET_SECRET in Vercel. Use a long random string.
var SECRET = 'CHANGE_ME_TO_A_LONG_RANDOM_STRING';
var SHEET_NAME = 'Leads';

var HEADERS = [
  'id', 'createdAt', 'updatedAt', 'status', 'source', 'locale',
  'name', 'phone', 'email', 'program', 'forWhom', 'level', 'goal', 'message',
  'consentText', 'consentAt', 'page', 'referrer',
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'
];

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

function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);
    if (!body || body.secret !== SECRET) return json_({ ok: false, error: 'unauthorized' });
    switch (body.action) {
      case 'append': return json_(append_(body.lead));
      case 'update': return json_(update_(body.id, body.status, body.updatedAt));
      case 'list':   return json_(list_(body.limit, body.statuses));
      case 'stats':  return json_(stats_());
      default:       return json_({ ok: false, error: 'unknown action' });
    }
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

// Opening the web app URL in a browser should not reveal anything.
function doGet() {
  return json_({ ok: false, error: 'POST only' });
}

function append_(lead) {
  if (!lead || !lead.id) return { ok: false, error: 'missing lead' };
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var sheet = getSheet_();
    var utm = lead.utm || {};
    var row = [
      lead.id, lead.createdAt, '', lead.status || 'new', lead.source, lead.locale,
      lead.name, lead.phone, lead.email || '', lead.program || '', lead.forWhom || '',
      lead.level || '', lead.goal || '', lead.message || '',
      lead.consentText || '', lead.consentAt || '', lead.page || '', lead.referrer || '',
      utm.source || '', utm.medium || '', utm.campaign || '', utm.term || '', utm.content || ''
    ];
    var target = sheet.getLastRow() + 1;
    var range = sheet.getRange(target, 1, 1, HEADERS.length);
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

function findRow_(sheet, id) {
  var last = sheet.getLastRow();
  if (last < 2) return -1;
  var ids = sheet.getRange(2, 1, last - 1, 1).getValues();
  for (var i = 0; i < ids.length; i++) {
    if (ids[i][0] === id) return i + 2;
  }
  return -1;
}

function update_(id, status, updatedAt) {
  var allowed = ['new', 'contacted', 'trial', 'enrolled', 'lost'];
  if (!id || allowed.indexOf(status) === -1) return { ok: false, error: 'bad input' };
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var sheet = getSheet_();
    var row = findRow_(sheet, id);
    if (row === -1) return { ok: false, error: 'lead not found' };
    sheet.getRange(row, 3).setValue(updatedAt || new Date().toISOString());
    sheet.getRange(row, 4).setValue(status);
    return { ok: true };
  } finally {
    lock.releaseLock();
  }
}

function readAll_() {
  var sheet = getSheet_();
  var last = sheet.getLastRow();
  if (last < 2) return [];
  var values = sheet.getRange(2, 1, last - 1, HEADERS.length).getValues();
  return values.map(function (v) {
    var o = {};
    for (var i = 0; i < HEADERS.length; i++) o[HEADERS[i]] = v[i];
    return o;
  });
}

function list_(limit, statuses) {
  var n = Math.min(Math.max(Number(limit) || 10, 1), 50);
  var wanted = statuses && statuses.length ? statuses : ['new', 'contacted'];
  var rows = readAll_().filter(function (r) { return wanted.indexOf(r.status) !== -1; });
  rows.reverse(); // newest first
  return {
    ok: true,
    leads: rows.slice(0, n).map(function (r) {
      return {
        id: String(r.id), createdAt: String(r.createdAt), status: String(r.status),
        name: String(r.name), phone: String(r.phone), program: String(r.program || ''),
        source: String(r.source), locale: String(r.locale)
      };
    })
  };
}

function stats_() {
  var month = new Date().toISOString().slice(0, 7); // YYYY-MM (UTC)
  var counts = { 'new': 0, contacted: 0, trial: 0, enrolled: 0, lost: 0 };
  var total = 0;
  readAll_().forEach(function (r) {
    if (String(r.createdAt).slice(0, 7) !== month) return;
    total++;
    if (counts.hasOwnProperty(r.status)) counts[r.status]++;
  });
  return { ok: true, stats: { month: month, total: total, counts: counts } };
}
