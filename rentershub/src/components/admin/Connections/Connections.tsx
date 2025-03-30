"use client"

import { useEffect, useState } from "react"
import { Download, Eye, Pencil, Save, X, LinkIcon } from "lucide-react"
import { baseUrl } from "@/utils/constants"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

import Link from "next/link"
import { format } from "date-fns"
import toast from "react-hot-toast"
import AddConnectionForm from "./AddConnectionForm"

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
  const router = useRouter()
  const { data: session } = useSession()
  const [connections, setConnections] = useState<Connection[]>([])
  const [filteredConnections, setFilteredConnections] = useState<Connection[]>([])
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

  // Filters
  const [filters, setFilters] = useState({
    movedIn: null as boolean | null,
    paid: null as boolean | null,
    date: undefined as Date | undefined,
  })

  useEffect(() => {
    fetchConnections()
  }, [apiEndpoint, session])

  useEffect(() => {
    applyFilters()
  }, [connections, filters])

  const applyFilters = () => {
    let filtered = [...connections]

    // Apply moved in filter
    if (filters.movedIn !== null) {
      filtered = filtered.filter((conn) => conn.moved_in === filters.movedIn)
    }

    // Apply paid filter
    if (filters.paid !== null) {
      filtered = filtered.filter((conn) => conn.is_paid === filters.paid)
    }

    // Apply date filter
    if (filters.date) {
      const filterDate = format(filters.date, "yyyy-MM-dd")
      filtered = filtered.filter((conn) => {
        const connDate = format(new Date(conn.created_at), "yyyy-MM-dd")
        return connDate === filterDate
      })
    }

    setFilteredConnections(filtered)
  }

  const resetFilters = () => {
    setFilters({
      movedIn: null,
      paid: null,
      date: undefined,
    })
  }

  const fetchConnections = async () => {
    if (!session?.user?.accessToken) {
      console.error("No access token available")
      setError("Authentication required")
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      // Use a try-catch inside the fetch to handle network errors
      let data: ConnectionResponse
      try {
        const response = await fetch(apiEndpoint, {
          headers: {
            Authorization: `Bearer ${session.user.accessToken}`,
          },
        })

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
      setFilteredConnections(connectionsWithIds)
      setError(null)
    } catch (err) {
      console.error("Error in fetchConnections:", err)
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      toast.error("Failed to load connections. You can still view any cached data.")
    } finally {
      setLoading(false)
    }
  }

  const viewConnectionDetails = (connection: Connection) => {
    // Ensure we're using the correct ID and navigation method
    console.log("Navigating to connection ID:", connection.id)
    router.push(`/admin/connections/${connection.id}`)
  }

  const toggleMovedIn = async (connection: Connection) => {
    if (!session?.user?.accessToken) {
      console.error("No access token available")
      toast.error("Authentication required")
      return
    }

    try {
      const newStatus = !connection.moved_in

      const response = await fetch(`${baseUrl}accounts/connection/${connection.id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.user.accessToken}`,
        },
        body: JSON.stringify({ moved_in: newStatus }),
      })

      if (!response.ok) throw new Error("Failed to update moved in status")

      // Update local state
      const updatedConnections = connections.map((conn) => {
        if (conn.id === connection.id) {
          return {
            ...conn,
            moved_in: newStatus,
          }
        }
        return conn
      })

      setConnections(updatedConnections)

      toast.success(`Status updated: ${newStatus ? "Moved In" : "Not Moved In"}`)
    } catch (err) {
      console.error("Error toggling moved in status:", err)
      toast.error("Failed to update status")
    }
  }

  const togglePaid = async (connection: Connection) => {
    if (!session?.user?.accessToken) {
      console.error("No access token available")
      toast.error("Authentication required")
      return
    }

    try {
      const newStatus = !connection.is_paid

      const response = await fetch(`${baseUrl}accounts/connection/${connection.id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.user.accessToken}`,
        },
        body: JSON.stringify({ is_paid: newStatus }),
      })

      if (!response.ok) throw new Error("Failed to update paid status")

      // Update local state
      const updatedConnections = connections.map((conn) => {
        if (conn.id === connection.id) {
          return {
            ...conn,
            is_paid: newStatus,
          }
        }
        return conn
      })

      setConnections(updatedConnections)

      toast.success(`Status updated: ${newStatus ? "Paid" : "Not Paid"}`)
    } catch (err) {
      console.error("Error toggling paid status:", err)
      toast.error("Failed to update status")
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
    if (!editData || !session?.user?.accessToken) return

    try {
      // Use a try-catch inside the fetch to handle network errors
      try {
        const response = await fetch(`${baseUrl}accounts/connection/${connectionId}/`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.user.accessToken}`,
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

      toast.success("Connection updated successfully")
    } catch (err) {
      console.error("Error in saveChanges:", err)
      toast.error("Failed to update connection")
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

    toast.success("Downloaded connections data as CSV")
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
          <h2 className="text-xl font-semibold">Property Connections</h2>
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
      <div className="flex flex-col gap-4 mb-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Connections</h2>
          <div className="flex gap-2">
            <AddConnectionForm onConnectionAdded={fetchConnections} />
            <Button onClick={downloadAsSheet} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Download as Sheet
            </Button>
          </div>
        </div>

        {/* Separate filter controls */}
        <div className="flex flex-wrap gap-4 p-4 bg-muted/20 rounded-md border">
          <div className="flex flex-col gap-1">
            <Label htmlFor="moved-in-filter">Moved In Status</Label>
            <Select
              value={filters.movedIn === null ? "all" : filters.movedIn.toString()}
              onValueChange={(value) => {
                if (value === "all") {
                  setFilters({ ...filters, movedIn: null })
                } else {
                  setFilters({ ...filters, movedIn: value === "true" })
                }
              }}
            >
              <SelectTrigger id="moved-in-filter" className="w-[180px]">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="true">Moved In</SelectItem>
                <SelectItem value="false">Not Moved In</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="paid-filter">Payment Status</Label>
            <Select
              value={filters.paid === null ? "all" : filters.paid.toString()}
              onValueChange={(value) => {
                if (value === "all") {
                  setFilters({ ...filters, paid: null })
                } else {
                  setFilters({ ...filters, paid: value === "true" })
                }
              }}
            >
              <SelectTrigger id="paid-filter" className="w-[180px]">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="true">Paid</SelectItem>
                <SelectItem value="false">Not Paid</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="date-filter">Date Created</Label>
            <div className="flex gap-2">
              <Input
                id="date-filter"
                type="date"
                className="w-[180px]"
                value={filters.date ? format(filters.date, "yyyy-MM-dd") : ""}
                onChange={(e) => {
                  const date = e.target.value ? new Date(e.target.value) : undefined
                  setFilters({ ...filters, date })
                }}
              />
              {filters.date && (
                <Button variant="ghost" size="icon" onClick={() => setFilters({ ...filters, date: undefined })}>
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          <div className="flex items-end">
            <Button variant="outline" onClick={resetFilters}>
              Reset All Filters
            </Button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive px-4 py-2 rounded-md mb-4">
          Error loading connections: {error}
          <Button onClick={fetchConnections} variant="link" className="ml-2 p-0 h-auto text-destructive">
            Retry
          </Button>
        </div>
      )}

      <div className="rounded-md border">
        <div className="overflow-auto max-h-[calc(100vh-220px)]">
          <Table>
            <TableHeader className="sticky top-0 z-20">
              <TableRow className="bg-background border-b">
                <TableHead className="font-medium bg-primary">Name</TableHead>
                <TableHead className="font-medium bg-primary">Contact</TableHead>
                <TableHead className="font-medium bg-primary">Property</TableHead>
                <TableHead className="font-medium bg-primary">Link</TableHead>
                <TableHead className="font-medium bg-primary">Owner's Contact</TableHead>
                <TableHead className="font-medium bg-primary">Managed By</TableHead>
                <TableHead className="font-medium bg-primary">Moved In</TableHead>
                <TableHead className="font-medium bg-primary">Paid</TableHead>
                <TableHead className="font-medium bg-primary">Commission</TableHead>
                <TableHead className="font-medium bg-primary">Created</TableHead>
                <TableHead className="text-right font-medium bg-primary">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableCaption className="text-primary">
              {filteredConnections.length === connections.length
                ? `A list of all property connections (${connections.length} total).`
                : `Showing ${filteredConnections.length} of ${connections.length} connections.`}
            </TableCaption>
            <TableBody>
              {filteredConnections.length > 0 ? (
                filteredConnections.map((connection) => (
                  <TableRow key={connection.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{connection.connectionfullname}</TableCell>
                    <TableCell>{connection.contact}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{connection.propertydata.title}</span>
                        <span className="text-xs text-black">{connection.propertydata.address}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {connection.propertylink ? (
                        <Link
                          href={connection.propertylink}
                          target="_blank"
                          className="text-primary hover:underline flex items-center"
                        >
                          <LinkIcon className="h-3 w-3 mr-1" />
                          Link
                        </Link>
                      ) : (
                        <span className="text-primary">No link</span>
                      )}
                    </TableCell>
                    <TableCell>{connection.propertydata.owners_contact}</TableCell>
                    <TableCell>{connection.propertydata.managed_by}</TableCell>
                    <TableCell>
                      {editingId === connection.id ? (
                        <Checkbox
                          checked={editData?.moved_in}
                          onCheckedChange={(checked) => handleEditChange("moved_in", !!checked)}
                        />
                      ) : (
                        <div className="flex items-center">
                          <Switch
                            checked={connection.moved_in}
                            onCheckedChange={() => toggleMovedIn(connection)}
                            className="mr-2"
                          />
                          <Badge variant={connection.moved_in ? "default" : "outline"}>
                            {connection.moved_in ? "Yes" : "No"}
                          </Badge>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === connection.id ? (
                        <Checkbox
                          checked={editData?.is_paid}
                          onCheckedChange={(checked) => handleEditChange("is_paid", !!checked)}
                        />
                      ) : (
                        <div className="flex items-center">
                          <Switch
                            checked={connection.is_paid}
                            onCheckedChange={() => togglePaid(connection)}
                            className="mr-2"
                          />
                          <Badge variant={connection.is_paid ? "default" : "outline"}>
                            {connection.is_paid ? "Yes" : "No"}
                          </Badge>
                        </div>
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
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() => {
                                console.log("View button clicked for connection ID:", connection.id)
                                viewConnectionDetails(connection)
                              }}
                            >
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">View</span>
                            </Button>
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
                  <TableCell colSpan={11} className="h-24 text-center">
                    No connections found. {error ? "There was an error loading the data." : ""}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}

