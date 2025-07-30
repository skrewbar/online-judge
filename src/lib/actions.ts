"use server"

import { signIn, signOut } from "@/auth"
import { AuthError } from "next-auth"
import { redirect } from "next/navigation"
import { loginSchema, createProblemSchema } from "./zod"
import { ZodError } from "zod"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

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
