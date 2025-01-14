'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Building, PlusSquare, User, X } from 'lucide-react'
import { Button } from "@/components/ui/button"

interface SidebarProps {
  isOpen: boolean
  toggleSidebar: () => void
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const pathname = usePathname()
  
  const menuItems = [
    { icon: Home, label: 'Dashboard', href: '/dashboard' },
    { icon: Building, label: 'My Properties', href: '/properties' },
    { icon: PlusSquare, label: 'Add Property', href: '/add-property' },
    { icon: User, label: 'Profile', href: '/profile' },
  ]

  return (
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#1C4532] text-white transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
      <div className="flex items-center justify-between h-16 px-4 bg-[#153726]">
        <span className="text-xl font-semibold">RentersHub</span>
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="lg:hidden">
          <X className="h-6 w-6" />
        </Button>
      </div>
      <nav className="mt-8">
        {menuItems.map((item, index) => (
          <Link key={index} href={item.href} className={`flex items-center px-4 py-2 text-gray-300 hover:bg-[#153726] ${pathname === item.href ? 'bg-[#153726] text-white' : ''}`}>
            <item.icon className="h-5 w-5 mr-3" />
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  )
}

export default Sidebar

