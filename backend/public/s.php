<?php
/**
 * Serve files from storage/app/public/.
 */
$path = $_GET['f'] ?? '';
$path = ltrim($path, '/');

$base = __DIR__ . '/../storage/app/public/';
$real = realpath($base . $path);

if (!$real || !str_starts_with($real, realpath($base))) {
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