import { auth } from "@/auth"
import { redirect } from "next/navigation"
import ClientPage from "./ClientPage"
import { prisma } from "@/lib/prisma"

export default async function Page() {
  const session = await auth()
  if (!session?.user) redirect("/login") // TODO: 404로 redirect

  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (!user?.isAdmin) redirect("/")

  return <ClientPage />
}
