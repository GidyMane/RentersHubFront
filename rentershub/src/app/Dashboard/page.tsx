import DashboardLayout from '@/components/Test/Rentershub/DashbordLayout'
import LandlordDashboard from '@/components/Test/Rentershub/LandlordDashboard'
import React from 'react'

function page() {
  return (
    <div>
    <DashboardLayout>
      <LandlordDashboard/>
      </DashboardLayout>
    </div>
  )
}

export default page
