import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.js';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

async function main() {
  await prisma.account.createMany({
    data: [
      { name: 'Primary Savings', type: 'savings', balance: 0 },
      { name: 'Primary Current', type: 'current', balance: 0 },
      { name: 'Secondary Current', type: 'current', balance: 0 },
    ],
  });
  console.log('Seeded 3 accounts.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
