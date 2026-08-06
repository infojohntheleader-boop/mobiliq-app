import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAuth } from '@/lib/verify-auth';
import { getSupabaseAdmin } from '@/lib/db';

export async function POST() {
  try {
    const user = await verifyAuth();
    if (user) {
      await getSupabaseAdmin().from('User').update({ sessionToken: null }).eq('id', user.id);
    }
    const cookieStore = await cookies();
    cookieStore.delete('session');
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to logout.' }, { status: 500 });
  }
}
