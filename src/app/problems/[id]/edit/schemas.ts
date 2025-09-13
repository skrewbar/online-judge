import { object, boolean, int, string } from "zod"
import { prisma } from "@/lib/prisma"

export const generalInfoSchema = object({
  isPublic: boolean(),
  timeLimit: int().positive(),
  memoryLimit: int().positive(),
  difficulty: int().nonnegative(),
  tags: string()
    .array()
    .min(1, "아무런 태그도 선택되지 않았어요.")
    .refine(
      (tags) => new Set(tags).size === tags.length,
      "중복된 태그가 있어요."
    )
    .refine(async (tags) => {
      const count = await prisma.tag.count({
        where: { name: { in: tags } },
      })

      return count === tags.length
    }, "존재하지 않는 태그가 포함되어 있어요."),
  isSpecialJudge: boolean(),
  isInteractive: boolean(),
  hasSubtask: boolean(),
}).refine(
  ({ isSpecialJudge, isInteractive }) => !(isSpecialJudge && isInteractive),
  {
    error: "스페셜 저지이면서 인터랙티브 문제일 수는 없어요.",
    path: ["isSpecialJudge"],
  }
)

export const statementSchema = object({
  // statements
  title: string().min(1, "제목이 입력되지 않았어요."),
  legend: string().min(1, "문제 설명이 입력되지 않았어요."),
  inputFormat: string().min(1, "입력 형식이 입력되지 않았어요."),
  outputFormat: string().min(1, "출력 형식이 입력되지 않았어요."),
  notes: string().optional(),
})
