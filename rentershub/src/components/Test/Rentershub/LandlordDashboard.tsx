"use client"

import type React from "react"
import { useEffect, useState } from "react"
import axios from "axios"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Home,
  CheckCircle,
  Clock,
  Plus,
  BarChart3,
  Building,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Edit,
  MoreHorizontal,
} from "lucide-react"
import { baseUrl } from "@/utils/constants"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import Link from "next/link"

interface DashboardData {
  totalProperties: number
  vacantProperties: number
  approvedProperties: number
  awaitingApproval: number
  isLoading: boolean
  error: string | null
}

// Mock data for recent activities
const recentActivities = [
  { id: 1, action: "Property approved", property: "Sunset Apartments", date: "2 hours ago", status: "approved" },
  { id: 2, action: "New tenant inquiry", property: "Oakwood Heights", date: "Yesterday", status: "pending" },
  { id: 3, action: "Maintenance request", property: "Riverside Condos", date: "2 days ago", status: "pending" },
  { id: 4, action: "Lease renewal", property: "Pine Valley Estate", date: "3 days ago", status: "completed" },
]

// Mock data for upcoming tasks
const upcomingTasks = [
  {
    id: 1,
    task: "Property inspection",
    property: "Maple Grove Apartments",
    date: "Tomorrow, 10:00 AM",
    priority: "high",
  },
  { id: 2, task: "Tenant meeting", property: "Cedar Hills Complex", date: "Jan 15, 2:00 PM", priority: "medium" },
  { id: 3, task: "Contract renewal", property: "Willow Park Residences", date: "Jan 20", priority: "medium" },
]

const LandlordDashboard = () => {
  const { data: session, status } = useSession()
  const userId = session?.user?.user_id

  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalProperties: 0,
    vacantProperties: 0,
    approvedProperties: 0,
    awaitingApproval: 0,
    isLoading: true,
    error: null,
  })


  

  useEffect(() => {
    if (userId) {
      const fetchDashboardData = async () => {
        try {
          setDashboardData((prev) => ({ ...prev, isLoading: true, error: null }))

          const response = await axios.get(`${baseUrl}listing/${userId}/getsummarybylandlordorgroundagent/`, {
            headers: {
              Authorization: `Bearer ${session?.user?.accessToken}`,
            },
          })

          const { total_properties, approved_properties, pending_properties } = response.data
          const vacant = total_properties - approved_properties // Assuming vacant = total - approved

          setDashboardData({
            totalProperties: total_properties,
            approvedProperties: approved_properties,
            awaitingApproval: pending_properties,
            vacantProperties: vacant,
            isLoading: false,
            error: null,
          })
        } catch (error) {
          console.error("Error fetching dashboard data:", error)
          setDashboardData((prev) => ({
            ...prev,
            isLoading: false,
            error: "Failed to load dashboard data. Please try again later.",
          }))
        }
      }

      fetchDashboardData()
    } else if (status !== "loading") {
      setDashboardData((prev) => ({ ...prev, isLoading: false }))
    }
  }, [userId, session, status])

  // Prepare chart data
  const propertyStatusData = [
    { name: "Approved", value: dashboardData.approvedProperties, color: "var(--color-approved)" },
    { name: "Pending", value: dashboardData.awaitingApproval, color: "var(--color-pending)" },
    { name: "Vacant", value: dashboardData.vacantProperties, color: "#6366F1" },
  ]

  const propertyDistributionData = [
    { name: "Approved", value: dashboardData.approvedProperties },
    { name: "Pending", value: dashboardData.awaitingApproval },
    { name: "Vacant", value: dashboardData.vacantProperties },
  ]

  const COLORS = ["var(--color-approved)", "var(--color-pending)", "#6366F1"]

  if (dashboardData.error) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="text-center p-6 bg-destructive/10 rounded-lg max-w-md">
          <AlertCircle className="mx-auto h-10 w-10 text-destructive mb-4" />
          <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
          <p className="text-black mb-4">{dashboardData.error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8" style={{ fontFamily: "Georgia, serif" }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-1">{session?.user?.role || ""} Dashboard</h1>
            <p className="text-black">Welcome back, {session?.user?.name || ""}</p>
          </div>
          <div className="flex gap-2">
            {/* <Button variant="outline" size="sm" className="hidden md:flex">
              <BarChart3 className="mr-2 h-4 w-4" />
              Reports
            </Button> */}
            <Link href="/rentershub/add-property">
  <Button size="sm">
    <Plus className="mr-2 h-4 w-4" />
    Add Property
  </Button>
</Link>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="properties">Properties</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>
            <div className="text-sm text-black">Last updated: {new Date().toLocaleString()}</div>
          </div>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {dashboardData.isLoading ? (
                <>
                  {[1, 2, 3, 4].map((i) => (
                    <Card key={i} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <Skeleton className="h-4 w-24" />
                      </CardHeader>
                      <CardContent>
                        <Skeleton className="h-8 w-16 mb-2" />
                        <Skeleton className="h-4 w-full" />
                      </CardContent>
                    </Card>
                  ))}
                </>
              ) : (
                <>
                  <StatsCard
                    title="Total Properties"
                    value={dashboardData.totalProperties}
                    icon={Building}
                    description="All properties under management"
                    trend="up"
                  />
                  <StatsCard
                    title="Vacant Properties"
                    value={dashboardData.vacantProperties}
                    icon={Home}
                    description="Properties available for rent"
                    trend={dashboardData.vacantProperties > 0 ? "down" : "neutral"}
                  />
                  <StatsCard
                    title="Approved Properties"
                    value={dashboardData.approvedProperties}
                    icon={CheckCircle}
                    description="Properties verified successfully"
                    trend="up"
                  />
                  <StatsCard
                    title="Awaiting Approval"
                    value={dashboardData.awaitingApproval}
                    icon={Clock}
                    description="Properties pending verification"
                    trend={dashboardData.awaitingApproval > 0 ? "down" : "neutral"}
                  />
                </>
              )}
            </div>

            {/* Charts and Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Property Distribution Chart */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Property Status Distribution</CardTitle>
                  <CardDescription>Overview of your property portfolio status</CardDescription>
                </CardHeader>
                <CardContent>
                  {dashboardData.isLoading ? (
                    <Skeleton className="h-[300px] w-full" />
                  ) : (
                    <div className="h-[300px]">
                      <ChartContainer
                        config={{
                          approved: {
                            label: "Approved",
                            color: "var(--color-approved)",
                          },
                          pending: {
                            label: "Pending",
                            color: "var(--color-pending)",
                          },
                          vacant: {
                            label: "Vacant",
                            color: "#6366F1",
                          },
                        }}
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={[
                              {
                                name: "Properties",
                                approved: dashboardData.approvedProperties,
                                pending: dashboardData.awaitingApproval,
                                vacant: dashboardData.vacantProperties,
                              },
                            ]}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Bar dataKey="approved" stackId="a" fill="var(--color-approved)" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="pending" stackId="a" fill="var(--color-pending)" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="vacant" stackId="a" fill="#6366F1" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                  <div className="flex justify-between w-full text-sm">
                    <div className="flex items-center">
                      <div className="h-3 w-3 rounded-full bg-primary mr-2"></div>
                      <span>Approved: {dashboardData.approvedProperties}</span>
                    </div>
                    <div className="flex items-center">
                      <div className="h-3 w-3 rounded-full bg-[#f59e0b] mr-2"></div>
                      <span>Pending: {dashboardData.awaitingApproval}</span>
                    </div>
                    <div className="flex items-center">
                      <div className="h-3 w-3 rounded-full bg-[#6366F1] mr-2"></div>
                      <span>Vacant: {dashboardData.vacantProperties}</span>
                    </div>
                  </div>
                </CardFooter>
              </Card>

              {/* Pie Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Property Breakdown</CardTitle>
                  <CardDescription>Distribution by status</CardDescription>
                </CardHeader>
                <CardContent>
                  {dashboardData.isLoading ? (
                    <Skeleton className="h-[300px] w-full" />
                  ) : (
                    <div className="h-[300px] flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={propertyStatusData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {propertyStatusData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => [`${value} Properties`, ""]} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity and Tasks */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              {/* <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest updates on your properties</CardDescription>
                </CardHeader>
                <CardContent>
                  {dashboardData.isLoading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-start gap-4">
                          <Skeleton className="h-10 w-10 rounded-full" />
                          <div className="space-y-2 flex-1">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : recentActivities.length > 0 ? (
                    <div className="space-y-4">
                      {recentActivities.map((activity) => (
                        <div key={activity.id} className="flex items-start gap-4 pb-4 border-b last:border-0">
                          <div
                            className={`p-2 rounded-full ${
                              activity.status === "approved"
                                ? "bg-primary/10 text-primary"
                                : activity.status === "pending"
                                  ? "bg-amber-100 text-amber-600"
                                  : "bg-blue-100 text-blue-600"
                            }`}
                          >
                            {activity.status === "approved" ? (
                              <CheckCircle className="h-4 w-4" />
                            ) : activity.status === "pending" ? (
                              <Clock className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{activity.action}</p>
                            <p className="text-sm text-black">{activity.property}</p>
                            <p className="text-xs text-black mt-1">{activity.date}</p>
                          </div>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-black">No recent activity to display</p>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                  <Button variant="outline" size="sm" className="w-full">
                    View All Activity
                  </Button>
                </CardFooter>
              </Card> */}

              {/* Upcoming Tasks */}
              {/* <Card>
                <CardHeader>
                  <CardTitle>Upcoming Tasks</CardTitle>
                  <CardDescription>Scheduled events and deadlines</CardDescription>
                </CardHeader>
                <CardContent>
                  {dashboardData.isLoading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-start gap-4">
                          <Skeleton className="h-10 w-10 rounded-full" />
                          <div className="space-y-2 flex-1">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : upcomingTasks.length > 0 ? (
                    <div className="space-y-4">
                      {upcomingTasks.map((task) => (
                        <div key={task.id} className="flex items-start gap-4 pb-4 border-b last:border-0">
                          <div
                            className={`p-2 rounded-full ${
                              task.priority === "high"
                                ? "bg-red-100 text-red-600"
                                : task.priority === "medium"
                                  ? "bg-amber-100 text-amber-600"
                                  : "bg-green-100 text-green-600"
                            }`}
                          >
                            <Clock className="h-4 w-4" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{task.task}</p>
                            <p className="text-sm text-black">{task.property}</p>
                            <p className="text-xs text-black mt-1">{task.date}</p>
                          </div>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-black">No upcoming tasks</p>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                  <Button variant="outline" size="sm" className="w-full">
                    View All Tasks
                  </Button>
                </CardFooter>
              </Card> */}
            </div>
          </TabsContent>

          <TabsContent value="properties" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Property Management (COMING SOON)</CardTitle>
                <CardDescription>View and manage all your properties</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-black mb-4">
                  This section will display a detailed list of all your properties with management options.
                </p>
                <Button>View Properties</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Activity Log (COMING SOON)</CardTitle>
                <CardDescription>Track all activities related to your properties</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-black mb-4">
                  This section will display a comprehensive activity log for all your properties.
                </p>
                <Button>View Full Activity Log</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

// Stats card component for reusability
function StatsCard({
  title,
  value,
  icon: Icon,
  description,
  trend = "neutral",
}: {
  title: string
  value: number
  icon: React.ElementType
  description: string
  trend?: "up" | "down" | "neutral"
}) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-black mt-1 flex items-center">
          {trend === "up" && <ArrowUpRight className="mr-1 h-3 w-3 text-primary" />}
          {trend === "down" && <ArrowDownRight className="mr-1 h-3 w-3 text-destructive" />}
          {description}
        </p>
      </CardContent>
    </Card>
  )
}

export default LandlordDashboard

