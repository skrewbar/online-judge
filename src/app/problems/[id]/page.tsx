import { prisma } from "@/lib/prisma"
import { getDiffImageSrc } from "@/utils/difficulty"

import Image from "next/image"

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function Page({ params }: PageProps) {
  const { id } = await params
  const problemId = parseInt(id)

  const problem = (await prisma.problem.findUnique({
    where: { id: problemId },
    include: { tags: true, author: true, testCases: true, subTasks: true },
  }))!
  const examples = problem.testCases.filter((tc) => tc.isSample)

  return (
    <main>
      <div className="w-full flex flex-col justify-center items-center">
        <p className="text-2xl flex gap-1 justify-center">
          {problem.id}번:<span> </span>
          <Image
            alt={`${problem.difficulty}`}
            src={getDiffImageSrc(problem.difficulty)}
            width={17}
            height={34}
          />
          {problem.title}
        </p>
        <p>시간 제한: {(problem.timeLimit / 1000).toFixed(3)}초</p>
        <p>메모리 제한: {problem.memoryLimit}MB</p>
      </div>
    </main>
  )
}
