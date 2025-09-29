"use client"

import { useActionState, useEffect, useState } from "react"
import { useProblem } from "@/contexts/ProblemContext"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { LoadingImage } from "@/components/ui/loading-image"
import { Plus, X } from "lucide-react"

import { editGeneralInfoAction } from "./actions"
import Image from "next/image"

import { intToDiff, getColorOfDiff } from "@/utils/difficulty"
import { Button } from "@/components/ui/button"

import { generalInfoSchema } from "./schemas"
import z from "zod"

interface EditFormProps {
  everyTags: string[]
}

export default function EditForm({ everyTags: allTags }: EditFormProps) {
  const problem = useProblem()

  const [state, formAction, isPending] = useActionState(editGeneralInfoAction, {})

  const [form, setForm] = useState({
    ...problem,
    tags: problem.tags.map((tag) => tag.name),
  })
  type GeneralInfoForm = z.infer<typeof generalInfoSchema>
  const updateForm = <K extends keyof GeneralInfoForm>(
    key: K,
    value: GeneralInfoForm[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  useEffect(() => {
    setForm({
      ...problem,
      tags: problem.tags.map((tag) => tag.name),
    })
  }, [problem])

  const addTag = (tag: string) => {
    updateForm("tags", [...form.tags, tag].sort())
  }

  return (
    <main className="flex justify-center items-center w-full">
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
            <input hidden name="id" defaultValue={`${problem.id}`}></input>
            <div className="flex items-center gap-3">
              <Checkbox
                name="isPublic"
                id="is-public"
                checked={form.isPublic}
                onCheckedChange={(v) => updateForm("isPublic", !!v)}
              />
              <Label htmlFor="is-public">공개</Label>
            </div>
            <div className="flex items-center gap-3">
              <Checkbox
                name="isSpecialJudge"
                id="is-special-judge"
                checked={form.isSpecialJudge}
                onCheckedChange={(v) => updateForm("isSpecialJudge", !!v)}
              />
              <Label htmlFor="is-special-judge">스페셜 저지</Label>
            </div>
            <div className="flex items-center gap-3">
              <Checkbox
                name="isInteractive"
                id="is-interactive"
                checked={form.isInteractive}
                onCheckedChange={(v) => updateForm("isInteractive", !!v)}
              />
              <Label htmlFor="is-interactive">인터랙티브</Label>
            </div>
            <div className="flex items-center gap-3">
              <Checkbox
                name="hasSubtask"
                id="has-subtask"
                checked={form.hasSubtask}
                onCheckedChange={(v) => updateForm("hasSubtask", !!v)}
              />
              <Label htmlFor="has-subtask">서브태스크</Label>
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="time-limit">시간 제한 (ms)</Label>
              <Input
                name="timeLimit"
                id="time-limit"
                type="number"
                value={form.timeLimit}
                onChange={(e) =>
                  updateForm("timeLimit", parseInt(e.target.value) || 0)
                }
              />
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="memory-limit">메모리 제한 (MiB)</Label>
              <Input
                name="memoryLimit"
                id="memory-limit"
                type="number"
                value={form.memoryLimit}
                onChange={(e) =>
                  updateForm("memoryLimit", parseInt(e.target.value) || 0)
                }
              ></Input>
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="difficulty">난이도</Label>
              <div className="flex flex-col items-center gap-3">
                <Image
                  width={50}
                  height={64}
                  alt={`${form.difficulty}`}
                  src={`https://static.solved.ac/tier_small/${form.difficulty}.svg`}
                ></Image>
                <p style={{ color: getColorOfDiff(form.difficulty) }}>
                  {intToDiff(form.difficulty)}
                </p>
                <Slider
                  id="difficulty"
                  name="difficulty"
                  max={30}
                  value={[form.difficulty]}
                  onValueChange={(value) => updateForm("difficulty", value[0])}
                />
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="tags">태그</Label>

              <div className="flex flex-wrap gap-2">
                {form.tags.map((tag, idx) => (
                  <Button
                    key={tag}
                    onClick={() =>
                      updateForm(
                        "tags",
                        form.tags.filter((_, i) => i != idx)
                      )
                    }
                    variant="outline"
                  >
                    {tag} <X />
                  </Button>
                ))}

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline">
                      태그 추가 <Plus />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <Command>
                      <CommandInput placeholder="태그 검색" />
                      <CommandList>
                        <CommandEmpty>결과 없음</CommandEmpty>
                        <CommandGroup>
                          {allTags.map(
                            (tag) =>
                              !form.tags.includes(tag) && (
                                <CommandItem
                                  key={tag}
                                  value={tag}
                                  onSelect={(value) => addTag(value)}
                                >
                                  {tag}
                                </CommandItem>
                              )
                          )}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>

                {/* hidden input for server actions */}
                {form.tags.map((tag, idx) => (
                  <input key={idx} type="hidden" name="tags" value={tag} />
                ))}
              </div>
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
