'use client'

<<<<<<< HEAD
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Building, PlusSquare, User, Settings, HelpCircle, LogOut, ChevronRight, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { signOut } from 'next-auth/react'
import { useTheme } from 'next-themes'
=======
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
>>>>>>> da2dc9da5fc186335cc48ca707f8b25d5cfb93b6

interface SidebarProps {
  isOpen: boolean
  toggleSidebar: () => void
}

const menuItems = [
<<<<<<< HEAD
  { icon: Home, label: 'Dashboard', href: '/rentershub/Dashboard' },
  { icon: Building, label: 'My Properties', href: '/rentershub/properties' },
  { icon: PlusSquare, label: 'Add Property', href: '/rentershub/add-property' },
  { icon: User, label: 'Profile', href: '/rentershub/profile' },
  { icon: Settings, label: 'Settings', href: '/rentershub/settings' },
  { icon: HelpCircle, label: 'Help & Support', href: '/rentershub/support' },
=======
  { icon: Building, label: "Dashboard", href: "/rentershub/Dashboard" },
  { icon: Building, label: "My Properties", href: "/rentershub/properties" },
  { icon: PlusSquare, label: "Add Property", href: "/rentershub/add-property" },
  { icon: User, label: "Profile", href: "/rentershub/profile" },
>>>>>>> da2dc9da5fc186335cc48ca707f8b25d5cfb93b6
]

export function Sidebar({ isOpen, toggleSidebar }: SidebarProps) {
  const pathname = usePathname()
  const { theme } = useTheme()

  return (
    <div
      className={cn(
<<<<<<< HEAD
        "fixed inset-y-0 left-0 z-50 w-64 bg-[#1C4532] dark:bg-[#153726] text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between h-16 px-4 bg-[#153726] dark:bg-[#0D2419]">
          <Link href="/rentershub/Dashboard" className="flex items-center space-x-4">
            <Image
              src={theme === 'dark' ? '/RH1.png' : '/RH1.png'}
              alt="RentersHub Logo"
              width={40}
              height={40}
              className="rounded-full"
            />
            <span className="text-xl font-bold">RentersHub</span>
          </Link>
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="lg:hidden">
            <X className="h-6 w-6" />
            <span className="sr-only">Close sidebar</span>
          </Button>
        </div>
        <ScrollArea className="flex-grow px-3 py-4">
          <nav className="space-y-1">
=======
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
>>>>>>> da2dc9da5fc186335cc48ca707f8b25d5cfb93b6
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
<<<<<<< HEAD
                  pathname === item.href
                    ? "bg-[#2C7A51] dark:bg-[#1F5A3C] text-white"
                    : "text-gray-300 hover:bg-[#2C7A51] dark:hover:bg-[#1F5A3C] hover:text-white"
                )}
              >
                <item.icon className="h-5 w-5 mr-3" aria-hidden="true" />
                {item.label}
                {pathname === item.href && (
                  <ChevronRight className="ml-auto h-4 w-4" aria-hidden="true" />
                )}
=======
                  pathname === item.href ? "bg-[#2C7A51] dark:bg-[#1F5A3C] text-white" : "text-gray-300 hover:bg-[#2C7A51] dark:hover:bg-[#1F5A3C] hover:text-white",
                )}
                onClick={toggleSidebar} // Hide sidebar when clicked
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.label}
>>>>>>> da2dc9da5fc186335cc48ca707f8b25d5cfb93b6
              </Link>
            ))}
          </nav>
        </ScrollArea>
<<<<<<< HEAD
=======

        {/* Logout Button */}
>>>>>>> da2dc9da5fc186335cc48ca707f8b25d5cfb93b6
        <div className="p-4 border-t border-[#2C7A51] dark:border-[#1F5A3C]">
          <Button
            variant="ghost"
            className="w-full justify-start text-gray-300 hover:bg-[#2C7A51] dark:hover:bg-[#1F5A3C] hover:text-white"
            onClick={async () => {
<<<<<<< HEAD
              await signOut()
            }}
          >
            <LogOut className="h-5 w-5 mr-3" aria-hidden="true" />
=======
              await signOut({ callbackUrl: "/" })
            }}
          >
            <LogOut className="h-5 w-5 mr-3" />
>>>>>>> da2dc9da5fc186335cc48ca707f8b25d5cfb93b6
            Log Out
          </Button>
        </div>
      </div>
    </div>
  )
}
<<<<<<< HEAD

=======
>>>>>>> da2dc9da5fc186335cc48ca707f8b25d5cfb93b6
