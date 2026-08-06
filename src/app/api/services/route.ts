import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/verify-auth';
import { supabaseAdmin } from '@/lib/db';

export async function GET() {
  const user = await verifyAuth();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data, error } = await supabaseAdmin
    .from('Service')
    .select(`*, addons:ServiceAddon(*)`)
    .eq('orgId', user.orgId)
    .order('createdAt', { ascending: true });

  if (error) return NextResponse.json({ error: 'Failed to load services.' }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const user = await verifyAuth();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();

  // Add-on operations
  if (body.action === 'addAddon') {
    const { error } = await supabaseAdmin.from('ServiceAddon').insert({
      name: body.name,
      price: body.price,
      serviceId: body.serviceId,
      orgId: user.orgId,
    });
    if (error) return NextResponse.json({ error: 'Failed to add add-on.' }, { status: 500 });
    return NextResponse.json({ success: true });
  }

  if (body.action === 'deleteAddon') {
    await supabaseAdmin.from('ServiceAddon').delete().eq('id', body.addonId).eq('orgId', user.orgId);
    return NextResponse.json({ success: true });
  }

  // Create service
  const { data, error } = await supabaseAdmin.from('Service').insert({
    name: body.name,
    description: body.description || null,
    price: body.price,
    duration: body.duration,
    orgId: user.orgId,
  }).select('id').single();

  if (error) return NextResponse.json({ error: 'Failed to create service.' }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
