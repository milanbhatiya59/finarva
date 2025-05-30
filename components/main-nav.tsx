"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Shield, Home, History, User, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const navigation = [
  { name: "Dashboard", href: "/", icon: Home, color: "from-blue-500 to-cyan-500" },
  { name: "History", href: "/history", icon: History, color: "from-purple-500 to-pink-500" },
  { name: "Insurances", href: "/insurances", icon: Shield, color: "from-green-500 to-emerald-500" },
]

export function MainNav() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  InsureFlow
                </span>
                <Badge className="ml-2 bg-gradient-to-r from-orange-400 to-red-400 text-white text-xs">Pro</Badge>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-2">
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Button
                    key={item.name}
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    asChild
                    className={
                      isActive
                        ? `bg-gradient-to-r ${item.color} text-white shadow-lg hover:shadow-xl transition-all duration-300`
                        : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                    }
                  >
                    <Link href={item.href} className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      {item.name}
                    </Link>
                  </Button>
                )
              })}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="border-2 border-purple-200 text-purple-600 hover:bg-purple-50"
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button
              size="sm"
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg"
            >
              <User className="h-4 w-4 mr-2" />
              Profile
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
