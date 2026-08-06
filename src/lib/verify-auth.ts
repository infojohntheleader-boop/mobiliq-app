import { cookies } from 'next/headers';
import { supabaseAdmin } from './db';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  orgId: string;
  orgName: string;
  orgSlug: string;
}

export async function verifyAuth(): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('session')?.value;

  if (!token) return null;

  const { data: user } = await supabaseAdmin
    .from('User')
    .select('id, email, name, role, orgId, Organization(name, slug)')
    .eq('sessionToken', token)
    .single();

  if (!user) return null;

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    orgId: user.orgId,
    orgName: user.Organization?.name || '',
    orgSlug: user.Organization?.slug || '',
  };
}
