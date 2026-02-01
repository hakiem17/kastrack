# KasTrack 💰

**Aplikasi Manajemen Keuangan untuk Mengontrol Pemasukan dan Pengeluaran**

[![version](https://img.shields.io/badge/version-1.0-007ec6)](https://github.com/hakiem17/kastrack)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-007ec6?logo=github&logoColor=white)](https://github.com/hakiem17/kastrack)
[![Next.js](https://img.shields.io/badge/Next.js-14-000000?logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)

---

## 🎯 Tentang Aplikasi

KasTrack adalah aplikasi manajemen keuangan yang dirancang untuk mengontrol pemasukan dan pengeluaran dengan mudah. Dibangun dengan Next.js 14, Supabase, dan Tailwind CSS. Aplikasi ini menyediakan dashboard, multi-dompet, laporan kategori, serta dukungan PWA dan tema gelap/terang untuk pengalaman penggunaan yang modern.

---

## 📋 Versi 1.0 - What's New

Versi 1.0 membawa fitur lengkap untuk manajemen keuangan:

### 🐛 Perbaikan & Peningkatan

- ✅ **Improved:** Alur autentikasi dengan Supabase Auth
- ✅ **Enhanced:** Error handling dan validasi form
- ✅ **Added:** Loading states untuk UX yang lebih baik (spinners, indicators)
- ✅ **Fixed:** Tampilan responsif di berbagai perangkat

### ✨ Fitur Baru

- 📊 **Dashboard** — Grafik tren 6 bulan, bar/line chart, tooltip format Rupiah
- 💳 **Transaksi** — Catat, edit, hapus transaksi. Filter kategori, bulan, tipe, rentang tanggal
- 📁 **Laporan Kategori** — Breakdown per kategori, pie chart, perbandingan antar bulan
- 👛 **Multi-Dompet** — Beberapa dompet, switch aktif, transfer antar dompet, overview saldo
- 👥 **Admin** — Tambah user, assign wallet+role, undang via link, daftar user aktif
- 📤 **Export & Import** — Export CSV, backup JSON, import CSV dengan validasi
- 📱 **PWA** — Install ke home screen, dukungan offline
- 🌓 **Tema** — Mode gelap dan terang (dark/light)
- 🏷️ **Kategori** — Kelola kategori pemasukan dan pengeluaran per dompet

---

## 🛠 Tech Stack

| Kategori     | Teknologi                          |
| ------------ | ----------------------------------- |
| Framework    | Next.js 14 (App Router)             |
| Bahasa       | TypeScript                          |
| Database & Auth | Supabase (PostgreSQL, Auth, RLS) |
| Styling      | Tailwind CSS, shadcn/ui (Radix UI)  |
| Charts       | Recharts                            |

---

## 📦 Persiapan

1. **Node.js** 18+ dan npm
2. **Akun Supabase** — [supabase.com](https://supabase.com)
3. **Database** — Jalankan `supabase/init.sql` di Supabase SQL Editor (lihat [supabase/README.md](supabase/README.md))

---

## 🚀 Setup Lokal

```bash
# Clone
git clone https://github.com/hakiem17/kastrack.git
cd kastrack

# Install dependency
npm install

# Copy env dan isi nilai
cp .env.example .env.local
```

### Variabel environment (`.env.local`)

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...   # Untuk fitur admin buat user (opsional)
```

Ambil URL dan key dari **Supabase Dashboard** → Project → **Settings** → **API**.

---

## ▶️ Menjalankan

```bash
# Development
npm run dev
# Buka http://localhost:3000

# Build production
npm run build
npm start
```

---

## 📚 Dokumen Lain

- **[supabase/README.md](supabase/README.md)** — Setup database Supabase
- **[REKOMENDASI_FITUR.md](REKOMENDASI_FITUR.md)** — Daftar fitur dan progress implementasi
- **[UPLOAD_KE_SERVER.md](UPLOAD_KE_SERVER.md)** — Checklist upload ke server

---

## 📄 Lisensi

Private / sesuai kebijakan project.
