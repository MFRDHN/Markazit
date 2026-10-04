<?php
/**
 * Serve PUBLIC uploads only (gallery/blogs/testimonials).
 * ponytail: plain PHP because shared hosting has no storage symlink;
 * sensitive dirs (applicants/, payments/) live on the private disk and
 * are served exclusively through authenticated API routes.
 */
$allowedPrefixes = ['gallery/', 'blogs/', 'testimonials/'];

$path = ltrim($_GET['f'] ?? '', '/');

$allowed = false;
foreach ($allowedPrefixes as $prefix) {
    if (str_starts_with($path, $prefix)) {
        $allowed = true;
        break;
    }
}

$base = __DIR__ . '/../storage/app/public/';
$real = realpath($base . $path);

if (!$allowed || !$real || !str_starts_with($real, realpath($base))) {
    http_response_code(404);
    exit;
}

if (!is_file($real)) {
    http_response_code(404);
    exit;
}

$mime = mime_content_type($real) ?: 'application/octet-stream';
header('Content-Type: ' . $mime);
header('Content-Length: ' . filesize($real));
header('Cache-Control: public, max-age=31536000, immutable');
readfile($real);
