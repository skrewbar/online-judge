import { auth } from "@/auth"

export default async function Home() {
  const session = await auth()
  const user = session?.user

  return (
    <main className="flex flex-col w-1/2 m-auto text-center">
      <h1 className="text-3xl">안녕하세요, {user && user.handle}님!</h1>
    </main>
  )
}
