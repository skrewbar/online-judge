import { auth } from "@/auth"
import { redirect } from "next/navigation"
import ClientPage from "./ClientPage"

export default async function Page() {
  const session = await auth()
  if (session?.user) redirect("/")

  return <ClientPage />
}
