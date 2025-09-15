"use server"

import { prisma } from "@/lib/prisma"

import { generalInfoSchema } from "./schemas"
import { revalidatePath } from "next/cache"

export type GeneralInfoState = {
  error?: string
  success?: boolean
}

export async function editAction(
  prevState: GeneralInfoState,
  formData: FormData
): Promise<GeneralInfoState> {
  const parseRes = await generalInfoSchema.safeParseAsync({
    isPublic: !!formData.get("isPublic"),
    timeLimit: parseInt(formData.get("timeLimit") as string),
    memoryLimit: parseInt(formData.get("memoryLimit") as string),
    difficulty: parseInt(formData.get("difficulty") as string),
    tags: formData.getAll("tags"),
    isSpecialJudge: !!formData.get("isSpecialJudge"),
    isInteractive: !!formData.get("isInteractive"),
    hasSubtask: !!formData.get("hasSubtask"),
  })

  const id = parseInt(formData.get("id") as string)

  if (!parseRes.success)
    return {
      error: `${parseRes.error.issues[0].path}: ${parseRes.error.issues[0].message}`,
    }
  if (!(await prisma.problem.findUnique({ where: { id } })))
    return {
      error: "페이지가 손상되었습니다. 새로고침 후 다시 시도해 주세요.",
    }

  const { tags: tagNames, ...dataWithoutTags } = structuredClone(parseRes.data)

  const tags = await prisma.tag.findMany({ where: { name: { in: tagNames } } })

  if (parseRes.success) {
    await prisma.problem.update({
      where: { id },
      data: {
        ...dataWithoutTags,
        tags: {
          set: tags,
        },
      },
    })
  }

  revalidatePath(`/problems/${id}/edit`)

  return {
    success: true,
  }
}
