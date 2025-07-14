import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcrypt"

async function validateName(handle: string) {
  return (await prisma.user.findUnique({ where: { handle: handle } })) == null
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { handle, email, password } = body

    if (!handle || !email || !password)
      return NextResponse.json(
        {
          error: "필수 항목이 누락되었어요.",
        },
        { status: 400 }
      )
    if (!(await validateName(handle)))
      return NextResponse.json(
        {
          error: "이미 해당 핸들을 다른 유저가 사용 중이에요.",
        },
        { status: 409 }
      )
    if (!(await validateEmail(email)))
      return NextResponse.json(
        {
          error: "이미 해당 이메일을 다른 유저가 사용 중이에요.",
        },
        { status: 409 }
      )

    const hashedPassword = await bcrypt.hash(password, 11)

    await prisma.user.create({
      data: {
        handle: handle,
        email: email,
        password: hashedPassword,
      },
    })

    return NextResponse.redirect(new URL("/", request.url))
  } catch (error) {
    console.error("USER_REGISTER_POST_ERROR", error)
    return NextResponse.json(
      { error: "내부 서버에 오류가 발생했어요." },
      { status: 500 }
    )
  }
}
