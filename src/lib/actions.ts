"use server"

import { signIn, signOut } from "@/auth"
import { AuthError } from "next-auth"
import { loginSchema } from "./zod"
import { ZodError } from "zod"

export interface LoginState {
  handle?: string
  error?: string
}
export async function loginAction(prevState: LoginState, formData: FormData) {
  const newState: LoginState = {}

  try {
    const { handle, password } = loginSchema.parse(
      Object.fromEntries(formData.entries())
    )
    newState.handle = handle
    await signIn("credentials", { handle, password, redirectTo: "/" })
  } catch (error) {
    if (error instanceof ZodError) {
      newState.error = error.message
    } else if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          newState.error = "핸들 또는 비밀번호가 잘못되었어요."
          break
        default:
          newState.error =
            "서버에서 에러가 발생했어요. 관리자에게 문의해 주세요."
      }
    } else throw error
  }

  return newState
}

export async function logoutAction() {
  await signOut()
}
