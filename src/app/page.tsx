import { auth } from "@/auth"

export default async function Home() {
  const session = await auth()
  const user = session?.user

  return (
    <main className="flex flex-col w-1/2 m-auto text-center">
      <h1 className="text-3xl">
        {user ? `안녕하세요, ${user.handle}님!` : "어서오세요!"}
      </h1>
    </main>
  )
}
