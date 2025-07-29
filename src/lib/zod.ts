import { email, object, string } from "zod"
import { isEmailTaken, isHandleTaken } from "./validator"

export const registerSchema = object({
  handle: string()
    .min(1, "핸들을 입력해 주세요.")
    .refine(
      async (val) => !(await isHandleTaken(val)),
      "다른 유저가 해당 핸들을 사용하고 있어요."
    ),
  email: email("올바른 이메일을 입력해 주세요.")
    .min(1, "이메일을 입력해 주세요.")
    .refine(
      async (val) => !(await isEmailTaken(val)),
      "다른 유저가 해당 이메일을 사용하고 있어요."
    ),
  password: string().min(1, "비밀번호를 입력해 주세요."),
  pwcheck: string().min(1, "비밀번호를 한번 더 입력해 주세요."),
}).refine((data) => data.password === data.pwcheck, {
  error: "비밀번호가 일치하지 않아요.",
  path: ["pwcheck"],
})

export const loginSchema = object({
  handle: string().min(1, "핸들을 입력해 주세요."),
  password: string().min(1, "비밀번호를 입력해 주세요."),
})

export const createProblemSchema = object({
  title: string().min(1, "문제의 제목을 입력해 주세요."),
})
