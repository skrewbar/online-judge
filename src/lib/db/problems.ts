import { prisma } from "@/lib/prisma"

export async function getPaginatedProblems(page: number, pageSize: number) {
  return await prisma.problem.findMany({
    where: {
      isPublic: true,
    },
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      difficulty: true,
      title: true,
      isSpecialJudge: true,
      isInteractive: true,
      isSubtask: true,
      _count: {
        select: {
          solvedUsers: true,
          submissions: true,
        },
      },
    },
  })
}
