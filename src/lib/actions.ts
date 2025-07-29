"use server"

import { signIn, signOut } from "@/auth"
import { AuthError } from "next-auth"
import { redirect } from "next/navigation"
import { registerSchema, loginSchema, createProblemSchema } from "./zod"
import z, { ZodError } from "zod"
import { RegisterResponse } from "@/types/api"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

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
  // TODO: api 없이 server action 내에서 전부 처리하기
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
      pwcheck,
    }),
  })

  if (!res.ok) {
    const data: RegisterResponse = await res.json()
    console.log(formData.get("pwcheck"))
    newState.errors[data.error!.field] = data.error!.message
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

export interface CreateProblemState {
  title: string
  error?: string
}
export async function createProblemAction(
  prevState: CreateProblemState,
  formData: FormData
): Promise<CreateProblemState> {
  const newState: CreateProblemState = {
    title: formData.get("title") as string,
  }

  const parseRes = createProblemSchema.safeParse(newState)
  if (!parseRes.success) {
    newState.error = parseRes.error.issues[0].message
    return newState
  }

  const session = await auth()
  if (!session?.user) {
    newState.error = "not authenticated"
    return newState
  }

  await prisma.problem.create({
    data: {
      title: parseRes.data.title,
      legend: "문제 설명",
      inputFormat: "입력 형식 설명",
      outputFormat: "출력 형식 설명",

      authorId: session.user.id,
    },
  })

  redirect("/")
}
