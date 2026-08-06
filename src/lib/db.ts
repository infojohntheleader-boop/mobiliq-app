import { createClient } from '@supabase/supabase-js';

let _admin: any = null;

export function getSupabaseAdmin(): any {
  if (!_admin) {
    _admin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
  }
  return _admin;
}
