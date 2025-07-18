import { email, object, string, ZodString } from "zod"

const handle: ZodString = string().min(1, "핸들을 입력해 주세요.")
const password: ZodString = string().min(1, "비밀번호를 입력해 주세요.")

export const registerSchema = object({
  handle,
  email: email().min(1, "이메일을 입력해 주세요."),
  password,
  pwcheck: password,
})

export const loginSchema = object({
  handle,
  password,
})
