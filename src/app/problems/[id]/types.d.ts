import { Prisma } from "@/generated/prisma"

export type Problem = Prisma.ProblemGetPayload<{
  include: {
    tags: true
    author: true
    testCases: true
    subTasks: true
  }
}>
