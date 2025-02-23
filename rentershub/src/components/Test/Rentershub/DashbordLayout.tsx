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
      <div className='flex justify-start items-start w-full'>


        <div className='fixed w-64 h-screen z-40'>
          <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        </div>


        <div className="flex flex-col relative md:ml-64 w-full">
          <Navbar toggleSidebar={toggleSidebar} isOpen={sidebarOpen} />

          <main className="bg-gray-100 overflow-y-auto container mx-auto">
            {children}

          </main>
        </div>
      </div>
    </>
  )
}

