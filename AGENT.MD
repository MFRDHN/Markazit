# Markaz IT Madinah — Agent Guide

## Stack
- **Frontend:** `frontend/` — React + Vite, SPA, multi-bahasa (id/en/ar)
- **Backend:** `backend/` — Laravel 12 API, MySQL, file uploads via `s.php`
- **Auth:** Sanctum token-based (login → token → dashboard)
- **Deploy:** Zip FE (dist) + BE (full) → upload ke shared hosting

## Key Files

### Frontend
| File | Fungsi |
|------|--------|
| `src/services/api.js` | Axios instance (no default Content-Type) |
| `src/pages/public/Pendaftaran.jsx` | Form registrasi |
| `src/pages/dashboard/*.jsx` | Halaman dashboard (data, pembayaran) |
| `src/context/AuthContext.jsx` | Auth state (login/logout/token) |
| `src/i18n/locales/{id,en,ar}.json` | Terjemahan |

### Backend
| File | Fungsi |
|------|--------|
| `app/Http/Controllers/Api/ApplicantController.php` | Registrasi + update data |
| `app/Http/Controllers/Api/AuthController.php` | Login, me, logout |
| `app/Http/Controllers/Api/PaymentController.php` | Upload bukti + riwayat |
| `app/Models/Applicant.php` | Model applicant |
| `app/Models/Payment.php` | Model payment |
| `public/s.php` | Serve uploaded files (`?f=...`) |
| `routes/api.php` | Semua route |

### Database
| Tabel | Fungsi |
|-------|--------|
| `applicants` | Data pendaftar (user_id, nama, usia, dll, status) |
| `payments` | Riwayat bayar (applicant_id, jumlah, bukti, status) |
| `users` | Auth (email, password) |
| `personal_access_tokens` | Token Sanctum |

## Aturan
- **Jangan tambah dep baru tanpa alasan kuat** — prioritize stdlib / kode minimal.
- **Jangan buat interface/abstraction sebelum ada implementasi ke-2.**
- **File upload:** Laravel `$request->file()` → simpan ke `storage/app/public/`.
- **s.php path:** `s.php?f=filename.jpg` → ambil dari `storage/app/public/`.
- **Registrasi sukses → login otomatis → redirect `/dashboard`.**
- **Harga:** Rp 2.500.000 (daftar) + Rp 45.000.000 (sisa) = Rp 47.500.000 total.
  Bank BSI 7364 9901 83 a.n. PT MARKAZ IT INTERNATIONAL.
- **Format response:** `{"data": {...}}` — wrapper Laravel API resource.

## Endpoints — Auth

### Registrasi (otomatis buat akun + applicant)
```
POST /api/applicants
Body: multipart (nama, usia, no_hp, email, password, motivasi, dokumen*)
Response: { data: { applicant, token } }
→ FE simpan token, redirect ke /dashboard
```

### Login
```
POST /api/auth/login
Body: { email, password }
Response: { data: { user, token } }
```

### Profile
```
GET /api/auth/me
Header: Authorization: Bearer {token}
```

### Update data
```
PUT /api/applicants/{id}
Body: multipart (field yg diupdate)
```

### Payment
```
POST /api/payments
Body: multipart (applicant_id, jumlah, bukti)
Response: { data: payment }

GET /api/payments?applicant_id=X
Response: { data: [payment, ...] }
```

## Halaman Frontend

### Public
| Route | File | Fungsi |
|-------|------|--------|
| `/` | Home.jsx | Landing page |
| `/pendaftaran` | Pendaftaran.jsx | Form daftar |
| `/login` | Login.jsx | Login user |

### Dashboard (protected — redirect ke /login kalau ga punya token)
| Route | File | Fungsi |
|-------|------|--------|
| `/dashboard` | DashboardLayout.jsx | Layout sidebar + ringkasan |
| `/dashboard/data` | DataDiri.jsx | Lihat & edit data |
| `/dashboard/pembayaran` | Pembayaran.jsx | Upload bukti + riwayat |

## Deploy
```bash
# Backend
cd backend
composer install --no-dev --optimize-autoloader
zip -r backend.zip . -x ".env" -x "storage/app/public/*"
# Upload & extract di server, lalu:
# (buat database MySQL dulu: DB_DATABASE=markazit_madinah, DB_USERNAME=markazit_madinah, DB_PASSWORD=)
php artisan migrate
php artisan queue:table
php artisan migrate
php artisan storage:link
php artisan optimize:clear
chmod -R 775 storage bootstrap/cache

# Frontend
cd frontend
npm run build
zip -r frontend-dist.zip dist/
# Upload & extract ke domain root
```

## Perangkap Umum
1. **Lupa hapus Content-Type header** → Axios FormData break. Solusi: jangan set default Content-Type.
2. **.env kereplace** → selalu exclude dari zip.
3. **Cache SQLite error** → `CACHE_DRIVER=database` butuh tabel cache. Ganti ke `file` aja.
4. **File upload ilang** → jangan timpa `storage/app/public/` pas deploy.
5. **Token expired** → kalau 401, redirect ke /login.
6. **Registrasi tanpa password** → user harus isi password di form daftar.
