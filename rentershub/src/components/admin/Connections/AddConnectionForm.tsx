"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { baseUrl } from "@/utils/constants"
import { Plus, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Alert, AlertDescription } from "@/components/ui/alert"
import toast from "react-hot-toast"

interface Property {
  id: number
  title: string
  address: string
  owners_contact: string
  managed_by: string
}

export default function AddConnectionForm({ onConnectionAdded }: { onConnectionAdded: () => void }) {
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [properties, setProperties] = useState<Property[]>([])
  const [isLoadingProperties, setIsLoadingProperties] = useState(false)
  const [propertyError, setPropertyError] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    connectionfullname: "",
    contact: "",
    property: "",
    propertylink: "",
    moved_in: false,
    is_paid: false,
    commission: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (isOpen && properties.length === 0) {
      fetchProperties()
    }
  }, [isOpen])

  const fetchProperties = async () => {
    if (!session?.user?.accessToken) {
      setPropertyError("Authentication required to load properties")
      return
    }

    try {
      setIsLoadingProperties(true)
      setPropertyError(null)

      const response = await fetch(`${baseUrl}properties/`, {
        headers: {
          Authorization: `Bearer ${session.user.accessToken}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch properties: ${response.status}`)
      }

      const data = await response.json()
      setProperties(data.results || [])
    } catch (err) {
      console.error("Error fetching properties:", err)
      setPropertyError("Failed to load properties. Please try again later.")
    } finally {
      setIsLoadingProperties(false)
    }
  }

  const handleChange = (field: string, value: string | boolean) => {
    setFormData({
      ...formData,
      [field]: value,
    })

    // Clear error for this field when user makes changes
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: "",
      })
    }

    // Clear submit error when user makes any changes
    if (submitError) {
      setSubmitError(null)
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.connectionfullname.trim()) {
      newErrors.connectionfullname = "Name is required"
    }

    if (!formData.contact.trim()) {
      newErrors.contact = "Contact is required"
    } else if (!/^\+?[0-9\s-]{10,15}$/.test(formData.contact.trim())) {
      newErrors.contact = "Please enter a valid phone number"
    }

    if (!formData.property) {
      newErrors.property = "Property is required"
    }

    if (
      formData.propertylink &&
      !/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(formData.propertylink)
    ) {
      newErrors.propertylink = "Please enter a valid URL"
    }

    if (formData.commission && isNaN(Number(formData.commission))) {
      newErrors.commission = "Commission must be a number"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError(null)

    if (!validateForm()) {
      return
    }

    if (!session?.user?.accessToken) {
      setSubmitError("Authentication required. Please log in again.")
      return
    }

    try {
      setIsLoading(true)

      const payload = {
        ...formData,
        property: Number(formData.property),
        commission: formData.commission || "0",
      }

      const response = await fetch(`${baseUrl}accounts/connection/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.user.accessToken}`,
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.detail || `Failed to create connection: ${response.status}`)
      }

      toast.success("Connection created successfully")

      // Reset form
      setFormData({
        connectionfullname: "",
        contact: "",
        property: "",
        propertylink: "",
        moved_in: false,
        is_paid: false,
        commission: "",
      })

      // Close the sheet
      setIsOpen(false)

      // Safely call the refresh function
      try {
        onConnectionAdded()
      } catch (refreshError) {
        console.error("Error refreshing connections:", refreshError)
        toast.error("Connection was created but the list couldn't be refreshed. Please reload the page.")
      }
    } catch (err) {
      console.error("Error creating connection:", err)
      setSubmitError(err instanceof Error ? err.message : "Failed to create connection. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const retryFetchProperties = () => {
    fetchProperties()
  }

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open)
        if (!open) {
          // Reset errors when closing
          setErrors({})
          setSubmitError(null)
        }
      }}
    >
      <SheetTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Connection
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="mb-4">
          <SheetTitle>Add New Connection</SheetTitle>
          <SheetDescription>Create a new connection between a client and a property.</SheetDescription>
        </SheetHeader>

        {submitError && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{submitError}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="connectionfullname" className="required">
                Full Name
              </Label>
              <Input
                id="connectionfullname"
                value={formData.connectionfullname}
                onChange={(e) => handleChange("connectionfullname", e.target.value)}
                placeholder="John Doe"
                className={errors.connectionfullname ? "border-destructive" : ""}
              />
              {errors.connectionfullname && <p className="text-sm text-destructive">{errors.connectionfullname}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact" className="required">
                Contact Number
              </Label>
              <Input
                id="contact"
                value={formData.contact}
                onChange={(e) => handleChange("contact", e.target.value)}
                placeholder="+254 712 345 678"
                className={errors.contact ? "border-destructive" : ""}
              />
              {errors.contact && <p className="text-sm text-destructive">{errors.contact}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="property" className="required">
                Property
              </Label>
              {propertyError ? (
                <div className="space-y-2">
                  <Alert variant="destructive">
                    <AlertDescription>{propertyError}</AlertDescription>
                  </Alert>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={retryFetchProperties}
                    disabled={isLoadingProperties}
                    className="w-full"
                  >
                    {isLoadingProperties ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      "Retry Loading Properties"
                    )}
                  </Button>
                </div>
              ) : (
                <Select value={formData.property} onValueChange={(value) => handleChange("property", value)}>
                  <SelectTrigger id="property" className={errors.property ? "border-destructive" : ""}>
                    <SelectValue placeholder="Select a property" />
                  </SelectTrigger>
                  <SelectContent>
                    {isLoadingProperties ? (
                      <div className="flex items-center justify-center py-2">
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Loading properties...
                      </div>
                    ) : properties.length > 0 ? (
                      properties.map((property) => (
                        <SelectItem key={property.id} value={property.id.toString()}>
                          {property.title} - {property.address}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="p-2 text-center text-muted-foreground">No properties found</div>
                    )}
                  </SelectContent>
                </Select>
              )}
              {errors.property && <p className="text-sm text-destructive">{errors.property}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="propertylink">Property Link (Optional)</Label>
              <Input
                id="propertylink"
                value={formData.propertylink}
                onChange={(e) => handleChange("propertylink", e.target.value)}
                placeholder="https://example.com/property"
                className={errors.propertylink ? "border-destructive" : ""}
              />
              {errors.propertylink && <p className="text-sm text-destructive">{errors.propertylink}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="commission">Commission (Optional)</Label>
              <Input
                id="commission"
                value={formData.commission}
                onChange={(e) => handleChange("commission", e.target.value)}
                placeholder="5000"
                className={errors.commission ? "border-destructive" : ""}
              />
              {errors.commission && <p className="text-sm text-destructive">{errors.commission}</p>}
            </div>

            <div className="flex items-center justify-between pt-2">
              <Label htmlFor="moved_in" className="cursor-pointer">
                Moved In
              </Label>
              <Switch
                id="moved_in"
                checked={formData.moved_in}
                onCheckedChange={(checked) => handleChange("moved_in", checked)}
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <Label htmlFor="is_paid" className="cursor-pointer">
                Paid
              </Label>
              <Switch
                id="is_paid"
                checked={formData.is_paid}
                onCheckedChange={(checked) => handleChange("is_paid", checked)}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || isLoadingProperties || !!propertyError}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Connection
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}

