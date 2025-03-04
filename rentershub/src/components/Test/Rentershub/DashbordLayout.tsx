'use client'

import React, { useState } from 'react'
import { Sidebar } from './Sidebar'
import { Navbar } from './Navbar'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

  return (
    <div className="flex h-screen">
      {/* Sidebar: Always visible on large screens, toggle on small screens */}
      <div className={`lg:w-64 ${sidebarOpen ? "block" : "hidden lg:block"}`}>
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col w-full">
        <Navbar toggleSidebar={toggleSidebar} isOpen={sidebarOpen} />

        <main className="flex-1 bg-gray-100 overflow-y-auto container mx-auto p-4">
          {children}
        </main>
      </div>
    </div>
  )
}
