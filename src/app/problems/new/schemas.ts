import { object, string } from "zod"

export const createProblemSchema = object({
  title: string().min(1, "문제의 제목을 입력해 주세요."),
})
