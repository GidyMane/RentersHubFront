"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { baseUrl } from "@/utils/constants"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { ArrowLeft, ExternalLink, Pencil, Save, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import toast from "react-hot-toast"


interface PropertyType {
  id: number
  name: string
}

interface PropertyData {
  id: number
  title: string
  propertytype: PropertyType
  address: string
  is_available: boolean
  is_approved: boolean
  featured: boolean
  rent_price: string
  deposit_amount: string
  water_charges: string
  water_deposit: string
  garbage_charges: string
  security_charges: string
  other_charges: string
  postedby: string
  owners_contact: string
  managed_by: string
  created_at: string
  updated_at: string
}

interface Connection {
  id: number
  connectionfullname: string
  contact: string
  propertylink: string
  property: number
  propertydata: PropertyData
  moved_in: boolean
  is_paid: boolean
  commission: string
  created_at: string
  updated_at: string
}

export default function ConnectionDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const connectionId = params.id

  const [connection, setConnection] = useState<Connection | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState<{
    commission: string
    is_paid: boolean
    moved_in: boolean
  } | null>(null)

  useEffect(() => {
    if (connectionId && session?.user?.accessToken) {
      fetchConnectionDetails(connectionId as string)
    }
  }, [connectionId, session])

  const fetchConnectionDetails = async (id: string) => {
    if (!session?.user?.accessToken) {
      setError("Authentication required")
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const response = await fetch(`${baseUrl}accounts/connection/${id}/`, {
        headers: {
          Authorization: `Bearer ${session.user.accessToken}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch connection details: ${response.status}`)
      }

      const data = await response.json()
      setConnection(data)
      setEditData({
        commission: data.commission,
        is_paid: data.is_paid,
        moved_in: data.moved_in,
      })
    } catch (err) {
      console.error("Error fetching connection details:", err)
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      toast({
        description: "Failed to load connection details",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEditChange = (field: string, value: string | boolean) => {
    if (!editData) return

    setEditData({
      ...editData,
      [field]: value,
    })
  }

  const saveChanges = async () => {
    if (!editData || !connection || !session?.user?.accessToken) return

    try {
      const response = await fetch(`${baseUrl}accounts/connection/${connection.id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.user.accessToken}`,
        },
        body: JSON.stringify(editData),
      })

      if (!response.ok) throw new Error("Failed to update connection")

      // Update local state
      setConnection({
        ...connection,
        commission: editData.commission,
        is_paid: editData.is_paid,
        moved_in: editData.moved_in,
      })

      setIsEditing(false)

      toast({
        description: "Connection updated successfully",
      })
    } catch (err) {
      console.error("Error updating connection:", err)
      toast({
        description: "Failed to update connection",
        variant: "destructive",
      })
    }
  }

  const formatCurrency = (amount: string) => {
    // Handle very large or invalid numbers
    const num = Number.parseFloat(amount)
    if (isNaN(num) || !isFinite(num)) return "Invalid amount"

    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      maximumFractionDigits: 2,
    }).format(num)
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date)
    } catch (e) {
      return dateString // Return the original string if parsing fails
    }
  }

  if (loading) {
    return (
      <div className="container py-6 space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Skeleton className="h-8 w-64" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-[400px] w-full" />
          <Skeleton className="h-[400px] w-full" />
        </div>
      </div>
    )
  }

  if (error || !connection) {
    return (
      <div className="container py-6">
        <div className="flex items-center gap-2 mb-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Connection Details</h1>
        </div>

        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <p className="text-muted-foreground mb-4">{error || "Connection not found"}</p>
            <Button onClick={() => router.push("/connections")}>Return to Connections</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">{connection.connectionfullname}</h1>
        </div>

        {isEditing ? (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={saveChanges}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        ) : (
          <Button onClick={() => setIsEditing(true)}>
            <Pencil className="h-4 w-4 mr-2" />
            Edit Connection
          </Button>
        )}
      </div>

      <Tabs defaultValue="details">
        <TabsList className="mb-4">
          <TabsTrigger value="details">Connection Details</TabsTrigger>
          <TabsTrigger value="property">Property Information</TabsTrigger>
          <TabsTrigger value="financial">Financial Details</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Connection Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <div className="p-2 border rounded-md bg-muted/30">{connection.connectionfullname}</div>
                </div>

                <div className="space-y-2">
                  <Label>Contact</Label>
                  <div className="p-2 border rounded-md bg-muted/30">{connection.contact}</div>
                </div>

                <div className="space-y-2">
                  <Label>Created At</Label>
                  <div className="p-2 border rounded-md bg-muted/30">{formatDate(connection.created_at)}</div>
                </div>

                <div className="space-y-2">
                  <Label>Last Updated</Label>
                  <div className="p-2 border rounded-md bg-muted/30">{formatDate(connection.updated_at)}</div>
                </div>

                <div className="space-y-2">
                  <Label>Moved In Status</Label>
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={editData?.moved_in}
                        onCheckedChange={(checked) => handleEditChange("moved_in", checked)}
                      />
                      <span>{editData?.moved_in ? "Moved In" : "Not Moved In"}</span>
                    </div>
                  ) : (
                    <div className="p-2 border rounded-md bg-muted/30">
                      <Badge variant={connection.moved_in ? "default" : "outline"}>
                        {connection.moved_in ? "Moved In" : "Not Moved In"}
                      </Badge>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Payment Status</Label>
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={editData?.is_paid}
                        onCheckedChange={(checked) => handleEditChange("is_paid", checked)}
                      />
                      <span>{editData?.is_paid ? "Paid" : "Not Paid"}</span>
                    </div>
                  ) : (
                    <div className="p-2 border rounded-md bg-muted/30">
                      <Badge variant={connection.is_paid ? "default" : "outline"}>
                        {connection.is_paid ? "Paid" : "Not Paid"}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="property" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Property Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Property Name</Label>
                  <div className="p-2 border rounded-md bg-muted/30">{connection.propertydata.title}</div>
                </div>

                <div className="space-y-2">
                  <Label>Property Type</Label>
                  <div className="p-2 border rounded-md bg-muted/30">{connection.propertydata.propertytype.name}</div>
                </div>

                <div className="space-y-2">
                  <Label>Address</Label>
                  <div className="p-2 border rounded-md bg-muted/30">{connection.propertydata.address}</div>
                </div>

                <div className="space-y-2">
                  <Label>Property Link</Label>
                  <div className="p-2 border rounded-md bg-muted/30">
                    {connection.propertylink ? (
                      <Link
                        href={connection.propertylink}
                        target="_blank"
                        className="text-primary hover:underline flex items-center"
                      >
                        View Property <ExternalLink className="h-3 w-3 ml-1" />
                      </Link>
                    ) : (
                      <span className="text-muted-foreground">No link available</span>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Owner's Contact</Label>
                  <div className="p-2 border rounded-md bg-muted/30">
                    {connection.propertydata.owners_contact || "Not provided"}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Managed By</Label>
                  <div className="p-2 border rounded-md bg-muted/30">
                    {connection.propertydata.managed_by || "Not specified"}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Availability</Label>
                  <div className="p-2 border rounded-md bg-muted/30">
                    <Badge variant={connection.propertydata.is_available ? "default" : "outline"}>
                      {connection.propertydata.is_available ? "Available" : "Not Available"}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Approval Status</Label>
                  <div className="p-2 border rounded-md bg-muted/30">
                    <Badge variant={connection.propertydata.is_approved ? "default" : "outline"}>
                      {connection.propertydata.is_approved ? "Approved" : "Not Approved"}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financial" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Financial Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Commission</Label>
                  {isEditing ? (
                    <Input
                      value={editData?.commission}
                      onChange={(e) => handleEditChange("commission", e.target.value)}
                    />
                  ) : (
                    <div className="p-2 border rounded-md bg-muted/30">{formatCurrency(connection.commission)}</div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Rent Price</Label>
                  <div className="p-2 border rounded-md bg-muted/30">
                    {formatCurrency(connection.propertydata.rent_price)}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Deposit Amount</Label>
                  <div className="p-2 border rounded-md bg-muted/30">
                    {formatCurrency(connection.propertydata.deposit_amount)}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Water Charges</Label>
                  <div className="p-2 border rounded-md bg-muted/30">
                    {formatCurrency(connection.propertydata.water_charges)}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Water Deposit</Label>
                  <div className="p-2 border rounded-md bg-muted/30">
                    {formatCurrency(connection.propertydata.water_deposit)}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Garbage Charges</Label>
                  <div className="p-2 border rounded-md bg-muted/30">
                    {formatCurrency(connection.propertydata.garbage_charges)}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Security Charges</Label>
                  <div className="p-2 border rounded-md bg-muted/30">
                    {formatCurrency(connection.propertydata.security_charges)}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Other Charges</Label>
                  <div className="p-2 border rounded-md bg-muted/30">
                    {formatCurrency(connection.propertydata.other_charges)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

