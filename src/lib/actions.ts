'use server'

import { createClient } from './supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
export async function createWallet(prevState: any, formData: FormData) {
    const supabase = await createClient()
    const name = formData.get('name') as string

    if (!name) return { error: "Name is required" }

    try {
        // Use RPC function to handle atomic creation and bypass RLS for initial member insertion
        const { data: walletId, error } = await supabase.rpc('create_wallet_with_member', {
            _name: name,
            _currency: 'IDR'
        })

        if (error) {
            console.error('Wallet Creation RPC Error:', error)
            return { error: error.message }
        }

        // RPC returns the new wallet ID
        if (!walletId) {
            return { error: "Failed to create wallet (No ID returned)" }
        }

        ;(await cookies()).set('active_wallet_id', walletId, {
            path: '/',
            maxAge: 60 * 60 * 24 * 365,
        })

        revalidatePath('/dashboard')
    } catch (e) {
        console.error('Unexpected Error:', e)
        return { error: "An unexpected error occurred" }
    }

    // Redirect must be outside try/catch because logic throws 'NEXT_REDIRECT' error
    redirect('/dashboard')
}

export async function createWalletAndStay(formData: FormData) {
    const supabase = await createClient()
    const name = formData.get('name') as string

    if (!name) return { error: "Name is required" }

    try {
        const { data: walletId, error } = await supabase.rpc('create_wallet_with_member', {
            _name: name,
            _currency: 'IDR'
        })

        if (error) {
            console.error('Wallet Creation RPC Error:', error)
            return { error: error.message }
        }

        if (!walletId) {
            return { error: "Failed to create wallet (No ID returned)" }
        }

        ;(await cookies()).set('active_wallet_id', walletId, {
            path: '/',
            maxAge: 60 * 60 * 24 * 365,
        })

        revalidatePath('/wallets')
        revalidatePath('/dashboard')
    } catch (e) {
        console.error('Unexpected Error:', e)
        return { error: "An unexpected error occurred" }
    }

    redirect('/wallets')
}

export async function setActiveWallet(formData: FormData) {
    const supabase = await createClient()
    const walletId = formData.get('walletId') as string
    const redirectTo = formData.get('redirectTo') as string | null

    if (!walletId) {
        return { error: 'Wallet ID tidak ditemukan' }
    }

    const { data, error } = await supabase
        .from('wallets')
        .select('id')
        .eq('id', walletId)
        .single()

    if (error || !data) {
        return { error: 'Dompet tidak valid atau tidak memiliki akses' }
    }

    ;(await cookies()).set('active_wallet_id', walletId, {
        path: '/',
        maxAge: 60 * 60 * 24 * 365,
    })

    revalidatePath('/dashboard')
    revalidatePath('/transactions')
    revalidatePath('/categories')
    revalidatePath('/reports')
    revalidatePath('/wallets')

    if (redirectTo) {
        redirect(redirectTo)
    }

    return { success: true }
}

async function getOrCreateTransferCategory(
    walletId: string,
    type: 'income' | 'expense',
    name: string
) {
    const supabase = await createClient()
    const { data: existing } = await supabase
        .from('categories')
        .select('id')
        .eq('wallet_id', walletId)
        .ilike('name', name)
        .eq('type', type)
        .maybeSingle()

    if (existing?.id) return existing.id

    const { data: created, error } = await supabase
        .from('categories')
        .insert({
            wallet_id: walletId,
            name,
            type,
        })
        .select('id')
        .single()

    if (error || !created) {
        throw new Error(error?.message || 'Gagal membuat kategori transfer')
    }

    return created.id
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
export async function transferBetweenWallets(prevState: any, formData: FormData) {
    const supabase = await createClient()
    const fromWalletId = formData.get('fromWalletId') as string
    const toWalletId = formData.get('toWalletId') as string
    const amountRaw = formData.get('amount') as string
    const date = formData.get('date') as string
    const description = (formData.get('description') as string | null) || null

    if (!fromWalletId || !toWalletId || !amountRaw || !date) {
        return { error: 'Lengkapi semua field yang wajib.' }
    }

    if (fromWalletId === toWalletId) {
        return { error: 'Dompet asal dan tujuan tidak boleh sama.' }
    }

    const amount = Number(amountRaw)
    if (!Number.isFinite(amount) || amount <= 0) {
        return { error: 'Jumlah transfer tidak valid.' }
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { error: 'User tidak ditemukan.' }
    }

    const { data: wallets } = await supabase
        .from('wallets')
        .select('id, name')
        .in('id', [fromWalletId, toWalletId])

    const fromWalletName = wallets?.find((w) => w.id === fromWalletId)?.name || 'Dompet Asal'
    const toWalletName = wallets?.find((w) => w.id === toWalletId)?.name || 'Dompet Tujuan'

    try {
        const expenseCategoryId = await getOrCreateTransferCategory(
            fromWalletId,
            'expense',
            'Transfer Keluar'
        )
        const incomeCategoryId = await getOrCreateTransferCategory(
            toWalletId,
            'income',
            'Transfer Masuk'
        )

        const timestamp = new Date(date).toISOString()
        const sourceDescription = description || `Transfer ke ${toWalletName}`
        const targetDescription = description || `Transfer dari ${fromWalletName}`

        const { error } = await supabase
            .from('transactions')
            .insert([
                {
                    wallet_id: fromWalletId,
                    user_id: user.id,
                    category_id: expenseCategoryId,
                    amount,
                    description: sourceDescription,
                    date: timestamp,
                },
                {
                    wallet_id: toWalletId,
                    user_id: user.id,
                    category_id: incomeCategoryId,
                    amount,
                    description: targetDescription,
                    date: timestamp,
                },
            ])

        if (error) {
            return { error: error.message }
        }
    } catch (error) {
        return { error: error instanceof Error ? error.message : 'Gagal melakukan transfer.' }
    }

    revalidatePath('/dashboard')
    revalidatePath('/transactions')
    revalidatePath('/reports')
    revalidatePath('/wallets')

    return { success: 'Transfer berhasil.' }
}

export async function createTransaction(walletId: string, formData: FormData) {
    const supabase = await createClient()

    const amount = formData.get('amount')
    const description = formData.get('description')
    const categoryId = formData.get('categoryId')
    const date = formData.get('date')

    if (!amount || !categoryId || !date) {
        return { error: "Missing required fields" }
    }

    const { error } = await supabase
        .from('transactions')
        .insert({
            wallet_id: walletId,
            user_id: (await supabase.auth.getUser()).data.user?.id,
            category_id: categoryId,
            amount: parseFloat(amount as string),
            description: description,
            date: new Date(date as string).toISOString()
        })

    if (error) return { error: error.message }

    revalidatePath('/dashboard')
    revalidatePath('/transactions')
    redirect('/transactions')
}

export async function createCategory(walletId: string, formData: FormData) {
    const supabase = await createClient()

    const name = formData.get('name') as string
    const type = formData.get('type') as string

    if (!name || !type) {
        return { error: "Nama dan tipe kategori harus diisi" }
    }

    if (type !== 'income' && type !== 'expense') {
        return { error: "Tipe kategori tidak valid" }
    }

    const { error } = await supabase
        .from('categories')
        .insert({
            wallet_id: walletId,
            name: name.trim(),
            type: type
        })

    if (error) return { error: error.message }

    revalidatePath('/categories')
    revalidatePath('/transactions/new')
    return { success: true }
}

export async function updateCategory(categoryId: string, formData: FormData) {
    const supabase = await createClient()

    const name = formData.get('name') as string
    const type = formData.get('type') as string

    if (!name || !type) {
        return { error: "Nama dan tipe kategori harus diisi" }
    }

    if (type !== 'income' && type !== 'expense') {
        return { error: "Tipe kategori tidak valid" }
    }

    const { error } = await supabase
        .from('categories')
        .update({
            name: name.trim(),
            type: type
        })
        .eq('id', categoryId)

    if (error) return { error: error.message }

    revalidatePath('/categories')
    revalidatePath('/transactions/new')
    return { success: true }
}

export async function deleteCategory(categoryId: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', categoryId)

    if (error) return { error: error.message }

    revalidatePath('/categories')
    revalidatePath('/transactions/new')
    return { success: true }
}

export async function updateTransaction(transactionId: string, formData: FormData) {
    const supabase = await createClient()

    const amount = formData.get('amount')
    const description = formData.get('description')
    const categoryId = formData.get('categoryId')
    const date = formData.get('date')

    if (!amount || !categoryId || !date) {
        return { error: "Semua field wajib diisi" }
    }

    const { error } = await supabase
        .from('transactions')
        .update({
            category_id: categoryId,
            amount: parseFloat(amount as string),
            description: description,
            date: new Date(date as string).toISOString()
        })
        .eq('id', transactionId)

    if (error) return { error: error.message }

    revalidatePath('/dashboard')
    revalidatePath('/transactions')
    redirect('/transactions')
}

export async function deleteTransaction(transactionId: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', transactionId)

    if (error) return { error: error.message }

    revalidatePath('/dashboard')
    revalidatePath('/transactions')
    return { success: true }
}

export interface ImportTransactionData {
    date: string
    categoryName: string
    type: 'income' | 'expense'
    amount: number
    description: string
}

export async function importTransactions(walletId: string, transactions: ImportTransactionData[]) {
    const supabase = await createClient()
    const errors: string[] = []
    let successCount = 0

    // Get all categories for this wallet
    const { data: categories } = await supabase
        .from('categories')
        .select('id, name, type')
        .eq('wallet_id', walletId)

    if (!categories) {
        return { error: 'Gagal mengambil data kategori' }
    }

    // Get user ID
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { error: 'User tidak ditemukan' }
    }

    // Process each transaction
    for (const tx of transactions) {
        // Find or create category
        let categoryId = categories.find(
            cat => cat.name.toLowerCase() === tx.categoryName.toLowerCase() && cat.type === tx.type
        )?.id

        // Create category if it doesn't exist
        if (!categoryId) {
            const { data: newCategory, error: catError } = await supabase
                .from('categories')
                .insert({
                    wallet_id: walletId,
                    name: tx.categoryName,
                    type: tx.type
                })
                .select('id')
                .single()

            if (catError) {
                errors.push(`Gagal membuat kategori "${tx.categoryName}": ${catError.message}`)
                continue
            }

            categoryId = newCategory.id
            // Add to local cache
            categories.push({ id: categoryId, name: tx.categoryName, type: tx.type })
        }

        // Insert transaction
        const { error: txError } = await supabase
            .from('transactions')
            .insert({
                wallet_id: walletId,
                category_id: categoryId,
                user_id: user.id,
                amount: tx.amount,
                description: tx.description || null,
                date: new Date(tx.date).toISOString()
            })

        if (txError) {
            errors.push(`Gagal mengimpor transaksi ${tx.date}: ${txError.message}`)
        } else {
            successCount++
        }
    }

    revalidatePath('/dashboard')
    revalidatePath('/transactions')
    revalidatePath('/categories')

    if (errors.length > 0) {
        return {
            success: true,
            message: `Berhasil mengimpor ${successCount} transaksi. ${errors.length} error.`,
            errors
        }
    }

    return {
        success: true,
        message: `Berhasil mengimpor ${successCount} transaksi.`
    }
}

// ---------- Settings: undangan & akses wallet (hanya admin) ----------

export async function createWalletInvite(formData: FormData) {
    const supabase = await createClient()
    const walletId = formData.get('walletId') as string
    const email = (formData.get('email') as string)?.trim()
    const role = (formData.get('role') as string) || 'viewer'

    if (!walletId || !email) {
        return { error: 'Wallet dan email wajib diisi.' }
    }
    if (!['admin', 'editor', 'viewer'].includes(role)) {
        return { error: 'Role tidak valid.' }
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'User tidak ditemukan.' }

    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7)

    const { data: invite, error } = await supabase
        .from('wallet_invites')
        .insert({
            wallet_id: walletId,
            email,
            role,
            invited_by: user.id,
            expires_at: expiresAt.toISOString(),
        })
        .select('id, token, email, role, expires_at')
        .single()

    if (error) return { error: error.message }
    if (!invite) return { error: 'Gagal membuat undangan.' }

    revalidatePath('/settings')

    const token = (invite as { token: string }).token
    const invitePath = `/invite?token=${token}`

    return {
        success: true,
        inviteLink: invitePath,
        email: (invite as { email: string }).email,
        role: (invite as { role: string }).role,
    }
}

export async function removeWalletMember(walletId: string, userId: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('wallet_members')
        .delete()
        .eq('wallet_id', walletId)
        .eq('user_id', userId)

    if (error) return { error: error.message }
    revalidatePath('/settings')
    return { success: true }
}

export async function updateWalletMemberRole(formData: FormData) {
    const walletId = formData.get('walletId') as string
    const userId = formData.get('userId') as string
    const role = formData.get('role') as string
    if (!walletId || !userId || !role || !['admin', 'editor', 'viewer'].includes(role)) {
        return { error: 'Data tidak valid.' }
    }

    const supabase = await createClient()
    const { error } = await supabase
        .from('wallet_members')
        .update({ role })
        .eq('wallet_id', walletId)
        .eq('user_id', userId)

    if (error) return { error: error.message }
    revalidatePath('/settings')
    return { success: true }
}

export async function acceptWalletInvite(token: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user?.email) {
        return { success: false, error: 'Anda harus masuk dengan akun yang sesuai undangan.' }
    }

    const { data, error } = await supabase.rpc('accept_wallet_invite', {
        _token: token,
        _user_email: user.email,
    })

    if (error) {
        return { success: false, error: error.message }
    }

    const result = data as { success?: boolean; error?: string; wallet_id?: string }
    if (!result?.success) {
        return { success: false, error: result?.error || 'Gagal menerima undangan.' }
    }

    revalidatePath('/settings')
    revalidatePath('/wallets')
    revalidatePath('/dashboard')
    return { success: true, walletId: result.wallet_id }
}

export async function deleteWalletInvite(walletId: string, inviteId: string) {
    const supabase = await createClient()
    const { error } = await supabase
        .from('wallet_invites')
        .delete()
        .eq('id', inviteId)
        .eq('wallet_id', walletId)
    if (error) return { error: error.message }
    revalidatePath('/settings')
    return { success: true }
}

/** Jadikan user saat ini admin di semua wallet yang ia ikuti (satu kali, untuk koreksi data). */
export async function setSelfAdminAllWallets() {
    const supabase = await createClient()
    const { data, error } = await supabase.rpc('set_self_admin_all_wallets')
    if (error) return { error: error.message }
    const result = data as { success?: boolean; error?: string; updated?: number }
    if (!result?.success) return { error: result?.error ?? 'Gagal memperbarui peran.' }
    revalidatePath('/settings')
    revalidatePath('/wallets')
    return { success: true, updated: result?.updated ?? 0 }
}

/** Admin membuat akun user baru dan memilih wallet yang boleh diakses. User hanya akan melihat wallet yang diizinkan. */
export async function createUserByAdmin(formData: FormData) {
    const supabase = await createClient()
    const { data: { user: currentUser } } = await supabase.auth.getUser()
    if (!currentUser) return { error: 'Anda harus masuk sebagai admin.' }

    const email = (formData.get('email') as string)?.trim()
    const password = formData.get('password') as string
    const walletAssignmentsJson = formData.get('walletAssignments') as string

    if (!email || !password) return { error: 'Email dan password wajib diisi.' }
    if (password.length < 6) return { error: 'Password minimal 6 karakter.' }

    let assignments: { walletId: string; role: string }[]
    try {
        assignments = JSON.parse(walletAssignmentsJson || '[]')
    } catch {
        return { error: 'Pilih minimal satu wallet untuk user.' }
    }
    if (assignments.length === 0) return { error: 'Pilih minimal satu wallet untuk user.' }

    for (const a of assignments) {
        if (!a.walletId || !['admin', 'editor', 'viewer'].includes(a.role ?? '')) {
            return { error: 'Data wallet tidak valid.' }
        }
    }

    const walletsWithRole = await supabase
        .from('wallet_members')
        .select('wallet_id, role')
        .eq('user_id', currentUser.id)
        .eq('role', 'admin')
    const adminWalletIds = new Set((walletsWithRole.data ?? []).map((r) => r.wallet_id))

    for (const a of assignments) {
        if (!adminWalletIds.has(a.walletId)) {
            return { error: 'Anda bukan admin dari salah satu wallet yang dipilih.' }
        }
    }

    let adminClient: ReturnType<typeof import('@/lib/supabase/admin').createAdminClient>
    try {
        const { createAdminClient } = await import('@/lib/supabase/admin')
        adminClient = createAdminClient()
    } catch (e) {
        console.error(e)
        return { error: 'Konfigurasi admin tidak tersedia. Tambahkan SUPABASE_SERVICE_ROLE_KEY di env.' }
    }

    const { data: newUser, error: createError } = await adminClient.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
    })

    if (createError) {
        return { error: createError.message }
    }
    if (!newUser?.user?.id) {
        return { error: 'Gagal membuat user.' }
    }

    const inserts = assignments.map((a) => ({
        wallet_id: a.walletId,
        user_id: newUser.user.id,
        role: a.role,
    }))
    const { error: insertError } = await adminClient
        .from('wallet_members')
        .insert(inserts)

    if (insertError) {
        return { error: 'User dibuat tapi gagal menambah akses wallet: ' + insertError.message }
    }

    revalidatePath('/settings')
    return { success: true, message: `Akun ${email} berhasil dibuat. User hanya akan melihat wallet yang Anda pilih.` }
}
