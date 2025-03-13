
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const dynamic = "force-dynamic"


export default function DashboardPage() {
  return (
<<<<<<< HEAD
    <div className="space-y-6 col-span-3">
=======
    <div className="space-y-6 col-span-3"   style={{ fontFamily: "Georgia, serif" }}>
>>>>>>> da2dc9da5fc186335cc48ca707f8b25d5cfb93b6
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
        {/* <QuickPropertySearch /> */}
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
          </CardHeader>
          <CardContent>
<<<<<<< HEAD
            <div className="text-2xl font-bold text-primary300">1,234</div>
=======
            <div className="text-2xl font-bold text-primary300">0</div>
>>>>>>> da2dc9da5fc186335cc48ca707f8b25d5cfb93b6
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Landlords</CardTitle>
          </CardHeader>
          <CardContent>
<<<<<<< HEAD
            <div className="text-2xl font-bold text-primary300">789</div>
=======
            <div className="text-2xl font-bold text-primary300">0</div>
>>>>>>> da2dc9da5fc186335cc48ca707f8b25d5cfb93b6
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Ground Agents</CardTitle>
          </CardHeader>
          <CardContent>
<<<<<<< HEAD
            <div className="text-2xl font-bold text-primary300">445</div>
=======
            <div className="text-2xl font-bold text-primary300">0</div>
>>>>>>> da2dc9da5fc186335cc48ca707f8b25d5cfb93b6
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
<<<<<<< HEAD
            <div className="text-2xl font-bold text-primary300">56,000</div>
=======
            <div className="text-2xl font-bold text-primary300">0</div>
>>>>>>> da2dc9da5fc186335cc48ca707f8b25d5cfb93b6
          </CardContent>
        </Card>
      </div>

      
    </div>
  )
}

