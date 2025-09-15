"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { LoadingImage } from "@/components/ui/loading-image"
import { useActionState } from "react"
import { RegisterState, registerAction } from "./actions"

export default function RegisterForm() {
  const initialState: RegisterState = { formData: {}, errors: {} }
  const [state, formAction, isPending] = useActionState(
    registerAction,
    initialState
  )

  return (
    <main className="flex justify-center items-center h-full">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-lg">회원가입</CardTitle>
          <CardDescription>
            핸들(사용자명)과 이메일은 가입 후 변경할 수 있어요.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            id="register"
            action={formAction}
            className="flex flex-col gap-6"
          >
            <div className="grid gap-2">
              <Label htmlFor="handle">핸들</Label>
              <Input
                name="handle"
                id="handle"
                type="text"
                defaultValue={state.formData.handle}
              />
              {state.errors.handle && (
                <p className="text-sm text-red-500">{state.errors.handle}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">이메일</Label>
              <Input
                name="email"
                id="email"
                type="email"
                defaultValue={state.formData.email}
              />
              {state.errors.email && (
                <p className="text-sm text-red-500">{state.errors.email}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">비밀번호</Label>
              <Input name="password" id="password" type="password" />
              {state.errors.password && (
                <p className="text-sm text-red-500">{state.errors.password}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="pwcheck">비밀번호 확인</Label>
              <Input name="pwcheck" id="pwcheck" type="password" />
              {state.errors.pwcheck && (
                <p className="text-sm text-red-500">{state.errors.pwcheck}</p>
              )}
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <div className="w-full flex flex-col gap-3">
            {state.errors.form && (
              <p className="text-sm text-red-500">{state.errors.form}</p>
            )}
            <Button disabled={isPending} form="register" type="submit">
              {isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <LoadingImage className="h-4 w-4" />
                  가입 중...
                </span>
              ) : (
                "가입"
              )}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </main>
  )
}
