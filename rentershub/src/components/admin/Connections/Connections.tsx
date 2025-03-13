"use client"

import { useEffect, useState } from "react"
import { Download, ExternalLink, Eye, Pencil, Save, X } from "lucide-react"
import { baseUrl } from "@/utils/constants"

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
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

interface ConnectionResponse {
  results: Connection[]
}

interface ConnectionsTableProps {
  apiEndpoint: string
}

export default function ConnectionsTable({ apiEndpoint }: ConnectionsTableProps) {
  const [connections, setConnections] = useState<Connection[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [viewingConnection, setViewingConnection] = useState<Connection | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [editData, setEditData] = useState<{
    commission: string
    is_paid: boolean
    moved_in: boolean
  } | null>(null)
  

  useEffect(() => {
    fetchConnections()
  }, [apiEndpoint])

  const fetchConnections = async () => {
    try {
      setLoading(true)
      // Use a try-catch inside the fetch to handle network errors
      let data: ConnectionResponse
      try {
        const response = await fetch(apiEndpoint)

        if (!response.ok) {
          throw new Error(`Status ${response.status}`)
        }

        data = await response.json()
      } catch (fetchErr) {
        console.error("Fetch error:", fetchErr)
        throw new Error("Failed to fetch connections")
      }

      // Add id if it doesn't exist in the API response
      const connectionsWithIds = data.results.map((conn, index) => ({
        ...conn,
        id: conn.id || index + 1,
      }))

      setConnections(connectionsWithIds)
      setError(null)
    } catch (err) {
      console.error("Error in fetchConnections:", err)
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      toast({
        description: "Failed to load connections. You can still view any cached data.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchConnectionDetails = async (id: number) => {
    try {
      // Use a try-catch inside the fetch to handle network errors
      let data
      try {
        const response = await fetch(`${baseUrl}accounts/connection/${id}/`)

        if (!response.ok) {
          throw new Error(`Failed to fetch connection details: ${response.status}`)
        }

        data = await response.json()
      } catch (fetchErr) {
        console.error("Fetch error:", fetchErr)
        throw new Error("Failed to fetch connection details")
      }

      setViewingConnection(data)
      setIsViewDialogOpen(true)
    } catch (err) {
      console.error("Error in fetchConnectionDetails:", err)
      toast({
        description: "Failed to load connection details",
        variant: "destructive",
      })
    }
  }

  const startEditing = (connection: Connection) => {
    setEditingId(connection.id)
    setEditData({
      commission: connection.commission,
      is_paid: connection.is_paid,
      moved_in: connection.moved_in,
    })
  }

  const cancelEditing = () => {
    setEditingId(null)
    setEditData(null)
  }

  const handleEditChange = (field: string, value: string | boolean) => {
    if (!editData) return

    setEditData({
      ...editData,
      [field]: value,
    })
  }

  const saveChanges = async (connectionId: number) => {
    if (!editData) return

    try {
      // Use a try-catch inside the fetch to handle network errors
      try {
        const response = await fetch(`${baseUrl}accounts/connection/${connectionId}/`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editData),
        })

        if (!response.ok) throw new Error("Failed to update connection")
      } catch (fetchErr) {
        console.error("Fetch error:", fetchErr)
        throw new Error("Failed to update connection")
      }

      // Update local state
      const updatedConnections = connections.map((conn) => {
        if (conn.id === connectionId) {
          return {
            ...conn,
            commission: editData.commission,
            is_paid: editData.is_paid,
            moved_in: editData.moved_in,
          }
        }
        return conn
      })

      setConnections(updatedConnections)
      setEditingId(null)
      setEditData(null)

      toast({
        description: "Connection updated successfully",
      })
    } catch (err) {
      console.error("Error in saveChanges:", err)
      toast({
        description: "Failed to update connection",
        variant: "destructive",
      })
    }
  }

  const downloadAsSheet = () => {
    // Format the data for Google Sheets
    const headers = [
      "Name",
      "Contact",
      "Property",
      "Address",
      "Property Link",
      "Owner's Contact",
      "Managed By",
      "Rent Price",
      "Moved In",
      "Paid",
      "Commission",
      "Created At",
    ]

    const rows = connections.map((conn) => [
      conn.connectionfullname,
      conn.contact,
      conn.propertydata.title,
      conn.propertydata.address,
      conn.propertylink,
      conn.propertydata.owners_contact,
      conn.propertydata.managed_by,
      conn.propertydata.rent_price,
      conn.moved_in ? "Yes" : "No",
      conn.is_paid ? "Yes" : "No",
      conn.commission,
      conn.created_at,
    ])

    // Create CSV content
    const csvContent = [headers.join(","), ...rows.map((row) => row.map((cell) => `"${cell}"`).join(","))].join("\n")

    // Create a blob and download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `connections_${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      description: "Downloaded connections data as CSV",
    })
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
      // Use a consistent date format that doesn't depend on locale
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
    } catch (e) {
      return dateString // Return the original string if parsing fails
    }
  }

  if (loading && connections.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">    


          <h2 className="text-xl font-semibold"> Property Connections</h2>
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="rounded-md border">
          <div className="p-4">
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Connections</h2>
        <Button onClick={downloadAsSheet} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Download as Sheet
        </Button>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive px-4 py-2 rounded-md mb-4">
          Error loading connections: {error}
          <Button onClick={fetchConnections} variant="link" className="ml-2 p-0 h-auto text-destructive">
            Retry
          </Button>
        </div>
      )}

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableCaption>A list of all property connections.</TableCaption>
          <TableHeader className="bg-muted">
            <TableRow>
              <TableHead className="font-medium">Name</TableHead>
              <TableHead className="font-medium">Contact</TableHead>
              <TableHead className="font-medium">Property</TableHead>
              <TableHead className="font-medium">Managed By</TableHead>
              <TableHead className="font-medium">Moved In</TableHead>
              <TableHead className="font-medium">Paid</TableHead>
              <TableHead className="font-medium">Commission</TableHead>
              <TableHead className="font-medium">Created</TableHead>
              <TableHead className="text-right font-medium">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {connections.length > 0 ? (
              connections.map((connection) => (
                <TableRow key={connection.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{connection.connectionfullname}</TableCell>
                  <TableCell>{connection.contact}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{connection.propertydata.title}</span>
                      <span className="text-xs text-black">{connection.propertydata.address}</span>
                    </div>
                  </TableCell>
                  <TableCell>{connection.propertydata.managed_by}</TableCell>
                  <TableCell>
                    {editingId === connection.id ? (
                      <Checkbox
                        checked={editData?.moved_in}
                        onCheckedChange={(checked) => handleEditChange("moved_in", !!checked)}
                      />
                    ) : (
                      <Badge variant={connection.moved_in ? "default" : "outline"}>
                        {connection.moved_in ? "Yes" : "No"}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === connection.id ? (
                      <Checkbox
                        checked={editData?.is_paid}
                        onCheckedChange={(checked) => handleEditChange("is_paid", !!checked)}
                      />
                    ) : (
                      <Badge variant={connection.is_paid ? "default" : "outline"}>
                        {connection.is_paid ? "Yes" : "No"}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === connection.id ? (
                      <Input
                        value={editData?.commission}
                        onChange={(e) => handleEditChange("commission", e.target.value)}
                        className="w-32"
                      />
                    ) : (
                      formatCurrency(connection.commission)
                    )}
                  </TableCell>
                  <TableCell>{formatDate(connection.created_at)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {editingId === connection.id ? (
                        <>
                          <Button size="icon" variant="outline" onClick={() => saveChanges(connection.id)}>
                            <Save className="h-4 w-4" />
                            <span className="sr-only">Save</span>
                          </Button>
                          <Button size="icon" variant="outline" onClick={cancelEditing}>
                            <X className="h-4 w-4" />
                            <span className="sr-only">Cancel</span>
                          </Button>
                        </>
                      ) : (
                        <>
                          {/* <Button size="icon" variant="outline" onClick={() => fetchConnectionDetails(connection.id)}>
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Button> */}
                          <Button size="icon" variant="outline" onClick={() => startEditing(connection)}>
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center">
                  No connections found. {error ? "There was an error loading the data." : ""}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Connection Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Connection Details</DialogTitle>
            <DialogDescription>Detailed information about this property connection.</DialogDescription>
          </DialogHeader>

          {viewingConnection ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Connection Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Name</h4>
                    <p>{viewingConnection.connectionfullname}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Contact</h4>
                    <p>{viewingConnection.contact}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Property Link</h4>
                    <div className="flex items-center gap-2">
                      <Link
                        href={viewingConnection.propertylink}
                        target="_blank"
                        className="text-primary hover:underline flex items-center"
                      >
                        View Property <ExternalLink className="h-3 w-3 ml-1" />
                      </Link>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Status</h4>
                    <div className="flex gap-2 mt-1">
                      <Badge variant={viewingConnection.moved_in ? "default" : "outline"}>
                        {viewingConnection.moved_in ? "Moved In" : "Not Moved In"}
                      </Badge>
                      <Badge variant={viewingConnection.is_paid ? "default" : "outline"}>
                        {viewingConnection.is_paid ? "Paid" : "Not Paid"}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Commission</h4>
                    <p>{formatCurrency(viewingConnection.commission)}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Created</h4>
                    <p>{formatDate(viewingConnection.created_at)}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Property Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Property</h4>
                    <p>{viewingConnection.propertydata.title}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Type</h4>
                    <p>{viewingConnection.propertydata.propertytype.name}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Address</h4>
                    <p>{viewingConnection.propertydata.address}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Owner's Contact</h4>
                    <p>{viewingConnection.propertydata.owners_contact}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Managed By</h4>
                    <p>{viewingConnection.propertydata.managed_by}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Rent Price</h4>
                    <p>{formatCurrency(viewingConnection.propertydata.rent_price)}</p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                    Close
                  </Button>
                  <Button
                    onClick={() => {
                      setIsViewDialogOpen(false)
                      startEditing(viewingConnection)
                    }}
                  >
                    Edit Connection
                  </Button>
                </CardFooter>
              </Card>
            </div>
          ) : (
            <div className="flex justify-center items-center h-40">
              <p>Loading connection details...</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

