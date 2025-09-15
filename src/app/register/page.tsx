import { auth } from "@/auth"
import { redirect } from "next/navigation"
import RegisterForm from "./RegisterForm"

export default async function Page() {
  const session = await auth()
  if (session?.user) redirect("/")

  return <RegisterForm />
}
