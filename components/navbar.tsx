"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Home", href: "/" },
  { name: "Playground", href: "/playground" },
  { name: "Learning Modules", href: "/learning-module" },
  { name: "Leaderboard", href: "/leaderboard" },
]

export function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl font-bold text-primary">
              GromoV7
            </Link>
            <div className="hidden md:flex space-x-4">
              {navigation.map((item) => (
                <Button
                  key={item.name}
                  variant="ghost"
                  asChild
                  className={cn(
                    "text-muted-foreground hover:text-foreground",
                    pathname === item.href && "text-foreground bg-muted",
                  )}
                >
                  <Link href={item.href}>{item.name}</Link>
                </Button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary text-primary-foreground">👨‍💼</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">Darpan</span>
          </div>
        </div>
      </div>
    </nav>
  )
}
