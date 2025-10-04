"use client"

import { getDiffImageSrc } from "@/utils/difficulty"

import Image from "next/image"
import MathText from "@/components/MathText"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

import {
  Fragment,
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react"
import CopyButton from "@/components/CopyButton"

import { Code } from "lucide-react"
import { useProblem } from "@/contexts/ProblemContext"
import { useUser } from "@/contexts/UserContext"

import languages from "@/config/languages.json" with { type: "json" }

import MonacoEditor from "@monaco-editor/react"

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"

import { SendHorizonal } from "lucide-react"

function ProblemPage() {
  const problem = useProblem()
  const examples = problem.testCases.filter((tc) => tc.isSample)

  return (
    <>
      <section>
        <p className="text-2xl flex">
          {problem.id}번:
          <Image
            alt={`${problem.difficulty}`}
            src={getDiffImageSrc(problem.difficulty)}
            width={17}
            height={34}
            className="mx-1"
          />
          {problem.title}
        </p>
        <span className="mr-5">
          시간 제한: {(problem.timeLimit / 1000).toFixed(3)}초
        </span>
        <span>메모리 제한: {problem.memoryLimit}MB</span>
        <hr />
      </section>

      <section>
        <h1 className="text-2xl">문제</h1>
        <hr />
        <MathText>{problem.legend}</MathText>
      </section>

      <section>
        <h1 className="text-2xl">입력 형식</h1>
        <hr />
        <MathText>{problem.inputFormat}</MathText>
      </section>

      <section>
        <h1 className="text-2xl">출력 형식</h1>
        <hr />
        <MathText>{problem.outputFormat}</MathText>
      </section>

      {problem.hasSubtask && (
        <section>
          <h1 className="text-2xl">서브태스크</h1>
          <hr />

          <Table className="w-fit mx-auto mt-3 border">
            <TableHeader>
              <TableRow>
                <TableHead className="border-r text-center">번호</TableHead>
                <TableHead className="border-r text-center">점수</TableHead>
                <TableHead className="text-center">제한</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {problem.subTasks.map((subtask) => (
                <TableRow key={subtask.subtaskNumber}>
                  <TableCell className="border-r text-center">
                    {subtask.subtaskNumber}
                  </TableCell>
                  <TableCell className="border-r text-center">
                    {subtask.score}
                  </TableCell>
                  <TableCell className="text-center">
                    <MathText>{subtask.limit}</MathText>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </section>
      )}

      {examples.map((example, idx) => (
        <Fragment key={idx}>
          <section>
            <h1 className="text-2xl flex items-center gap-2">
              예제 입력 {idx + 1}
              <CopyButton value={example.input} />
            </h1>
            <hr />
            <code className="block p-2 bg-gray-200">{example.input}</code>
          </section>
          <section>
            <h1 className="text-2xl flex items-center gap-2">
              예제 출력 {idx + 1}
              <CopyButton value={example.output} />
            </h1>
            <hr />
            <code className="block p-2 bg-gray-200">{example.output}</code>
          </section>
        </Fragment>
      ))}
    </>
  )
}

function SubmissionsPage() {
  // TODO
  const pageSize = 10
}

export default function Page() {
  const [active, setActive] = useState(["editor"])

  const user = useUser()
  const [lang, setLang] = useState("cpp")
  const langNames = Object.keys(languages) as (keyof typeof languages)[]
  const [source, setSource] = useState("")

  return (
    <main className="w-full flex h-full">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={50} className="m-5 flex flex-col gap-5">
          <ToggleGroup
            value={active}
            onValueChange={(v) => setActive(v)}
            variant="outline"
            type="multiple"
          >
            <ToggleGroupItem value="editor">
              <Code />
            </ToggleGroupItem>
          </ToggleGroup>

          <ProblemPage />
        </ResizablePanel>
        {active.includes("editor") && (
          <>
            <ResizableHandle className="border" />
            <ResizablePanel
              onResize={(size) =>
                size < 10 && setActive(active.filter((v) => v !== "editor"))
              }
              defaultSize={50}
              maxSize={75}
              // minSize={25}
              className="h-full"
            >
              {user ? (
                <div className="flex flex-col gap-3 h-full">
                  <MonacoEditor
                    className="m-2.5 flex-1"
                    options={{
                      automaticLayout: true,
                      fontSize: 16,
                      minimap: { enabled: false },
                    }}
                    language={lang}
                    value={source}
                    onChange={(v) => v && setSource(v)}
                  />
                  <div className="m-5 flex gap-3">
                    <Select value={lang} onValueChange={(v) => setLang(v)}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="언어" />
                      </SelectTrigger>
                      <SelectContent>
                        {langNames.map((lang) => (
                          <SelectItem key={lang} value={lang}>
                            <div className="flex justify-between gap-5">
                              {languages[lang].name} ({languages[lang].version})
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button>
                      제출 <SendHorizonal />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="h-full flex justify-center items-center">
                  <p>로그인 해야 코드를 제출할 수 있어요.</p>
                </div>
              )}
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>
    </main>
  )
}
