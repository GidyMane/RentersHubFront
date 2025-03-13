"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bar, BarChart as RechartsBarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"
import { Building2, Users, UserCheck, Clock, CheckCircle, AlertCircle, User, UserCog } from "lucide-react"
import { baseUrl } from "@/utils/constants"
import { useSession } from "next-auth/react"

// Define the type for our API response
type AdminSummary = {
  approved_properties: number
  pending_properties: number
  total_properties: number
  total_users: number
  totaladmins: number
  total_landlords: number
  total_groundagents: number
  approved_admins: number
  pending_admins: number
  approved_landlords: number
  pending_landlords: number
  approved_agents: number
  pending_agents: number
}

export default function DashboardPage() {
  const [data, setData] = useState<AdminSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { data: session } = useSession();

  useEffect(() => {
    const fetchData = async () => {
      if (!session?.user?.accessToken) return;

      try {
        setLoading(true);
        const response = await fetch(`${baseUrl}listing/adminsummary`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${session.user.accessToken}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status}`);
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session]);
  

  // Prepare chart data for users
  const userChartData = data
    ? [
        { name: "Admins", total: data.totaladmins, approved: data.approved_admins, pending: data.pending_admins },
        {
          name: "Landlords",
          total: data.total_landlords,
          approved: data.approved_landlords,
          pending: data.pending_landlords,
        },
        {
          name: "Agents",
          total: data.total_groundagents,
          approved: data.approved_agents,
          pending: data.pending_agents,
        },
      ]
    : []

  if (loading) {
    return <DashboardSkeleton />
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center p-6 bg-destructive/10 rounded-lg">
          <AlertCircle className="mx-auto h-10 w-10 text-destructive mb-4" />
          <h2 className="text-xl font-bold mb-2">Failed to load dashboard data</h2>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 col-span-3">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
        <div className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleString()}</div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="properties">Properties</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              title="Total Properties"
              value={data?.total_properties || 0}
              icon={<Building2 className="h-4 w-4 text-muted-foreground" />}
              description="All properties in the system"
              trend="up"
            />
            <StatsCard
              title="Total Users"
              value={data?.total_users || 0}
              icon={<Users className="h-4 w-4 text-muted-foreground" />}
              description="Combined users across all roles"
              trend="up"
            />
            <StatsCard
              title="Approved Properties"
              value={data?.approved_properties || 0}
              icon={<CheckCircle className="h-4 w-4 text-muted-foreground" />}
              description={`${data ? Math.round((data.approved_properties / data.total_properties) * 100) : 0}% approval rate`}
              trend="up"
            />
            <StatsCard
              title="Pending Approvals"
              value={
                (data?.pending_properties || 0) +
                (data?.pending_admins || 0) +
                (data?.pending_landlords || 0) +
                (data?.pending_agents || 0)
              }
              icon={<Clock className="h-4 w-4 text-muted-foreground" />}
              description="Items requiring your attention"
              trend="neutral"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>User Distribution</CardTitle>
                <CardDescription>Breakdown of users by role and status</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ChartContainer
                  config={{
                    approved: {
                      label: "Approved",
                      color: "hsl(var(--chart-1))",
                    },
                    pending: {
                      label: "Pending",
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                  className="aspect-[2/1]"
                >
                  <RechartsBarChart data={userChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="approved" stackId="a" fill="var(--color-approved)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="pending" stackId="a" fill="var(--color-pending)" radius={[4, 4, 0, 0]} />
                  </RechartsBarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Property Status</CardTitle>
                <CardDescription>Approved vs pending properties</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[240px] flex items-center justify-center">
                  <div className="w-full max-w-[180px]">
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex w-full items-center gap-2">
                        <div className="h-2.5 w-2.5 rounded-sm bg-primary"></div>
                        <div className="flex-1 text-sm">Approved</div>
                        <div className="text-sm font-medium">{data?.approved_properties || 0}</div>
                      </div>
                      <div className="flex w-full items-center gap-2">
                        <div className="h-2.5 w-2.5 rounded-sm bg-muted"></div>
                        <div className="flex-1 text-sm">Pending</div>
                        <div className="text-sm font-medium">{data?.pending_properties || 0}</div>
                      </div>
                    </div>
                    <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full bg-primary"
                        style={{
                          width: `${data ? (data.approved_properties / data.total_properties) * 100 : 0}%`,
                        }}
                      ></div>
                    </div>
                    <div className="mt-2 text-center text-sm text-muted-foreground">
                      {data ? Math.round((data.approved_properties / data.total_properties) * 100) : 0}% approved
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="properties" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <StatsCard
              title="Total Properties"
              value={data?.total_properties || 0}
              icon={<Building2 className="h-4 w-4 text-muted-foreground" />}
              description="All properties in the system"
              trend="up"
              className="lg:col-span-1"
            />
            <StatsCard
              title="Approved Properties"
              value={data?.approved_properties || 0}
              icon={<CheckCircle className="h-4 w-4 text-muted-foreground" />}
              description={`${data ? Math.round((data.approved_properties / data.total_properties) * 100) : 0}% of total`}
              trend="up"
              className="lg:col-span-1"
            />
            <StatsCard
              title="Pending Properties"
              value={data?.pending_properties || 0}
              icon={<Clock className="h-4 w-4 text-muted-foreground" />}
              description="Awaiting approval"
              trend={data?.pending_properties ? "down" : "neutral"}
              className="lg:col-span-1"
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Property Approval Status</CardTitle>
              <CardDescription>Visual breakdown of property statuses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart
                    data={[
                      {
                        name: "Properties",
                        approved: data?.approved_properties || 0,
                        pending: data?.pending_properties || 0,
                      },
                    ]}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar name="Approved" dataKey="approved" stackId="a" fill="#10b981" />
                    <Bar name="Pending" dataKey="pending" stackId="a" fill="#f59e0b" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <div className="flex justify-between w-full text-sm">
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-[#10b981] mr-2"></div>
                  <span>Approved: {data?.approved_properties || 0}</span>
                </div>
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-[#f59e0b] mr-2"></div>
                  <span>Pending: {data?.pending_properties || 0}</span>
                </div>
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-primary mr-2"></div>
                  <span>Total: {data?.total_properties || 0}</span>
                </div>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">Admins</CardTitle>
                  <User className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data?.totaladmins || 0}</div>
                <div className="flex items-center justify-between mt-2">
                  <div className="text-xs text-muted-foreground">
                    <span className="inline-flex items-center text-emerald-600">
                      <CheckCircle className="mr-1 h-3 w-3" /> {data?.approved_admins || 0} Approved
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <span className="inline-flex items-center text-amber-600">
                      <Clock className="mr-1 h-3 w-3" /> {data?.pending_admins || 0} Pending
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">Landlords</CardTitle>
                  <UserCheck className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data?.total_landlords || 0}</div>
                <div className="flex items-center justify-between mt-2">
                  <div className="text-xs text-muted-foreground">
                    <span className="inline-flex items-center text-emerald-600">
                      <CheckCircle className="mr-1 h-3 w-3" /> {data?.approved_landlords || 0} Approved
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <span className="inline-flex items-center text-amber-600">
                      <Clock className="mr-1 h-3 w-3" /> {data?.pending_landlords || 0} Pending
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">Ground Agents</CardTitle>
                  <UserCog className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data?.total_groundagents || 0}</div>
                <div className="flex items-center justify-between mt-2">
                  <div className="text-xs text-muted-foreground">
                    <span className="inline-flex items-center text-emerald-600">
                      <CheckCircle className="mr-1 h-3 w-3" /> {data?.approved_agents || 0} Approved
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <span className="inline-flex items-center text-amber-600">
                      <Clock className="mr-1 h-3 w-3" /> {data?.pending_agents || 0} Pending
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>User Breakdown</CardTitle>
              <CardDescription>Distribution of users by role and approval status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={userChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar name="Approved" dataKey="approved" fill="#10b981" />
                    <Bar name="Pending" dataKey="pending" fill="#f59e0b" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <div className="grid grid-cols-3 gap-4 w-full text-sm">
                <div className="flex flex-col">
                  <span className="text-muted-foreground">Total Users</span>
                  <span className="font-medium">{data?.total_users || 0}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-muted-foreground">Approved Users</span>
                  <span className="font-medium">
                    {(data?.approved_admins || 0) + (data?.approved_landlords || 0) + (data?.approved_agents || 0)}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-muted-foreground">Pending Users</span>
                  <span className="font-medium">
                    {(data?.pending_admins || 0) + (data?.pending_landlords || 0) + (data?.pending_agents || 0)}
                  </span>
                </div>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Stats card component for reusability
function StatsCard({
  title,
  value,
  icon,
  description,
  trend = "neutral",
  className = "",
}: {
  title: string
  value: number
  icon: React.ReactNode
  description: string
  trend?: "up" | "down" | "neutral"
  className?: string
}) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1 flex items-center">
          {trend === "up" && <TrendingUpIcon className="mr-1 h-3 w-3 text-emerald-600" />}
          {trend === "down" && <TrendingDownIcon className="mr-1 h-3 w-3 text-rose-600" />}
          {description}
        </p>
      </CardContent>
    </Card>
  )
}

// Trending icons
function TrendingUpIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
      <path
        fillRule="evenodd"
        d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
        clipRule="evenodd"
      />
    </svg>
  )
}

function TrendingDownIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
      <path
        fillRule="evenodd"
        d="M12 13a1 1 0 100 2h5a1 1 0 001-1v-5a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586l-4.293-4.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z"
        clipRule="evenodd"
      />
    </svg>
  )
}

// Loading skeleton
function DashboardSkeleton() {
  return (
    <div className="space-y-6 col-span-3">
      <div className="flex justify-between items-center">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-5 w-40" />
      </div>

      <div className="space-y-2">
        <Skeleton className="h-10 w-72" />

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-4 rounded-full" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </CardContent>
              </Card>
            ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="col-span-2">
            <CardHeader>
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[240px] w-full" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-40 mb-2" />
              <Skeleton className="h-4 w-56" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[240px] w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

