import Link from "next/link"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { auth } from "@/auth"
import { Button } from "@/components/ui/button"
import { logoutAction } from "@/lib/actions"

export default async function NavigationBar() {
  const session = await auth()

  return (
    <NavigationMenu viewport={false} className="min-w-full h-10">
      <NavigationMenuList>
        <NavigationMenuItem asChild>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link href="/">홈</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        {session?.user ? (
          <NavigationMenuItem asChild>
            <form action={logoutAction}>
              <NavigationMenuLink asChild>
                <button>로그아웃</button>
              </NavigationMenuLink>
            </form>
          </NavigationMenuItem>
        ) : (
          <>
            <NavigationMenuItem asChild>
              <NavigationMenuLink
                asChild
                className={navigationMenuTriggerStyle()}
              >
                <Link href="/login">로그인</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem asChild>
              <NavigationMenuLink
                asChild
                className={navigationMenuTriggerStyle()}
              >
                <Link href="/register">회원가입</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </>
        )}
      </NavigationMenuList>
    </NavigationMenu>
  )
}
