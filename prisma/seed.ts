import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.idea.create({
    data: {
      title: "Sample Idea",
      summary: "Seeded to verify DB writes."
    }
  });
  console.log("Seed complete");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
