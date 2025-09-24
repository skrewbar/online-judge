import { object, string } from "zod"

export const statementsSchema = object({
  legend: string().min(1, "문제의 지문이 비어있습니다."),
  inputFormat: string().min(1, "입력 형식 설명이 비어있습니다."),
  outputFormat: string().min(1, "출력 형식 설명이 비어있습니다."),
  notes: string().optional(),
})
