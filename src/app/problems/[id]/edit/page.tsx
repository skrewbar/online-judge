import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { ProblemAccessRole } from "@/generated/prisma"

interface EditPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function Page({ params }: EditPageProps) {
  const session = await auth()
  if (!session?.user) notFound()
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  })
  if (!user) notFound()

  const { id } = await params
  const problemId = parseInt(id)
  const problem = await prisma.problem.findUnique({ where: { id: problemId } })
  if (!problem) notFound()

  const problemAccess = await prisma.problemAccess.findUnique({
    where: { userId_problemId: { userId: session.user.id, problemId } },
  })

  if (!user.isAdmin && problemAccess?.role !== ProblemAccessRole.EDITOR) notFound()

  return <p>{problemId}</p>
}
