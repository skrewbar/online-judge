import { redirect } from "next/navigation"
import LoginForm from "./LoginForm"
import { auth } from "@/auth"

interface PageProps {
  searchParams: Promise<{
    redirect?: string
  }>
}

export default async function Page({ searchParams }: PageProps) {
  const session = await auth()
  const redirectURL = (await searchParams).redirect ?? "/"

  if (session?.user) redirect(redirectURL)

  return <LoginForm redirect={redirectURL}></LoginForm>
}
