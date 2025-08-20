"use server"

import { registerSchema } from "./schemas"
import z from "zod"
import { redirect } from "next/navigation"
import bcrypt from "bcrypt"
import { prisma } from "@/lib/prisma"
import { PrismaClientKnownRequestError } from "@/generated/prisma/runtime/library"

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

export async function registerAction(prevState: RegisterState, formData: FormData) {
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

  const { handle, email, password } = schemaParseRes.data

  const hashedPassword = await bcrypt.hash(password, 11)

  try {
    await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: { handle, email, password: hashedPassword },
      })

      await tx.handleHistory.create({
        data: {
          handle,
          userId: user.id,
        },
      })
    })
  } catch (error) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      newState.errors.form =
        "다른 유저가 해당 핸들이나 이메일을 사용하고 있어요."
    }

    throw error
  }

  redirect("/login")
}
