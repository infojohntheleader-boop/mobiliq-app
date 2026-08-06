import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/verify-auth';
import { supabaseAdmin } from '@/lib/db';

export async function GET() {
  const user = await verifyAuth();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data } = await supabaseAdmin
    .from('Organization')
    .select('*')
    .eq('id', user.orgId)
    .single();

  return NextResponse.json(data);
}

export async function PUT(req: NextRequest) {
  const user = await verifyAuth();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();

  await supabaseAdmin
    .from('Organization')
    .update({
      name: body.name,
      phone: body.phone || null,
      address: body.address || null,
      brandColor: body.brandColor,
    })
    .eq('id', user.orgId);

  return NextResponse.json({ success: true });
}
