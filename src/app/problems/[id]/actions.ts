"use server"

import type { Language } from "@/generated/prisma"
import { SubmissionStatus } from "@/generated/prisma"

import { prisma } from "@/lib/prisma"

export async function submit(
  authorId: string,
  problemId: number,
  code: string,
  language: Language
): Promise<boolean> {
  try {
    await prisma.submission.create({
      data: {
        code,
        authorId,
        problemId,
        language,
        status: SubmissionStatus.PENDING,
      },
    })
  } catch (err) {
    console.log(err)
    return false
  }
  return true
}
