import { prisma } from "@/lib/prisma"

export async function isHandleTaken(handle: string) {
  return !!(await prisma.handleHistory.findUnique({ where: { handle } }))
}

export async function isEmailTaken(email: string) {
  return !!(await prisma.user.findUnique({ where: { email } }))
}
