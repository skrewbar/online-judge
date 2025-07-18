"use server"

import { signIn, signOut } from "@/auth"
import { AuthError } from "next-auth"

export async function loginAction(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    const credentials = Object.fromEntries(formData.entries())
    await signIn("credentials", { ...credentials, redirectTo: "/" })
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "핸들 또는 비밀번호가 잘못되었어요."
        default:
          return "Something went wrong."
      }
    }
    throw error
  }
}

export async function logoutAction() {
  await signOut()
}
