<?php

namespace Database\Seeders;

use App\Models\Blog;
use App\Models\Gallery;
use App\Models\Program;
use App\Models\Testimonial;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ==========================================
        // Admin User
        // ==========================================
        User::firstOrCreate(
            ['email' => 'fajri@gmail.com'],
            [
                'name' => 'Admin Markaz IT',
                'password' => Hash::make('password123'),
            ],
        );

        // ==========================================
        // Programs
        // ==========================================
        $programs = [
            [
                'nama' => 'Dars Masyaikh',
                'deskripsi' => 'Program kajian intensif langsung bersama para masyaikh (ulama) di Masjid Nabawi dan masjid-masjid sekitar Madinah. Pelajari ilmu syar\'i dari sumber terpercaya dengan metode tradisional yang telah teruji.',
                'icon' => 'book-open',
                'urutan' => 1,
            ],
            [
                'nama' => 'Halaqah Quran',
                'deskripsi' => 'Program tahfidz dan tahsin Al-Quran dengan metode talaqqi bersama muhafizh berpengalaman. Target hafalan minimal 5 juz per tahun dengan sanad yang bersambung.',
                'icon' => 'quran',
                'urutan' => 2,
            ],
            [
                'nama' => 'Coding & IoT',
                'deskripsi' => 'Program teknologi informasi meliputi web development, mobile app, IoT (Internet of Things), dan artificial intelligence. Belajar coding sambil mendalami ilmu agama di kota Nabi ﷺ.',
                'icon' => 'code',
                'urutan' => 3,
            ],
            [
                'nama' => 'Bimbingan Beasiswa',
                'deskripsi' => 'Pendampingan lengkap untuk mendaftar beasiswa di Universitas Islam Madinah dan universitas lainnya di Arab Saudi. Termasuk persiapan bahasa Arab, berkas, dan wawancara.',
                'icon' => 'graduation-cap',
                'urutan' => 4,
            ],
        ];

        foreach ($programs as $program) {
            Program::firstOrCreate(['nama' => $program['nama']], $program);
        }

        // ==========================================
        // Testimonials
        // ==========================================
        $testimonials = [
            [
                'nama' => 'Ahmad Fauzi',
                'asal' => 'Jakarta, Indonesia',
                'isi' => 'Alhamdulillah, program di Markaz IT sangat luar biasa. Saya bisa belajar ilmu agama langsung di Masjid Nabawi sekaligus mengembangkan skill programming. Sekarang saya sudah diterima di Universitas Islam Madinah.',
                'rating' => 5,
            ],
            [
                'nama' => 'Muhammad Rizki',
                'asal' => 'Bandung, Indonesia',
                'isi' => 'Lingkungan belajar yang sangat kondusif. Para ustadz dan mentor sangat sabar membimbing. Fasilitas asrama juga nyaman. Pengalaman terbaik dalam hidup saya.',
                'rating' => 5,
            ],
            [
                'nama' => 'Abdullah Rahman',
                'asal' => 'Surabaya, Indonesia',
                'isi' => 'Program Halaqah Quran-nya amazing! Dalam setahun saya berhasil menghafal 8 juz dengan tajwid yang benar. Metode talaqqi langsung dengan muhafizh sangat efektif.',
                'rating' => 5,
            ],
            [
                'nama' => 'Irfan Hakim',
                'asal' => 'Medan, Indonesia',
                'isi' => 'Saya datang tanpa bisa bahasa Arab sama sekali. Setelah 6 bulan di program Markaz IT, sekarang saya sudah bisa berkomunikasi dan memahami pelajaran dalam bahasa Arab.',
                'rating' => 4,
            ],
        ];

        foreach ($testimonials as $testimonial) {
            Testimonial::firstOrCreate(['nama' => $testimonial['nama'], 'isi' => $testimonial['isi']], $testimonial);
        }

        // ==========================================
        // Galleries
        // ==========================================
        $galleries = [
            ['judul' => 'Masjid Nabawi', 'foto' => '', 'kategori' => 'Masjid', 'deskripsi' => 'Pemandangan indah Masjid Nabawi dari area utama'],
            ['judul' => 'Kegiatan Halaqah', 'foto' => '', 'kategori' => 'Kegiatan', 'deskripsi' => 'Suasana halaqah tahfidz quran bersama muhafizh'],
            ['judul' => 'Kelas Coding', 'foto' => '', 'kategori' => 'Kegiatan', 'deskripsi' => 'Santri belajar programming di lab komputer'],
            ['judul' => 'Asrama Santri', 'foto' => '', 'kategori' => 'Fasilitas', 'deskripsi' => 'Fasilitas asrama yang nyaman dan bersih'],
            ['judul' => 'Wisuda Alumni', 'foto' => '', 'kategori' => 'Acara', 'deskripsi' => 'Momen kelulusan alumni Markaz IT'],
            ['judul' => 'Umrah Bersama', 'foto' => '', 'kategori' => 'Kegiatan', 'deskripsi' => 'Kegiatan umrah bulanan bersama seluruh santri'],
        ];

        foreach ($galleries as $gallery) {
            Gallery::firstOrCreate(['judul' => $gallery['judul']], $gallery);
        }

        // ==========================================
        // Blog Posts
        // ==========================================
        $blogs = [
            [
                'judul' => 'Panduan Lengkap Beasiswa Universitas Islam Madinah 2026',
                'slug' => 'panduan-beasiswa-universitas-islam-madinah-2026',
                'konten' => '<h2>Apa itu Beasiswa Universitas Islam Madinah?</h2><p>Universitas Islam Madinah (UIM) adalah salah satu universitas Islam paling prestisius di dunia, berlokasi di kota suci Madinah Al-Munawwarah, Arab Saudi. Setiap tahun, UIM membuka kesempatan beasiswa penuh bagi mahasiswa internasional dari seluruh dunia.</p><h2>Persyaratan Umum</h2><ul><li>Muslim, laki-laki</li><li>Usia maksimal 25 tahun</li><li>Ijazah SMA/sederajat</li><li>Sehat jasmani dan rohani</li><li>Mendapat rekomendasi dari lembaga Islam</li></ul><h2>Fasilitas Beasiswa</h2><p>Beasiswa UIM mencakup: biaya kuliah penuh, asrama gratis, tunjangan bulanan, tiket pesawat PP tahunan, dan asuransi kesehatan.</p>',
                'kategori' => 'Beasiswa',
                'meta_desc' => 'Panduan lengkap cara mendaftar beasiswa Universitas Islam Madinah 2026. Persyaratan, prosedur, dan tips diterima.',
            ],
            [
                'judul' => 'Kehidupan Sehari-hari di Madinah Al-Munawwarah',
                'slug' => 'kehidupan-sehari-hari-di-madinah',
                'konten' => '<h2>Sehari di Kota Nabi ﷺ</h2><p>Tinggal di Madinah adalah impian setiap Muslim. Kota yang penuh berkah ini menawarkan pengalaman spiritual yang tak tertandingi. Setiap hari dimulai dengan shalat Subuh di Masjid Nabawi, dilanjutkan dengan halaqah tahfidz ilmu.</p><h2>Cuaca dan Iklim</h2><p>Madinah memiliki iklim gurun dengan musim panas yang cukup terik (40-45°C) dan musim dingin yang sejuk (10-20°C). Musim terbaik untuk berkunjung adalah Oktober hingga Maret.</p>',
                'kategori' => 'Kehidupan',
                'meta_desc' => 'Seperti apa kehidupan sehari-hari di Madinah? Simak pengalaman tinggal dan belajar di kota Nabi Muhammad ﷺ.',
            ],
            [
                'judul' => 'Cerita Alumni: Dari Markaz IT ke Google',
                'slug' => 'cerita-alumni-dari-markaz-it-ke-google',
                'konten' => '<h2>Perjalanan Inspiratif</h2><p>Ahmad, alumni angkatan pertama Markaz IT Madinah, kini berkarir sebagai Software Engineer di Google. Ia memulai perjalanannya dari nol, belajar coding di sela-sela menghafal Al-Quran di Madinah.</p><p>"Markaz IT mengajarkan saya bahwa ilmu dunia dan akhirat bisa berjalan beriringan. Saya belajar coding setelah Dzuhur dan menghafal Quran setelah Subuh," ungkap Ahmad.</p>',
                'kategori' => 'Alumni',
                'meta_desc' => 'Kisah inspiratif alumni Markaz IT Madinah yang berhasil berkarir di perusahaan teknologi dunia.',
            ],
        ];

        foreach ($blogs as $blog) {
            Blog::firstOrCreate(['slug' => $blog['slug']], $blog);
        }
        // ==========================================
        // Applicants
        // ==========================================
        $applicants = [
            [
                'nama' => 'Budi Santoso',
                'usia' => 20,
                'no_hp' => '081234567890',
                'email' => 'budi@example.com',
                'motivasi' => 'Ingin belajar ilmu agama dan IT secara mendalam.',
                'status' => 'pending',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama' => 'Siti Aminah',
                'usia' => 19,
                'no_hp' => '089876543210',
                'email' => 'siti@example.com',
                'motivasi' => 'Ingin menghafal Al-Quran dan belajar coding.',
                'status' => 'review',
                'created_at' => now()->subDays(2),
                'updated_at' => now()->subDays(2),
            ],
            [
                'nama' => 'Ahmad Yusuf',
                'usia' => 22,
                'no_hp' => '081122334455',
                'email' => 'ahmad@example.com',
                'motivasi' => 'Mempersiapkan beasiswa ke Madinah dan belajar web development.',
                'status' => 'diterima',
                'created_at' => now()->subDays(5),
                'updated_at' => now()->subDays(4),
            ],
        ];

        foreach ($applicants as $applicant) {
            \App\Models\Applicant::firstOrCreate(['email' => $applicant['email']], $applicant);
        }
    }
}
