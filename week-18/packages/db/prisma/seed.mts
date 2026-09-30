import prismaClient from "@prisma/client";
import bcrypt from "bcrypt";

const { PrismaClient } = prismaClient;
const prisma = new PrismaClient();

const NUMBER = "9894416963";
// Only used when the user doesn't exist yet; an existing password is left untouched
const DEFAULT_PASSWORD = "password123";

async function main() {
  const user = await prisma.user.upsert({
    where: { number: NUMBER },
    update: {},
    create: {
      number: NUMBER,
      name: "Bhagat",
      password: await bcrypt.hash(DEFAULT_PASSWORD, 10),
    },
  });

  await prisma.balance.upsert({
    where: { userId: user.id },
    update: { amount: 20000, locked: 0 },
    create: { userId: user.id, amount: 20000, locked: 0 },
  });

  const transactions = [
    { token: "seed_token_1", status: "Success", amount: 20000, provider: "HDFC Bank" },
    { token: "seed_token_2", status: "Processing", amount: 5000, provider: "Axis Bank" },
    { token: "seed_token_3", status: "Failure", amount: 1000, provider: "HDFC Bank" },
  ] as const;

  for (const t of transactions) {
    await prisma.onRampTransaction.upsert({
      where: { token: t.token },
      update: {},
      create: { ...t, startTime: new Date(), userId: user.id },
    });
  }

  console.log(`Seeded user ${NUMBER} (id ${user.id})`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
