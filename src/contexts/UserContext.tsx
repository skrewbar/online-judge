"use client"

import { createContext, useContext } from "react"
import type { User } from "@/generated/prisma"

export const UserContext = createContext<User | null>(null)

interface UserProviderProps {
  user: User | null
  children: React.ReactNode
}
export function UserProvider({ user, children }: UserProviderProps) {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>
}

export function useUser() {
  const user = useContext(UserContext)
  return user
}
