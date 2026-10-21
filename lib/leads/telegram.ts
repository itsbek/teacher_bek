/** Compatibility entry point for lib/leads/submit.ts; the bot itself lives in lib/telegram/. */
export { isTelegramConfigured } from '../telegram/config';
export { notifyTelegram } from '../telegram/notify';
