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
<<<<<<< HEAD
    <div className="flex h-screen bg-gray-100">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-4 py-6">
            {children}
          </div>
=======
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
>>>>>>> da2dc9da5fc186335cc48ca707f8b25d5cfb93b6
        </main>
      </div>
    </div>
  )
}
<<<<<<< HEAD

=======
>>>>>>> da2dc9da5fc186335cc48ca707f8b25d5cfb93b6
