#!/bin/bash
set -e

# ============================================================
# Deploy script — run after extracting deploy_package.zip
# Usage: cd /var/www/markaz-it && bash deploy.sh
# ============================================================

cd "$(dirname "$0")"

echo ">>> Deploying Markaz IT..."

# 1. Backend setup
cd backend

# 2. Environment
if [ ! -f .env ]; then
    cp .env.example .env
    echo ">>> .env created from .env.example"
fi

# 3. Generate APP_KEY if missing
if ! grep -q "APP_KEY=base64" .env 2>/dev/null; then
    php artisan key:generate --force
    echo ">>> APP_KEY generated"
fi

# 4. Composer (production only)
export COMPOSER_ALLOW_SUPERUSER=1
composer install --no-dev --optimize-autoloader --no-interaction

# 5. Storage
php artisan storage:link --force

# 6. Migrate
php artisan migrate --force

# 7. Optimize
php artisan optimize

# 8. Permissions
chown -R www-data:www-data storage bootstrap/cache public 2>/dev/null || true
chmod -R 775 storage bootstrap/cache 2>/dev/null || true

echo ">>> =================================="
echo ">>> ✅ Deploy backend selesai!"
echo ">>> =================================="
echo ">>>"
echo ">>> Frontend build ada di: frontend/dist/"
echo ">>> Upload isinya ke server frontend (markaz-it.web.id)"
echo ">>>"
