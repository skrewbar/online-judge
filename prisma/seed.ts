import { PrismaClient } from "../src/generated/prisma"
import bcrypt from "bcrypt"
import data from "./seedData.json" with { type: "json" }

const prisma = new PrismaClient()

async function seedData() {
  const root = await prisma.user.upsert({
    where: { handle: data.root.handle },
    update: {},
    create: {
      ...data.root,
      password: await bcrypt.hash(data.root.password, 11),
    },
  })

  data.problems.map(async ({ tagNames, ...problem }) => {
    await prisma.problem.upsert({
      where: { id: 1 },
      update: {},
      create: {
        ...problem,
        authorId: root.id,
        tags: {
          connectOrCreate: tagNames.map((name) => {
            return {
              where: { name },
              create: { name },
            }
          }),
        },
      },
    })
  })
}

seedData()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
