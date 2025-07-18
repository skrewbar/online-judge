import type { DefaultSession, User as DefaultUser } from "next-auth"

declare module "next-auth" {
  /**
   * The `User` object returned by the `authorize` callback.
   * We are overriding the default User model to use a number for the id.
   */
  interface User extends DefaultUser {
    id: string
    handle: string
  }

  /**
   * The `Session` object returned by `auth`, `useSession`, `getSession`.
   */
  interface Session {
    user: {
      id: string
      handle: string
    } & DefaultSession["user"]
  }
}

