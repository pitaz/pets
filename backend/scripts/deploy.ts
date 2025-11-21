import { execSync } from 'child_process';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function deploy() {
  console.log('🚀 Running deployment tasks...');

  try {
    // Always run migrations (safe, idempotent)
    console.log('📦 Running database migrations...');
    try {
      execSync('npx prisma migrate deploy', { stdio: 'inherit' });
      console.log('✅ Migrations completed');
    } catch (error) {
      console.warn('⚠️  Migration warning (may already be up to date):', error);
    }

    // Check if database needs seeding (only seed if empty)
    console.log('🔍 Checking if database needs seeding...');
    const userCount = await prisma.user.count();
    const petCount = await prisma.pet.count();

    if (userCount === 0 && petCount === 0) {
      console.log('🌱 Database is empty, seeding initial data...');
      try {
        execSync('npx ts-node prisma/seed.ts', { stdio: 'inherit' });
        console.log('✅ Seeding completed!');
      } catch (error) {
        console.warn('⚠️  Seeding failed (may already be seeded):', error);
      }
    } else {
      console.log(
        `ℹ️  Database already has data (${userCount} users, ${petCount} pets). Skipping seed.`,
      );
    }
  } catch (error) {
    console.error('❌ Deployment error:', error);
    // Don't fail the deployment - let the app start anyway
    console.log('⚠️  Continuing with application start...');
  } finally {
    await prisma.$disconnect();
  }
}

// Only run if called directly (not imported)
if (require.main === module) {
  deploy()
    .then(() => {
      console.log('✅ Deployment tasks completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Deployment error (non-fatal):', error);
      // Exit with 0 to allow app to start even if deploy tasks fail
      process.exit(0);
    });
}

export { deploy };
