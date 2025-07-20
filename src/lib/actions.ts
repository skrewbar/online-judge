"use server"

import { signIn, signOut } from "@/auth"
import { AuthError } from "next-auth"
import { redirect } from "next/navigation"
import { registerSchema, loginSchema } from "./zod"
import z, { ZodError } from "zod"
import { RegisterResponse } from "@/types/api"

export interface RegisterState {
  formData: {
    handle?: string
    email?: string
  }
  errors: {
    handle?: string
    email?: string
    password?: string
    pwcheck?: string
    form?: string
  }
}
export async function registerAction(
  prevState: RegisterState,
  formData: FormData
) {
  const newState: RegisterState = {
    formData: {
      handle: formData.get("handle") as string,
      email: formData.get("email") as string,
    },
    errors: {},
  }

  const schemaParseRes = await registerSchema.safeParseAsync(
    Object.fromEntries(formData.entries())
  )

  if (!schemaParseRes.success) {
    const properties = z.treeifyError(schemaParseRes.error).properties
    newState.errors.handle = properties?.handle?.errors[0]
    newState.errors.email = properties?.email?.errors[0]
    newState.errors.password = properties?.password?.errors[0]
    newState.errors.pwcheck = properties?.pwcheck?.errors[0]
    return newState
  }

  const { handle, email, password, pwcheck } = schemaParseRes.data

  if (pwcheck !== password) {
    newState.errors.pwcheck = "비밀번호가 일치하지 않아요."
    return newState
  }

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
    const data: RegisterResponse = await res.json()
    newState.errors[data.error!.label] = data.error!.message
    return newState
  }

  redirect("/login")
}

// TODO: 로그인도 회원가입처럼 field마다 error띄우도록 만들기
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
