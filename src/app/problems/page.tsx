import { getPaginatedProblems } from "@/lib/db/problems"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

const disabledStyle = "pointer-events-none opacity-50"
interface PageProps {
  searchParams: Promise<{
    page?: string
  }>
}

const pageSize = 10

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams
  const page = parseInt(params.page ?? "1")

  const { problems, totalCount } = await getPaginatedProblems(page, pageSize)

  const totalPages = Math.ceil(totalCount / pageSize)

  const prevPages = []
  if (page - 2 > 0) prevPages.push(page - 2)
  if (page - 1 > 0) prevPages.push(page - 1)

  const nextPages = []
  if (page + 1 <= totalPages) nextPages.push(page + 1)
  if (page + 2 <= totalPages) nextPages.push(page + 2)

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

        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href={page === 1 ? "#" : `/problems?page=${page - 1}`}
                className={page === 1 ? disabledStyle : undefined}
              />
            </PaginationItem>
            {page > 3 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            {prevPages.map((prevPage) => (
              <PaginationItem key={prevPage}>
                <PaginationLink href={`/problems?page=${prevPage}`}>
                  {prevPage}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationLink href="#" isActive>
                {page}
              </PaginationLink>
            </PaginationItem>

            {nextPages.map((nextPage) => (
              <PaginationItem key={nextPage}>
                <PaginationLink href={`/problems?page=${nextPage}`}>
                  {nextPage}
                </PaginationLink>
              </PaginationItem>
            ))}
            {page + 2 < totalPages && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            <PaginationItem>
              <PaginationNext
                href={page === totalPages ? "#" : `/problems?page=${page + 1}`}
                className={page === totalPages ? disabledStyle : undefined}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </main>
  )
}
