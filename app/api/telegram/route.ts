import { after, NextResponse, type NextRequest } from 'next/server';
import { secretsMatch } from '@/lib/telegram/config';
import { handleUpdate } from '@/lib/telegram/router';
import type { TgUpdate } from '@/lib/telegram/types';

export const runtime = 'nodejs';
export const maxDuration = 30;

/** Runs slow work after the 200 has been sent; falls back to inline when not in a request scope. */
async function defer(task: () => Promise<void>): Promise<void> {
  try {
    after(task);
  } catch {
    await task();
  }
}

export async function POST(request: NextRequest) {
  const expected = process.env.TELEGRAM_WEBHOOK_SECRET;
  const given = request.headers.get('x-telegram-bot-api-secret-token') ?? '';
  if (!expected || !(await secretsMatch(given, expected))) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const update = (await request.json()) as TgUpdate;
    await defer(() => handleUpdate(update));
  } catch (err) {
    console.error('[telegram] webhook:', err instanceof Error ? err.message : 'unknown');
  }
  // Always 200 so Telegram does not retry.
  return NextResponse.json({ ok: true });
}
