import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcrypt"
import { RegisterResponse } from "@/types/api"

async function validateHandle(handle: string) {
  return (
    (await prisma.handleHistory.findUnique({ where: { handle: handle } })) ==
    null
  )
}
async function validateEmail(email: string) {
  return (
    (await prisma.user.findUnique({
      where: {
        email: email,
      },
    })) == null
  )
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<RegisterResponse>> {
  try {
    const body = await request.json()
    const { handle, email, password } = body

    if (!handle || !email || !password)
      return NextResponse.json(
        {
          success: false,
          error: { message: "필수 항목이 누락되었어요.", label: "form" },
        },
        { status: 400 }
      )
    if (!(await validateHandle(handle)))
      return NextResponse.json(
        {
          success: false,
          error: {
            message: "다른 유저가 해당 핸들을 사용하고 있어요.",
            label: "handle",
          },
        },
        { status: 409 }
      )
    if (!(await validateEmail(email)))
      return NextResponse.json(
        {
          success: false,
          error: {
            message: "다른 유저가 해당 이메일을 사용하고 있어요.",
            label: "email",
          },
        },
        { status: 409 }
      )

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
    console.error("USER_REGISTER_POST_ERROR", error)
    return NextResponse.json(
      {
        success: false,
        error: {
          message:
            "내부 서버에 오류가 발생했어요. 다시 시도해 보시거나 관리자에게 문의해 주세요.",
          label: "form",
        },
      },
      { status: 500 }
    )
  }
}
