import { createClient } from '@supabase/supabase-js'

/**
 * Supabase client dengan SERVICE_ROLE key.
 * Hanya dipakai di server (Server Action) untuk:
 * - auth.admin.createUser
 * - insert wallet_members untuk user baru
 * Jangan pernah expose key ini ke client.
 */
export function createAdminClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !serviceRoleKey) {
        throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
    }
    return createClient(url, serviceRoleKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    })
}
