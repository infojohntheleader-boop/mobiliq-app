import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/verify-auth';
import { getSupabaseAdmin } from '@/lib/db';
import { hashPassword } from '@/lib/auth';

export async function GET() {
  const user = await verifyAuth();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data, error } = await getSupabaseAdmin()
    .from('User')
    .select('id, name, email, role, createdAt')
    .eq('orgId', user.orgId);

  if (error) return NextResponse.json({ error: 'Failed to load team.' }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const user = await verifyAuth();
  if (!user || user.role !== 'owner') {
    return NextResponse.json({ error: 'Only owners can add team members.' }, { status: 403 });
  }

  const body = await req.json();
  if (!body.name || !body.email || !body.password) {
    return NextResponse.json({ error: 'All fields required.' }, { status: 400 });
  }

  const hashedPassword = await hashPassword(body.password);

  const { error } = await getSupabaseAdmin().from('User').insert({
    email: body.email.toLowerCase(),
    password: hashedPassword,
    name: body.name,
    role: body.role || 'admin',
    orgId: user.orgId,
  });

  if (error) {
    if (error.message?.includes('duplicate') || error.code === '23505') {
      return NextResponse.json({ error: 'Email already in use.' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to add member.' }, { status: 500 });
  }

  return NextResponse.json({ success: true }, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const user = await verifyAuth();
  if (!user || user.role !== 'owner') {
    return NextResponse.json({ error: 'Only owners can remove members.' }, { status: 403 });
  }

  const { id } = await req.json();
  await getSupabaseAdmin().from('User').delete().eq('id', id).eq('orgId', user.orgId).neq('role', 'owner');
  return NextResponse.json({ success: true });
}
