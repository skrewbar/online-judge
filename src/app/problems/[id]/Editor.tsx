"use client"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import MonacoEditor from "@monaco-editor/react"
import { SendHorizonal } from "lucide-react"

import languages from "@/config/languages.json" with { type: "json" }
import { useState } from "react"

export default function Editor() {
  const [lang, setLang] = useState("cpp")

  const langNames = Object.keys(languages) as (keyof typeof languages)[]

  return (
    <div className="flex-1 flex flex-col gap-3">
      <MonacoEditor
        className="m-2.5 flex-1"
        options={{ automaticLayout: true, fontSize: 16 }}
        language={lang}
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
  )
}
