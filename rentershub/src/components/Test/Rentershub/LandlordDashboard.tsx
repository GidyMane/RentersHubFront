'use client'

<<<<<<< HEAD
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Home, CheckCircle, HomeIcon, Clock } from 'lucide-react'

const DashboardCard = ({ title, value, icon: Icon, description }: { title: string, value: number, icon: React.ElementType, description: string }) => (
=======
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Home, CheckCircle, HomeIcon, Clock } from 'lucide-react'
import { baseUrl } from "@/utils/constants"

interface DashboardCardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  description: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, icon: Icon, description }) => (
>>>>>>> da2dc9da5fc186335cc48ca707f8b25d5cfb93b6
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
<<<<<<< HEAD
  // This data would typically come from an API or state management
  const dashboardData = {
    totalProperties: 15,
    vacantProperties: 3,
    occupiedProperties: 11,
    awaitingApproval: 1
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1C4532] mb-6">Landlord Dashboard</h1>
=======
  const { data: session } = useSession();
  const userId = session?.user?.user_id;

  const [dashboardData, setDashboardData] = useState({
    totalProperties: 0,
    vacantProperties: 0,
    approvedProperties: 0,
    awaitingApproval: 0
  })

  useEffect(() => {
    if (userId) {
      const fetchDashboardData = async () => {
        try {
          const response = await axios.get(`${baseUrl}listing/${userId}/getsummarybylandlordorgroundagent/`, {
            headers: {
              Authorization: `Bearer ${session?.user?.accessToken}`
            }
          })
          console.log(response.data, "data");
          
          const { total_properties, approved_properties, pending_properties } = response.data;
          setDashboardData({
            totalProperties: total_properties,
            approvedProperties: approved_properties,
            awaitingApproval: pending_properties,
            vacantProperties: total_properties - approved_properties // Assuming vacant = total - approved
          });
        } catch (error) {
          console.error("Error fetching dashboard data:", error);
        }
      };
      fetchDashboardData();
    }
  }, [userId, session]);

  return (
    <div className="p-4 sm:p-6 lg:p-8" style={{ fontFamily: "Georgia, serif" }}>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1C4532] mb-6">Dashboard</h1>
>>>>>>> da2dc9da5fc186335cc48ca707f8b25d5cfb93b6
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
            icon={HomeIcon}
            description="Properties available for rent"
          />
          <DashboardCard 
<<<<<<< HEAD
            title="Occupied Properties" 
            value={dashboardData.occupiedProperties}
            icon={CheckCircle}
            description="Properties currently rented"
=======
            title="approved Properties" 
            value={dashboardData.approvedProperties}
            icon={CheckCircle}
            description="Properties verified successfully"
>>>>>>> da2dc9da5fc186335cc48ca707f8b25d5cfb93b6
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
<<<<<<< HEAD
  )
}

export default LandlordDashboard

=======
  );
};

export default LandlordDashboard;
>>>>>>> da2dc9da5fc186335cc48ca707f8b25d5cfb93b6
