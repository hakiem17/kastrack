import { createClient } from './supabase/server'
import { cookies } from 'next/headers'
import { startOfMonth, endOfMonth, format, subMonths } from 'date-fns'

export interface Transaction {
    id: string
    amount: number
    description: string | null
    date: string
    created_at: string
    categories: {
        name: string
        type: 'income' | 'expense'
    } | null
}

export interface WalletSummary {
    id: string
    name: string
    currency: string
    totalBalance: number
}

export async function getActiveWallet() {
    const supabase = createClient()
    const cookieStore = cookies()
    const activeWalletId = cookieStore.get('active_wallet_id')?.value

    if (activeWalletId) {
        const { data: activeWallet } = await supabase
            .from('wallets')
            .select('id, name, currency')
            .eq('id', activeWalletId)
            .single()

        if (activeWallet) {
            return activeWallet
        }
    }

    const { data: memberData } = await supabase
        .from('wallet_members')
        .select('wallet_id, wallets(id, name, currency)')
        .limit(1)
        .single()

    if (!memberData) return null

    // @ts-expect-error - Supabase types join inference
    const wallet = memberData.wallets as { id: string; name: string; currency: string }
    return wallet
}

/** Daftar wallet yang **Anda** ikuti (satu baris per wallet, tanpa duplikat). */
export async function getWallets() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    const { data } = await supabase
        .from('wallet_members')
        .select('wallet_id, role, wallets(id, name, currency, created_at)')
        .eq('user_id', user.id)
        .order('joined_at', { ascending: true })

    if (!data) return []

    return data
        // @ts-expect-error - Supabase types join inference
        .map((member) => member.wallets as { id: string; name: string; currency: string })
        .filter(Boolean)
}

export interface WalletWithRole {
    id: string
    name: string
    currency: string
    role: string
}

/** Daftar wallet dengan role **Anda** (user saat ini); gunakan untuk filter admin saja di Settings */
export async function getWalletsWithRole(): Promise<WalletWithRole[]> {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    const { data } = await supabase
        .from('wallet_members')
        .select('wallet_id, role, wallets(id, name, currency)')
        .eq('user_id', user.id)
        .order('joined_at', { ascending: true })

    if (!data) return []

    return data
        // @ts-expect-error - Supabase types join inference
        .map((m: { wallet_id: string; role: string; wallets: { id: string; name: string; currency: string } }) =>
            m.wallets ? { ...m.wallets, role: m.role } : null
        )
        .filter(Boolean) as WalletWithRole[]
}

export interface WalletMemberRow {
    user_id: string
    role: string
}

export async function getWalletMembers(walletId: string): Promise<WalletMemberRow[]> {
    const supabase = createClient()
    const { data } = await supabase
        .from('wallet_members')
        .select('user_id, role')
        .eq('wallet_id', walletId)
        .order('role', { ascending: true })
    return (data as WalletMemberRow[]) || []
}

export interface WalletInviteRow {
    id: string
    email: string
    role: string
    token: string
    expires_at: string
    created_at: string
}

export async function getWalletInvites(walletId: string): Promise<WalletInviteRow[]> {
    const supabase = createClient()
    const { data } = await supabase
        .from('wallet_invites')
        .select('id, email, role, token, expires_at, created_at')
        .eq('wallet_id', walletId)
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false })
    return (data as WalletInviteRow[]) || []
}

/** Untuk admin: daftar user yang punya akses ke wallet yang Anda admin, beserta role dan wallet yang dibolehkan */
export interface ActiveUserWithWallets {
    user_id: string
    wallets: { walletId: string; walletName: string; role: string }[]
}

export async function getActiveUsersWithWallets(adminWalletIds: string[]): Promise<ActiveUserWithWallets[]> {
    if (adminWalletIds.length === 0) return []

    const supabase = createClient()
    const { data } = await supabase
        .from('wallet_members')
        .select('user_id, wallet_id, role, wallets(id, name)')
        .in('wallet_id', adminWalletIds)

    if (!data) return []

    const byUser = new Map<string, { walletId: string; walletName: string; role: string }[]>()
    for (const row of data as { user_id: string; wallet_id: string; role: string; wallets: { id: string; name: string } | null }[]) {
        if (!row.wallets) continue
        const list = byUser.get(row.user_id) ?? []
        list.push({
            walletId: row.wallet_id,
            walletName: row.wallets.name,
            role: row.role,
        })
        byUser.set(row.user_id, list)
    }

    return Array.from(byUser.entries()).map(([user_id, wallets]) => ({
        user_id,
        wallets: wallets.sort((a, b) => a.walletName.localeCompare(b.walletName)),
    }))
}

export async function getWalletSummaries(): Promise<WalletSummary[]> {
    const wallets = await getWallets()
    if (wallets.length === 0) return []

    const supabase = createClient()
    const { data } = await supabase
        .from('transactions')
        .select('wallet_id, amount, categories(type)')
        .in('wallet_id', wallets.map((wallet) => wallet.id))

    const totals = new Map<string, number>()
    wallets.forEach((wallet) => totals.set(wallet.id, 0))

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?.forEach((tx: any) => {
        const amount = Number(tx.amount)
        if (!tx.wallet_id || !tx.categories?.type) return
        const current = totals.get(tx.wallet_id) || 0
        if (tx.categories.type === 'income') {
            totals.set(tx.wallet_id, current + amount)
        } else if (tx.categories.type === 'expense') {
            totals.set(tx.wallet_id, current - amount)
        }
    })

    return wallets.map((wallet) => ({
        ...wallet,
        totalBalance: totals.get(wallet.id) || 0,
    }))
}

export async function getDashboardStats(walletId: string) {
    const supabase = createClient()
    const start = startOfMonth(new Date()).toISOString()
    const end = endOfMonth(new Date()).toISOString()

    const [{ data: transactions }, { data: allTx }] = await Promise.all([
        supabase
            .from('transactions')
            .select('amount, categories(type)')
            .eq('wallet_id', walletId)
            .gte('date', start)
            .lte('date', end),
        supabase
            .from('transactions')
            .select('amount, categories(type)')
            .eq('wallet_id', walletId),
    ])

    let income = 0
    let expense = 0

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    transactions?.forEach((tx: any) => {
        const amount = Number(tx.amount)
        if (tx.categories?.type === 'income') {
            income += amount
        } else if (tx.categories?.type === 'expense') {
            expense += amount
        }
    })

    let totalBalance = 0
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    allTx?.forEach((tx: any) => {
        const amount = Number(tx.amount)
        if (tx.categories?.type === 'income') {
            totalBalance += amount
        } else if (tx.categories?.type === 'expense') {
            totalBalance -= amount
        }
    })

    return {
        monthIncome: income,
        monthExpense: expense,
        totalBalance
    }
}

export interface TransactionFilters {
    categoryId?: string
    type?: 'income' | 'expense'
    startDate?: string
    endDate?: string
    search?: string
    sortBy?: 'date' | 'amount' | 'category'
    sortOrder?: 'asc' | 'desc'
}

export async function getTransactions(
    walletId: string, 
    limit = 50, 
    offset = 0,
    filters?: TransactionFilters
) {
    const supabase = createClient()

    let query = supabase
        .from('transactions')
        .select(`
      id,
      amount,
      description,
      date,
      created_at,
      category_id,
      categories (
        id,
        name,
        type
      )
    `)
        .eq('wallet_id', walletId)

    // Apply filters
    if (filters?.categoryId) {
        query = query.eq('category_id', filters.categoryId)
    }

    // Note: Type filter needs to be applied after join, so we'll filter in memory
    // or use a different approach. For now, we'll filter after fetching.

    if (filters?.startDate) {
        query = query.gte('date', new Date(filters.startDate).toISOString())
    }

    if (filters?.endDate) {
        query = query.lte('date', new Date(filters.endDate).toISOString())
    }

    if (filters?.search) {
        query = query.ilike('description', `%${filters.search}%`)
    }

    // Apply sorting
    const sortBy = filters?.sortBy || 'date'
    const sortOrder = filters?.sortOrder || 'desc'
    
    if (sortBy === 'amount') {
        query = query.order('amount', { ascending: sortOrder === 'asc' })
    } else if (sortBy === 'category') {
        query = query.order('category_id', { ascending: sortOrder === 'asc' })
    } else {
        query = query.order('date', { ascending: sortOrder === 'asc' })
    }

    const { data } = await query.range(offset, offset + limit - 1)

    let result = (data as unknown as Transaction[]) || []

    // Filter by type if specified (since we can't filter on joined table directly)
    if (filters?.type) {
        result = result.filter(tx => tx.categories?.type === filters.type)
    }

    // Re-sort after filtering if needed (for type filter)
    if (filters?.type && result.length > 0) {
        const sortBy = filters?.sortBy || 'date'
        const sortOrder = filters?.sortOrder || 'desc'
        
        result.sort((a, b) => {
            let aVal: any, bVal: any
            
            if (sortBy === 'amount') {
                aVal = Number(a.amount)
                bVal = Number(b.amount)
            } else if (sortBy === 'category') {
                aVal = a.categories?.name || ''
                bVal = b.categories?.name || ''
            } else {
                aVal = new Date(a.date).getTime()
                bVal = new Date(b.date).getTime()
            }
            
            if (sortOrder === 'asc') {
                return aVal > bVal ? 1 : aVal < bVal ? -1 : 0
            } else {
                return aVal < bVal ? 1 : aVal > bVal ? -1 : 0
            }
        })
    }

    return result
}

export async function getCategories(walletId: string) {
    const supabase = createClient()
    const { data } = await supabase
        .from('categories')
        .select('id, name, type')
        .eq('wallet_id', walletId)
        .order('name')
    return data || []
}

export async function getTransaction(transactionId: string) {
    const supabase = createClient()
    const { data, error } = await supabase
        .from('transactions')
        .select(`
            id,
            amount,
            description,
            date,
            category_id,
            categories (
                id,
                name,
                type
            )
        `)
        .eq('id', transactionId)
        .single()
    
    if (error || !data) return null
    
    return {
        id: data.id,
        amount: Number(data.amount),
        description: data.description,
        date: data.date,
        category_id: data.category_id
    }
}

export async function getMonthlyReport(walletId: string) {
    const supabase = createClient()
    const today = new Date()
    const startDate = startOfMonth(subMonths(today, 5))
    const endDate = endOfMonth(today)

    const monthSlots = Array.from({ length: 6 }, (_, i) => {
        const date = subMonths(today, i)
        const key = format(date, 'yyyy-MM')
        return {
            key,
            label: format(date, 'MMM yyyy'),
        }
    }).reverse()

    const monthMap = new Map<string, { Income: number; Expense: number }>()
    monthSlots.forEach((slot) => monthMap.set(slot.key, { Income: 0, Expense: 0 }))

    const { data } = await supabase
        .from('transactions')
        .select('amount, date, categories(type)')
        .eq('wallet_id', walletId)
        .gte('date', startDate.toISOString())
        .lte('date', endDate.toISOString())

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?.forEach((tx: any) => {
        if (!tx.date || !tx.categories?.type) return
        const key = format(new Date(tx.date), 'yyyy-MM')
        const bucket = monthMap.get(key)
        if (!bucket) return
        const amount = Number(tx.amount)
        if (tx.categories.type === 'income') bucket.Income += amount
        if (tx.categories.type === 'expense') bucket.Expense += amount
    })

    return monthSlots.map((slot) => ({
        name: slot.label,
        Income: monthMap.get(slot.key)?.Income || 0,
        Expense: monthMap.get(slot.key)?.Expense || 0,
    }))
}

export interface CategoryBreakdown {
    categoryId: string
    categoryName: string
    type: 'income' | 'expense'
    total: number
    transactionCount: number
    percentage: number
}

export interface CategoryMonthlyComparison {
    month: string
    categories: {
        categoryId: string
        categoryName: string
        type: 'income' | 'expense'
        total: number
    }[]
}

export async function getCategoryBreakdown(
    walletId: string,
    type?: 'income' | 'expense',
    startDate?: string,
    endDate?: string
): Promise<CategoryBreakdown[]> {
    const supabase = createClient()

    let query = supabase
        .from('transactions')
        .select('amount, category_id, categories(id, name, type)')
        .eq('wallet_id', walletId)

    if (startDate) {
        query = query.gte('date', new Date(startDate).toISOString())
    }

    if (endDate) {
        query = query.lte('date', new Date(endDate).toISOString())
    }

    const { data } = await query

    // Group by category
    const categoryMap = new Map<string, { name: string; type: string; total: number; count: number }>()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?.forEach((tx: any) => {
        if (!tx.categories) return

        const categoryType = tx.categories.type
        if (type && categoryType !== type) return

        const categoryId = tx.category_id || 'uncategorized'
        const categoryName = tx.categories.name || 'Tanpa Kategori'
        const amount = Number(tx.amount)

        if (!categoryMap.has(categoryId)) {
            categoryMap.set(categoryId, {
                name: categoryName,
                type: categoryType,
                total: 0,
                count: 0
            })
        }

        const category = categoryMap.get(categoryId)!
        category.total += amount
        category.count += 1
    })

    // Calculate total for percentage
    const total = Array.from(categoryMap.values()).reduce((sum, cat) => sum + cat.total, 0)

    // Convert to array and calculate percentage
    const breakdown: CategoryBreakdown[] = Array.from(categoryMap.entries()).map(([id, cat]) => ({
        categoryId: id,
        categoryName: cat.name,
        type: cat.type as 'income' | 'expense',
        total: cat.total,
        transactionCount: cat.count,
        percentage: total > 0 ? (cat.total / total) * 100 : 0
    }))

    // Sort by total descending
    return breakdown.sort((a, b) => b.total - a.total)
}

export async function getCategoryMonthlyComparison(
    walletId: string,
    type: 'income' | 'expense',
    months: number = 6
): Promise<CategoryMonthlyComparison[]> {
    const supabase = createClient()
    const today = new Date()
    const startDate = startOfMonth(subMonths(today, months - 1))
    const endDate = endOfMonth(today)

    const monthSlots = Array.from({ length: months }, (_, i) => {
        const date = subMonths(today, i)
        const key = format(date, 'yyyy-MM')
        return {
            key,
            label: format(date, 'MMM yyyy'),
        }
    }).reverse()

    const monthCategoryMap = new Map<string, Map<string, { name: string; total: number }>>()
    monthSlots.forEach((slot) => monthCategoryMap.set(slot.key, new Map()))

    const { data } = await supabase
        .from('transactions')
        .select('amount, date, category_id, categories(id, name, type)')
        .eq('wallet_id', walletId)
        .gte('date', startDate.toISOString())
        .lte('date', endDate.toISOString())

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?.forEach((tx: any) => {
        if (!tx.date || !tx.categories || tx.categories.type !== type) return

        const key = format(new Date(tx.date), 'yyyy-MM')
        const categoryId = tx.category_id || 'uncategorized'
        const categoryName = tx.categories.name || 'Tanpa Kategori'
        const amount = Number(tx.amount)

        const monthMap = monthCategoryMap.get(key)
        if (!monthMap) return

        if (!monthMap.has(categoryId)) {
            monthMap.set(categoryId, { name: categoryName, total: 0 })
        }

        const category = monthMap.get(categoryId)!
        category.total += amount
    })

    return monthSlots.map((slot) => {
        const categoryMap = monthCategoryMap.get(slot.key) || new Map()
        const categories = Array.from(categoryMap.entries()).map(([id, cat]) => ({
            categoryId: id,
            categoryName: cat.name,
            type: type as 'income' | 'expense',
            total: cat.total,
        }))

        return { month: slot.label, categories }
    })
}
