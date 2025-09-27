import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.create({
    data: {
      email: "alice@example.com",
      name: "Alice",
      dob: new Date("1995-08-15"),
    },
  });
  console.log("User created:", user);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());