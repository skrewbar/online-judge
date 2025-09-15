import Link from "next/link"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { auth } from "@/auth"
import { logoutAction } from "@/lib/actions"
import LoginLink from "./LoginLink"

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
        <NavigationMenuItem asChild>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link href="/problems">문제</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        {session?.user ? (
          <NavigationMenuItem asChild>
            <form action={logoutAction}>
              <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                <button className="cursor-pointer">로그아웃</button>
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
                <LoginLink />
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
