import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@legalpets.com' },
    update: {},
    create: {
      email: 'admin@legalpets.com',
      passwordHash: adminPassword,
      name: 'Admin User',
      role: 'ADMIN',
    },
  });

  console.log('✅ Created admin user:', admin.email);

  // Create sample tags
  const tags = await Promise.all([
    prisma.tag.upsert({
      where: { name: 'Dog' },
      update: {},
      create: { name: 'Dog', slug: 'dog' },
    }),
    prisma.tag.upsert({
      where: { name: 'Cat' },
      update: {},
      create: { name: 'Cat', slug: 'cat' },
    }),
    prisma.tag.upsert({
      where: { name: 'Bird' },
      update: {},
      create: { name: 'Bird', slug: 'bird' },
    }),
    prisma.tag.upsert({
      where: { name: 'Reptile' },
      update: {},
      create: { name: 'Reptile', slug: 'reptile' },
    }),
  ]);

  console.log('✅ Created tags:', tags.map((t) => t.name).join(', '));

  // Create sample pet
  const samplePet = await prisma.pet.upsert({
    where: { slug: 'siberian-husky' },
    update: {},
    create: {
      slug: 'siberian-husky',
      commonName: 'Siberian Husky',
      scientificName: 'Canis lupus familiaris',
      shortIntro:
        'The Siberian Husky is a medium-sized working sled dog breed known for its endurance and friendly temperament.',
      background:
        'The Siberian Husky originated in Northeast Asia where they were bred by the Chukchi people of Siberia. They were used as sled dogs and companions, capable of traveling long distances in harsh conditions.',
      history:
        'Siberian Huskies were brought to Alaska in 1908 for sled-dog racing. They gained fame during the 1925 serum run to Nome, where teams of sled dogs delivered diphtheria antitoxin across Alaska.',
      diet:
        'Siberian Huskies require a high-quality diet rich in protein. They typically need 2-3 cups of dry dog food per day, divided into two meals. Active dogs may require more calories.',
      ownershipGuide:
        'Siberian Huskies are energetic and require daily exercise. They need a secure yard as they are known escape artists. Regular grooming is essential, especially during shedding season. They are social dogs and do not do well when left alone for long periods.',
      status: 'PUBLISHED',
      publishedAt: new Date(),
      tags: {
        connect: [{ id: tags[0].id }], // Dog tag
      },
      classifications: {
        create: [
          { type: 'Species', value: 'Canis lupus familiaris' },
          { type: 'Breed', value: 'Siberian Husky' },
          { type: 'LegalStatus', value: 'Legal in most jurisdictions' },
        ],
      },
    },
  });

  console.log('✅ Created sample pet:', samplePet.commonName);

  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

