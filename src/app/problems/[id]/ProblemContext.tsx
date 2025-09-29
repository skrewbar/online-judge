"use client"

import { createContext, useContext } from "react"
import type { Problem } from "@/types/db"

export const ProblemContext = createContext<{ problem: Problem } | undefined>(
  undefined
)

export function useProblem() {
  const context = useContext(ProblemContext)
  if (!context)
    throw new Error("useProblem must be used within ProblemProvider")
  return context.problem
}
