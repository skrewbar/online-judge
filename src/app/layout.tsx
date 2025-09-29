import { auth } from "@/auth"
import "./globals.css"
import NavigationBar from "./NavigationBar"

import { UserProvider } from "@/contexts/UserContext"
import { prisma } from "@/lib/prisma"

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth()
  const user = session?.user
    ? await prisma.user.findUnique({
        where: { id: session?.user.id },
      })
    : null

  return (
    <html lang="en">
      <body className="h-screen flex flex-col">
        <NavigationBar />
        <div className="flex-1">
          <UserProvider user={user}>{children}</UserProvider>
        </div>
      </body>
    </html>
  )
}
