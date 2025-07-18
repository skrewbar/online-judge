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
import { registerAction, RegisterState } from "@/lib/actions"

export default function Page() {
  const initialState: RegisterState = {}
  const [state, formAction, isPending] = useActionState(
    registerAction,
    initialState
  )

  return (
    <main className="flex justify-center items-center min-h-screen">
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
                defaultValue={state.handle}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">이메일</Label>
              <Input
                name="email"
                id="email"
                type="email"
                defaultValue={state.email}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">비밀번호</Label>
              <Input
                name="password"
                id="password"
                type="password"
                required
              ></Input>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="pwcheck">비밀번호 확인</Label>
              <Input
                name="pwcheck"
                id="pwcheck"
                type="password"
                required
              ></Input>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <div className="w-full flex flex-col gap-3">
            {state.error && (
              <p className="text-sm text-red-500">{state.error}</p>
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
