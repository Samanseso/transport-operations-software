#!/usr/bin/env bash
# exit on error
set -o errexit

echo "--- Installing PHP Dependencies ---"
composer install --no-dev --optimize-autoloader

echo "--- Installing Node Dependencies ---"
npm ci || npm install

echo "--- Building Production Frontend Assets ---"
npm run build

echo "--- Caching Laravel Configurations ---"
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "--- Running Database Migrations ---"
php artisan migrate --force

echo "--- Render Build Complete! ---"
