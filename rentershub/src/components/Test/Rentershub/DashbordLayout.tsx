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
    <>
    <div className='flex justify-between w-full'>


      <div className='h-screen'>
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      </div>


      <div className="flex flex-col w-full relative">
        <Navbar toggleSidebar={toggleSidebar} />
        <main className="flex-1 bg-gray-100">
          <div className="container mx-auto px-4 py-6">
            {children}
          </div>
        </main>
      </div>
      </div>
    </>
  )
}

