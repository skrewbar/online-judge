import NextAuth, { type NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcrypt"
import { prisma } from "./lib/prisma"
import { loginSchema } from "./lib/zod"
import { ZodError } from "zod"

export const authConfig = {
  providers: [
    Credentials({
      async authorize(credentials) {
        try {
          const { handle, password } = await loginSchema.parseAsync(credentials)

          const user = await prisma.user.findUnique({
            where: { handle },
          })

          if (!user) return null

          if (await bcrypt.compare(password, user.password))
            return { id: user.id, handle: user.handle }

          return null
        } catch (error) {
          if (error instanceof ZodError) {
            return null
          }
          throw error
        }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.handle = user.handle
      }
      return token
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.handle = token.handle as string
      }
      return session
    },
  },
} satisfies NextAuthConfig

export const { handlers, signIn, signOut, auth } = NextAuth(authConfig)
