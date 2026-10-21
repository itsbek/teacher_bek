#!/usr/bin/env node
/**
 * Configures the Telegram bot profile: commands, descriptions, menu button.
 * Idempotent: safe to run as often as you like.
 *
 *   TELEGRAM_BOT_TOKEN=... TELEGRAM_ADMIN_CHAT_IDS=123,456 node scripts/telegram-setup.mjs
 *
 * If the variables are not exported, they are read from .env.local (or .env) in the project root.
 * The token is never printed.
 */
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

function loadEnvFile(file) {
  const path = resolve(process.cwd(), file);
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/.exec(line);
    if (!m || process.env[m[1]]) continue;
    process.env[m[1]] = m[2].replace(/^(['"])(.*)\1$/, '$2');
  }
}
loadEnvFile('.env.local');
loadEnvFile('.env');

const token = process.env.TELEGRAM_BOT_TOKEN;
const adminIds = (process.env.TELEGRAM_ADMIN_CHAT_IDS ?? '').split(',').map((s) => s.trim()).filter(Boolean);
if (!token || adminIds.length === 0) {
  console.error('Missing TELEGRAM_BOT_TOKEN or TELEGRAM_ADMIN_CHAT_IDS.');
  process.exit(1);
}

const COMMANDS = [
  { command: 'start', description: 'Show the menu' },
  { command: 'new', description: 'New leads waiting for contact' },
  { command: 'leads', description: 'Browse all leads' },
  { command: 'today', description: 'Leads received today' },
  { command: 'stats', description: 'Monthly dashboard' },
  { command: 'search', description: 'Find a lead by name or phone' },
  { command: 'help', description: 'How this bot works' },
];
const DEFAULT_COMMANDS = [{ command: 'start', description: 'Start' }];

const DESCRIPTION = {
  en: 'Private lead desk for Teacher Bek. New enquiries from teacherbek.com arrive here as cards you can update with one tap.',
  vi: 'Bảng quản lý học viên tiềm năng của Teacher Bek. Các yêu cầu mới từ teacherbek.com sẽ hiện ở đây.',
};
const SHORT = {
  en: 'Private lead desk for teacherbek.com',
  vi: 'Quản lý học viên tiềm năng của teacherbek.com',
};

async function call(method, body) {
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(10000),
    });
    const data = await res.json();
    return data.ok ? { ok: true } : { ok: false, error: `${data.error_code} ${data.description}` };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message.replaceAll(token, '***') : 'network error' };
  }
}

const chatIdValue = (id) => (/^-?\d+$/.test(id) ? Number(id) : id);
const results = [];
async function step(label, method, body) {
  const r = await call(method, body);
  results.push({ label, ...r });
}

await step('default commands (minimal)', 'setMyCommands', { commands: DEFAULT_COMMANDS });
for (const id of adminIds) {
  await step(`commands for admin ${id}`, 'setMyCommands', {
    commands: COMMANDS,
    scope: { type: 'chat', chat_id: chatIdValue(id) },
  });
  await step(`menu button for admin ${id}`, 'setChatMenuButton', {
    chat_id: chatIdValue(id),
    menu_button: { type: 'commands' },
  });
}
await step('description (default/en)', 'setMyDescription', { description: DESCRIPTION.en });
await step('description (vi)', 'setMyDescription', { description: DESCRIPTION.vi, language_code: 'vi' });
await step('short description (default/en)', 'setMyShortDescription', { short_description: SHORT.en });
await step('short description (vi)', 'setMyShortDescription', { short_description: SHORT.vi, language_code: 'vi' });

console.log('Telegram bot setup');
for (const r of results) console.log(`  ${r.ok ? 'OK  ' : 'FAIL'} ${r.label}${r.ok ? '' : ` - ${r.error}`}`);
const failed = results.filter((r) => !r.ok).length;
console.log(`${results.length - failed}/${results.length} steps succeeded.`);
if (failed) console.log('Hint: each admin must press Start in the bot once before chat-scoped settings can apply.');
process.exit(failed ? 1 : 0);
