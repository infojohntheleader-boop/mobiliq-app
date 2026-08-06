import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/verify-auth';
import { getSupabaseAdmin } from '@/lib/db';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await verifyAuth();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const { data } = await getSupabaseAdmin()
    .from('Booking')
    .select('*')
    .eq('id', id)
    .eq('orgId', user.orgId)
    .single();

  if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(data);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await verifyAuth();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const body = await req.json();

  const { error } = await getSupabaseAdmin()
    .from('Booking')
    .update(body)
    .eq('id', id)
    .eq('orgId', user.orgId);

  if (error) return NextResponse.json({ error: 'Update failed.' }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await verifyAuth();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  await getSupabaseAdmin().from('Booking').delete().eq('id', id).eq('orgId', user.orgId);
  return NextResponse.json({ success: true });
}