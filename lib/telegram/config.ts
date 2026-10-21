export function adminChatIds(): string[] {
  return (process.env.TELEGRAM_ADMIN_CHAT_IDS ?? '')
    .split(',')
    .map((x) => x.trim())
    .filter(Boolean);
}

export function isTelegramConfigured(): boolean {
  return Boolean(process.env.TELEGRAM_BOT_TOKEN && adminChatIds().length > 0);
}

export function isAdminId(id: number | undefined): boolean {
  return id !== undefined && adminChatIds().includes(String(id));
}

/** Length-safe constant-time comparison (hashes both sides so lengths never leak). */
export async function secretsMatch(given: string, expected: string): Promise<boolean> {
  const enc = new TextEncoder();
  const [a, b] = await Promise.all([
    crypto.subtle.digest('SHA-256', enc.encode(given)),
    crypto.subtle.digest('SHA-256', enc.encode(expected)),
  ]);
  const x = new Uint8Array(a);
  const y = new Uint8Array(b);
  let diff = 0;
  for (let i = 0; i < x.length; i++) diff |= x[i] ^ y[i];
  return diff === 0;
}
