#!/bin/bash
set -e

echo "🚀 Starting deployment process..."

# Run migrations
echo "📦 Running database migrations..."
yarn prisma migrate deploy

# Seed database (only if needed - safe to run multiple times due to upsert)
echo "🌱 Seeding database..."
yarn prisma:seed || echo "⚠️  Seeding failed or already completed, continuing..."

# Start the application
echo "✅ Starting application..."
exec yarn start:prod

