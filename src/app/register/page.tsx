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
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function Page() {
  const router = useRouter()

  const [handle, setHandle] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [pwcheck, setPwcheck] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const register = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (password !== pwcheck) {
      setError("비밀번호가 일치하지 않아요.")
      return
    }

    const res = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        handle,
        email,
        password,
      }),
    })

    setIsLoading(false)
    if (res.redirected) router.push(res.url)
    else {
      const data = await res.json()
      setError(data.error || "알 수 없는 오류가 발생했습니다.")
    }
  }

  return (
    <main className="flex justify-center items-center min-h-screen">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-lg">회원가입</CardTitle>
          <CardDescription>
            핸들(사용자명)과 이메일은 가입 후 변경할 수 있습니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            id="register"
            onSubmit={register}
            className="flex flex-col gap-6"
          >
            <div className="grid gap-2">
              <Label htmlFor="handle">핸들</Label>
              <Input
                id="handle"
                type="text"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">비밀번호</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              ></Input>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="pwcheck">비밀번호 확인</Label>
              <Input
                id="pwcheck"
                type="password"
                value={pwcheck}
                onChange={(e) => setPwcheck(e.target.value)}
                required
              ></Input>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <div className="w-full flex flex-col gap-3">
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button form="register" type="submit">
              {isLoading ? (
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
