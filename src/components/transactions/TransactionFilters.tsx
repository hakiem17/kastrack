"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Filter, X, ArrowUpDown } from "lucide-react"

interface TransactionFiltersProps {
    categories: { id: string; name: string; type: 'income' | 'expense' }[]
}

export function TransactionFilters({ categories }: TransactionFiltersProps) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [isOpen, setIsOpen] = useState(false)
    
    const [search, setSearch] = useState(searchParams.get('search') || '')
    const [categoryId, setCategoryId] = useState(searchParams.get('category') || 'all')
    const [type, setType] = useState<'income' | 'expense' | 'all'>(searchParams.get('type') as 'income' | 'expense' | 'all' || 'all')
    const [month, setMonth] = useState(searchParams.get('month') || '')
    const [startDate, setStartDate] = useState(searchParams.get('startDate') || '')
    const [endDate, setEndDate] = useState(searchParams.get('endDate') || '')
    const [sortBy, setSortBy] = useState<'date' | 'amount' | 'category'>(searchParams.get('sortBy') as 'date' | 'amount' | 'category' || 'date')
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(searchParams.get('sortOrder') as 'asc' | 'desc' || 'desc')

    const hasActiveFilters = search || categoryId || type !== 'all' || month || startDate || endDate

    const setMonthRange = (monthValue: string) => {
        if (!monthValue) {
            setMonth('')
            setStartDate('')
            setEndDate('')
            return
        }

        const [year, monthNumber] = monthValue.split('-').map(Number)
        if (!year || !monthNumber) return

        const start = new Date(year, monthNumber - 1, 1)
        const end = new Date(year, monthNumber, 0)
        const pad = (value: number) => value.toString().padStart(2, '0')
        const startFormatted = `${start.getFullYear()}-${pad(start.getMonth() + 1)}-${pad(start.getDate())}`
        const endFormatted = `${end.getFullYear()}-${pad(end.getMonth() + 1)}-${pad(end.getDate())}`

        setMonth(monthValue)
        setStartDate(startFormatted)
        setEndDate(endFormatted)
    }

    const applyFilters = () => {
        const params = new URLSearchParams()
        
        if (search) params.set('search', search)
        if (categoryId && categoryId !== 'all') params.set('category', categoryId)
        if (type !== 'all') params.set('type', type)
        if (month) params.set('month', month)
        if (startDate) params.set('startDate', startDate)
        if (endDate) params.set('endDate', endDate)
        params.set('sortBy', sortBy)
        params.set('sortOrder', sortOrder)

        router.push(`/transactions?${params.toString()}`)
    }

    const clearFilters = () => {
        setSearch('')
        setCategoryId('all')
        setType('all')
        setMonth('')
        setStartDate('')
        setEndDate('')
        setSortBy('date')
        setSortOrder('desc')
        router.push('/transactions')
    }

    // Apply filters when sort changes
    const handleSortChange = (newSortBy: 'date' | 'amount' | 'category', newSortOrder: 'asc' | 'desc') => {
        setSortBy(newSortBy)
        setSortOrder(newSortOrder)
        const params = new URLSearchParams()
        
        // Preserve existing filters
        if (search) params.set('search', search)
        if (categoryId && categoryId !== 'all') params.set('category', categoryId)
        if (type !== 'all') params.set('type', type)
        if (month) params.set('month', month)
        if (startDate) params.set('startDate', startDate)
        if (endDate) params.set('endDate', endDate)
        
        // Update sort
        params.set('sortBy', newSortBy)
        params.set('sortOrder', newSortOrder)
        
        router.push(`/transactions?${params.toString()}`)
    }

    const incomeCategories = categories.filter(c => c.type === 'income')
    const expenseCategories = categories.filter(c => c.type === 'expense')

    return (
        <div className="space-y-4">
            {/* Search Bar */}
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        type="text"
                        placeholder="Cari berdasarkan keterangan..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                applyFilters()
                            }
                        }}
                        className="pl-10 h-10 border-2 focus:border-blue-500"
                    />
                </div>
                <Button
                    onClick={() => setIsOpen(!isOpen)}
                    variant={isOpen ? "default" : "outline"}
                    className="h-10"
                >
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                    {hasActiveFilters && (
                        <span className="ml-2 h-5 w-5 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center">
                            {[search, categoryId, type !== 'all', month, startDate, endDate].filter(Boolean).length}
                        </span>
                    )}
                </Button>
                {hasActiveFilters && (
                    <Button
                        onClick={clearFilters}
                        variant="outline"
                        className="h-10"
                    >
                        <X className="h-4 w-4 mr-2" />
                        Reset
                    </Button>
                )}
            </div>

            {/* Filter Panel */}
            {isOpen && (
                <Card className="border-0 shadow-lg">
                    <CardContent className="p-6 space-y-4">
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {/* Type Filter */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Tipe</label>
                                <Select 
                                    value={type} 
                                    onValueChange={(value) => {
                                        const newType = value as 'income' | 'expense' | 'all'
                                        setType(newType)
                                        // Reset category if it doesn't match the new type
                                        if (newType !== 'all' && categoryId) {
                                            const selectedCategory = categories.find(c => c.id === categoryId)
                                            if (selectedCategory && selectedCategory.type !== newType) {
                                                setCategoryId('')
                                            }
                                        }
                                    }}
                                >
                                    <SelectTrigger className="h-10">
                                        <SelectValue placeholder="Semua" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua</SelectItem>
                                        <SelectItem value="income">Pemasukan</SelectItem>
                                        <SelectItem value="expense">Pengeluaran</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Category Filter */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Kategori</label>
                                <Select 
                                    value={categoryId} 
                                    onValueChange={(value) => {
                                        setCategoryId(value)
                                        // Auto-apply when category changes
                                        setTimeout(() => {
                                            const params = new URLSearchParams()
                                            if (search) params.set('search', search)
                                            if (value && value !== 'all') params.set('category', value)
                                            if (type !== 'all') params.set('type', type)
                                            if (month) params.set('month', month)
                                            if (startDate) params.set('startDate', startDate)
                                            if (endDate) params.set('endDate', endDate)
                                            params.set('sortBy', sortBy)
                                            params.set('sortOrder', sortOrder)
                                            router.push(`/transactions?${params.toString()}`)
                                        }, 100)
                                    }}
                                >
                                    <SelectTrigger className="h-10">
                                        <SelectValue placeholder="Semua Kategori" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Kategori</SelectItem>
                                        {type === 'income' || type === 'all' ? (
                                            incomeCategories.map((cat) => (
                                                <SelectItem key={cat.id} value={cat.id}>
                                                    {cat.name} (Pemasukan)
                                                </SelectItem>
                                            ))
                                        ) : null}
                                        {type === 'expense' || type === 'all' ? (
                                            expenseCategories.map((cat) => (
                                                <SelectItem key={cat.id} value={cat.id}>
                                                    {cat.name} (Pengeluaran)
                                                </SelectItem>
                                            ))
                                        ) : null}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Sort By */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Urutkan</label>
                                <div className="flex gap-2">
                                    <Select value={sortBy} onValueChange={(value) => handleSortChange(value as 'date' | 'amount' | 'category', sortOrder)}>
                                        <SelectTrigger className="h-10 flex-1">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="date">Tanggal</SelectItem>
                                            <SelectItem value="amount">Jumlah</SelectItem>
                                            <SelectItem value="category">Kategori</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => handleSortChange(sortBy, sortOrder === 'asc' ? 'desc' : 'asc')}
                                        className="h-10 w-10"
                                    >
                                        <ArrowUpDown className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            {/* Month Filter */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Bulan</label>
                                <Input
                                    type="month"
                                    value={month}
                                    onChange={(e) => setMonthRange(e.target.value)}
                                    className="h-10 border-2 focus:border-blue-500"
                                />
                            </div>

                            {/* Start Date */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Dari Tanggal</label>
                                <Input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => {
                                        setStartDate(e.target.value)
                                        setMonth('')
                                    }}
                                    className="h-10 border-2 focus:border-blue-500"
                                />
                            </div>

                            {/* End Date */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Sampai Tanggal</label>
                                <Input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => {
                                        setEndDate(e.target.value)
                                        setMonth('')
                                    }}
                                    className="h-10 border-2 focus:border-blue-500"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                            <Button
                                variant="outline"
                                onClick={clearFilters}
                            >
                                Reset
                            </Button>
                            <Button
                                onClick={applyFilters}
                                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                            >
                                Terapkan Filter
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
