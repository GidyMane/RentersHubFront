"use client"

import { Button } from "@/components/ui/button"
import { LayoutGrid, List } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface FilterBarProps {
  view: "grid" | "list"
  onViewChange: (view: "grid" | "list") => void
  status: string
  onStatusChange: (status: string) => void
  sortOrder: string
  onSortOrderChange: (sortOrder: string) => void
}

export function FilterBar({
  view,
  onViewChange,
  status,
  onStatusChange,
  sortOrder,
  onSortOrderChange,
}: FilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      {/* Status filter */}
      <div className="w-full sm:w-auto">
        <Select value={status} onValueChange={onStatusChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Properties</SelectItem>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="unavailable">Unavailable</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-4 w-full sm:w-auto">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Show as</span>
          <div className="flex items-center border rounded-md">
            <Button
              variant="ghost"
              size="sm"
              className={`px-2 ${view === "grid" ? "bg-gray-100" : ""}`}
              onClick={() => onViewChange("grid")}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`px-2 ${view === "list" ? "bg-gray-100" : ""}`}
              onClick={() => onViewChange("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <Select value={sortOrder} onValueChange={onSortOrderChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest to Oldest</SelectItem>
            <SelectItem value="oldest">Oldest to Newest</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

