import 'server-only';

import { createClient as createSupabaseClient } from '@supabase/supabase-js';

/**
 * Privileged Supabase client using the service role key. Bypasses RLS.
 *
 * This module imports `server-only`, so any attempt to bundle it into browser
 * code is a build error. Use it ONLY for trusted server-side operations such as
 * token-validated public intake writes.
 */
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}
