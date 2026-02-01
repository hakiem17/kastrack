# Supabase Setup — KasTrack (KasBidang)

Panduan setup database Supabase untuk aplikasi KasTrack.

## Struktur File

- **`init.sql`** — Satu file SQL lengkap untuk setup awal database. Gunakan file ini untuk DDL dari nol.
- **`migrations/`** — Kosong (semua migration sudah digabung ke `init.sql`).

## Quick Start — Setup Database

1. Buka **Supabase Dashboard** → pilih project Anda
2. Buka **SQL Editor** → **New Query**
3. Salin seluruh isi `supabase/init.sql`
4. Paste ke SQL Editor → **Run** (atau Ctrl/Cmd + Enter)

Setelah selesai, database siap dipakai.

## Apa yang Dibuat?

### Tabel

| Tabel | Keterangan |
|-------|------------|
| `wallets` | Dompet (nama, currency) |
| `wallet_members` | Anggota dompet dengan role (admin, editor, viewer) |
| `wallet_invites` | Undangan wallet (email, role, token, expires) |
| `categories` | Kategori transaksi per wallet |
| `transactions` | Transaksi keuangan |

### Fungsi (SECURITY DEFINER)

| Fungsi | Keterangan |
|--------|------------|
| `is_wallet_member(_wallet_id)` | Cek apakah user saat ini anggota wallet |
| `get_wallet_role(_wallet_id)` | Ambil role user di wallet |
| `create_wallet_with_member(_name, _currency)` | Buat wallet + member admin + kategori default |
| `accept_wallet_invite(_token, _user_email)` | Terima undangan wallet (tambah ke wallet_members, hapus invite) |
| `set_self_admin_all_wallets()` | Jadikan user saat ini admin di semua wallet yang diikuti (untuk koreksi data) |

### Keamanan

- **Row Level Security (RLS)** aktif di semua tabel
- Kebijakan per role: admin bisa kelola user/invite; editor/admin bisa tulis transaksi/kategori; viewer hanya baca
- Helper `is_wallet_member` dan `get_wallet_role` dipakai di policy untuk hindari rekursi

### Index

- `idx_wallet_members_user`, `idx_transactions_wallet`, `idx_categories_wallet`
- `idx_wallet_invites_wallet`, `idx_wallet_invites_token`

## Test Setup

Setelah menjalankan `init.sql`, tes dengan (setelah login/auth):

```sql
-- Buat wallet pertama (jalan sebagai user yang login)
SELECT create_wallet_with_member('Dompet Test');

-- Cek wallet
SELECT * FROM wallets;

-- Cek kategori default
SELECT * FROM categories;

-- Cek member
SELECT * FROM wallet_members;
```

Di aplikasi: login → buat dompet dari halaman Dompet, atau gunakan RPC `create_wallet_with_member` dari client.

## Catatan Penting

1. **Hanya satu file:** `init.sql` berisi semua DDL. Tidak perlu jalankan migration terpisah.
2. **Wallet pertama:** Gunakan `create_wallet_with_member()` (dari app atau RPC), jangan insert langsung ke `wallets` karena RLS dan trigger member.
3. **Invite:** Admin buat invite → user dapat link → buka `/invite?token=...` → login → terima undangan (email harus cocok).
4. **Service role:** Fitur "Tambah User Baru" (admin buat akun) membutuhkan `SUPABASE_SERVICE_ROLE_KEY` di env aplikasi.

## Troubleshooting

| Error | Solusi |
|-------|--------|
| permission denied for table | Pastikan RLS policies sudah jalan dan user sudah login |
| function does not exist | Pastikan seluruh isi `init.sql` sudah di-run (termasuk semua `CREATE OR REPLACE FUNCTION`) |
| new row violates row-level security | Gunakan `create_wallet_with_member()` untuk buat wallet; untuk invite gunakan `accept_wallet_invite` |
| Undangan tidak valid / kadaluarsa | Cek token dan `expires_at` di `wallet_invites`; buat invite baru jika perlu |

## Referensi

- [Supabase RLS](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL Functions](https://www.postgresql.org/docs/current/sql-createfunction.html)
