# KasTrack (KasBidang)

Aplikasi manajemen keuangan untuk mengontrol pemasukan dan pengeluaran. Dibangun dengan Next.js 14, Supabase, dan Tailwind CSS.

## Fitur

- **Transaksi** — Catat, edit, hapus transaksi. Filter berdasarkan kategori, bulan, tipe, rentang tanggal. Pencarian dan sort.
- **Dashboard** — Grafik tren 6 bulan, bar/line chart, tooltip format Rupiah.
- **Laporan Kategori** — Breakdown per kategori, pie chart, perbandingan antar bulan.
- **Multi-Dompet** — Beberapa dompet, switch aktif, transfer antar dompet, overview saldo. Admin: tambah user, assign wallet+role, undang via link, daftar user aktif.
- **Export & Import** — Export CSV, backup JSON, import CSV dengan validasi.
- **PWA** — Install ke home screen, dukungan offline untuk halaman yang pernah dibuka.
- **Tema** — Mode gelap dan terang (dark/light).
- **Kategori** — Kelola kategori pemasukan dan pengeluaran per dompet.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Database & Auth:** Supabase (PostgreSQL, Auth, RLS)
- **Styling:** Tailwind CSS, shadcn/ui (Radix UI)
- **Charts:** Recharts
- **Font:** Inter (Google Fonts)

## Persiapan

1. **Node.js** 18+ dan npm
2. **Akun Supabase** — [supabase.com](https://supabase.com)
3. **Database** — Jalankan `supabase/init.sql` di Supabase SQL Editor (lihat [supabase/README.md](supabase/README.md))

## Setup Lokal

```bash
# Clone (jika dari repo)
git clone <repo-url>
cd kasbidang

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
`SUPABASE_SERVICE_ROLE_KEY` dari **API** → **service_role** (secret).

## Menjalankan

```bash
# Development
npm run dev
# Buka http://localhost:3000

# Build production
npm run build

# Jalankan production
npm start
```

## Deploy ke Server

- Jangan upload `.env.local`. Set variabel env di panel hosting (Vercel, Railway, dll.).
- Detail: lihat [UPLOAD_KE_SERVER.md](UPLOAD_KE_SERVER.md).

### Vercel

1. Import project dari Git
2. Set env: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (jika pakai fitur admin buat user)
3. Deploy

## Struktur Project

```
kasbidang/
├── public/           # manifest.json, sw.js (PWA)
├── src/
│   ├── app/          # Halaman (dashboard, transaksi, kategori, laporan, dompet, pengaturan, invite, login)
│   ├── components/   # UI, wallet, settings, transactions, reports, pwa
│   └── lib/          # data, actions, supabase client, utils, export, import
├── supabase/
│   ├── init.sql      # DDL awal database (satu file)
│   └── README.md     # Panduan setup Supabase
├── README.md
├── REKOMENDASI_FITUR.md
└── UPLOAD_KE_SERVER.md
```

## Dokumen Lain

- **[supabase/README.md](supabase/README.md)** — Setup database Supabase
- **[REKOMENDASI_FITUR.md](REKOMENDASI_FITUR.md)** — Daftar fitur dan progress implementasi
- **[UPLOAD_KE_SERVER.md](UPLOAD_KE_SERVER.md)** — Checklist upload ke server

## Lisensi

Private / sesuai kebijakan project.
# kastrack
