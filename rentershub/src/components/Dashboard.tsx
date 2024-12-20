import { Building, Home, CheckSquare, Clock } from 'lucide-react'

import { PropertyMetrics, ActivityItem } from '../types/dashboard'
import Card from './Card';
import ActivityLog from './ActivityLog';

interface DashboardContentProps {
  metrics: PropertyMetrics;
  recentActivities: ActivityItem[];
}

export default function DashboardContent({ metrics, recentActivities }: DashboardContentProps) {
  return (
    <div className="p-6 bg-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card 
          title="Total Properties" 
          value={metrics.total} 
          icon={<Building className="h-8 w-8" />} 
          accentColor="border-green-500"
        />
        <Card 
          title="Vacant Properties" 
          value={metrics.vacant} 
          icon={<Home className="h-8 w-8" />} 
          accentColor="border-blue-500"
        />
        <Card 
          title="Occupied Properties" 
          value={metrics.occupied} 
          icon={<CheckSquare className="h-8 w-8" />} 
          accentColor="border-green-500"
        />
        <Card 
          title="Pending Approvals" 
          value={metrics.pendingApproval} 
          icon={<Clock className="h-8 w-8" />} 
          accentColor="border-blue-300"
        />
      </div>
      <ActivityLog activities={recentActivities} />
    </div>
  )
}

