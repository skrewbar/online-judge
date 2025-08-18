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
import { useActionState } from "react"
import { createProblemAction, CreateProblemState } from "./actions"
import { LoadingImage } from "@/components/ui/loading-image"

export default function ClientPage() {
  const initialState: CreateProblemState = { title: "" }
  const [state, formAction, isPending] = useActionState(
    createProblemAction,
    initialState
  )

  return (
    <main className="flex justify-center items-center h-full">
      <Card className="w-96">
        <CardHeader>
          <CardTitle>문제 만들기</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={formAction} id="create" className="flex flex-col gap-2">
            <Label htmlFor="title">제목</Label>
            <Input name="title" id="title" type="text" required />
          </form>
        </CardContent>
        <CardFooter>
          <div className="flex flex-col w-full gap-3">
            {state.error && (
              <p className="text-sm text-red-500">{state.error}</p>
            )}
            <Button disabled={isPending} form="create" className="w-full">
              {isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <LoadingImage className="h-4 w-4" />
                  만드는 중...
                </span>
              ) : (
                "만들기"
              )}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </main>
  )
}
