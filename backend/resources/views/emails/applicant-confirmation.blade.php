<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Konfirmasi Pendaftaran</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, sans-serif; background: #f4f7fa; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #1a5632, #2d8a4e); padding: 30px; text-align: center; color: #fff; }
        .header h1 { margin: 0; font-size: 24px; }
        .header p { margin: 5px 0 0; opacity: 0.9; font-size: 14px; }
        .content { padding: 30px; }
        .content h2 { color: #1a5632; margin-top: 0; }
        .info-box { background: #f0faf4; border-left: 4px solid #2d8a4e; padding: 15px; border-radius: 0 8px 8px 0; margin: 20px 0; }
        .info-box p { margin: 5px 0; color: #333; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #888; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>مركز تقنية المعلومات</h1>
            <p>Markaz IT Madinah Study Center</p>
        </div>
        <div class="content">
            <h2>Assalamu'alaikum {{ $applicant->nama }},</h2>
            <p>Terima kasih telah mendaftar di <strong>Markaz IT Madinah Study Center</strong>. Pendaftaran Anda telah kami terima dan sedang dalam proses peninjauan.</p>

            <div class="info-box">
                <p><strong>Nama:</strong> {{ $applicant->nama }}</p>
                <p><strong>Email:</strong> {{ $applicant->email }}</p>
                <p><strong>No. HP:</strong> {{ $applicant->no_hp }}</p>
                <p><strong>Status:</strong> {{ ucfirst($applicant->status) }}</p>
            </div>

            <p>Langkah selanjutnya:</p>
            <ol style="margin: 15px 0; padding-left: 20px; color: #333; line-height: 1.8;">
                <li><strong>Hubungi admin</strong> via WhatsApp di <a href="https://wa.me/62817786805" style="color: #2d8a4e;">+62 817-7868-05</a> untuk konfirmasi pendaftaran Anda.</li>
                <li>Admin akan memverifikasi data dan dokumen Anda.</li>
                <li>Setelah disetujui, Anda dapat melanjutkan pembayaran DP di: <a href="{{ config('app.url') }}/lanjutkan-pembayaran" style="color: #2d8a4e;">{{ config('app.url') }}/lanjutkan-pembayaran</a></li>
            </ol>
            <p>Jazakallahu khairan atas kepercayaan Anda.</p>

            <p style="margin-top: 30px;">Wassalamu'alaikum,<br><strong>Tim Markaz IT Madinah</strong></p>
        </div>
        <div class="footer">
            <p>&copy; {{ date('Y') }} Markaz IT Madinah Study Center. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
