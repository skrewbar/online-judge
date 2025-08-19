import { auth } from "@/auth"
import { notFound } from "next/navigation"
import ClientPage from "./ClientPage"
import { prisma } from "@/lib/prisma"

export default async function Page() {
  const session = await auth()
  if (!session?.user) notFound()

  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (!user?.isAdmin) notFound()

  return <ClientPage />
}
