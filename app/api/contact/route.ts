import type { NextRequest } from 'next/server';
import { handleLeadPost } from '@/lib/leads/handler';

export async function POST(request: NextRequest) {
  return handleLeadPost(request, 'contact');
}
