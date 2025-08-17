import { getPaginatedProblems } from "@/lib/db/problems"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface PageProps {
  searchParams: Promise<{
    page?: number
  }>
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams
  const page = params.page ?? 1

  const problems = await getPaginatedProblems(page, 10)

  return (
    <main className="flex justify-center">
      <div className="w-1/2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>번호</TableHead>
              <TableHead>난이도</TableHead>
              <TableHead>제목</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {problems.map((problem) => (
              <TableRow key={problem.id}>
                <TableCell>{problem.id}</TableCell>
                <TableCell>{problem.difficulty}</TableCell>
                <TableCell>{problem.title}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </main>
  )
}
