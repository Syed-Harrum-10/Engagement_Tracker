import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL is not set');
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

const categories = ['nature', 'cars', 'food', 'tech', 'travel'];

async function main() {
  const images = categories.flatMap((category) =>
    Array.from({ length: 6 }, (_, i) => ({
      url: `https://picsum.photos/seed/${category}${i + 1}/400/300`,
      category,
    })),
  );

  const existingImages = await prisma.image.findMany({
    where: { url: { in: images.map(({ url }) => url) } },
    select: { url: true },
  });
  const existingUrls = new Set(existingImages.map(({ url }) => url));
  const newImages = images.filter(({ url }) => !existingUrls.has(url));

  if (newImages.length > 0) {
    await prisma.image.createMany({ data: newImages });
  }
  console.log('seeded', newImages.length, 'new images');
}

async function run() {
  let failed = false;

  try {
    await main();
  } catch (error) {
    console.error('Failed to seed images:', error);
    failed = true;
  }

  try {
    await prisma.$disconnect();
  } catch (error) {
    console.error('Failed to disconnect Prisma:', error);
    failed = true;
  }

  if (failed) {
    process.exitCode = 1;
  }
}

void run();
