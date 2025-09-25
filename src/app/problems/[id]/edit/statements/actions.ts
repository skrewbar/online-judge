"use server"

import { prisma } from "@/lib/prisma"
import { statementsSchema } from "./schemas"
import { revalidatePath } from "next/cache"

interface StatementsState {
  error?: string
  success?: boolean
}

export async function editStatementsAction(
  prevData: StatementsState,
  formData: FormData
): Promise<StatementsState> {
  const parseRes = statementsSchema.safeParse({
    legend: formData.get("legend"),
    inputFormat: formData.get("inputFormat"),
    outputFormat: formData.get("outputFormat"),
    notes: formData.get("notes") || undefined,
  })

  const id = parseInt(formData.get("id") as string)

  if (!parseRes.success)
    return {
      error: `${parseRes.error.issues[0].path}: ${parseRes.error.issues[0].message}`,
    }
  if (!(await prisma.problem.findUnique({ where: { id } })))
    return {
      error: "페이지가 손상되었어요. 새로고침 후 다시 시도해 주세요.",
    }

  await prisma.problem.update({
    where: { id },
    data: parseRes.data,
  })

  revalidatePath(`/problems/${id}/edit/statements`)

  return { success: true }
}
