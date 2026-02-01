# Checklist Upload ke Server

## Jangan upload (rahasia / di-generate)

- **`.env.local`** — berisi `SUPABASE_SERVICE_ROLE_KEY` dan key lain. **Jangan** ikut di-upload. Set variabel env di server (Vercel, Railway, atau panel hosting).
- **`node_modules/`** — sudah di-ignore; di server jalankan `npm install`.
- **`.next/`** — build cache; di server jalankan `npm run build`.
- **`.DS_Store`**, **`*.pem`** — sudah di-ignore.

## Yang aman di-upload (source code)

- `src/` — semua kode aplikasi
- `public/` — manifest.json, sw.js
- `supabase/` — init.sql, README.md
- `package.json`, `package-lock.json`
- `next.config.mjs`, `tailwind.config.ts`, `tsconfig.json`, `postcss.config.mjs`
- `components.json`, `.eslintrc.json`
- `README.md`, `REKOMENDASI_FITUR.md`

## Variabel env yang harus diset di server

Set di panel hosting (Vercel / Railway / dll.):

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...   (hanya untuk fitur admin buat user)
```

## Jika pakai Git

- `git status` — pastikan `.env.local` tidak muncul (sudah di .gitignore).
- `git add .` lalu `git push` — file yang di-ignore tidak ikut ter-push.

## Setelah file sampai di server

1. `npm install`
2. Set env vars (lihat di atas)
3. `npm run build`
4. `npm start` (atau gunakan perintah yang disediakan hosting)
