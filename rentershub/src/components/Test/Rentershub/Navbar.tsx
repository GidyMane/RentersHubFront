import React from 'react'
import { Menu, Bell, User } from 'lucide-react'
import { Button } from "@/components/ui/button"

interface NavbarProps {
  toggleSidebar: () => void
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  return (
    <header className="bg-white border-b">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="lg:hidden mr-2">
            <Menu className="h-6 w-6" />
          </Button>
          <span className="text-xl font-semibold text-[#1C4532] lg:hidden">RentersHub</span>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}

export default Navbar

