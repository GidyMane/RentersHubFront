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
    <div className="flex w-full">
      {/* Render sidebar only when it's open */}
      {sidebarOpen && (
        <div className="fixed w-64 h-screen z-40">
          <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        </div>
      )}

      <div className={`flex flex-col w-full transition-all ${sidebarOpen ? 'md:ml-64' : ''}`}>
        <Navbar toggleSidebar={toggleSidebar} isOpen={sidebarOpen} />

        <main className="bg-gray-100 overflow-y-auto container mx-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
