# Markaz IT Madinah — PRD

## 1. Ringkasan
Landing page + sistem pendaftaran program pendidikan Islam di Madinah.
Multi-bahasa (ID/EN/AR), SPA, dengan API backend untuk registrasi, dashboard user, & konten dinamis.

## 2. Target Pengguna
- Muslim Indonesia & Malaysia yang ingin belajar agama di Madinah
- Usia 17–35 tahun

## 3. Fitur Utama
| Fitur | Prioritas | Catatan |
|-------|-----------|---------|
| Landing page (program, biaya, galeri, blog, testimoni) | P0 | Konten statis via API |
| Pendaftaran online (form + upload dokumen) | P0 | Nama, usia, no HP, email, motivasi, KTP/KK/paspor/foto |
| Biaya pendaftaran Rp 2.500.000 | P0 | Dibayar saat/ setelah daftar |
| Total program Rp 47.500.000 | P0 | Termasuk 2,5juta yg sudah dibayar |
| Dashboard user | P0 | Lihat data, update, upload bukti bayar, riwayat pembayaran |
| Multi-bahasa (id/en/ar) | P0 | i18next |
| Admin panel (kelola pendaftar + verifikasi bayar) | P1 | Belum dibangun |

## 4. Arsitektur
```
Frontend (React + Vite) → API (Laravel 12) → SQLite
                          ↕
                     Storage (file upload)
```

## 5. Tech Stack
- **FE:** React 18, Vite, React Router, i18next, Axios, Tailwind
- **BE:** Laravel 12, PHP 8.2+, SQLite, Sanctum
- **Domain:** markaz-it.web.id (FE), api.markaz-it.web.id (API)
- **File serving:** `s.php` — serves uploads from `storage/app/public/`

## 6. API Endpoints (Public & Auth)

### Publik (no auth)
| Method | Path | Fungsi |
|--------|------|--------|
| GET | /api/programs | Daftar program |
| GET | /api/programs/{id} | Detail program |
| GET | /api/gallery | Galeri foto |
| GET | /api/blogs | Artikel blog |
| GET | /api/testimonials | Testimoni |
| POST | /api/applicants | Daftar (multipart form) |

### Auth (dashboard user)
| Method | Path | Fungsi |
|--------|------|--------|
| POST | /api/auth/login | Login (email + password) |
| GET | /api/auth/me | Profil user saat ini |
| GET | /api/applicants/{id} | Lihat data pendaftaran sendiri |
| PUT | /api/applicants/{id} | Update data pendaftaran |
| POST | /api/payments | Upload bukti bayar |
| GET | /api/payments | Riwayat pembayaran sendiri |

## 7. Alur Pendaftaran
1. User isi form (nama, usia, no hp, email, motivasi, dokumen)
2. Saat submit, system buat akun dengan password (generate + kirim ke email, atau user set password sendiri)
3. Redirect ke `/dashboard` — tampilkan data & instruksi bayar Rp 2.500.000
4. User upload bukti transfer Rp 2.500.000 di dashboard
5. Admin verifikasi — status pendaftar berubah
6. User bisa upload bukti bayar untuk sisa Rp 45.000.000 nanti

## 8. Model Data — Applicants (tambah kolom)

### applicants
| Kolom | Tipe | Catatan |
|-------|------|---------|
| id | integer | |
| user_id | integer | FK ke users |
| nama | string | |
| usia | integer | |
| no_hp | string | |
| email | string | |
| motivasi | text | |
| dokumen_ktp | string | path file |
| dokumen_kk | string | path file |
| dokumen_paspor | string | path file |
| foto | string | path file |
| status | enum | `registered`, `verified`, `active` |
| created_at | datetime | |
| updated_at | datetime | |

### payments (tabel baru)
| Kolom | Tipe | Catatan |
|-------|------|---------|
| id | integer | |
| applicant_id | integer | FK ke applicants |
| jumlah | integer | nominal yg dibayar |
| bukti | string | path file bukti transfer |
| status | enum | `pending`, `verified`, `rejected` |
| keterangan | text | catatan admin |
| created_at | datetime | |

## 9. Halaman Dashboard User
| Halaman | Fungsi |
|---------|--------|
| `/dashboard` | Ringkasan: data diri + status + total tagihan |
| `/dashboard/data` | Lihat & edit data pendaftaran |
| `/dashboard/pembayaran` | Upload bukti bayar + riwayat pembayaran |

## 10. Non-Goals (v1)
- Tidak ada payment gateway otomatis
- Tidak ada notifikasi email/WA otomatis
- Tidak ada fitur lupa password
