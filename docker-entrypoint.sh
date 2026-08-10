#!/usr/bin/env bash
set -e

# Use Render/host provided PORT or default to 8000
PORT=${PORT:-8000}

# Replace placeholder in supervisord.conf if present
if grep -q "%(ENV_PORT)s" /etc/supervisor/conf.d/supervisord.conf 2>/dev/null; then
  sed -i "s/%(ENV_PORT)s/${PORT}/g" /etc/supervisor/conf.d/supervisord.conf
fi

# Ensure storage and cache directories are writable
chown -R www-data:www-data storage bootstrap/cache || true
chmod -R 775 storage bootstrap/cache || true

# Clear cached config (important when using Render env variables)
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan cache:clear


# Run database migrations (drop all tables first, recreate & seed)
# php artisan migrate:fresh --seed --force
php artisan migrate

# Start supervisor
exec "$@"
