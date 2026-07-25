## Latest Summary — temporal anchor

### ✅ Bug Foto Admin: ROOT CAUSE DITEMUKAN & DIPERBAIKI

**Bug**: Admin dashboard menampilkan FOTO YANG SAMA untuk semua pendaftar, meskipun URL di DB berbeda.

**Root Cause #1 (Frontend — RACE CONDITION)**:
`useEffect` di `KelolaPendaftar.jsx` menggunakan closure variable untuk guard race condition:

```jsx
// BROKEN: selectedApplicat adalah closure variable, bukan current state
.then(r => { if (selectedApplicat?.id === id) { setFotoBlob(...) } })
```

Ketika response LAMBAT dari pendaftar SEBELUMNYA datang belakangan, guard selalu PASS karena membaca `selectedApplicat` dari closure LAMA (saat effect dibuat), bukan nilai STATE terbaru. Response pendaftar A bisa menimpa foto pendaftar B, C, D — foto yang PALAKHIR datang (paling lambat) yang menang.

**Root Cause #2 (Frontend — DocLink field detection RUSAK)**:
`DocLink` menentukan field dari path prefix. Path tersimpan adalah `applicants/dokumen_ktp/abc.jpg` — TIDAK dimulai dengan `dokumen_ktp`. Semua dokumen (KTP, KK, Paspor) resolve ke `'foto'`.

### 🔧 Perbaikan yang Diterapkan

| # | File | Perbaikan |
|---|------|-----------|
| 1 | `KelolaPendaftar.jsx` | Guard race condition diganti pakai `useRef` (`currentApplicantIdRef`) — ref selalu baca nilai TERKINI, bukan closure |
| 2 | `KelolaPendaftar.jsx` | `DocLink` now terima prop `field` eksplisit — `field="dokumen_ktp"` instead of broken `path?.startsWith(...)` |
| 3 | `KelolaPendaftar.jsx` | Blob URL memory leak diperbaiki — `setFotoBlob(prev => { ... URL.revokeObjectURL(prev); ... })` revoke old URL |
| 4 | `ApplicantController.php` | `response()->file($path)` → `Storage::disk('public')->response($relativePath)` + Logging debug |
| 5 | `PaymentController.php` | `response()->file($path)` → `Storage::disk('public')->response()` untuk konsistensi |

### Sebelumnya

- **no_hp unique collision fixed**
- **Token collision admin/user fixed**
- **Blank page admin (ReferenceError) fixed**
- **Sidebar username not updating fixed**
- **no_hp placeholder showing fixed**
- **Logout confirmation added**

---

### 🐳 Round 2: Infrastructure + CI/CD + Over-Engineering + Tests

#### ✅ 1. Docker Compose
- `docker-compose.yml` — 4 services:
  - `app`: PHP 8.2 FPM + Nginx (supervisord) — serves Laravel
  - `mysql`: MySQL 8.0 with healthcheck
  - `node`: Node 20 — Vite dev server at `:5173`
- `docker/php/Dockerfile` — multi-stage, auto-runs storage:link + migrate + optimize on start
- `docker/nginx/default.conf` — root `/app/backend/public`, storage `/storage/` alias
- `docker/php/entrypoint.sh` — waits for MySQL, runs artisan commands, starts supervisord
- `.dockerignore` — excludes vendor, node_modules, .env, etc.

#### ✅ 2. GitHub Actions CI/CD (`.github/workflows/deploy.yml`)
- `backend-check`: PHP 8.2 lint + composer validate + install
- `frontend-check`: Node 20 install + build
- `deploy` (main only): builds frontend + composer install --no-dev → rsync to server → migrate

#### ✅ 3. Animation Bloat Removed
- Deleted: `FadeContent.jsx`, `Keyboard3D.jsx`, `ShinyText.jsx`, `Magnet.jsx` (unused)
- Removed deps: `@react-three/drei`, `@react-three/fiber`, `three`, `react-hook-form`, `zod`, `@hookform/resolvers`
- Updated `vite.config.js`: removed `three` chunk

#### ✅ 4. Unit Test (Laravel Feature Test)
- `ApplicantFotoTest.php` — 3 tests:
  - `test_each_applicant_gets_unique_foto_path_on_upload` — upload 2 different fotos → paths unique + files on disk
  - `test_admin_viewFile_returns_correct_foto_for_each_applicant` — admin hits `/file/foto` for each → content berbeda
  - `test_admin_list_returns_unique_foto_paths` — admin list API returns 2 unique paths
- Added `ApplicantFactory.php`
- Added `HasFactory` trait to `Applicant` model
- Enabled SQLite in-memory in `phpunit.xml`
