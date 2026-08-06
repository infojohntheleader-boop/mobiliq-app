import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/db';

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const { data: org } = await supabaseAdmin
    .from('Organization')
    .select('id')
    .eq('slug', slug)
    .single();

  if (!org) {
    return NextResponse.json({ error: 'Business not found.' }, { status: 404 });
  }

  const body = await req.json();

  const { data: booking, error } = await supabaseAdmin.from('Booking').insert({
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
    status: 'pending',
    notes: body.notes || null,
    orgId: org.id,
  }).select('id').single();

  if (error || !booking) {
    return NextResponse.json({ error: 'Failed to create booking.' }, { status: 500 });
  }

  // Insert addons
  if (body.addons && body.addons.length > 0) {
    const addonRows = body.addons.map((a: { name: string; price: number }) => ({
      bookingId: booking.id,
      addonName: a.name,
      addonPrice: a.price,
      orgId: org.id,
    }));
    await supabaseAdmin.from('BookingAddon').insert(addonRows);
  }

  return NextResponse.json({ success: true, bookingId: booking.id }, { status: 201 });
}
