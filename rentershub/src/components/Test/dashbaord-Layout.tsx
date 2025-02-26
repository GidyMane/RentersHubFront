"use client"

import React, { useState, useEffect } from "react"
import { Home, Building, FileText, Settings, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

const Sidebar = ({ isOpen, toggleSidebar }: { isOpen: boolean, toggleSidebar: () => void }) => {
  const menuItems = [
    { icon: Home, label: "Dashboard" },
    { icon: Building, label: "Properties" },
    { icon: FileText, label: "Leases" },
    { icon: Settings, label: "Settings" },
  ]

  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#1C4532] text-white transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
    >
      <div className="flex items-center justify-between h-16 px-4 bg-[#153726]">
        <span className="text-xl font-semibold">Renters Hub</span>
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="lg:hidden">
          <X className="h-6 w-6" />
        </Button>
      </div>
      <nav className="mt-8">
        {menuItems.map((item, index) => (
          <a
            key={index}
            href="#"
            className="flex items-center px-4 py-2 text-gray-300 hover:bg-[#153726]"
          >
            <item.icon className="h-5 w-5 mr-3" />
            {item.label}
          </a>
        ))}
      </nav>
    </div>
  )
}

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [sidebarOpen])

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between px-4 py-3 bg-white border-b lg:hidden">
          <Button variant="ghost" size="icon" onClick={toggleSidebar}>
            <Menu className="h-6 w-6" />
          </Button>
          <span className="text-xl font-semibold text-[#1C4532]">Renters Hub</span>
          <div className="w-6"></div> {/* Placeholder for balance */}
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}

export default DashboardLayout
