"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import React, { useActionState } from "react"
import { LoadingImage } from "@/components/ui/loading-image"
import { loginAction, LoginState } from "./actions"

export default function Form({ redirect }: { redirect: string }) {
  const initialState: LoginState = { redirect }
  const [state, formAction, isPending] = useActionState(
    loginAction,
    initialState
  )

  return (
    <main className="flex justify-center items-center h-full">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-lg">로그인</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={formAction} id="login" className="flex flex-col gap-6">
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
              <Label htmlFor="password">비밀번호</Label>
              <Input name="password" id="password" type="password" required />
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <div className="w-full flex flex-col gap-3">
            {state.error && (
              <p className="text-sm text-red-500">{state.error}</p>
            )}
            <Button disabled={isPending} form="login" type="submit">
              {isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <LoadingImage className="h-4 w-4" />
                  로그인 중...
                </span>
              ) : (
                "로그인"
              )}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </main>
  )
}
