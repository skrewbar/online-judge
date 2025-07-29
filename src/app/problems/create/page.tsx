import { auth } from "@/auth"
import { redirect } from "next/navigation"
import FormCard from "./FormCard"

export default async function Page() {
  const session = await auth()
  if (!session?.user) redirect("/login")

  return <FormCard />
}
