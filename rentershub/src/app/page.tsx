import DashboardContent from '@/components/Dashboard';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { PropertyMetrics } from '@/types/dashboard';
import React from 'react';

const defaultMetrics: PropertyMetrics = {
  total: 0,
  vacant: 0,
  occupied: 0,
  pendingApproval: 0,
};

const Page = () => {
  return (
    <div className="flex h-screen bg-gray-100 text-gray-800">
      {/* Sidebar */}
      <div className="w-64 bg-green-500 text-white">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <div className="bg-white shadow">
          <Navbar />
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <DashboardContent metrics={defaultMetrics} recentActivities={[]} />
        </div>
      </div>
    </div>
  );
};

export default Page;
