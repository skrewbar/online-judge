"use client"

import { ProblemContext } from "./ProblemContext"
import type { Problem } from "@/types/db"

interface ProblemProviderProps {
  problem: Problem
  children: React.ReactNode
}

export default function ProblemProvider({ problem, children }: ProblemProviderProps) {
  return (
    <ProblemContext.Provider value={{ problem }}>
      {children}
    </ProblemContext.Provider>
  )
}
