import { auth } from "@/auth"
import React from "react"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { ProblemAccessRole } from "@/generated/prisma"

type LayoutProps = Readonly<{
  children: React.ReactNode
  params: Promise<{ id: string }>
}>

export default async function Layout({ children, params }: LayoutProps) {
  const session = await auth()
  if (!session?.user) notFound()
  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (!user) notFound()

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

  const problemAccess = await prisma.problemAccess.findUnique({
    where: { userId_problemId: { userId: user.id, problemId } },
  })
  if (!user.isAdmin && problemAccess?.role !== ProblemAccessRole.EDITOR)
    notFound()

  return (
    <>
      <h1>{problem.title}</h1>
      {children}
    </>
  )
}
