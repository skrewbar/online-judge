"use client"

import { useActionState, useState } from "react"
import { useProblem } from "./ProblemContext"

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"

import type { GeneralInfoState } from "./actions"
import { editAction } from "./actions"
import Image from "next/image"

import { intToDiff, getColorOfDiff } from "@/utils/difficulty"

export default function Page() {
  const problem = useProblem()

  const initialState: GeneralInfoState = {
    id: problem.id,
    isPublic: problem.isPublic,
    timeLimit: problem.timeLimit,
    memoryLimit: problem.memoryLimit,
    difficulty: problem.difficulty,
    tags: problem.tags.map((tag) => tag.name),
    isSpecialJudge: problem.isSpecialJudge,
    isInteractive: problem.isInteractive,
    hasSubtask: problem.hasSubtask,
  }

  const [state, formAction, isPending] = useActionState(
    editAction,
    initialState
  )

  const [difficulty, setDifficulty] = useState(state.difficulty)

  return (
    <main className="flex justify-center items-center h-5/6">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>일반</CardTitle>
          <CardDescription>
            문제와 관련된 정보들을 수정할 수 있어요.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            action={formAction}
            id="general"
            className="flex flex-col gap-6"
          >
            <div className="flex items-center gap-3">
              <Checkbox
                name="id-public"
                id="is-public"
                defaultChecked={state.isPublic}
              />
              <Label htmlFor="is-public">공개</Label>
            </div>
            <div className="flex items-center gap-3">
              <Checkbox
                name="id-public"
                id="is-public"
                defaultChecked={state.isSpecialJudge}
              />
              <Label htmlFor="is-public">스페셜 저지</Label>
            </div>
            <div className="flex items-center gap-3">
              <Checkbox
                name="id-public"
                id="is-public"
                defaultChecked={state.isInteractive}
              />
              <Label htmlFor="is-public">인터랙티브</Label>
            </div>{" "}
            <div className="flex items-center gap-3">
              <Checkbox
                name="id-public"
                id="is-public"
                defaultChecked={state.hasSubtask}
              />
              <Label htmlFor="is-public">서브태스크</Label>
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="time-limit">시간 제한 (ms)</Label>
              <Input
                name="time-limit"
                id="time-limit"
                type="number"
                defaultValue={state.timeLimit}
              />
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="memory-limit">메모리 제한 (MiB)</Label>
              <Input
                name="memory-limit"
                id="memory-limit"
                type="number"
                defaultValue={state.memoryLimit}
              ></Input>
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="difficulty">난이도</Label>
              <div className="flex flex-col items-center gap-3">
                <Image
                  width={50}
                  height={64}
                  alt={`${difficulty}`}
                  src={`https://static.solved.ac/tier_small/${difficulty}.svg`}
                ></Image>
                <p style={{ color: getColorOfDiff(difficulty) }}>
                  {intToDiff(difficulty)}
                </p>
                <Slider
                  id="difficulty"
                  name="difficulty"
                  max={30}
                  defaultValue={[difficulty]}
                  onValueChange={(value) => {
                    setDifficulty(value[0])
                  }}
                />
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
