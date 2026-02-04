import { getCategories, getTransaction } from "@/lib/data"
import { TransactionForm } from "@/components/transactions/TransactionForm"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { notFound } from "next/navigation"

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export default async function EditTransactionPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const resolved = await params
    const id = typeof resolved?.id === 'string' ? resolved.id.trim() : ''

    if (!id || !UUID_REGEX.test(id)) {
        notFound()
    }

    const transaction = await getTransaction(id)

    if (!transaction) {
        notFound()
    }

    const categories = await getCategories(transaction.wallet_id)

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild className="rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                    <Link href="/transactions">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                        Edit Transaksi
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-2">Perbarui informasi transaksi</p>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border-0 shadow-xl">
                <TransactionForm 
                    walletId={transaction.wallet_id} 
                    categories={categories || []} 
                    transaction={transaction}
                />
            </div>
        </div>
    )
}
