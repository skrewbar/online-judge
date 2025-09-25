"use client"

import { useActionState, useEffect, useState } from "react"
import { useProblem } from "../../ProblemContext"

import { editStatementsAction } from "./actions"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import z from "zod"
import { statementsSchema } from "./schemas"
import { Button } from "@/components/ui/button"
import { LoadingImage } from "@/components/ui/loading-image"

export default function EditForm() {
  const problem = useProblem()

  const [state, formAction, isPending] = useActionState(
    editStatementsAction,
    {}
  )

  const [form, setForm] = useState({
    ...problem,
  })
  type StatementsForm = z.infer<typeof statementsSchema>
  const updateForm = <K extends keyof StatementsForm>(
    key: K,
    value: StatementsForm[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  useEffect(() => {
    setForm({
      ...problem,
    })
  }, [problem])

  return (
    <main className="flex justify-center items-center w-full">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>지문</CardTitle>
          <CardDescription>문제의 지문을 수정할 수 있어요.</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            action={formAction}
            id="statements"
            className="flex flex-col gap-6"
          >
            <input hidden name="id" defaultValue={`${problem.id}`} />
            <div className="flex flex-col gap-3">
              <Label>문제</Label>
              <Textarea
                name="legend"
                value={form.legend}
                onChange={(e) => updateForm("legend", e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-3">
              <Label>입력</Label>
              <Textarea
                name="inputFormat"
                value={form.inputFormat}
                onChange={(e) => updateForm("inputFormat", e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-3">
              <Label>출력</Label>
              <Textarea
                name="outputFormat"
                value={form.outputFormat}
                onChange={(e) => updateForm("outputFormat", e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-3">
              <Label>노트</Label>
              <Textarea
                name="notes"
                value={form.notes || ""}
                onChange={(e) => updateForm("notes", e.target.value)}
              />
            </div>

            {state.error && <p className="text-red-500">{state.error}</p>}
            {state.success && <p className="text-green-600">저장 성공</p>}

            <Button disabled={isPending}>
              저장 {isPending && <LoadingImage />}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
