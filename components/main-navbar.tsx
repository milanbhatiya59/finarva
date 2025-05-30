"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export function MainNavbar() {
  const pathname = usePathname()

  const isActive = (path) => {
    return pathname === path ? "bg-indigo-700" : ""
  }

  return (
    <nav className="bg-indigo-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <span className="text-white text-xl font-bold">GromoV3</span>
            </Link>
          </div>
          <div className="flex space-x-4">
            <Link href="/" className={`text-white px-3 py-2 rounded-md text-sm font-medium ${isActive("/")}`}>
              Home
            </Link>
            <Link
              href="/history"
              className={`text-white px-3 py-2 rounded-md text-sm font-medium ${isActive("/history")}`}
            >
              History
            </Link>
            <Link
              href="/insurances"
              className={`text-white px-3 py-2 rounded-md text-sm font-medium ${isActive("/insurances")}`}
            >
              Insurances
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
