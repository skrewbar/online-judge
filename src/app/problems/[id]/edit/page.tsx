import { prisma } from "@/lib/prisma"
import EditForm from "./EditForm"

export default async function Page() {
  const tags = await prisma.tag.findMany()

  return <EditForm allTags={tags.map((tag) => tag.name)} />
}
