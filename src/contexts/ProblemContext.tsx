"use client"

import { createContext, useContext } from "react"
import type { Problem } from "@/types/db"

export const ProblemContext = createContext<Problem | undefined>(undefined)

interface ProblemProviderProps {
  problem: Problem
  children: React.ReactNode
}
export function ProblemProvider({ problem, children }: ProblemProviderProps) {
  return (
    <ProblemContext.Provider value={problem}>
      {children}
    </ProblemContext.Provider>
  )
}

export function useProblem() {
  const problem = useContext(ProblemContext)
  if (!problem)
    throw new Error("useProblem must be used within ProblemProvider")
  return problem
}
