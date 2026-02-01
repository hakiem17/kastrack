"use client"

import { useState } from "react"
import { deleteCategory } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { CategoryForm } from "./CategoryForm"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Pencil, Trash2, TrendingUp, TrendingDown } from "lucide-react"
import { useRouter } from "next/navigation"

interface Category {
    id: string
    name: string
    type: 'income' | 'expense'
}

interface CategoryListProps {
    walletId: string
    categories: Category[]
}

export function CategoryList({ walletId, categories }: CategoryListProps) {
    const router = useRouter()
    const [editingCategory, setEditingCategory] = useState<Category | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const handleDelete = async (categoryId: string) => {
        if (!confirm('Apakah Anda yakin ingin menghapus kategori ini?')) {
            return
        }

        const result = await deleteCategory(categoryId)
        if (result?.error) {
            alert(`Error: ${result.error}`)
        } else {
            router.refresh()
        }
    }

    const handleEdit = (category: Category) => {
        setEditingCategory(category)
        setIsDialogOpen(true)
    }

    const handleSuccess = () => {
        setIsDialogOpen(false)
        setEditingCategory(null)
        router.refresh()
    }

    const incomeCategories = categories.filter(c => c.type === 'income')
    const expenseCategories = categories.filter(c => c.type === 'expense')

    if (categories.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="h-16 w-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
                    <svg className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                </div>
                <p className="text-slate-600 dark:text-slate-400 font-medium">Belum ada kategori</p>
                <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">Tambahkan kategori baru di form sebelah kiri</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Income Categories */}
            <div>
                <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <h3 className="font-semibold text-green-600">Pemasukan</h3>
                </div>
                <div className="space-y-2">
                    {incomeCategories.length === 0 ? (
                        <p className="text-sm text-muted-foreground">Tidak ada kategori pemasukan</p>
                    ) : (
                        incomeCategories.map((category) => (
                            <CategoryItem
                                key={category.id}
                                category={category}
                                onEdit={() => handleEdit(category)}
                                onDelete={() => handleDelete(category.id)}
                            />
                        ))
                    )}
                </div>
            </div>

            {/* Expense Categories */}
            <div>
                <div className="flex items-center gap-2 mb-3">
                    <TrendingDown className="h-4 w-4 text-red-600" />
                    <h3 className="font-semibold text-red-600">Pengeluaran</h3>
                </div>
                <div className="space-y-2">
                    {expenseCategories.length === 0 ? (
                        <p className="text-sm text-muted-foreground">Tidak ada kategori pengeluaran</p>
                    ) : (
                        expenseCategories.map((category) => (
                            <CategoryItem
                                key={category.id}
                                category={category}
                                onEdit={() => handleEdit(category)}
                                onDelete={() => handleDelete(category.id)}
                            />
                        ))
                    )}
                </div>
            </div>

            {/* Edit Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Kategori</DialogTitle>
                    </DialogHeader>
                    <CategoryForm
                        walletId={walletId}
                        category={editingCategory}
                        onSuccess={handleSuccess}
                    />
                </DialogContent>
            </Dialog>
        </div>
    )
}

function CategoryItem({ category, onEdit, onDelete }: { category: Category; onEdit: () => void; onDelete: () => void }) {
    return (
        <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:shadow-md transition-all duration-200 group">
            <span className="font-semibold text-slate-900 dark:text-slate-100">{category.name}</span>
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onEdit}
                    className="h-9 w-9 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400"
                >
                    <Pencil className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onDelete}
                    className="h-9 w-9 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}
