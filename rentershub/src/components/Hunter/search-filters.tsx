"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SearchFiltersProps {
  onSearch: (filters: {
    location: string
    type: string
    priceRange: string
  }) => void
}

export function SearchFilters({ onSearch }: SearchFiltersProps) {
  const [location, setLocation] = useState("Sleman Yogyakarta")
  const [type, setType] = useState("All Type")
  const [priceRange, setPriceRange] = useState("$100,000 - $500,000")

  const handleApply = () => {
    onSearch({ location, type, priceRange })
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 p-4 bg-background border rounded-lg">
      <div className="flex-1">
        <label className="text-sm text-muted-foreground">Location</label>
        <Select value={location} onValueChange={setLocation}>
          <SelectTrigger>
            <SelectValue placeholder="Select location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Sleman Yogyakarta">Sleman Yogyakarta</SelectItem>
            <SelectItem value="Jakarta">Jakarta</SelectItem>
            <SelectItem value="Bali">Bali</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1">
        <label className="text-sm text-muted-foreground">Unit Type</label>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All Type">All Type</SelectItem>
            <SelectItem value="House">House</SelectItem>
            <SelectItem value="Apartment">Apartment</SelectItem>
            <SelectItem value="Villa">Villa</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1">
        <label className="text-sm text-muted-foreground">Price</label>
        <Select value={priceRange} onValueChange={setPriceRange}>
          <SelectTrigger>
            <SelectValue placeholder="Select price range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="$100,000 - $500,000">$100,000 - $500,000</SelectItem>
            <SelectItem value="$500,000 - $1,000,000">$500,000 - $1,000,000</SelectItem>
            <SelectItem value="$1,000,000+">$1,000,000+</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-end">
        <Button className="w-full md:w-auto" onClick={handleApply}>
          Apply
        </Button>
      </div>
    </div>
  )
}

