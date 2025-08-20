"use server"

import { redirect } from "next/navigation"
import { createProblemSchema } from "./schemas"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import z from "zod"

export interface CreateProblemState {
  data: z.infer<typeof createProblemSchema>
  error?: string
}

export async function createProblemAction(
  prevState: CreateProblemState,
  formData: FormData
): Promise<CreateProblemState> {
  const newState: CreateProblemState = {
    data: {
      title: formData.get("title") as string,
    },
  }

  const parseRes = createProblemSchema.safeParse(newState.data)
  if (!parseRes.success) {
    newState.error = parseRes.error.issues[0].message
    return newState
  }

  const session = await auth()
  if (!session?.user) {
    newState.error = "not authenticated"
    return newState
  }

  await prisma.problem.create({
    data: {
      title: parseRes.data.title,
      legend: "문제 설명",
      inputFormat: "입력 형식 설명",
      outputFormat: "출력 형식 설명",

      authorId: session.user.id,
    },
  })

  redirect("/")
}
