"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    ArrowRight,
    Wallet,
    TrendingUp,
    BarChart3,
    Zap,
    CreditCard,
    PieChart,
    Download,
    Smartphone,
} from "lucide-react"

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]" />

            {/* Navigation */}
            <nav className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                            <span className="text-white font-bold text-lg">K</span>
                        </div>
                        <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            KasTrack
                        </span>
                    </div>
                    <Button asChild className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30">
                        <Link href="/login">
                            Masuk
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-sm font-semibold mb-8">
                        <Zap className="h-4 w-4" />
                        <span>Kelola Keuangan dengan Mudah</span>
                    </div>

                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
                        <span className="bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-900 dark:from-slate-100 dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent">
                            Kelola Keuangan
                        </span>
                        <br />
                        <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            Lebih Cerdas
                        </span>
                    </h1>

                    <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto">
                        Aplikasi manajemen keuangan untuk mengontrol pemasukan dan pengeluaran. Transaksi, dashboard grafik, laporan kategori, multi-dompet, export/import, dan PWA—semua dalam satu tempat.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            asChild
                            size="lg"
                            className="h-14 px-8 text-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg shadow-blue-500/30"
                        >
                            <Link href="/login">
                                Mulai Sekarang
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </Button>
                        <Button
                            asChild
                            size="lg"
                            variant="outline"
                            className="h-14 px-8 text-lg border-2"
                        >
                            <Link href="#features">
                                Fitur Tersedia
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Features Section - sesuai fitur yang tersedia */}
            <div id="features" className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                            Fitur Tersedia
                        </h2>
                        <p className="text-xl text-slate-600 dark:text-slate-400">
                            Semua fitur di bawah ini sudah aktif dan siap dipakai setelah login
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Transaksi & Filter */}
                        <div className="p-8 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-xl transition-all duration-300">
                            <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-6 shadow-md">
                                <CreditCard className="h-7 w-7 text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100">Transaksi & Filter</h3>
                            <p className="text-slate-600 dark:text-slate-400">
                                Catat, edit, dan hapus transaksi. Filter berdasarkan kategori, bulan, tipe, dan rentang tanggal. Pencarian keterangan. Sort by amount, date, category.
                            </p>
                        </div>

                        {/* Dashboard & Grafik */}
                        <div className="p-8 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-xl transition-all duration-300">
                            <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mb-6 shadow-md">
                                <TrendingUp className="h-7 w-7 text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100">Dashboard & Grafik</h3>
                            <p className="text-slate-600 dark:text-slate-400">
                                Grafik tren 6 bulan terakhir. Bar chart dan line chart dengan toggle. Tooltip format Rupiah. Perbandingan pemasukan dan pengeluaran bulanan.
                            </p>
                        </div>

                        {/* Laporan Kategori */}
                        <div className="p-8 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-xl transition-all duration-300">
                            <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mb-6 shadow-md">
                                <PieChart className="h-7 w-7 text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100">Laporan Kategori</h3>
                            <p className="text-slate-600 dark:text-slate-400">
                                Breakdown pengeluaran dan pemasukan per kategori. Pie chart distribusi. Top kategori. Perbandingan kategori antar bulan.
                            </p>
                        </div>

                        {/* Multi-Dompet & Pengaturan User */}
                        <div className="p-8 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-xl transition-all duration-300">
                            <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center mb-6 shadow-md">
                                <Wallet className="h-7 w-7 text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100">Multi-Dompet & User</h3>
                            <p className="text-slate-600 dark:text-slate-400">
                                Beberapa dompet, switch aktif, transfer antar dompet, overview saldo. Admin: tambah user baru, assign wallet dan role, undang via link, daftar user aktif.
                            </p>
                        </div>

                        {/* Export / Import */}
                        <div className="p-8 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-xl transition-all duration-300">
                            <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mb-6 shadow-md">
                                <Download className="h-7 w-7 text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100">Export & Import</h3>
                            <p className="text-slate-600 dark:text-slate-400">
                                Export ke CSV, backup lengkap (JSON). Import dari CSV dengan validasi. Template import untuk memudahkan isi data.
                            </p>
                        </div>

                        {/* PWA & Tema */}
                        <div className="p-8 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-xl transition-all duration-300">
                            <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-6 shadow-md">
                                <Smartphone className="h-7 w-7 text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100">PWA & Tema</h3>
                            <p className="text-slate-600 dark:text-slate-400">
                                Install ke home screen seperti aplikasi. Dukungan offline untuk halaman yang pernah dibuka. Mode gelap dan terang (dark/light theme).
                            </p>
                        </div>
                    </div>

                    {/* Bonus: Kategori */}
                    <div className="mt-12 max-w-2xl mx-auto p-6 rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-slate-800">
                        <div className="flex items-start gap-4">
                            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-slate-500 to-slate-600 flex items-center justify-center shrink-0">
                                <BarChart3 className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold mb-1 text-slate-900 dark:text-slate-100">Kategori</h3>
                                <p className="text-slate-600 dark:text-slate-400 text-sm">
                                    Kelola kategori pemasukan dan pengeluaran. Tambah, edit, dan hapus kategori sesuai kebutuhan dompet Anda.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="p-12 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 shadow-2xl">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Siap Memulai?
                        </h2>
                        <p className="text-xl text-blue-100 mb-8">
                            Login dan nikmati semua fitur di atas—transaksi, dashboard, laporan, multi-dompet, export/import, dan PWA.
                        </p>
                        <Button
                            asChild
                            size="lg"
                            className="h-14 px-8 text-lg bg-white text-blue-600 hover:bg-blue-50 font-semibold shadow-lg"
                        >
                            <Link href="/login">
                                Masuk Sekarang
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="relative z-10 border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col md:flex-row items-center justify-between">
                        <div className="flex items-center gap-3 mb-4 md:mb-0">
                            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                                <span className="text-white font-bold">K</span>
                            </div>
                            <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                KasTrack
                            </span>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            © {new Date().getFullYear()} KasTrack. Kelola keuangan lebih cerdas.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    )
}
