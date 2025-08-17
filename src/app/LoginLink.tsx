"use client"

import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"

import { useEffect, useState } from "react"

interface LoginLinkProps {
  className?: string
}

export default function LoginLink({ className }: LoginLinkProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <Link href="/login" className={className}>로그인</Link>

  const query = searchParams.toString()
  const fullPath = query ? `${pathname}?${query}` : pathname

  return (
    <Link href={`/login?redirect=${fullPath}`} className={className}>
      로그인
    </Link>
  )
}
