'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Home, CheckIcon as HomeCheck, HomeIcon as HomeX, Clock } from 'lucide-react'
import DashboardLayout from './dashbaord-Layout'


const DashboardCard = ({ title, value, icon: Icon, description }: { title: string, value: number, icon: React.ElementType, description: string }) => (
  <Card className="bg-white">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
      <Icon className="h-4 w-4 text-[#1C4532]" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-[#1C4532]">{value}</div>
      <p className="text-xs text-gray-500">{description}</p>
    </CardContent>
  </Card>
)

const LandlordDashboard = () => {
  // This data would typically come from an API or state management
  const dashboardData = {
    totalProperties: 15,
    vacantProperties: 3,
    occupiedProperties: 11,
    awaitingApproval: 1
  }

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1C4532] mb-6">Landlord Dashboard</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <DashboardCard 
              title="Total Properties" 
              value={dashboardData.totalProperties}
              icon={Home}
              description="All properties under management"
            />
            <DashboardCard 
              title="Vacant Properties" 
              value={dashboardData.vacantProperties}
              icon={HomeX}
              description="Properties available for rent"
            />
            <DashboardCard 
              title="Occupied Properties" 
              value={dashboardData.occupiedProperties}
              icon={HomeCheck}
              description="Properties currently rented"
            />
            <DashboardCard 
              title="Awaiting Approval" 
              value={dashboardData.awaitingApproval}
              icon={Clock}
              description="Properties pending verification"
            />
          </div>

          {/* Additional dashboard content can be added here */}
          <div className="mt-8 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-[#1C4532] mb-4">Recent Activity</h2>
            <p className="text-gray-600">No recent activity to display.</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default LandlordDashboard

