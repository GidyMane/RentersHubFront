"use client"

import { useState } from "react"
import { Search, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

interface FiltersProps {
  totalResults: number
  location: string
  onSearch: (filters: any) => void
  showMap: boolean
  onToggleMap: () => void
}

export function Filters({ totalResults, location, onSearch, showMap, onToggleMap }: FiltersProps) {
  const [familyMode, setFamilyMode] = useState(false)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">
          {totalResults} Results <span className="text-muted-foreground">in {location}</span>
        </h1>
        <div className="flex items-center gap-4">
          {/* <div className="flex items-center gap-2">
            <span className="text-sm">Family mode</span>
            <Switch checked={familyMode} onCheckedChange={setFamilyMode} />
          </div> */}
          <div className="flex items-center gap-2">
            <span className="text-sm">Map View</span>
            <Switch checked={showMap} onCheckedChange={onToggleMap} />
          </div>
        </div>
      </div>

      {/* <div className="flex gap-2 flex-wrap">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by location..." className="pl-8" />
          </div>
        </div>
        <Select defaultValue="any-price">
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Price" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any-price">Any Price</SelectItem>
            <SelectItem value="100k-200k">$100k - $200k</SelectItem>
            <SelectItem value="200k-300k">$200k - $300k</SelectItem>
            <SelectItem value="300k+">$300k+</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="any-beds">
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Beds" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any-beds">Any Beds</SelectItem>
            <SelectItem value="1">1+ Beds</SelectItem>
            <SelectItem value="2">2+ Beds</SelectItem>
            <SelectItem value="3">3+ Beds</SelectItem>
            <SelectItem value="4">4+ Beds</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="all-types">
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Property Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-types">All Types</SelectItem>
            <SelectItem value="house">House</SelectItem>
            <SelectItem value="apartment">Apartment</SelectItem>
            <SelectItem value="condo">Condo</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline">
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          More
        </Button>
      </div> */}
    </div>
  )
}

