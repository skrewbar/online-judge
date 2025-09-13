"use server"

import { prisma } from "@/lib/prisma"

import { generalInfoSchema } from "./schemas"
import z from "zod"

export type GeneralInfoState = {
  id: number
  error?: string
  success?: boolean
} & z.infer<typeof generalInfoSchema>

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

  if (!parseRes.success) {
    return {
      ...prevState,
      error: `${parseRes.error.issues[0].path}: ${parseRes.error.issues[0].message}`,
    }
  }

  const { tags: tagNames, ...dataWithoutTags } = structuredClone(parseRes.data)

  const tags = await prisma.tag.findMany({ where: { name: { in: tagNames } } })

  if (parseRes.success) {
    await prisma.problem.update({
      where: { id: prevState.id },
      data: {
        ...dataWithoutTags,
        tags: {
          set: tags,
        },
      },
    })
  }

  return {
    id: prevState.id,
    success: true,
    ...parseRes.data,
  }
}
