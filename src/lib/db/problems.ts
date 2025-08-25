import { prisma } from "@/lib/prisma"

export async function getPaginatedProblems(page: number, pageSize: number) {
  const [problems, totalCount] = await Promise.all([
    prisma.problem.findMany({
      where: {
        isPublic: true,
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: {
        id: "asc",
      },
      select: {
        id: true,
        difficulty: true,
        title: true,
        isSpecialJudge: true,
        isInteractive: true,
        hasSubtask: true,
        _count: {
          select: {
            solvedUsers: true,
            submissions: true,
          },
        },
      },
    }),

    prisma.problem.count({
      where: { isPublic: true },
    }),
  ])

  return { problems, totalCount }
}
