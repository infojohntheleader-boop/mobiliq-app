import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/db';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const { data: org } = await supabaseAdmin
    .from('Organization')
    .select('id, name, slug, brandColor, logo, phone')
    .eq('slug', slug)
    .single();

  if (!org) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const { data: services } = await supabaseAdmin
    .from('Service')
    .select('id, name, description, price, duration, addons:ServiceAddon(id, name, price)')
    .eq('orgId', org.id)
    .eq('isActive', true);

  return NextResponse.json({ org, services: services || [] });
}