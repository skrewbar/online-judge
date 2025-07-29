import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcrypt"
import { RegisterField, RegisterResponse } from "@/types/api"
import { registerSchema } from "@/lib/zod"
import { ZodError } from "zod"
import { PrismaClientKnownRequestError } from "@/generated/prisma/runtime/library"

export async function POST(
  request: NextRequest
): Promise<NextResponse<RegisterResponse>> {
  try {
    const body = await request.json()
    const { handle, email, password } = await registerSchema.parseAsync(body)

    const hashedPassword = await bcrypt.hash(password, 11)

    await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          handle,
          email,
          password: hashedPassword,
        },
      })

      await tx.handleHistory.create({
        data: {
          handle,
          userId: user.id,
        },
      })
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: error.issues[0].message,
            field: String(error.issues[0].path[0]) as RegisterField,
          },
        },
        { status: 400 }
      )
    }

    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code == "P2002"
    ) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: "해당 핸들이나 이메일을 다른 유저가 사용하고 있어요.",
            field: "form",
          },
        },
        { status: 409 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: {
          message:
            "내부 서버에 오류가 발생했어요. 다시 시도해 보시거나 관리자에게 문의해 주세요.",
          field: "form",
        },
      },
      { status: 500 }
    )
  }
}
