import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/db';
import { hashPassword, generateToken, generateSlug } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, businessName } = await req.json();

    if (!name || !email || !password || !businessName) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 });
    }

    const hashedPassword = await hashPassword(password);
    const sessionToken = generateToken();
    const slug = generateSlug(businessName);

    // Check if email exists globally
    const { data: existingUser } = await getSupabaseAdmin()
      .from('User')
      .select('id')
      .eq('email', email.toLowerCase())
      .single();

    if (existingUser) {
      return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 });
    }

    // Create org
    const { data: org, error: orgErr } = await getSupabaseAdmin()
      .from('Organization')
      .insert({ name: businessName, slug })
      .select('id')
      .single();

    if (orgErr || !org) {
      return NextResponse.json({ error: 'Failed to create organization.' }, { status: 500 });
    }

    const orgData = org as Record<string, any>;

    // Create user (owner)
    const { error: userErr } = await getSupabaseAdmin().from('User').insert({
      email: email.toLowerCase(),
      password: hashedPassword,
      name,
      role: 'owner',
      orgId: orgData.id,
      sessionToken,
    });

    if (userErr) {
      // Clean up org
      await getSupabaseAdmin().from('Organization').delete().eq('id', orgData.id);
      return NextResponse.json({ error: 'Failed to create user.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, sessionToken, slug });
  } catch {
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
