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

  // Create tags/categories
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
    prisma.tag.upsert({
      where: { name: 'Small Mammal' },
      update: {},
      create: { name: 'Small Mammal', slug: 'small-mammal' },
    }),
    prisma.tag.upsert({
      where: { name: 'Fish' },
      update: {},
      create: { name: 'Fish', slug: 'fish' },
    }),
  ]);

  console.log('✅ Created tags:', tags.map((t) => t.name).join(', '));

  const dogTag = tags[0];
  const catTag = tags[1];
  const birdTag = tags[2];
  const reptileTag = tags[3];
  const smallMammalTag = tags[4];
  const fishTag = tags[5];

  // Helper function to create pets with media
  const createPet = async (petData: any) => {
    const pet = await prisma.pet.upsert({
      where: { slug: petData.slug },
      update: {},
      create: {
        ...petData,
        media: undefined, // Remove media from initial create
      },
    });

    // Add media after pet is created
    if (petData.media && petData.media.length > 0) {
      for (const mediaItem of petData.media) {
        await prisma.media.create({
          data: {
            ...mediaItem,
            petId: pet.id,
          },
        });
      }
    }

    return pet;
  };

  // DOGS
  const dogs = [
    {
      slug: 'golden-retriever',
      commonName: 'Golden Retriever',
      scientificName: 'Canis lupus familiaris',
      shortIntro:
        'Friendly, intelligent, and devoted, Golden Retrievers are one of the most popular family dogs in the world.',
      background:
        'Golden Retrievers were developed in Scotland in the mid-19th century by Lord Tweedmouth, who crossed a yellow retriever with a Tweed Water Spaniel. They were bred to retrieve waterfowl during hunting expeditions.',
      history:
        'The breed was officially recognized by the Kennel Club in 1913. They became popular in the United States in the 1920s and have remained one of the most beloved breeds ever since.',
      diet: 'Golden Retrievers need 2-3 cups of high-quality dry dog food daily, divided into two meals. They are prone to obesity, so portion control is important. Include protein-rich foods and avoid overfeeding treats.',
      ownershipGuide:
        'Golden Retrievers need daily exercise (1-2 hours), regular grooming (weekly brushing), and lots of social interaction. They are great with children and other pets. Training should start early as they are eager to please.',
      status: 'PUBLISHED' as const,
      publishedAt: new Date(),
      tags: { connect: [{ id: dogTag.id }] },
      classifications: {
        create: [
          { type: 'Species', value: 'Canis lupus familiaris' },
          { type: 'Breed', value: 'Golden Retriever' },
          { type: 'Size', value: 'Large' },
          { type: 'LegalStatus', value: 'Legal in all jurisdictions' },
        ],
      },
      media: [
        {
          url: 'https://images.unsplash.com/photo-1551717743-49959800b1f6?w=800&h=600&fit=crop',
          type: 'IMAGE' as const,
          altText: 'Golden Retriever dog',
          width: 800,
          height: 600,
          mimeType: 'image/jpeg',
        },
      ],
    },
    {
      slug: 'german-shepherd',
      commonName: 'German Shepherd',
      scientificName: 'Canis lupus familiaris',
      shortIntro:
        'Confident, courageous, and smart, German Shepherds are versatile working dogs known for their loyalty and trainability.',
      background:
        'German Shepherds were developed in Germany in the late 19th century by Captain Max von Stephanitz, who wanted to create the perfect working dog. They were bred from various herding dogs.',
      history:
        'Originally used for herding sheep, German Shepherds quickly became popular as police, military, and service dogs. They served extensively in both World Wars and continue to be used in various working roles today.',
      diet: 'German Shepherds require 2.5-3.5 cups of high-quality dog food daily, split into two meals. They benefit from diets rich in protein and omega-3 fatty acids. Be mindful of their sensitive stomachs.',
      ownershipGuide:
        'These dogs need extensive daily exercise (2+ hours) and mental stimulation. They require consistent training and socialization. Regular grooming is needed, especially during shedding seasons. They thrive in active households.',
      status: 'PUBLISHED' as const,
      publishedAt: new Date(),
      tags: { connect: [{ id: dogTag.id }] },
      classifications: {
        create: [
          { type: 'Species', value: 'Canis lupus familiaris' },
          { type: 'Breed', value: 'German Shepherd' },
          { type: 'Size', value: 'Large' },
          { type: 'LegalStatus', value: 'Legal in all jurisdictions' },
        ],
      },
      media: [
        {
          url: 'https://images.unsplash.com/photo-1589941027006-0c8c3e0cc4e8?w=800&h=600&fit=crop',
          type: 'IMAGE' as const,
          altText: 'German Shepherd dog',
          width: 800,
          height: 600,
          mimeType: 'image/jpeg',
        },
      ],
    },
    {
      slug: 'french-bulldog',
      commonName: 'French Bulldog',
      scientificName: 'Canis lupus familiaris',
      shortIntro:
        'Playful, adaptable, and smart, French Bulldogs are small companion dogs with big personalities.',
      background:
        'French Bulldogs originated in England as miniature versions of English Bulldogs. When lace workers moved to France during the Industrial Revolution, they brought these dogs with them, where they became popular.',
      history:
        'The breed was developed in the 1800s and became fashionable among Parisian society. They were recognized by the AKC in 1898 and have grown in popularity worldwide.',
      diet: 'French Bulldogs need 1-1.5 cups of high-quality dog food daily, divided into two meals. They are prone to obesity, so monitor their weight. Avoid foods that cause flatulence due to their brachycephalic nature.',
      ownershipGuide:
        'French Bulldogs are low-energy dogs that need moderate exercise (20-30 minutes daily). They cannot tolerate extreme heat or cold. Regular cleaning of facial folds is essential. They are great apartment dogs but can be prone to breathing issues.',
      status: 'PUBLISHED' as const,
      publishedAt: new Date(),
      tags: { connect: [{ id: dogTag.id }] },
      classifications: {
        create: [
          { type: 'Species', value: 'Canis lupus familiaris' },
          { type: 'Breed', value: 'French Bulldog' },
          { type: 'Size', value: 'Small' },
          { type: 'LegalStatus', value: 'Legal in all jurisdictions' },
        ],
      },
      media: [
        {
          url: 'https://images.unsplash.com/photos/short-coated-tan-dog-sitting-on-white-fur-textile-jVOkrxUSzAQ?w=800&h=600&fit=crop',
          type: 'IMAGE' as const,
          altText: 'French Bulldog',
          width: 800,
          height: 600,
          mimeType: 'image/jpeg',
        },
      ],
    },
    {
      slug: 'siberian-husky',
      commonName: 'Siberian Husky',
      scientificName: 'Canis lupus familiaris',
      shortIntro:
        'The Siberian Husky is a medium-sized working sled dog breed known for its endurance and friendly temperament.',
      background:
        'The Siberian Husky originated in Northeast Asia where they were bred by the Chukchi people of Siberia. They were used as sled dogs and companions, capable of traveling long distances in harsh conditions.',
      history:
        'Siberian Huskies were brought to Alaska in 1908 for sled-dog racing. They gained fame during the 1925 serum run to Nome, where teams of sled dogs delivered diphtheria antitoxin across Alaska.',
      diet: 'Siberian Huskies require a high-quality diet rich in protein. They typically need 2-3 cups of dry dog food per day, divided into two meals. Active dogs may require more calories.',
      ownershipGuide:
        'Siberian Huskies are energetic and require daily exercise. They need a secure yard as they are known escape artists. Regular grooming is essential, especially during shedding season. They are social dogs and do not do well when left alone for long periods.',
      status: 'PUBLISHED' as const,
      publishedAt: new Date(),
      tags: { connect: [{ id: dogTag.id }] },
      classifications: {
        create: [
          { type: 'Species', value: 'Canis lupus familiaris' },
          { type: 'Breed', value: 'Siberian Husky' },
          { type: 'Size', value: 'Medium' },
          { type: 'LegalStatus', value: 'Legal in most jurisdictions' },
        ],
      },
      media: [
        {
          url: 'https://images.unsplash.com/photo-1605568427561-40dd23c2acea?w=800&h=600&fit=crop',
          type: 'IMAGE' as const,
          altText: 'Siberian Husky dog',
          width: 800,
          height: 600,
          mimeType: 'image/jpeg',
        },
      ],
    },
  ];

  // CATS
  const cats = [
    {
      slug: 'persian-cat',
      commonName: 'Persian Cat',
      scientificName: 'Felis catus',
      shortIntro:
        'Persian cats are known for their long, luxurious coats, sweet personalities, and calm demeanor.',
      background:
        'Persian cats originated in Persia (modern-day Iran) and were brought to Europe in the 1600s. They were highly prized by nobility and became one of the most popular cat breeds.',
      history:
        'The breed was developed through selective breeding in Europe and America. Modern Persians have been bred for their distinctive flat faces and long coats. They were one of the first breeds recognized by cat registries.',
      diet: 'Persian cats need high-quality cat food, about 1/2 to 1 cup of dry food or 6-9 ounces of wet food daily. They benefit from hairball control formulas. Fresh water should always be available.',
      ownershipGuide:
        'Persians require daily grooming (15-20 minutes) to prevent matting. They are indoor cats and need a calm, quiet environment. Regular eye cleaning is necessary due to their flat faces. They are gentle and prefer a predictable routine.',
      status: 'PUBLISHED' as const,
      publishedAt: new Date(),
      tags: { connect: [{ id: catTag.id }] },
      classifications: {
        create: [
          { type: 'Species', value: 'Felis catus' },
          { type: 'Breed', value: 'Persian' },
          { type: 'Size', value: 'Medium' },
          { type: 'LegalStatus', value: 'Legal in all jurisdictions' },
        ],
      },
      media: [
        {
          url: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800&h=600&fit=crop',
          type: 'IMAGE' as const,
          altText: 'Persian cat',
          width: 800,
          height: 600,
          mimeType: 'image/jpeg',
        },
      ],
    },
    {
      slug: 'maine-coon',
      commonName: 'Maine Coon',
      scientificName: 'Felis catus',
      shortIntro:
        'Maine Coons are large, friendly cats known for their intelligence, playful nature, and distinctive tufted ears.',
      background:
        'Maine Coons are one of the oldest natural breeds in North America, originating in the state of Maine. They are believed to have descended from long-haired cats brought by European settlers.',
      history:
        'The breed was popular in the 1800s but declined with the introduction of Persian cats. They made a comeback in the 1950s and are now one of the most popular breeds in America.',
      diet: 'Maine Coons need 1-1.5 cups of high-quality cat food daily, divided into meals. They benefit from protein-rich diets. Due to their size, they may need more food than average cats.',
      ownershipGuide:
        'Maine Coons need regular grooming (2-3 times per week) and enjoy interactive play. They are good with children and other pets. Provide scratching posts and climbing opportunities. They are generally healthy but can be prone to hip dysplasia.',
      status: 'PUBLISHED' as const,
      publishedAt: new Date(),
      tags: { connect: [{ id: catTag.id }] },
      classifications: {
        create: [
          { type: 'Species', value: 'Felis catus' },
          { type: 'Breed', value: 'Maine Coon' },
          { type: 'Size', value: 'Large' },
          { type: 'LegalStatus', value: 'Legal in all jurisdictions' },
        ],
      },
      media: [
        {
          url: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=800&h=600&fit=crop',
          type: 'IMAGE' as const,
          altText: 'Maine Coon cat',
          width: 800,
          height: 600,
          mimeType: 'image/jpeg',
        },
      ],
    },
    {
      slug: 'siamese-cat',
      commonName: 'Siamese Cat',
      scientificName: 'Felis catus',
      shortIntro:
        'Siamese cats are vocal, social, and intelligent felines with striking blue eyes and distinctive color points.',
      background:
        'Siamese cats originated in Thailand (formerly Siam) and were considered sacred temple cats. They were first exported to the West in the late 1800s.',
      history:
        'The breed became popular in Europe and America in the early 1900s. Modern Siamese have been bred to be more slender, while traditional Siamese maintain a more robust build.',
      diet: 'Siamese cats need 1/2 to 1 cup of high-quality cat food daily. They are active and may need more calories. Provide both wet and dry food options.',
      ownershipGuide:
        "Siamese cats are very social and don't do well alone. They need daily interaction and mental stimulation. They are vocal and will communicate with their owners. Regular grooming is minimal. They thrive in active households with attention.",
      status: 'PUBLISHED' as const,
      publishedAt: new Date(),
      tags: { connect: [{ id: catTag.id }] },
      classifications: {
        create: [
          { type: 'Species', value: 'Felis catus' },
          { type: 'Breed', value: 'Siamese' },
          { type: 'Size', value: 'Medium' },
          { type: 'LegalStatus', value: 'Legal in all jurisdictions' },
        ],
      },
      media: [
        {
          url: 'https://images.unsplash.com/photo-1513245543132-31f507417b26?w=800&h=600&fit=crop',
          type: 'IMAGE' as const,
          altText: 'Siamese cat',
          width: 800,
          height: 600,
          mimeType: 'image/jpeg',
        },
      ],
    },
  ];

  // BIRDS
  const birds = [
    {
      slug: 'african-grey-parrot',
      commonName: 'African Grey Parrot',
      scientificName: 'Psittacus erithacus',
      shortIntro:
        'African Grey Parrots are highly intelligent birds known for their exceptional talking ability and problem-solving skills.',
      background:
        'African Grey Parrots are native to the rainforests of West and Central Africa. They are one of the most intelligent bird species, capable of understanding and using human language.',
      history:
        'These parrots have been kept as pets for centuries. They gained fame through research showing their cognitive abilities, including understanding concepts like shape, color, and number.',
      diet: 'African Greys need a varied diet: high-quality pellets (60-70%), fresh fruits and vegetables (20-30%), and seeds/nuts (10%). Avoid avocado, chocolate, and caffeine. Provide fresh water daily.',
      ownershipGuide:
        'African Greys need large cages (minimum 24"x24"x36"), daily out-of-cage time (3-4 hours), and mental stimulation. They require social interaction and can become stressed if neglected. Regular veterinary check-ups are essential.',
      status: 'PUBLISHED' as const,
      publishedAt: new Date(),
      tags: { connect: [{ id: birdTag.id }] },
      classifications: {
        create: [
          { type: 'Species', value: 'Psittacus erithacus' },
          { type: 'Breed', value: 'African Grey Parrot' },
          { type: 'Size', value: 'Medium' },
          { type: 'LegalStatus', value: 'Legal in most jurisdictions (check local laws)' },
        ],
      },
      media: [
        {
          url: 'https://images.unsplash.com/photo-1605367735090-3e0b5c5a0b5e?w=800&h=600&fit=crop',
          type: 'IMAGE' as const,
          altText: 'African Grey Parrot',
          width: 800,
          height: 600,
          mimeType: 'image/jpeg',
        },
      ],
    },
    {
      slug: 'cockatiel',
      commonName: 'Cockatiel',
      scientificName: 'Nymphicus hollandicus',
      shortIntro:
        'Cockatiels are friendly, affectionate birds that make excellent pets for both beginners and experienced bird owners.',
      background:
        'Cockatiels are native to Australia and are the smallest members of the cockatoo family. They were first described in 1792 and became popular pets in the 1900s.',
      history:
        'Cockatiels were first bred in captivity in the 1950s. They quickly became one of the most popular pet birds due to their friendly nature and relatively easy care requirements.',
      diet: 'Cockatiels need a balanced diet: high-quality pellets (60%), fresh vegetables and fruits (30%), and seeds (10%). Provide cuttlebone for calcium. Fresh water should always be available.',
      ownershipGuide:
        'Cockatiels need a cage at least 20"x20"x24" with horizontal bars for climbing. They require daily interaction and out-of-cage time. They enjoy toys and can learn to whistle tunes. Regular nail and wing trimming may be needed.',
      status: 'PUBLISHED' as const,
      publishedAt: new Date(),
      tags: { connect: [{ id: birdTag.id }] },
      classifications: {
        create: [
          { type: 'Species', value: 'Nymphicus hollandicus' },
          { type: 'Breed', value: 'Cockatiel' },
          { type: 'Size', value: 'Small' },
          { type: 'LegalStatus', value: 'Legal in all jurisdictions' },
        ],
      },
      media: [
        {
          url: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=800&h=600&fit=crop',
          type: 'IMAGE' as const,
          altText: 'Cockatiel bird',
          width: 800,
          height: 600,
          mimeType: 'image/jpeg',
        },
      ],
    },
    {
      slug: 'canary',
      commonName: 'Canary',
      scientificName: 'Serinus canaria',
      shortIntro:
        'Canaries are cheerful songbirds known for their beautiful melodies and bright colors.',
      background:
        'Canaries originated from the Canary Islands, Madeira, and the Azores. They were first brought to Europe in the 15th century and became popular pets for their singing ability.',
      history:
        'Selective breeding has produced many color varieties and improved singing ability. They were particularly popular in the 1800s and remain beloved pets today.',
      diet: 'Canaries need a seed mix specifically for canaries, supplemented with fresh greens, vegetables, and occasional fruits. Provide cuttlebone and grit. Fresh water daily is essential.',
      ownershipGuide:
        'Canaries need a cage at least 18"x18"x24" with perches at different heights. They prefer to be kept alone or in pairs. They need natural light but not direct sunlight. Regular cage cleaning is important for their health.',
      status: 'PUBLISHED' as const,
      publishedAt: new Date(),
      tags: { connect: [{ id: birdTag.id }] },
      classifications: {
        create: [
          { type: 'Species', value: 'Serinus canaria' },
          { type: 'Breed', value: 'Canary' },
          { type: 'Size', value: 'Small' },
          { type: 'LegalStatus', value: 'Legal in all jurisdictions' },
        ],
      },
      media: [
        {
          url: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=800&h=600&fit=crop',
          type: 'IMAGE' as const,
          altText: 'Canary bird',
          width: 800,
          height: 600,
          mimeType: 'image/jpeg',
        },
      ],
    },
  ];

  // REPTILES
  const reptiles = [
    {
      slug: 'bearded-dragon',
      commonName: 'Bearded Dragon',
      scientificName: 'Pogona vitticeps',
      shortIntro:
        'Bearded Dragons are docile, easy-to-handle lizards that make excellent reptile pets for beginners.',
      background:
        'Bearded Dragons are native to the arid, rocky regions of Australia. They are named for the "beard" of spiny scales under their chin that they puff out when threatened.',
      history:
        'Bearded Dragons were first exported from Australia in the 1990s and quickly became one of the most popular pet reptiles worldwide due to their calm temperament.',
      diet: 'Bearded Dragons are omnivores. Juveniles need 80% insects (crickets, mealworms) and 20% vegetables. Adults need 80% vegetables and 20% insects. Provide calcium and vitamin D3 supplements.',
      ownershipGuide:
        'Bearded Dragons need a 40-75 gallon tank with proper heating (95-110°F basking spot) and UVB lighting (10-12 hours daily). They need a temperature gradient and hiding spots. Regular handling helps them stay tame.',
      status: 'PUBLISHED' as const,
      publishedAt: new Date(),
      tags: { connect: [{ id: reptileTag.id }] },
      classifications: {
        create: [
          { type: 'Species', value: 'Pogona vitticeps' },
          { type: 'Breed', value: 'Bearded Dragon' },
          { type: 'Size', value: 'Medium' },
          { type: 'LegalStatus', value: 'Legal in most jurisdictions (check local laws)' },
        ],
      },
      media: [
        {
          url: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&h=600&fit=crop',
          type: 'IMAGE' as const,
          altText: 'Bearded Dragon lizard',
          width: 800,
          height: 600,
          mimeType: 'image/jpeg',
        },
      ],
    },
    {
      slug: 'ball-python',
      commonName: 'Ball Python',
      scientificName: 'Python regius',
      shortIntro:
        'Ball Pythons are gentle, docile snakes that are perfect for first-time snake owners.',
      background:
        'Ball Pythons are native to sub-Saharan Africa. They are named for their defensive behavior of curling into a tight ball when threatened.',
      history:
        'Ball Pythons have been kept as pets since the 1970s. Selective breeding has produced many color and pattern morphs, making them highly sought after.',
      diet: 'Ball Pythons eat appropriately sized rodents (mice or rats). Juveniles eat every 5-7 days, adults every 7-10 days. Pre-killed prey is safer than live feeding.',
      ownershipGuide:
        'Ball Pythons need a 20-40 gallon tank with proper heating (88-92°F hot side, 78-80°F cool side) and humidity (50-60%). They need hiding spots and a water bowl. Handle gently and infrequently, especially after feeding.',
      status: 'PUBLISHED' as const,
      publishedAt: new Date(),
      tags: { connect: [{ id: reptileTag.id }] },
      classifications: {
        create: [
          { type: 'Species', value: 'Python regius' },
          { type: 'Breed', value: 'Ball Python' },
          { type: 'Size', value: 'Medium' },
          { type: 'LegalStatus', value: 'Legal in most jurisdictions (check local laws)' },
        ],
      },
      media: [
        {
          url: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&h=600&fit=crop',
          type: 'IMAGE' as const,
          altText: 'Ball Python snake',
          width: 800,
          height: 600,
          mimeType: 'image/jpeg',
        },
      ],
    },
    {
      slug: 'leopard-gecko',
      commonName: 'Leopard Gecko',
      scientificName: 'Eublepharis macularius',
      shortIntro:
        'Leopard Geckos are hardy, easy-to-care-for lizards that are ideal for reptile beginners.',
      background:
        'Leopard Geckos are native to the rocky, dry grasslands of Afghanistan, Pakistan, and parts of India. They are one of the most popular pet reptiles.',
      history:
        'Leopard Geckos have been bred in captivity since the 1970s. Many color morphs have been developed through selective breeding.',
      diet: 'Leopard Geckos are insectivores. Feed them appropriately sized insects (crickets, mealworms, dubia roaches) dusted with calcium and vitamin D3. Juveniles eat daily, adults every 2-3 days.',
      ownershipGuide:
        "Leopard Geckos need a 20-gallon tank with a heat mat (88-92°F hot side, 75-80°F cool side). They need hiding spots and a moist hide for shedding. They are nocturnal and don't require UVB lighting. Handle gently and support their body.",
      status: 'PUBLISHED' as const,
      publishedAt: new Date(),
      tags: { connect: [{ id: reptileTag.id }] },
      classifications: {
        create: [
          { type: 'Species', value: 'Eublepharis macularius' },
          { type: 'Breed', value: 'Leopard Gecko' },
          { type: 'Size', value: 'Small' },
          { type: 'LegalStatus', value: 'Legal in most jurisdictions' },
        ],
      },
      media: [
        {
          url: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&h=600&fit=crop',
          type: 'IMAGE' as const,
          altText: 'Leopard Gecko',
          width: 800,
          height: 600,
          mimeType: 'image/jpeg',
        },
      ],
    },
  ];

  // SMALL MAMMALS
  const smallMammals = [
    {
      slug: 'rabbit',
      commonName: 'Domestic Rabbit',
      scientificName: 'Oryctolagus cuniculus',
      shortIntro:
        'Rabbits are social, intelligent animals that make wonderful pets for families willing to provide proper care.',
      background:
        'Domestic rabbits are descended from European wild rabbits. They were first domesticated in the Middle Ages and have been kept as pets and livestock for centuries.',
      history:
        'Rabbits became popular pets in the 19th century. Today, there are over 50 recognized breeds, ranging from tiny dwarf rabbits to large Flemish Giants.',
      diet: 'Rabbits need unlimited hay (timothy or orchard grass), fresh vegetables (1 cup per 2 lbs body weight), and a small amount of pellets. Fresh water should always be available.',
      ownershipGuide:
        'Rabbits need a large enclosure (minimum 4x2 feet) or free-roaming space. They need daily exercise and social interaction. Litter training is possible. They require regular grooming, especially long-haired breeds. Spaying/neutering is recommended.',
      status: 'PUBLISHED' as const,
      publishedAt: new Date(),
      tags: { connect: [{ id: smallMammalTag.id }] },
      classifications: {
        create: [
          { type: 'Species', value: 'Oryctolagus cuniculus' },
          { type: 'Breed', value: 'Domestic Rabbit' },
          { type: 'Size', value: 'Small to Medium' },
          { type: 'LegalStatus', value: 'Legal in all jurisdictions' },
        ],
      },
      media: [
        {
          url: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=800&h=600&fit=crop',
          type: 'IMAGE' as const,
          altText: 'Domestic Rabbit',
          width: 800,
          height: 600,
          mimeType: 'image/jpeg',
        },
      ],
    },
    {
      slug: 'guinea-pig',
      commonName: 'Guinea Pig',
      scientificName: 'Cavia porcellus',
      shortIntro:
        'Guinea Pigs are gentle, social rodents that are perfect pets for children and families.',
      background:
        'Guinea Pigs originated in the Andes Mountains of South America. They were domesticated by the Incas and were kept as food animals and pets.',
      history:
        'Guinea Pigs were brought to Europe in the 16th century and became popular pets. They are now one of the most common small pets worldwide.',
      diet: 'Guinea Pigs need unlimited timothy hay, fresh vegetables (especially leafy greens), and vitamin C-fortified pellets. They cannot produce their own vitamin C, so supplementation is essential.',
      ownershipGuide:
        'Guinea Pigs need a large cage (minimum 7.5 square feet for one, 10.5 for two). They are social and do best in pairs. They need daily handling and interaction. Regular nail trimming and occasional grooming are required.',
      status: 'PUBLISHED' as const,
      publishedAt: new Date(),
      tags: { connect: [{ id: smallMammalTag.id }] },
      classifications: {
        create: [
          { type: 'Species', value: 'Cavia porcellus' },
          { type: 'Breed', value: 'Guinea Pig' },
          { type: 'Size', value: 'Small' },
          { type: 'LegalStatus', value: 'Legal in all jurisdictions' },
        ],
      },
      media: [
        {
          url: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=800&h=600&fit=crop',
          type: 'IMAGE' as const,
          altText: 'Guinea Pig',
          width: 800,
          height: 600,
          mimeType: 'image/jpeg',
        },
      ],
    },
    {
      slug: 'hamster',
      commonName: 'Hamster',
      scientificName: 'Mesocricetus auratus',
      shortIntro: 'Hamsters are small, nocturnal rodents that are popular first pets for children.',
      background:
        'Syrian Hamsters (the most common pet hamster) were first discovered in Syria in 1839. They were thought to be extinct until a female and her litter were found in 1930.',
      history:
        'The captured hamsters were bred in laboratories and became popular pets in the 1940s. Today, there are several species kept as pets, including Syrian, Dwarf, and Roborovski hamsters.',
      diet: 'Hamsters need a commercial hamster mix supplemented with fresh vegetables and occasional fruits. They also enjoy small amounts of protein (cooked chicken, mealworms). Provide fresh water daily.',
      ownershipGuide:
        'Hamsters need a cage at least 24"x12"x12" with a solid bottom. They need exercise wheels, tunnels, and hiding spots. They are nocturnal and prefer to be handled in the evening. Clean the cage weekly, but leave some old bedding for scent.',
      status: 'PUBLISHED' as const,
      publishedAt: new Date(),
      tags: { connect: [{ id: smallMammalTag.id }] },
      classifications: {
        create: [
          { type: 'Species', value: 'Mesocricetus auratus' },
          { type: 'Breed', value: 'Hamster' },
          { type: 'Size', value: 'Small' },
          { type: 'LegalStatus', value: 'Legal in all jurisdictions' },
        ],
      },
      media: [
        {
          url: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=800&h=600&fit=crop',
          type: 'IMAGE' as const,
          altText: 'Hamster',
          width: 800,
          height: 600,
          mimeType: 'image/jpeg',
        },
      ],
    },
  ];

  // FISH
  const fish = [
    {
      slug: 'goldfish',
      commonName: 'Goldfish',
      scientificName: 'Carassius auratus',
      shortIntro: 'Goldfish are hardy, colorful fish that are perfect for beginner aquarists.',
      background:
        'Goldfish were first domesticated in China over 1,000 years ago from wild carp. They were selectively bred for their colors and became symbols of good luck.',
      history:
        'Goldfish were introduced to Europe in the 17th century and to America in the 19th century. They are now one of the most popular aquarium fish worldwide.',
      diet: 'Goldfish need high-quality goldfish flakes or pellets, supplemented with fresh or frozen vegetables (peas, lettuce) and occasional live or frozen foods. Feed 2-3 times daily in small amounts.',
      ownershipGuide:
        'Goldfish need a large tank (minimum 20 gallons for one, 10 additional gallons per extra fish). They produce a lot of waste, so a good filtration system is essential. Regular water changes (25% weekly) are necessary. They prefer cooler water (65-72°F).',
      status: 'PUBLISHED' as const,
      publishedAt: new Date(),
      tags: { connect: [{ id: fishTag.id }] },
      classifications: {
        create: [
          { type: 'Species', value: 'Carassius auratus' },
          { type: 'Breed', value: 'Goldfish' },
          { type: 'Size', value: 'Small to Medium' },
          { type: 'LegalStatus', value: 'Legal in all jurisdictions' },
        ],
      },
      media: [
        {
          url: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&h=600&fit=crop',
          type: 'IMAGE' as const,
          altText: 'Goldfish',
          width: 800,
          height: 600,
          mimeType: 'image/jpeg',
        },
      ],
    },
    {
      slug: 'betta-fish',
      commonName: 'Betta Fish',
      scientificName: 'Betta splendens',
      shortIntro:
        'Betta Fish are beautiful, colorful fish known for their flowing fins and territorial nature.',
      background:
        'Betta Fish are native to the shallow waters of Thailand, Cambodia, and Vietnam. They are also known as Siamese Fighting Fish due to their aggressive behavior toward other males.',
      history:
        'Bettas were first bred for fighting in Thailand, but selective breeding has created many beautiful color and fin varieties. They became popular aquarium fish in the 20th century.',
      diet: 'Bettas are carnivores and need high-protein foods: betta pellets, frozen or live bloodworms, brine shrimp, and daphnia. Feed 2-3 small meals daily. Avoid overfeeding.',
      ownershipGuide:
        'Bettas need at least a 5-gallon tank with a heater (78-80°F) and gentle filtration. They prefer still or slow-moving water. They can be kept alone or with peaceful tank mates. Regular water changes (25% weekly) are essential. Provide hiding spots and plants.',
      status: 'PUBLISHED' as const,
      publishedAt: new Date(),
      tags: { connect: [{ id: fishTag.id }] },
      classifications: {
        create: [
          { type: 'Species', value: 'Betta splendens' },
          { type: 'Breed', value: 'Betta Fish' },
          { type: 'Size', value: 'Small' },
          { type: 'LegalStatus', value: 'Legal in all jurisdictions' },
        ],
      },
      media: [
        {
          url: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&h=600&fit=crop',
          type: 'IMAGE' as const,
          altText: 'Betta Fish',
          width: 800,
          height: 600,
          mimeType: 'image/jpeg',
        },
      ],
    },
  ];

  // Create all pets
  const allPets = [...dogs, ...cats, ...birds, ...reptiles, ...smallMammals, ...fish];

  console.log('📝 Creating pets...');
  for (const petData of allPets) {
    const pet = await createPet(petData);
    console.log(`✅ Created pet: ${pet.commonName}`);
  }

  console.log(
    `🎉 Seeding completed! Created ${allPets.length} pets across ${tags.length} categories.`,
  );
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
