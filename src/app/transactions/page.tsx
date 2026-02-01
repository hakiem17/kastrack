import { getActiveWallet, getTransactions, getCategories } from "@/lib/data"
import { formatCurrency } from "@/lib/utils"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus, CreditCard } from "lucide-react"
import { TransactionActions } from "@/components/transactions/TransactionActions"
import { TransactionFilters } from "@/components/transactions/TransactionFilters"
import { ImportDialog } from "@/components/import/ImportDialog"
import { ExportMenu } from "@/components/export/ExportMenu"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"

export default async function TransactionsPage({
    searchParams,
}: {
    searchParams?: { [key: string]: string | string[] | undefined }
}) {
    const wallet = await getActiveWallet()

    if (!wallet) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
                <p>Dompet tidak ditemukan.</p>
                <Button asChild>
                    <Link href="/">Buat Dompet</Link>
                </Button>
            </div>
        )
    }

    // Parse search params
    const filters = {
        categoryId: searchParams?.category as string | undefined,
        type: searchParams?.type as 'income' | 'expense' | undefined,
        startDate: searchParams?.startDate as string | undefined,
        endDate: searchParams?.endDate as string | undefined,
        search: searchParams?.search as string | undefined,
        sortBy: (searchParams?.sortBy as 'date' | 'amount' | 'category') || 'date',
        sortOrder: (searchParams?.sortOrder as 'asc' | 'desc') || 'desc',
    }

    const [transactions, categories, allTransactions] = await Promise.all([
        getTransactions(wallet.id, 100, 0, filters),
        getCategories(wallet.id),
        getTransactions(wallet.id, 10000, 0)
    ])

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                        Transaksi
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-2">Kelola semua transaksi keuangan Anda</p>
                </div>
                <div className="flex items-center gap-2">
                    <ImportDialog walletId={wallet.id} />
                    <ExportMenu
                        transactions={transactions}
                        walletName={wallet.name}
                        backupData={{
                            wallet: { name: wallet.name, currency: wallet.currency },
                            categories: categories.map(cat => ({ name: cat.name, type: cat.type })),
                            transactions: allTransactions
                        }}
                    />
                    <Button asChild className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30">
                        <Link href="/transactions/new">
                            <Plus className="mr-2 h-4 w-4" /> Tambah Baru
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <TransactionFilters categories={categories} />

            {/* Results Count */}
            {transactions.length > 0 && (
                <div className="text-sm text-slate-600 dark:text-slate-400">
                    Menampilkan <span className="font-semibold">{transactions.length}</span> transaksi
                </div>
            )}

            {/* Desktop Table */}
            <div className="hidden md:block rounded-xl border-0 shadow-lg bg-white dark:bg-slate-900 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border-0">
                            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Tanggal</TableHead>
                            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Kategori</TableHead>
                            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Keterangan</TableHead>
                            <TableHead className="text-right font-semibold text-slate-700 dark:text-slate-300">Jumlah</TableHead>
                            <TableHead className="text-right font-semibold text-slate-700 dark:text-slate-300">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {transactions.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-32 text-center">
                                    <div className="flex flex-col items-center justify-center py-8">
                                        <div className="h-16 w-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                                            <CreditCard className="h-8 w-8 text-slate-400" />
                                        </div>
                                        <p className="text-slate-600 dark:text-slate-400 font-medium">Belum ada transaksi</p>
                                        <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">Mulai dengan menambahkan transaksi pertama Anda</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            transactions.map((tx) => (
                                <TableRow key={tx.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border-b border-slate-100 dark:border-slate-800">
                                    <TableCell className="font-medium text-slate-700 dark:text-slate-300">{format(new Date(tx.date), 'dd MMM yyyy', { locale: id })}</TableCell>
                                    <TableCell>
                                        <span className={`inline-flex items-center rounded-lg px-3 py-1.5 text-xs font-semibold ${
                                            tx.categories?.type === 'income' 
                                                ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 dark:from-green-900/30 dark:to-emerald-900/30 dark:text-green-400' 
                                                : 'bg-gradient-to-r from-red-100 to-rose-100 text-red-700 dark:from-red-900/30 dark:to-rose-900/30 dark:text-red-400'
                                        }`}>
                                            {tx.categories?.name}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-slate-600 dark:text-slate-400">{tx.description || '-'}</TableCell>
                                    <TableCell className={`text-right font-bold text-lg ${tx.categories?.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                                        }`}>
                                        {tx.categories?.type === 'expense' && '-'}{formatCurrency(tx.amount)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <TransactionActions transactionId={tx.id} />
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Mobile Cards */}
            <div className="grid gap-4 md:hidden">
                {transactions.length === 0 ? (
                    <Card className="border-0 shadow-lg">
                        <CardContent className="p-8 text-center">
                            <div className="h-16 w-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
                                <CreditCard className="h-8 w-8 text-slate-400" />
                            </div>
                            <p className="text-slate-600 dark:text-slate-400 font-medium">Belum ada transaksi</p>
                        </CardContent>
                    </Card>
                ) : (
                    transactions.map((tx) => (
                        <Card key={tx.id} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                            <CardContent className="p-5">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="space-y-2 flex-1">
                                        <div className="flex items-center gap-2">
                                            <span className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-semibold ${
                                                tx.categories?.type === 'income' 
                                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                                                    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                            }`}>
                                                {tx.categories?.name}
                                            </span>
                                        </div>
                                        <div className="text-xs text-slate-500 dark:text-slate-400">{format(new Date(tx.date), 'dd MMM yyyy', { locale: id })}</div>
                                        {tx.description && (
                                            <div className="text-sm text-slate-600 dark:text-slate-400">{tx.description}</div>
                                        )}
                                    </div>
                                    <div className={`font-bold text-lg ml-4 ${tx.categories?.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                                        }`}>
                                        {tx.categories?.type === 'expense' && '-'}
                                        {formatCurrency(tx.amount)}
                                    </div>
                                </div>
                                <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
                                    <TransactionActions transactionId={tx.id} />
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}
