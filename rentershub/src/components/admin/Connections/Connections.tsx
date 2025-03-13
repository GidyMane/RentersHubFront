"use client"

import { useEffect, useState } from "react"
import { Download, Pencil, Save, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { toast } from "react-hot-toast"


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
      const response = await fetch(apiEndpoint)

      if (!response.ok) {
        throw new Error(`Status ${response.status}`)
      }

      const data: ConnectionResponse = await response.json()
      setConnections(data.results)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      toast({
        title: "Error",
        description: "Failed to load connections. You can still view any cached data.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const startEditing = (index: number, connection: Connection) => {
    setEditingId(index)
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
      // In a real app, you would send a PATCH/PUT request to update the connection
      // const response = await fetch(`${apiEndpoint}/${connectionId}`, {
      //   method: 'PATCH',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(editData),
      // })

      // if (!response.ok) throw new Error('Failed to update connection')

      // Update local state
      const updatedConnections = connections.map((conn, idx) => {
        if (idx === connectionId) {
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
        title: "Success",
        description: "Connection updated successfully",
      })
    } catch (err) {
      toast({
        title: "Error",
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
      title: "Success",
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

  if (loading && connections.length === 0) {
    return (
      <div className="flex justify-center items-center h-40">
        <p>Loading connections...</p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-4">
        {error && (
          <div className="bg-destructive/10 text-destructive px-4 py-2 rounded-md">
            Error loading connections: {error}
            <Button onClick={fetchConnections} variant="link" className="ml-2 p-0 h-auto text-destructive">
              Retry
            </Button>
          </div>
        )}
        <div className="ml-auto flex justify-start">
          Connections
        </div>
        <div className="ml-auto flex justify-end">
          <Button onClick={downloadAsSheet} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Download as Sheet
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableCaption>A list of all property connections.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Property</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Moved In</TableHead>
              <TableHead>Paid</TableHead>
              <TableHead>Commission</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {connections.length > 0 ? (
              connections.map((connection, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{connection.connectionfullname}</TableCell>
                  <TableCell>{connection.contact}</TableCell>
                  <TableCell>{connection.propertydata.title}</TableCell>
                  <TableCell>{connection.propertydata.address}</TableCell>
                  <TableCell>
                    {editingId === index ? (
                      <Checkbox
                        checked={editData?.moved_in}
                        onCheckedChange={(checked) => handleEditChange("moved_in", !!checked)}
                      />
                    ) : connection.moved_in ? (
                      "Yes"
                    ) : (
                      "No"
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === index ? (
                      <Checkbox
                        checked={editData?.is_paid}
                        onCheckedChange={(checked) => handleEditChange("is_paid", !!checked)}
                      />
                    ) : connection.is_paid ? (
                      "Yes"
                    ) : (
                      "No"
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === index ? (
                      <Input
                        value={editData?.commission}
                        onChange={(e) => handleEditChange("commission", e.target.value)}
                        className="w-32"
                      />
                    ) : (
                      formatCurrency(connection.commission)
                    )}
                  </TableCell>
                  <TableCell>{new Date(connection.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    {editingId === index ? (
                      <div className="flex justify-end gap-2">
                        <Button size="icon" variant="outline" onClick={() => saveChanges(index)}>
                          <Save className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="outline" onClick={cancelEditing}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <Button size="icon" variant="outline" onClick={() => startEditing(index, connection)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                    )}
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
    </div>
  )
}

