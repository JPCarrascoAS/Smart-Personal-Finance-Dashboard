#!/bin/sh
set -e

echo "Waiting for database to be ready..."
until nc -z db 5432 2>/dev/null; do
  sleep 1
done
echo "Database is ready!"

echo "Pushing database schema..."
npx prisma db push

echo "Seeding database..."
npx prisma db seed || echo "Seed skipped (may already be applied)"

echo "Starting Next.js development server..."
exec npm run dev
