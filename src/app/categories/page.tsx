import { getActiveWallet, getCategories } from "@/lib/data"
import { CategoryForm } from "@/components/categories/CategoryForm"
import { CategoryList } from "@/components/categories/CategoryList"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function CategoriesPage() {
    const wallet = await getActiveWallet()

    if (!wallet) {
        return (
            <div className="max-w-4xl mx-auto space-y-6">
                <h1 className="text-3xl font-bold tracking-tight">Master Kategori</h1>
                <Card>
                    <CardContent className="pt-6">
                        <p className="text-muted-foreground">Dompet tidak ditemukan. Silakan buat dompet terlebih dahulu.</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    const categories = await getCategories(wallet.id)

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div>
                <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                    Master Kategori
                </h1>
                <p className="text-slate-600 dark:text-slate-400 mt-2">Kelola kategori pemasukan dan pengeluaran</p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-xl font-bold flex items-center gap-2">
                            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                                <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                            </div>
                            Tambah Kategori Baru
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CategoryForm walletId={wallet.id} />
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-xl font-bold flex items-center gap-2">
                            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                                <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                </svg>
                            </div>
                            Daftar Kategori
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CategoryList walletId={wallet.id} categories={categories} />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
