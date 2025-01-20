import { DashboardLayout } from '@/components/Test/Rentershub/DashbordLayout'
import { UnderConstruction } from '@/components/Test/Rentershub/Under-Construction'
import React from 'react'

const page = () => {
  return (
    <DashboardLayout>
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 p-4">
      
      <UnderConstruction/>
      
    </div>
    </DashboardLayout>
  )
}

export default page
