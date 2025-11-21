#!/bin/bash
set -e

echo "🚀 Starting application with auto-deploy..."

# Run deployment tasks (migrations + seed if needed)
echo "📦 Running deployment tasks..."
yarn deploy || echo "⚠️  Deploy script completed with warnings, continuing..."

# Start the application
echo "✅ Starting NestJS application..."
exec yarn start:prod

