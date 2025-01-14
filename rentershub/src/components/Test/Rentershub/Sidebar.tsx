'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Building, PlusSquare, User, Settings, HelpCircle, LogOut, ChevronRight, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface SidebarProps {
  isOpen: boolean
  toggleSidebar: () => void
}

const menuItems = [
  { icon: Home, label: 'Dashboard', href: '/Dashboard' },
  { icon: Building, label: 'My Properties', href: '/properties' },
  { icon: PlusSquare, label: 'Add Property', href: '/add-property' },
  { icon: User, label: 'Profile', href: '/profile' },
  { icon: Settings, label: 'Settings', href: '#' },
  { icon: HelpCircle, label: 'Help & Support', href: '#' },
]

export function Sidebar({ isOpen, toggleSidebar }: SidebarProps) {
  const pathname = usePathname()

  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-[#1C4532] text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between h-16 px-4 bg-[#153726]">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <Building className="h-8 w-8" />
            <span className="text-xl font-bold">RentersHub</span>
          </Link>
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="lg:hidden">
            <X className="h-6 w-6" />
          </Button>
        </div>
        <ScrollArea className="flex-grow px-3 py-4">
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  pathname === item.href
                    ? "bg-[#2C7A51] text-white"
                    : "text-gray-300 hover:bg-[#2C7A51] hover:text-white"
                )}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.label}
                {pathname === item.href && (
                  <ChevronRight className="ml-auto h-4 w-4" />
                )}
              </Link>
            ))}
          </nav>
        </ScrollArea>
        <div className="p-4 border-t border-[#2C7A51]">
          <Button
            variant="ghost"
            className="w-full justify-start text-gray-300 hover:bg-[#2C7A51] hover:text-white"
          >
            <LogOut className="h-5 w-5 mr-3" />
            Log Out
          </Button>
        </div>
      </div>
    </div>
  )
}

