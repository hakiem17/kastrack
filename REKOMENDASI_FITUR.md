# 🚀 Rekomendasi Peningkatan Fitur KasTrack

Dokumen ini berisi rekomendasi fitur untuk meningkatkan aplikasi KasTrack berdasarkan analisis fitur yang sudah ada.

---

## 📊 **PRIORITAS TINGGI** (High Impact, Mudah Diimplementasikan)

### 1. **Filter & Pencarian Transaksi** ⭐⭐⭐⭐⭐ ✅ **SELESAI**
- **Fitur:**
  - ✅ Filter berdasarkan kategori, tanggal, tipe (pemasukan/pengeluaran)
  - ✅ Pencarian berdasarkan keterangan
  - ✅ Filter rentang tanggal (custom date range)
  - ✅ **Filter opsi bulan** (input month → auto set Dari/Sampai Tanggal)
  - ✅ Sort by amount, date, category
  - ✅ URL-based filters (dapat di-bookmark)
  - ✅ Auto-apply untuk kategori dan sorting
  
- **Manfaat:** Memudahkan analisis transaksi spesifik
- **Effort:** ⭐⭐ (Mudah)
- **Impact:** ⭐⭐⭐⭐⭐ (Sangat Tinggi)
- **Status:** ✅ **IMPLEMENTED** - File: `src/components/transactions/TransactionFilters.tsx`

---

### 2. **Edit & Hapus Transaksi** ⭐⭐⭐⭐⭐ ✅ **SELESAI**
- **Fitur:**
  - ✅ Edit transaksi yang sudah dibuat
  - ✅ Hapus transaksi dengan konfirmasi dialog
  - ✅ Form edit dengan pre-filled data
  - ✅ Auto-refresh setelah edit/hapus
  - ⬜ History perubahan (optional - belum diimplementasikan)
  
- **Manfaat:** Koreksi data lebih mudah
- **Effort:** ⭐⭐ (Mudah)
- **Impact:** ⭐⭐⭐⭐⭐ (Sangat Tinggi)
- **Status:** ✅ **IMPLEMENTED** - Files: `src/components/transactions/TransactionActions.tsx`, `src/app/transactions/[id]/edit/page.tsx`

---

### 3. **Dashboard Overview & Filter Bulan** ⭐⭐⭐⭐ ✅ **SELESAI**
- **Fitur:**
  - ✅ **Overview Keuangan tren harian** – chart per hari dalam bulan yang dipilih (bukan 12 bulan)
  - ✅ Filter bulan & tahun di dashboard (dropdown Bulan + Tahun)
  - ✅ Kartu Pemasukan/Pengeluaran mengikuti bulan yang dipilih
  - ✅ Line chart & Bar chart dengan toggle
  - ✅ Custom tooltip (format Rupiah, "Tanggal X" untuk view harian)
  - ✅ Sumbu X di chart harian dirapikan (interval label agar tidak penuh)
  
- **Manfaat:** Fokus analisis bulan berjalan per hari; ganti bulan tanpa keluar halaman
- **Effort:** ⭐⭐ (Mudah)
- **Impact:** ⭐⭐⭐⭐ (Tinggi)
- **Status:** ✅ **IMPLEMENTED** - Files: `src/components/dashboard/OverviewChart.tsx`, `src/components/dashboard/DashboardMonthFilter.tsx`, `src/app/dashboard/page.tsx`, `src/lib/data.ts` (getDashboardStats, getDailyReport, params month/year)

---

### 4. **Budget/Target Pengeluaran** ⭐⭐⭐⭐
- **Fitur:**
  - Set budget per kategori atau bulanan
  - Notifikasi saat mendekati/melebihi budget
  - Progress bar budget
  - Dashboard budget overview
  
- **Manfaat:** Kontrol pengeluaran lebih baik
- **Effort:** ⭐⭐⭐ (Sedang)
- **Impact:** ⭐⭐⭐⭐ (Tinggi)

---

### 5. **Recurring Transactions (Transaksi Berulang)** ⭐⭐⭐⭐
- **Fitur:**
  - Transaksi otomatis bulanan (gaji, tagihan)
  - Template transaksi cepat
  - Schedule transaksi (harian, mingguan, bulanan)
  
- **Manfaat:** Efisiensi input data
- **Effort:** ⭐⭐⭐ (Sedang)
- **Impact:** ⭐⭐⭐⭐ (Tinggi)

---

## 📈 **PRIORITAS MENENGAH** (Nilai Tambah)

### 6. **Laporan Kategori** ⭐⭐⭐ ✅ **SELESAI**
- **Fitur:**
  - ✅ Breakdown pengeluaran/pemasukan per kategori
  - ✅ Pie chart distribusi kategori
  - ✅ Top kategori terbesar
  - ✅ Perbandingan kategori antar bulan
  
- **Manfaat:** Identifikasi pola pengeluaran
- **Effort:** ⭐⭐ (Mudah)
- **Impact:** ⭐⭐⭐ (Sedang)
- **Status:** ✅ **IMPLEMENTED** - Files: `src/components/reports/CategoryReport.tsx`, `src/lib/data.ts` (getCategoryBreakdown, getCategoryMonthlyComparison)

---

### 7. **Notifikasi & Reminder** ⭐⭐⭐
- **Fitur:**
  - Notifikasi tagihan rutin
  - Reminder input transaksi harian
  - Alert budget hampir habis
  - Email/In-app notifications
  
- **Manfaat:** Meningkatkan engagement
- **Effort:** ⭐⭐⭐ (Sedang)
- **Impact:** ⭐⭐⭐ (Sedang)

---

### 8. **Multi-Wallet Management** ⭐⭐⭐ ✅ **SELESAI**
- **Fitur:**
  - ✅ Switch antar wallet (dropdown + tombol "Jadikan Aktif" per dompet)
  - ✅ Dashboard per wallet (wallet aktif via cookie `active_wallet_id`)
  - ✅ Transfer antar wallet (form Transfer Antar Wallet, kategori Transfer Masuk/Keluar)
  - ✅ Overview semua wallet (saldo total per dompet, tanpa duplikat)
  - ✅ Tambah dompet dari halaman Dompet (form Tambah Dompet Baru)
  - ✅ **Pengaturan User (Admin):** Tambah user baru (popup), email+password, pilih wallet + role; daftar user aktif & wallet yang diakses
  - ✅ **Invite wallet:** Admin buat link undangan; user terima lewat `/invite?token=...`, masuk wallet dengan role yang ditentukan
  - ✅ **Set self admin:** Tombol "Jadikan saya admin di semua wallet" di Pengaturan (koreksi role satu kali)
  
- **Manfaat:** Mengelola beberapa dompet dan akses per user
- **Effort:** ⭐⭐⭐ (Sedang)
- **Impact:** ⭐⭐⭐ (Sedang)
- **Status:** ✅ **IMPLEMENTED** - Files: `src/app/wallets/page.tsx`, `src/app/settings/page.tsx`, `src/app/invite/page.tsx`, `src/components/wallet/WalletSwitcher.tsx`, `src/components/wallet/WalletTransferForm.tsx`, `src/components/settings/SettingsCreateUserForm.tsx`, `src/components/settings/SettingsUserList.tsx`, `src/components/settings/SettingsSetAdminAllButton.tsx`, `src/components/settings/InviteAcceptClient.tsx`, `src/lib/data.ts` (getWallets dengan filter user_id, getWalletsWithRole, getActiveUsersWithWallets), `src/lib/actions.ts` (setActiveWallet, transferBetweenWallets, createWalletAndStay, createUserByAdmin, createWalletInvite, acceptWalletInvite, setSelfAdminAllWallets), `supabase/init.sql` (DDL awal satu file)

---

### 9. **Export & Import Data** ⭐⭐⭐ ✅ **SELESAI**
- **Fitur:**
  - ✅ Export ke Excel/CSV
  - ✅ Import dari Excel/CSV
  - ✅ Backup data otomatis (JSON)
  - ✅ Template import
  
- **Manfaat:** Backup dan migrasi data
- **Effort:** ⭐⭐⭐ (Sedang)
- **Impact:** ⭐⭐⭐ (Sedang)
- **Status:** ✅ **IMPLEMENTED** - Files: `src/lib/export.ts`, `src/lib/import.ts`, `src/components/import/ImportDialog.tsx`, `src/components/export/ExportMenu.tsx`, `src/lib/actions.ts` (importTransactions)

---

### 10. **Laporan Periode (MTD, YTD, YoY, TTM)** ⭐⭐⭐⭐ ✅ **SELESAI**
- **Fitur:**
  - ✅ **MTD (Month-to-Date)** – dari awal bulan hingga hari ini
  - ✅ **YTD (Year-to-Date)** – dari 1 Januari hingga hari ini
  - ✅ **YoY (Year-over-Year)** – bulan ini vs bulan sama tahun lalu + % pertumbuhan
  - ✅ **TTM (Trailing Twelve Months)** – ringkasan 12 bulan terakhir + chart tren
  - ✅ Tab MTD/YTD/YoY/TTM (navigasi via Link, tampilan sesuai periode)
  - ✅ Menu "Laporan Periode" di sidebar + link dari halaman Laporan
  
- **Manfaat:** Analisis periode standar (MTD, YTD, YoY, TTM) tanpa hitung manual
- **Effort:** ⭐⭐⭐ (Sedang)
- **Impact:** ⭐⭐⭐⭐ (Tinggi)
- **Status:** ✅ **IMPLEMENTED** - Files: `src/app/reports/period/page.tsx`, `src/components/reports/PeriodTypeTabs.tsx`, `src/lib/data.ts` (getPeriodReport, getIncomeExpenseInRange), Navbar (Laporan Periode)

---

### 11. **Statistik Lanjutan** ⭐⭐⭐
- **Fitur:**
  - Rata-rata pengeluaran harian/bulanan
  - Perbandingan YoY (Year over Year) — *sebagian tercakup di Laporan Periode*
  - Prediksi pengeluaran
  - Insight & rekomendasi
  
- **Manfaat:** Insight lebih dalam
- **Effort:** ⭐⭐⭐⭐ (Agak Sulit)
- **Impact:** ⭐⭐⭐ (Sedang)

---

## 🎨 **PRIORITAS RENDAH** (Nice to Have)

### 12. **Dark Mode Toggle** ⭐⭐ ✅ **SELESAI**
- **Fitur:**
  - ✅ Toggle dark/light mode
  - ✅ Simpan preferensi user (localStorage)
  - ✅ Auto-detect system preference
  - ✅ Smooth transitions
  - ✅ Dropdown menu dengan 3 opsi (Light/Dark/System)
  
- **Manfaat:** Kenyamanan visual
- **Effort:** ⭐⭐ (Mudah)
- **Impact:** ⭐⭐ (Rendah)
- **Status:** ✅ **IMPLEMENTED** - Files: `src/components/ThemeProvider.tsx`, `src/components/ThemeToggle.tsx`

---

### 13. **Tag/Label Transaksi** ⭐⭐
- **Fitur:**
  - Multiple tags per transaksi
  - Filter berdasarkan tag
  - Tag management
  
- **Manfaat:** Kategorisasi lebih fleksibel
- **Effort:** ⭐⭐⭐ (Sedang)
- **Impact:** ⭐⭐ (Rendah)

---

### 14. **Foto & Attachment** ⭐⭐
- **Fitur:**
  - Upload foto struk/kwitansi
  - Attachment dokumen
  - Preview gambar
  
- **Manfaat:** Dokumentasi transaksi
- **Effort:** ⭐⭐⭐⭐ (Agak Sulit)
- **Impact:** ⭐⭐ (Rendah)

---

### 15. **Goal/Target Keuangan** ⭐⭐
- **Fitur:**
  - Set target tabungan
  - Progress tracking
  - Milestone celebration
  
- **Manfaat:** Motivasi menabung
- **Effort:** ⭐⭐⭐ (Sedang)
- **Impact:** ⭐⭐ (Rendah)

---

### 16. **Sharing & Kolaborasi** ⭐⭐
- **Fitur:**
  - Share laporan dengan anggota wallet
  - Komentar pada transaksi
  - Activity log
  
- **Manfaat:** Kolaborasi tim
- **Effort:** ⭐⭐⭐⭐ (Agak Sulit)
- **Impact:** ⭐⭐ (Rendah)

---

### 17. **Mobile App (PWA)** ⭐⭐ ✅ **SELESAI**
- **Fitur:**
  - ✅ Progressive Web App (manifest, metadata, theme-color)
  - ✅ Offline support (service worker cache-first untuk repeat visit)
  - ✅ Install to home screen (Add to Home Screen / Install app)
  - ⬜ Push notifications (opsional, belum diimplementasikan)
  
- **Manfaat:** Akses mobile lebih baik
- **Effort:** ⭐⭐⭐⭐ (Agak Sulit)
- **Impact:** ⭐⭐ (Rendah)
- **Status:** ✅ **IMPLEMENTED** - Files: `public/manifest.json`, `public/sw.js`, `src/components/pwa/RegisterSW.tsx`, `src/app/layout.tsx` (metadata, viewport, manifest, appleWebApp)

---

### 18. **Integrasi Bank (Opsional)** ⭐
- **Fitur:**
  - Import otomatis dari bank
  - Auto-categorization dengan AI
  - Bank API integration
  
- **Manfaat:** Otomasi input
- **Effort:** ⭐⭐⭐⭐⭐ (Sangat Sulit)
- **Impact:** ⭐ (Sangat Rendah)

---

### 19. **Dashboard Widget Customization** ⭐
- **Fitur:**
  - Drag & drop widgets
  - Pilih metrik yang ditampilkan
  - Custom layout
  
- **Manfaat:** Personalisasi dashboard
- **Effort:** ⭐⭐⭐⭐ (Agak Sulit)
- **Impact:** ⭐ (Sangat Rendah)

---

## 📅 **REKOMENDASI IMPLEMENTASI BERTAHAP**

### **Fase 1** (1-2 Minggu) - Quick Wins ✅ **SELESAI**
✅ Edit & Hapus Transaksi  
✅ Filter & Pencarian Transaksi  
✅ Dashboard Overview (tren harian + filter bulan)  
✅ Dark Mode Toggle (Bonus)

**Total Effort:** ⭐⭐ (Mudah)  
**Total Impact:** ⭐⭐⭐⭐⭐ (Sangat Tinggi)  
**Status:** ✅ **COMPLETED**

---

### **Fase 2** (2-3 Minggu) - Core Features
⬜ Budget/Target Pengeluaran  
✅ Laporan Kategori  
⬜ Recurring Transactions  

**Total Effort:** ⭐⭐⭐ (Sedang)  
**Total Impact:** ⭐⭐⭐⭐ (Tinggi)

---

### **Fase 3** (3-4 Minggu) - Advanced Features
✅ Multi-Wallet Management (termasuk Pengaturan User, Invite, Set Self Admin)  
✅ Export/Import Data  
✅ Laporan Periode (MTD, YTD, YoY, TTM)  
⬜ Statistik Lanjutan  

**Total Effort:** ⭐⭐⭐⭐ (Agak Sulit)  
**Total Impact:** ⭐⭐⭐ (Sedang)

---

### **Fase 4** (Opsional) - Nice to Have
✅ Mobile App (PWA) — manifest, service worker, install to home screen  
✅ Tampilan iPad (sidebar lg, bottom nav + full width, tabel scroll, safe area)  
✅ Ganti wallet tanpa clear cache (full page load)

---

## 🎯 **PRIORITAS BERDASARKAN VALUE**

| Fitur | Impact | Effort | Priority | Status |
|-------|--------|--------|----------|--------|
| Edit/Hapus Transaksi | ⭐⭐⭐⭐⭐ | ⭐⭐ | **PALING PENTING** | ✅ **SELESAI** |
| Filter & Pencarian | ⭐⭐⭐⭐⭐ | ⭐⭐ | **PALING PENTING** | ✅ **SELESAI** |
| Dashboard Overview (harian + filter bulan) | ⭐⭐⭐⭐ | ⭐⭐ | **SANGAT PENTING** | ✅ **SELESAI** |
| Laporan Periode (MTD, YTD, YoY, TTM) | ⭐⭐⭐⭐ | ⭐⭐⭐ | **SANGAT PENTING** | ✅ **SELESAI** |
| Dark Mode Toggle | ⭐⭐ | ⭐⭐ | **OPSIONAL** | ✅ **SELESAI** |
| Budget Management | ⭐⭐⭐⭐ | ⭐⭐⭐ | **SANGAT PENTING** | ⬜ Belum |
| Recurring Transactions | ⭐⭐⭐⭐ | ⭐⭐⭐ | **PENTING** | ⬜ Belum |
| Laporan Kategori | ⭐⭐⭐ | ⭐⭐ | **PENTING** | ✅ **SELESAI** |
| Notifikasi | ⭐⭐⭐ | ⭐⭐⭐ | **PENTING** | ⬜ Belum |
| Multi-Wallet | ⭐⭐⭐ | ⭐⭐⭐ | **PENTING** | ✅ **SELESAI** |
| Export/Import | ⭐⭐⭐ | ⭐⭐⭐ | **PENTING** | ✅ **SELESAI** |
| Statistik Lanjutan | ⭐⭐⭐ | ⭐⭐⭐⭐ | **OPSIONAL** | ⬜ Belum |
| Mobile App (PWA) | ⭐⭐ | ⭐⭐⭐⭐ | **OPSIONAL** | ✅ **SELESAI** |

---

## 💡 **REKOMENDASI AWAL IMPLEMENTASI**

### **✅ TELAH DIIMPLEMENTASIKAN:**
1. ✅ **Edit & Hapus Transaksi** - Impact sangat tinggi, effort rendah
2. ✅ **Filter & Pencarian** (termasuk opsi filter bulan) - Impact sangat tinggi, effort rendah
3. ✅ **Dashboard Overview Keuangan** - Tren **harian** bulan berjalan + filter Bulan/Tahun; Bar/Line chart, tooltip "Tanggal X"
4. ✅ **Laporan Periode (MTD, YTD, YoY, TTM)** - Menu tersendiri + tab; MTD/YTD/YoY/TTM dengan kartu & (YoY) growth %, (TTM) chart 12 bulan
5. ✅ **Dark Mode Toggle** - Bonus feature
6. ✅ **Laporan Kategori** - Breakdown & perbandingan kategori
7. ✅ **Export/Import Data** - CSV, backup JSON, template import
8. ✅ **Multi-Wallet Management** - Switch wallet (full page reload agar data ikut wallet), transfer antar wallet, overview, tambah dompet; **Pengaturan User**, **Invite wallet**, **Set self admin**; DDL satu file `supabase/init.sql`
9. ✅ **Mobile App (PWA)** - Manifest, service worker, Install to home screen; metadata & viewport di layout
10. ✅ **Tampilan iPad** - Sidebar hanya dari lg (1024px); iPad portrait pakai bottom nav + full width; tabel overflow-x-auto; safe area (pb-safe)

### **Selanjutnya (Rekomendasi):**
1. **Budget Management** - Impact tinggi, effort sedang
2. **Recurring Transactions** - Impact tinggi, effort sedang

### **Alasan Implementasi Fase 1:**
- ✅ Quick wins (hasil cepat terlihat)
- ✅ High impact (meningkatkan UX signifikan)
- ✅ Low effort (mudah diimplementasikan)
- ✅ Foundation untuk fitur lain

---

## 📝 **CATATAN**

- Semua rekomendasi ini berdasarkan analisis fitur yang sudah ada
- Prioritas dapat disesuaikan dengan kebutuhan bisnis
- Effort estimation relatif terhadap kompleksitas kodebase saat ini
- Impact estimation berdasarkan value untuk end user
- Update terbaru: **Dashboard** pakai overview **tren harian** bulan berjalan + filter Bulan/Tahun. **Laporan Periode** (MTD, YTD, YoY, TTM) menu & halaman tersendiri. **Ganti wallet** dengan full page load (tanpa clear cache). **iPad**: sidebar dari lg, bottom nav + full width di tablet portrait, tabel scroll horizontal, safe area.

---

**Versi:** 1.6  
**Status:** Updated - Dashboard harian + filter bulan; Laporan Periode (MTD/YTD/YoY/TTM); iPad layout; wallet switch full reload

---

## 📊 **PROGRESS IMPLEMENTASI**

### ✅ **FITUR YANG SUDAH SELESAI (9 Fitur Utama + pengayaan)**

1. ✅ **Edit & Hapus Transaksi** - Implemented
   - File: `src/components/transactions/TransactionActions.tsx`
   - File: `src/app/transactions/[id]/edit/page.tsx`
   - File: `src/lib/actions.ts` (updateTransaction, deleteTransaction)

2. ✅ **Filter & Pencarian Transaksi** - Implemented
   - File: `src/components/transactions/TransactionFilters.tsx`
   - File: `src/lib/data.ts` (getTransactions dengan filters)
   - File: `src/app/transactions/page.tsx` (updated)
   - Features: Filter bulan (opsi month), kategori, tipe, rentang tanggal, sort, URL params

3. ✅ **Dashboard Overview Keuangan (tren harian + filter bulan)** - Implemented
   - File: `src/components/dashboard/OverviewChart.tsx` (Bar/Line, isDaily, tooltip "Tanggal X")
   - File: `src/components/dashboard/DashboardMonthFilter.tsx` (Bulan + Tahun dropdown)
   - File: `src/app/dashboard/page.tsx` (searchParams month/year, getDailyReport)
   - File: `src/lib/data.ts` (getDashboardStats, getDailyReport dengan params month/year)
   - Features: Tren harian bulan yang dipilih, filter Bulan/Tahun, Bar/Line chart, custom tooltip

4. ✅ **Dark Mode Toggle** - Implemented
   - File: `src/components/ThemeProvider.tsx`
   - File: `src/components/ThemeToggle.tsx`
   - File: `src/app/layout.tsx` (updated)

5. ✅ **Laporan Kategori** - Implemented
   - File: `src/components/reports/CategoryReport.tsx`
   - File: `src/lib/data.ts` (getCategoryBreakdown, getCategoryMonthlyComparison)
   - File: `src/app/reports/page.tsx` (updated)
   - Features: Pie Chart, Top Categories, Breakdown Table, Monthly Comparison

6. ✅ **Export & Import Data** - Implemented
   - File: `src/lib/export.ts` (CSV export, backup utilities)
   - File: `src/lib/import.ts` (CSV parsing and validation)
   - File: `src/components/import/ImportDialog.tsx` (Import UI with validation)
   - File: `src/components/export/ExportMenu.tsx` (Export menu with CSV and backup)
   - File: `src/lib/actions.ts` (importTransactions action)
   - File: `src/app/transactions/page.tsx` (integrated import/export)
   - Features: CSV Export, CSV Import, Full Backup (JSON), Import Template

7. ✅ **Multi-Wallet Management** - Implemented
   - File: `src/app/wallets/page.tsx` (halaman Dompet)
   - File: `src/app/settings/page.tsx` (Pengaturan user & akses wallet)
   - File: `src/app/invite/page.tsx` (terima undangan wallet)
   - File: `src/components/wallet/WalletSwitcher.tsx` (dropdown ganti wallet aktif)
   - File: `src/components/wallet/WalletTransferForm.tsx` (transfer antar wallet)
   - File: `src/components/settings/SettingsCreateUserForm.tsx` (Tambah User Baru, popup)
   - File: `src/components/settings/SettingsUserList.tsx` (daftar user aktif + wallet & role)
   - File: `src/components/settings/SettingsSetAdminAllButton.tsx` (Jadikan saya admin di semua wallet)
   - File: `src/components/settings/InviteAcceptClient.tsx` (terima invite)
   - File: `src/lib/data.ts` (getWallets filter user_id, getWalletSummaries, getActiveWallet, getWalletsWithRole, getActiveUsersWithWallets)
   - File: `src/lib/actions.ts` (setActiveWallet, transferBetweenWallets, createWalletAndStay, createUserByAdmin, createWalletInvite, acceptWalletInvite, setSelfAdminAllWallets)
   - File: `supabase/init.sql` (DDL awal satu file; migrations dihapus)
   - Features: Switch wallet, Overview semua wallet (tanpa duplikat), Transfer antar wallet, Tambah dompet; **Admin:** buat user (email+password, pilih wallet+role), daftar user aktif; **Invite** wallet by link; **Set self admin** di Pengaturan

8. ✅ **Filter Opsi Bulan** (pengayaan Filter Transaksi) - Implemented
   - File: `src/components/transactions/TransactionFilters.tsx` (input type="month", param month)
   - Filter transaksi bisa pilih bulan → auto set Dari/Sampai Tanggal

9. ✅ **Mobile App (PWA)** - Implemented
   - File: `public/manifest.json`, `public/sw.js`, `src/components/pwa/RegisterSW.tsx`, `src/app/layout.tsx`
   - Features: Install to home screen, offline support (repeat visit), PWA metadata

10. ✅ **Laporan Periode (MTD, YTD, YoY, TTM)** - Implemented
    - File: `src/app/reports/period/page.tsx` (halaman Laporan Periode)
    - File: `src/components/reports/PeriodTypeTabs.tsx` (tab MTD/YTD/YoY/TTM via Link)
    - File: `src/lib/data.ts` (getPeriodReport, getIncomeExpenseInRange)
    - Navbar: menu "Laporan Periode"; Reports page: link ke Laporan Periode
    - Features: MTD, YTD, YoY (dengan growth %), TTM (dengan chart 12 bulan); navigasi tab

11. ✅ **Ganti wallet tanpa clear cache** (UX) - Implemented
    - File: `src/lib/actions.ts` (setActiveWallet mengembalikan redirectTo, tidak redirect())
    - File: `src/components/wallet/WalletSwitcher.tsx` (panggil action lalu window.location.href = redirectTo)
    - Full page load setelah ganti wallet agar transaksi/laporan ikut wallet baru

12. ✅ **Tampilan iPad** - Implemented
    - File: `src/components/ConditionalLayout.tsx` (lg:ml-64, lg:p-8, pb-24)
    - File: `src/components/Navbar.tsx` (sidebar lg:flex, bottom nav lg:hidden; min-h nav)
    - File: `src/app/transactions/page.tsx`, `src/app/reports/page.tsx` (overflow-x-auto tabel)
    - File: `src/app/globals.css` (.pb-safe untuk safe-area-inset-bottom)
    - Features: Sidebar hanya ≥1024px; iPad portrait pakai bottom nav + full width; tabel scroll horizontal

### ⬜ **FITUR YANG BELUM DIIMPLEMENTASIKAN**

- Budget Management
- Recurring Transactions
- Notifikasi & Reminder
- Statistik Lanjutan
- Tag/Label Transaksi
- Foto & Attachment
- Goal/Target Keuangan
- Sharing & Kolaborasi
- Push notifications (PWA)
- Integrasi Bank
- Dashboard Widget Customization
