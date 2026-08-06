import { cookies } from 'next/headers';
import { getSupabaseAdmin } from './db';

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

  const { data: user } = await getSupabaseAdmin()
    .from('User')
    .select('id, email, name, role, orgId, Organization(name, slug)')
    .eq('sessionToken', token)
    .single();

  if (!user) return null;

  const org = (user as any).Organization;
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    orgId: user.orgId,
    orgName: org?.name || '',
    orgSlug: org?.slug || '',
  };
}
