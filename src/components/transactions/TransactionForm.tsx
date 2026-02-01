"use client"

import { useState } from "react"
import { createTransaction, updateTransaction } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"
import { useFormStatus } from "react-dom"
import { formatCurrency } from "@/lib/utils"

interface TransactionFormProps {
    walletId: string
    categories: { id: string; name: string; type: string }[]
    transaction?: {
        id: string
        amount: number
        description: string | null
        date: string
        category_id: string
    } | null
}

export function TransactionForm({ walletId, categories, transaction }: TransactionFormProps) {
    const today = format(new Date(), 'yyyy-MM-dd')
    const transactionDate = transaction ? format(new Date(transaction.date), 'yyyy-MM-dd') : today
    const [selectedCategory, setSelectedCategory] = useState<string>(transaction?.category_id || "")
    const [amountDisplay, setAmountDisplay] = useState<string>(
        transaction ? transaction.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') : ""
    )

    // Format angka dengan titik sebagai pemisah ribuan
    const formatNumber = (value: string): string => {
        // Hapus semua karakter non-digit
        const numbers = value.replace(/\D/g, '')
        if (!numbers) return ''
        // Format dengan titik sebagai pemisah ribuan
        return numbers.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    }

    // Parse angka dari format yang ditampilkan
    const parseNumber = (value: string): string => {
        return value.replace(/\./g, '')
    }

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatNumber(e.target.value)
        setAmountDisplay(formatted)
    }

    const formAction = async (formData: FormData) => {
        // Ensure categoryId is included in formData
        if (selectedCategory) {
            formData.set('categoryId', selectedCategory)
        }
        // Set amount dari display value (parse dulu)
        if (amountDisplay) {
            formData.set('amount', parseNumber(amountDisplay))
        }
        
        if (transaction) {
            await updateTransaction(transaction.id, formData)
        } else {
            await createTransaction(walletId, formData)
        }
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        if (!selectedCategory) {
            e.preventDefault()
            return false
        }
        if (!amountDisplay || parseNumber(amountDisplay) === '') {
            e.preventDefault()
            return false
        }
    }

    return (
        <form action={formAction} onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Kategori</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="h-11 border-2 focus:border-blue-500 transition-colors">
                        <SelectValue placeholder="Pilih kategori" />
                    </SelectTrigger>
                    <SelectContent>
                        {categories.length === 0 ? (
                            <SelectItem value="" disabled>Tidak ada kategori</SelectItem>
                        ) : (
                            categories.map((c) => (
                                <SelectItem key={c.id} value={c.id}>
                                    {c.name} ({c.type === 'income' ? 'Pemasukan' : 'Pengeluaran'})
                                </SelectItem>
                            ))
                        )}
                    </SelectContent>
                </Select>
                {/* Hidden input for form submission */}
                <input type="hidden" name="categoryId" value={selectedCategory} />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Jumlah (Rp)</label>
                <div className="relative">
                    <Input 
                        type="text" 
                        inputMode="numeric"
                        name="amount" 
                        value={amountDisplay}
                        onChange={handleAmountChange}
                        placeholder="0" 
                        required 
                        className="h-11 border-2 focus:border-blue-500 transition-colors pr-4"
                    />
                    {/* Hidden input untuk form submission dengan nilai numerik */}
                    <input type="hidden" name="amount" value={parseNumber(amountDisplay)} />
                </div>
                {amountDisplay && (
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        {formatCurrency(parseFloat(parseNumber(amountDisplay)) || 0)}
                    </p>
                )}
            </div>

            <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Tanggal</label>
                <Input 
                    type="date" 
                    name="date" 
                    defaultValue={transactionDate} 
                    required 
                    className="h-11 border-2 focus:border-blue-500 transition-colors"
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Keterangan (Opsional)</label>
                <Textarea 
                    name="description" 
                    placeholder="Catatan transaksi..." 
                    defaultValue={transaction?.description || ""}
                    className="border-2 focus:border-blue-500 transition-colors min-h-[100px]"
                />
            </div>

            <PendingButton isEdit={!!transaction} />
        </form>
    )
}

function PendingButton({ isEdit }: { isEdit: boolean }) {
    const { pending } = useFormStatus()
    return (
        <Button 
            type="submit" 
            disabled={pending} 
            className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg shadow-blue-500/30 transition-all duration-200"
        >
            {pending ? "Menyimpan..." : isEdit ? "Perbarui Transaksi" : "Simpan Transaksi"}
        </Button>
    )
}
