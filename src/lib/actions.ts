"use server"

import { signIn, signOut } from "@/auth"
import { AuthError } from "next-auth"
import { redirect } from "next/navigation"
import { registerSchema, loginSchema } from "./zod"
import { ZodError } from "zod"

export interface RegisterState {
  handle?: string
  email?: string
  error?: string
}
export async function registerAction(
  prevState: RegisterState,
  formData: FormData
) {
  const newState: RegisterState = {}
  try {
    const { handle, email, password, pwcheck } =
      await registerSchema.parseAsync(Object.fromEntries(formData.entries()))
    newState.handle = handle
    newState.email = email

    if (pwcheck !== password) throw new Error("비밀번호가 일치하지 않아요.")

    const baseUrl =
      process.env.BASE_URL?.replace(/\/$/, "") ?? "http://localhost:3000"

    const res = await fetch(baseUrl + "/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        handle,
        email,
        password,
      }),
    })

    if (!res.ok) {
      const data = await res.json()
      throw new Error(data.error)
    }
  } catch (error) {
    if (error instanceof ZodError) {
      newState.error = error.message
    }
    if (error instanceof Error) {
      newState.error = error.message
    }
    return newState
  }

  redirect("/login")
}

export interface LoginState {
  handle?: string
  error?: string
}
export async function loginAction(prevState: LoginState, formData: FormData) {
  const newState: LoginState = {}

  try {
    const { handle, password } = await loginSchema.parseAsync(
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
