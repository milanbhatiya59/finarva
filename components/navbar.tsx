"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Shield, Home, History, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const navigation = [
    { name: "Dashboard", href: "/", icon: Home },
    { name: "History", href: "/history", icon: History },
    { name: "Gurukul", href: "/gurukul", icon: Shield },
]

export function Navbar() {
    const pathname = usePathname()

    return (
        <header className="fixed top-0 z-50 w-full bg-white border-b border-gray-100">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo and Brand */}
                    <div className="flex items-center gap-4">
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
                    </div>

                    {/* Navigation Links */}
                    <nav className="hidden md:flex items-center">
                        <div className="flex space-x-8">
                            {navigation.map((item) => {
                                const Icon = item.icon
                                const isActive = pathname === item.href
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`
                                            flex items-center gap-2 text-sm font-medium transition-colors duration-200
                                            ${isActive
                                                ? "text-purple-600"
                                                : "text-gray-600 hover:text-gray-900"
                                            }
                                        `}
                                    >
                                        <Icon className="h-4 w-4" />
                                        {item.name}
                                    </Link>
                                )
                            })}
                        </div>
                    </nav>

                    {/* User Name */}
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-medium">
                            D
                        </div>
                        <span className="text-sm font-medium text-gray-700">Darpan</span>
                    </div>
                </div>
            </div>
        </header>
    )
} 