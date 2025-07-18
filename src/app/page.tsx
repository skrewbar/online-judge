import { auth } from "@/auth"
import { Button } from "@/components/ui/button"
import { logoutAction } from "@/lib/actions"

export default async function Home() {
  const session = await auth()

  return (
    <main className="flex flex-col w-1/2 m-auto text-center">
      <h1 className="text-3xl">안녕하세요</h1>
      <p>안녕하다는뜻</p>

      <form action={logoutAction}>
        {session?.user && <Button type="submit">로그아웃하기</Button>}
      </form>
    </main>
  )
}
