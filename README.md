# Markaz IT Madinah

> Landing page + sistem pendaftaran program pendidikan Islam di Madinah. Multi-bahasa (ID/EN/AR), SPA, dengan API backend untuk registrasi, dashboard user, & konten dinamis.

**Domain:** [markaz-it.web.id](https://markaz-it.web.id) (FE) · [api.markaz-it.web.id](https://api.markaz-it.web.id) (API)

---

## Tech Stack

| Layer | Teknologi |
|-------|-----------|
| **Frontend** | React 19, Vite 8, React Router 6, Tailwind 3, Framer Motion, i18next |
| **Backend** | Laravel 12, PHP 8.2+, Sanctum (auth), MySQL (MariaDB) |
| **Storage** | File system via `s.php` (`storage/app/public/`) |
| **Domain** | `markaz-it.web.id` (frontend) · `api.markaz-it.web.id` (backend) |

---

## Arsitektur

```
Frontend (SPA)
  ↓ Axios (JSON/multipart)
Backend API (Laravel)
  ↓
MySQL ←→ Storage (file upload)
```

- **SPA + API terpisah** — frontend di domain sendiri, backend di subdomain `api.*`.
- **No SSR** — Fully client-side rendering.
- **File serving** — via `public/s.php?f=path` (bypasses Laravel untuk performa).

---

## Database Schema

### Entity Relationship

```
users (1) ──< personal_access_tokens
                │
applicants (1) ──< payments (N)
     │
     └── dokumen_ktp, dokumen_kk, dokumen_paspor, foto (file paths)

programs       (standalone — CRUD)
galleries      (standalone — CRUD)
testimonials   (standalone — CRUD)
blogs          (standalone — CRUD)
```

### Tables

#### `applicants`
| Column | Type | Constraints |
|--------|------|-------------|
| id | bigIncrements | PK |
| nama | string(255) | required |
| usia | integer | unsigned |
| no_hp | string(20) | **unique**, indexed |
| email | string(255) | **unique**, indexed |
| dokumen_ktp | string(nullable) | file path |
| dokumen_kk | string(nullable) | file path |
| dokumen_paspor | string(nullable) | file path |
| foto | string(nullable) | file path |
| motivasi | text(nullable) | |
| status | enum | `pending`, `review`, `diterima`, `ditolak` — indexed |
| payment_allowed_at | timestamp(nullable) | indexed |
| created_at | timestamp | indexed |
| updated_at | timestamp | |

#### `payments`
| Column | Type | Constraints |
|--------|------|-------------|
| id | bigIncrements | PK |
| applicant_id | bigInteger | FK → applicants.id **cascade** |
| jumlah | decimal(12,2) | |
| norek_pengirim | string(50,null) | |
| bank_pengirim | string(100,null) | |
| status | enum | `pending`, `verified`, `rejected` — indexed |
| bukti | string(nullable) | file path (bukti transfer) |
| timestamps | | |

#### `users` (admin only)
| Column | Type | Constraints |
|--------|------|-------------|
| id | bigIncrements | PK |
| name | string(255) | |
| email | string(255) | unique |
| password | string(255) | bcrypt |
| timestamps | | |

#### Other tables
`programs`, `galleries`, `testimonials`, `blogs` — standalone CRUD dengan `timestamps()`.

---

## Models & Relations

```
Applicant
  ├── hasMany(Payment)
  └── $fillable: nama, usia, no_hp, email, ..., status, payment_allowed_at

Payment
  └── belongsTo(Applicant)
  └── $fillable: applicant_id, jumlah, norek_pengirim, bank_pengirim, status, bukti

Program, Gallery, Testimonial, Blog — no relations, standalone
```

**Key casts:**
- `Applicant.usia` → `integer`
- `Applicant.payment_allowed_at` → `datetime`
- `Payment.jumlah` → `decimal:2`

---

## API Endpoints

### Public (no auth)

| Method | Path | Rate Limit | Deskripsi |
|--------|------|------------|-----------|
| GET | `/api/programs` | 60/min | Daftar program |
| GET | `/api/programs/{program}` | 60/min | Detail program |
| GET | `/api/gallery` | 60/min | Galeri foto |
| GET | `/api/gallery/categories` | 60/min | Kategori galeri |
| GET | `/api/testimonials` | 60/min | Testimoni |
| GET | `/api/blogs` | 60/min | Artikel blog |
| GET | `/api/blogs/categories` | 60/min | Kategori blog |
| GET | `/api/blogs/{blog:id}` | 60/min | Detail artikel |
| **POST** | `/api/applicants` | **5/min** | Daftar (multipart) |
| **POST** | `/api/payments` | **5/min** | Upload bukti bayar (multipart) |
| **POST** | `/api/applicants/check-payment` | **5/min** | Cek status pembayaran |
| **POST** | `/api/admin/login` | **5/min** | Login admin |

### Protected (auth:sanctum)

| Method | Path | Deskripsi |
|--------|------|-----------|
| POST | `/api/admin/logout` | Logout |
| GET | `/api/admin/me` | Profil admin |
| GET | `/api/admin/dashboard` | Statistik dashboard |
| GET | `/api/applicants` | Daftar pendaftar |
| GET | `/api/applicants/{applicant}` | Detail pendaftar |
| PUT | `/api/applicants/{applicant}/status` | Update status |
| PUT | `/api/applicants/{applicant}/allow-payment` | Izinkan bayar |
| DELETE | `/api/applicants/{applicant}` | Hapus pendaftar |
| POST/PUT/DELETE | `/api/programs/*` | CRUD program |
| POST/PUT/DELETE | `/api/gallery/*` | CRUD galeri |
| POST/PUT/DELETE | `/api/testimonials/*` | CRUD testimoni |
| POST/PUT/DELETE | `/api/blogs/*` | CRUD blog |
| GET | `/api/payments` | Daftar pembayaran |
| PUT | `/api/payments/{payment}/status` | Verifikasi bayar |

---

## Frontend Structure

```
src/
├── App.jsx                  # Routes + lazy loading + Suspense
├── main.jsx                 # Entry point
├── components/
│   ├── common/              # Shared (Navbar, Footer, LoadingScreen, dll)
│   ├── admin/               # Admin layout
│   └── sections/            # Homepage sections (Hero, Program, Cost, dll)
├── pages/
│   ├── public/              # Home, Pendaftaran, Galeri, Blog, dll
│   └── admin/               # Dashboard, KelolaPendaftar, dll
├── services/
│   └── api.js               # Axios instance (timeout: 15s, auto Bearer token)
├── i18n/
│   ├── index.js             # i18next config
│   └── locales/             # id.json, en.json, ar.json
├── store/
│   └── index.js             # Zustand store
└── index.css                # Tailwind imports
```

**Lazy loading:** Semua halaman di `App.jsx` pake `React.lazy()` + `<Suspense>`. 
Bundle terpisah per halaman + vendor chunk.

---

## Biaya & Pembayaran

| Item | Jumlah |
|------|--------|
| Biaya Pendaftaran | Rp 2.500.000 |
| **Total Program** | **Rp 47.500.000** |
| Sisa (setelah daftar) | Rp 45.000.000 |

**Bank:** BSI 7364 9901 83 a.n. PT MARKAZ IT INTERNATIONAL

---

## Deployment

### Backend
```bash
cd backend
composer install --no-dev --optimize-autoloader
zip -r backend.zip . -x ".env" -x "storage/app/public/*" -x ".git/*"

# Di server:
unzip -o backend.zip

# Setup database MySQL (buat database dulu lewat phpMyAdmin/cPanel)
# DB_DATABASE=markazit_madinah, DB_USERNAME=markazit_madinah, DB_PASSWORD=

php artisan migrate        # jalankan migrasi (termasuk index baru)
php artisan storage:link
php artisan queue:table    # tabel untuk queue
php artisan migrate        # migrasi queue
php artisan optimize:clear
chmod -R 775 storage bootstrap/cache
```

### Frontend
```bash
cd frontend
npm run build
zip -r frontend-dist.zip dist/

# Di server:
unzip -o frontend-dist.zip -d /path/to/domains/markaz-it.web.id/public_html
```

### ⚠️ Penting
- **Jangan timpa `.env`** — exclude dari zip.
- **Jangan timpa `storage/app/public/`** — file upload akan ilang.
- **Hapus `public/hot`** di server — file marker Vite dev mode.
- **Jalankan migrasi** setelah deploy untuk menambah index.

---

## Keamanan

- ✅ **Throttle** — login, register, payment: 5x/menit per IP
- ✅ **Token expiry** — Sanctum token expired 24 jam
- ✅ **SQL injection** — Semua pake Eloquent (no raw queries)
- ✅ **Path traversal** — `s.php` pake `realpath()` + `str_starts_with()`
- ✅ **CORS** — Whitelist origin, preflight cached 24 jam
- ✅ **Security headers** — HSTS, X-Frame-Options, X-Content-Type-Options
- ✅ **DB transaction** — Semua write operation pake transaction
- ✅ **Unique constraint** — Email & no_hp unique (cegah duplikat)

---

## Best Practices yang Diterapkan

### Backend
- **Repository-less** — Eloquent langsung di controller (YAGNI — no need for repository pattern until 2nd data source)
- **Single responsibility** — Controller per resource
- **DB transactions** — Semua write operation wrap `DB::transaction()`
- **Eager loading** — `with('payments')` untuk n-query prevention
- **Pagination** — Semua list endpoint pake `paginate()`
- **Rate limiting** — Form endpoints dibatasi 5 request/menit
- **Optimized query** — Dashboard pake 1 query instead of 5

### Frontend
- **Lazy loading** — Code splitting per halaman
- **Vendor chunking** — React, i18n, animation, three.js dipisah
- **Minimal deps** — Satu animation library (framer-motion), gsap dicabut
- **Loading state** — `Suspense` fallback untuk tiap route
- **API timeout** — 15 detik, ga ngehang selamanya
- **Error handling** — 401 interceptor → redirect ke login

---

## Perangkap Umum

1. **FormData + Content-Type** — Jangan set default `Content-Type` di Axios. Biarin Axios set `multipart/form-data` otomatis pas pake FormData.
2. **Cache error SQLite** — `CACHE_DRIVER=database` butuh migrasi tabel cache. Ganti ke `file` aja.
3. **File upload ilang** — Jangan timpa `storage/app/public/` pas re-deploy.
4. **public/hot** — Hapus dari server production (file marker Vite dev).
5. **.env ketimpa** — Selalu exclude dari zip.

---

## Development

```bash
# Backend
cd backend
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve

# Frontend
cd frontend
npm install
cp .env.example .env
npm run dev
```

---

## Lisensi

© 2026 PT MARKAZ IT INTERNATIONAL. All rights reserved.
