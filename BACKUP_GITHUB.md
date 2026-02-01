# Backup ke GitHub

Commit sudah dibuat. Langkah selanjutnya:

## 1. Buat repository baru di GitHub

1. Buka https://github.com/new
2. **Repository name:** misalnya `kasbidang` atau `kastrack`
3. **Visibility:** Private atau Public (sesuai kebutuhan)
4. **Jangan** centang "Add a README" / "Initialize with .gitignore" (repo kosong saja)
5. Klik **Create repository**

## 2. Tambah remote dan push

Di terminal, dari folder project:

```bash
# Ganti YOUR_USERNAME dan YOUR_REPO dengan username GitHub dan nama repo Anda
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# Push ke GitHub
git push -u origin main
```

Contoh jika username `hakiem17` dan repo `kasbidang`:

```bash
git remote add origin https://github.com/hakiem17/kasbidang.git
git push -u origin main
```

Jika pakai SSH:

```bash
git remote add origin git@github.com:YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

## 3. Selesai

Setelah push, kode ada di GitHub. Untuk backup berikutnya:

```bash
git add .
git commit -m "Pesan commit"
git push
```

**Catatan:** File `.env.local` tidak ikut di-push (sudah di .gitignore). Rahasia tetap hanya di komputer Anda.
