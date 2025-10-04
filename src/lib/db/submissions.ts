import { prisma } from "@/lib/prisma"

export async function getPaginatedSubmissions(
  page: number,
  pageSize: number,
  problemId?: number,
  authorId?: string
) {
  const [submissions, totalCount] = await Promise.all([
    prisma.submission.findMany({
      where: {
        problemId,
        authorId,
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: {
        id: "desc",
      },
    }),

    prisma.submission.count(),
  ])

  return { submissions, totalCount }
}
