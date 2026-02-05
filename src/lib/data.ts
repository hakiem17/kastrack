import { createClient } from './supabase/server'
import { cookies } from 'next/headers'
import { startOfMonth, endOfMonth, startOfYear, endOfDay, addDays, format, subMonths, subYears } from 'date-fns'

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
    const supabase = await createClient()
    const cookieStore = await cookies()
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
    const supabase = await createClient()
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
    const supabase = await createClient()
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
    const supabase = await createClient()
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
    const supabase = await createClient()
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

    const supabase = await createClient()
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

    const supabase = await createClient()
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

export interface DashboardStatsParams {
    month?: number  // 1-12
    year?: number
}

export async function getDashboardStats(walletId: string, params?: DashboardStatsParams) {
    const supabase = await createClient()
    const now = new Date()
    const year = params?.year ?? now.getFullYear()
    const month = params?.month ?? now.getMonth() + 1
    const refDate = new Date(year, month - 1, 1)
    const start = startOfMonth(refDate).toISOString()
    const end = endOfMonth(refDate).toISOString()

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

    // Total Pemasukan/Pengeluaran bulan ini: hanya transaksi yang punya kategori income/expense
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    transactions?.forEach((tx: any) => {
        const amount = Number(tx.amount)
        if (tx.categories?.type === 'income') {
            income += amount
        } else if (tx.categories?.type === 'expense') {
            expense += amount
        }
        // Transaksi tanpa kategori (kategori dihapus) tidak masuk ke total bulan ini
    })

    let totalBalance = 0
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    allTx?.forEach((tx: any) => {
        const amount = Number(tx.amount)
        if (tx.categories?.type === 'income') {
            totalBalance += amount
        } else if (tx.categories?.type === 'expense') {
            totalBalance -= amount
        } else {
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
    const supabase = await createClient()

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
            let aVal: number | string
            let bVal: number | string
            
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
    const supabase = await createClient()
    const { data } = await supabase
        .from('categories')
        .select('id, name, type')
        .eq('wallet_id', walletId)
        .order('name')
    return data || []
}

/** Satu sticky note per dompet (hanya teks). */
export async function getWalletNote(walletId: string): Promise<string> {
    const supabase = await createClient()
    const { data } = await supabase
        .from('wallet_notes')
        .select('content')
        .eq('wallet_id', walletId)
        .maybeSingle()
    return (data?.content as string) ?? ''
}

export interface TransactionNote {
    id: string
    wallet_id: string
    date: string
    amount: number
    type: 'income' | 'expense'
    category_id: string | null
    description: string | null
    created_at: string
    categories: { name: string; type: string } | null
}

/** Catatan / log transaksi sebelum dimasukkan ke aplikasi (per wallet). */
export async function getTransactionNotes(walletId: string): Promise<TransactionNote[]> {
    const supabase = await createClient()
    const { data } = await supabase
        .from('transaction_notes')
        .select(`
            id,
            wallet_id,
            date,
            amount,
            type,
            category_id,
            description,
            created_at,
            categories ( name, type )
        `)
        .eq('wallet_id', walletId)
        .order('date', { ascending: false })
        .order('created_at', { ascending: false })
    if (!data) return []
    return data.map((row) => ({
        id: row.id,
        wallet_id: row.wallet_id,
        date: row.date,
        amount: Number(row.amount),
        type: row.type as 'income' | 'expense',
        category_id: row.category_id,
        description: row.description,
        created_at: row.created_at,
        // @ts-expect-error - join
        categories: row.categories ?? null,
    }))
}

export async function getTransaction(transactionId: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('transactions')
        .select(`
            id,
            wallet_id,
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
        wallet_id: data.wallet_id as string,
        amount: Number(data.amount),
        description: data.description,
        date: data.date,
        category_id: data.category_id
    }
}

export interface MonthlyReportParams {
    month?: number  // 1-12, bulan terakhir yang ditampilkan (untuk mode rolling)
    year?: number
    /** true = 12 bulan dalam satu tahun (Jan–Des), tidak digabung antar tahun */
    yearOnly?: boolean
}

/** 12 bulan: yearOnly=true → Jan–Des tahun yang dipilih; else rolling 12 bulan dari (endMonth-11) s.d. endMonth. */
export async function getMonthlyReport(walletId: string, params?: MonthlyReportParams) {
    const supabase = await createClient()
    const now = new Date()
    const endYear = params?.year ?? now.getFullYear()
    const endMonth = params?.month ?? now.getMonth() + 1
    const endDate = new Date(endYear, endMonth - 1, 1)

    let startDate: Date
    let rangeEnd: Date
    let monthSlots: { key: string; label: string }[]

    if (params?.yearOnly && params?.year != null) {
        // Satu tahun penuh (Jan–Des), tidak digabung dengan tahun lain
        const y = params.year
        startDate = new Date(y, 0, 1)
        rangeEnd = endOfMonth(new Date(y, 11, 1))
        monthSlots = Array.from({ length: 12 }, (_, i) => {
            const date = new Date(y, i, 1)
            return {
                key: format(date, 'yyyy-MM'),
                label: format(date, 'MMM yyyy'),
            }
        })
    } else {
        // Rolling 12 bulan (untuk TTM dll)
        startDate = startOfMonth(subMonths(endDate, 11))
        rangeEnd = endOfMonth(endDate)
        monthSlots = Array.from({ length: 12 }, (_, i) => {
            const date = subMonths(endDate, 11 - i)
            const key = format(date, 'yyyy-MM')
            return {
                key,
                label: format(date, 'MMM yyyy'),
            }
        })
    }

    const monthMap = new Map<string, { Income: number; Expense: number }>()
    monthSlots.forEach((slot) => monthMap.set(slot.key, { Income: 0, Expense: 0 }))

    const { data } = await supabase
        .from('transactions')
        .select('amount, date, categories(type)')
        .eq('wallet_id', walletId)
        .gte('date', startDate.toISOString())
        .lte('date', rangeEnd.toISOString())

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

/** Tren harian untuk satu bulan: satu baris per hari (1 s.d. akhir bulan). */
export async function getDailyReport(
    walletId: string,
    params: { month: number; year: number }
): Promise<{ name: string; Income: number; Expense: number }[]> {
    const supabase = await createClient()
    const { month, year } = params
    const startDate = startOfMonth(new Date(year, month - 1, 1))
    const endDate = endOfMonth(startDate)
    const lastDay = endDate.getDate()

    const daySlots = Array.from({ length: lastDay }, (_, i) => {
        const d = i + 1
        return { key: String(d), label: String(d) }
    })

    const dayMap = new Map<string, { Income: number; Expense: number }>()
    daySlots.forEach((slot) => dayMap.set(slot.key, { Income: 0, Expense: 0 }))

    const { data } = await supabase
        .from('transactions')
        .select('amount, date, categories(type)')
        .eq('wallet_id', walletId)
        .gte('date', startDate.toISOString())
        .lte('date', endDate.toISOString())

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?.forEach((tx: any) => {
        if (!tx.date || !tx.categories?.type) return
        const day = format(new Date(tx.date), 'd')
        const bucket = dayMap.get(day)
        if (!bucket) return
        const amount = Number(tx.amount)
        if (tx.categories.type === 'income') bucket.Income += amount
        if (tx.categories.type === 'expense') bucket.Expense += amount
    })

    return daySlots.map((slot) => ({
        name: slot.label,
        Income: dayMap.get(slot.key)?.Income || 0,
        Expense: dayMap.get(slot.key)?.Expense || 0,
    }))
}

/**
 * Jumlah pemasukan & pengeluaran untuk rentang tanggal.
 * endIsoExclusive: jika true, endIso adalah batas eksklusif (tanggal besok) agar seluruh hari terakhir ikut.
 */
async function getIncomeExpenseInRange(
    supabase: Awaited<ReturnType<typeof createClient>>,
    walletId: string,
    startIso: string,
    endIso: string,
    endIsoExclusive?: boolean
): Promise<{ income: number; expense: number }> {
    const query = supabase
        .from('transactions')
        .select('amount, categories(type)')
        .eq('wallet_id', walletId)
        .gte('date', startIso)
    const { data } = endIsoExclusive
        ? await query.lt('date', endIso)
        : await query.lte('date', endIso)
    let income = 0
    let expense = 0
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?.forEach((tx: any) => {
        const amount = Number(tx.amount)
        if (tx.categories?.type === 'income') income += amount
        else if (tx.categories?.type === 'expense') expense += amount
    })
    return { income, expense }
}

export type PeriodReportType = 'mtd' | 'ytd' | 'yoy' | 'ttm'

export interface PeriodReportResult {
    type: PeriodReportType
    label: string
    description: string
    periodStart: string
    periodEnd: string
    income: number
    expense: number
    net: number
    /** Hanya untuk YoY: perbandingan dengan periode sama tahun lalu. */
    previous?: { label: string; income: number; expense: number; net: number }
    growthIncomePercent?: number
    growthExpensePercent?: number
    /** Hanya untuk TTM: breakdown per bulan (12 bulan). */
    monthlyData?: { name: string; Income: number; Expense: number }[]
}

/**
 * Laporan periode: MTD, YTD, YoY, TTM.
 * refDate = tanggal acuan (default: hari ini).
 */
export async function getPeriodReport(
    walletId: string,
    type: PeriodReportType,
    refDate: Date = new Date()
): Promise<PeriodReportResult> {
    const supabase = await createClient()
    const today = refDate

    if (type === 'mtd') {
        const start = startOfMonth(today)
        const end = endOfDay(today)
        const startStr = format(start, 'yyyy-MM-dd')
        const endExclusiveStr = format(addDays(today, 1), 'yyyy-MM-dd')
        const { income, expense } = await getIncomeExpenseInRange(
            supabase, walletId, startStr, endExclusiveStr, true
        )
        return {
            type: 'mtd',
            label: 'Month-to-Date (MTD)',
            description: 'Dari awal bulan ini hingga hari ini',
            periodStart: format(start, 'dd MMM yyyy'),
            periodEnd: format(end, 'dd MMM yyyy'),
            income,
            expense,
            net: income - expense,
        }
    }

    if (type === 'ytd') {
        const start = startOfYear(today)
        const end = endOfDay(today)
        const startStr = format(start, 'yyyy-MM-dd')
        const endExclusiveStr = format(addDays(today, 1), 'yyyy-MM-dd')
        const { income, expense } = await getIncomeExpenseInRange(
            supabase, walletId, startStr, endExclusiveStr, true
        )
        return {
            type: 'ytd',
            label: 'Year-to-Date (YTD)',
            description: 'Dari 1 Januari hingga hari ini',
            periodStart: format(start, 'dd MMM yyyy'),
            periodEnd: format(end, 'dd MMM yyyy'),
            income,
            expense,
            net: income - expense,
        }
    }

    if (type === 'yoy') {
        const currentStart = startOfMonth(today)
        const currentEnd = endOfMonth(today)
        const previousStart = startOfMonth(subYears(today, 1))
        const previousEnd = endOfMonth(subYears(today, 1))
        const [current, previous] = await Promise.all([
            getIncomeExpenseInRange(supabase, walletId, currentStart.toISOString(), currentEnd.toISOString()),
            getIncomeExpenseInRange(supabase, walletId, previousStart.toISOString(), previousEnd.toISOString()),
        ])
        const netCurrent = current.income - current.expense
        const netPrevious = previous.income - previous.expense
        const growthIncomePercent = previous.income
            ? ((current.income - previous.income) / previous.income) * 100
            : (current.income ? 100 : 0)
        const growthExpensePercent = previous.expense
            ? ((current.expense - previous.expense) / previous.expense) * 100
            : (current.expense ? 100 : 0)
        return {
            type: 'yoy',
            label: 'Year-over-Year (YoY)',
            description: 'Bulan ini vs bulan yang sama tahun lalu',
            periodStart: format(currentStart, 'MMM yyyy'),
            periodEnd: format(currentEnd, 'MMM yyyy'),
            income: current.income,
            expense: current.expense,
            net: netCurrent,
            previous: {
                label: format(previousStart, 'MMM yyyy'),
                income: previous.income,
                expense: previous.expense,
                net: netPrevious,
            },
            growthIncomePercent,
            growthExpensePercent,
        }
    }

    // TTM
    const monthly = await getMonthlyReport(walletId, {
        month: today.getMonth() + 1,
        year: today.getFullYear(),
    })
    const income = monthly.reduce((s, r) => s + r.Income, 0)
    const expense = monthly.reduce((s, r) => s + r.Expense, 0)
    const ttmStart = startOfMonth(subMonths(today, 11))
    const ttmEnd = endOfMonth(today)
    return {
        type: 'ttm',
        label: 'Trailing Twelve Months (TTM)',
        description: 'Ringkasan 12 bulan terakhir',
        periodStart: format(ttmStart, 'MMM yyyy'),
        periodEnd: format(ttmEnd, 'MMM yyyy'),
        income,
        expense,
        net: income - expense,
        monthlyData: monthly,
    }
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
    const supabase = await createClient()

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
    const supabase = await createClient()
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
