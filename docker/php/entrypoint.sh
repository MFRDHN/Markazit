#!/bin/sh
set -e

cd /app/backend

# Wait for MySQL
echo "Waiting for MySQL..."
until php artisan db:show --quiet 2>/dev/null; do sleep 1; done

# Laravel setup
php artisan storage:link --force 2>/dev/null || true
php artisan migrate --force
php artisan optimize

cd /

# Start supervisord (nginx + php-fpm)
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
