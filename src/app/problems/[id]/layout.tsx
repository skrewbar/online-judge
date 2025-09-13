import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"

import ProblemProvider from "./ProblemProvider"

type LayoutProps = Readonly<{
  children: React.ReactNode
  params: Promise<{ id: string }>
}>

export default async function Layout({ children, params }: LayoutProps) {
  const { id } = await params
  const problemId = parseInt(id)
  const problem = await prisma.problem.findUnique({
    where: { id: problemId },
    include: {
      tags: true,
      author: true,
      testCases: true,
      subTasks: true,
    },
  })
  if (!problem) notFound()

  return <ProblemProvider problem={problem}>{children}</ProblemProvider>
}
