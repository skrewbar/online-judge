import { object, string } from "zod"

export const loginSchema = object({
  handle: string().min(1, "핸들을 입력해 주세요."),
  password: string().min(1, "비밀번호를 입력해 주세요."),
})
