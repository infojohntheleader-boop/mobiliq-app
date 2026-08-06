import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/verify-auth';
import { supabaseAdmin } from '@/lib/db';

export async function GET() {
  const user = await verifyAuth();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data, error } = await supabaseAdmin
    .from('Booking')
    .select('*')
    .eq('orgId', user.orgId)
    .order('date', { ascending: true });

  if (error) return NextResponse.json({ error: 'Failed to load bookings.' }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const user = await verifyAuth();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();

  const { data, error } = await supabaseAdmin.from('Booking').insert({
    customerName: body.customerName,
    customerEmail: body.customerEmail,
    customerPhone: body.customerPhone || null,
    vehicleMake: body.vehicleMake || null,
    vehicleModel: body.vehicleModel || null,
    vehicleYear: body.vehicleYear || null,
    vehicleColor: body.vehicleColor || null,
    serviceId: body.serviceId || null,
    serviceName: body.serviceName,
    servicePrice: body.servicePrice,
    date: body.date,
    time: body.time,
    status: body.status || 'pending',
    notes: body.notes || null,
    orgId: user.orgId,
  }).select('id').single();

  if (error) return NextResponse.json({ error: 'Failed to create booking.' }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
