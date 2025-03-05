'use client'

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Building, PlusSquare, User, LogOut, X, ArrowLeft
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { signOut } from "next-auth/react"
import { useTheme } from "next-themes"

interface SidebarProps {
  isOpen: boolean
  toggleSidebar: () => void
}

const menuItems = [
  { icon: Building, label: "My Properties", href: "/rentershub/properties" },
  { icon: PlusSquare, label: "Add Property", href: "/rentershub/add-property" },
  { icon: User, label: "Profile", href: "/rentershub/profile" },
]

export function Sidebar({ isOpen, toggleSidebar }: SidebarProps) {
  const pathname = usePathname()
  const { theme } = useTheme()

  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-50 h-full w-64 bg-[#1C4532] dark:bg-[#153726] text-white transition-transform lg:translate-x-0 lg:static",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )} style={{ fontFamily: "Georgia, serif" }}
    >
      <div className="flex flex-col h-full">
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-4 bg-[#153726] dark:bg-[#0D2419]">
          <Link href="/rentershub/Dashboard" className="flex items-center space-x-4">
            <Image src={theme === "dark" ? "/RH1.png" : "/RH1.png"} alt="RentersHub Logo" width={40} height={40} className="rounded-full" />
            <span className="text-xl font-bold">Renters Hub</span>
          </Link>
          {/* Hide close button on large screens */}
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="lg:hidden">
            <X className="h-6 w-6" />
          </Button>
        </div>

        {/* Sidebar Menu */}
        <ScrollArea className="flex-grow px-3 py-4">
          <nav className="space-y-1">
            <Link
              href="/"
              className="flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors text-gray-300 hover:bg-[#2C7A51] dark:hover:bg-[#1F5A3C] hover:text-white mb-4"
              onClick={toggleSidebar} // Hide sidebar when clicked
            >
              <ArrowLeft className="h-5 w-5 mr-3" />
              See Posted Houses
            </Link>
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  pathname === item.href ? "bg-[#2C7A51] dark:bg-[#1F5A3C] text-white" : "text-gray-300 hover:bg-[#2C7A51] dark:hover:bg-[#1F5A3C] hover:text-white",
                )}
                onClick={toggleSidebar} // Hide sidebar when clicked
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.label}
              </Link>
            ))}
          </nav>
        </ScrollArea>

        {/* Logout Button */}
        <div className="p-4 border-t border-[#2C7A51] dark:border-[#1F5A3C]">
          <Button
            variant="ghost"
            className="w-full justify-start text-gray-300 hover:bg-[#2C7A51] dark:hover:bg-[#1F5A3C] hover:text-white"
            onClick={async () => {
              await signOut({ callbackUrl: "/" })
            }}
          >
            <LogOut className="h-5 w-5 mr-3" />
            Log Out
          </Button>
        </div>
      </div>
    </div>
  )
}
