"use client"

import { useState } from "react"
import { createCategory, updateCategory } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useFormStatus } from "react-dom"

interface CategoryFormProps {
    walletId: string
    category?: { id: string; name: string; type: 'income' | 'expense' } | null
    onSuccess?: () => void
}

export function CategoryForm({ walletId, category, onSuccess }: CategoryFormProps) {
    const [type, setType] = useState<string>(category?.type || "")
    const [error, setError] = useState<string>("")

    const formAction = async (formData: FormData) => {
        setError("")
        formData.set('type', type)

        let result
        if (category) {
            result = await updateCategory(category.id, formData)
        } else {
            result = await createCategory(walletId, formData)
        }

        if (result?.error) {
            setError(result.error)
        } else {
            if (onSuccess) onSuccess()
            // Reset form
            if (!category) {
                const form = document.getElementById('category-form') as HTMLFormElement
                form?.reset()
                setType("")
            }
        }
    }

    return (
        <form id="category-form" action={formAction} className="space-y-5">
            <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Nama Kategori</Label>
                <Input
                    id="name"
                    name="name"
                    placeholder="Contoh: Gaji, Makan, Transport"
                    defaultValue={category?.name || ""}
                    required
                    className="h-11 border-2 focus:border-blue-500 transition-colors"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="type" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Tipe</Label>
                <Select value={type} onValueChange={setType} required>
                    <SelectTrigger id="type" className="h-11 border-2 focus:border-blue-500 transition-colors">
                        <SelectValue placeholder="Pilih tipe" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="income">Pemasukan</SelectItem>
                        <SelectItem value="expense">Pengeluaran</SelectItem>
                    </SelectContent>
                </Select>
                <input type="hidden" name="type" value={type} />
            </div>

            {error && (
                <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 rounded-lg font-medium">
                    {error}
                </div>
            )}

            <SubmitButton isEdit={!!category} />
        </form>
    )
}

function SubmitButton({ isEdit }: { isEdit: boolean }) {
    const { pending } = useFormStatus()
    return (
        <Button 
            type="submit" 
            disabled={pending} 
            className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg shadow-blue-500/30 transition-all duration-200"
        >
            {pending ? "Menyimpan..." : isEdit ? "Perbarui Kategori" : "Tambah Kategori"}
        </Button>
    )
}
