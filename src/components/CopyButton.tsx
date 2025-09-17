"use client"

import { useState } from "react"
import { Clipboard, ClipboardCheck } from "lucide-react"

type CopyButtonProps = {
  value: string
}

export default function CopyButton({ value }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  return (
    <button
      onClick={async () => {
        await navigator.clipboard.writeText(value)
        setCopied(true)

        setTimeout(() => setCopied(false), 2000)
      }}
    >
      {copied ? <ClipboardCheck /> : <Clipboard />}
    </button>
  )
}
