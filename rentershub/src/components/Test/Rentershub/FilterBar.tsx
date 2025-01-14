'use client'

import { Button } from "@/components/ui/button"
import { LayoutGrid, List, ChevronDown } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface FilterBarProps {
  view: 'grid' | 'list'
  onViewChange: (view: 'grid' | 'list') => void
  status: string
  onStatusChange: (status: string) => void
}

export function FilterBar({
  view,
  onViewChange,
  status,
  onStatusChange
}: FilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className={status === 'all' ? 'bg-[#1C4532] text-white' : ''}
          onClick={() => onStatusChange('all')}
        >
          All <span className="ml-1 text-xs">(12)</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          className={status === 'active' ? 'bg-[#1C4532] text-white' : ''}
          onClick={() => onStatusChange('active')}
        >
          Active <span className="ml-1 text-xs">(8)</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          className={status === 'off-market' ? 'bg-[#1C4532] text-white' : ''}
          onClick={() => onStatusChange('off-market')}
        >
          Off Market <span className="ml-1 text-xs">(4)</span>
        </Button>
      </div>
      <div className="flex items-center gap-4 w-full sm:w-auto">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Show as</span>
          <div className="flex items-center border rounded-md">
            <Button
              variant="ghost"
              size="sm"
              className={`px-2 ${view === 'grid' ? 'bg-gray-100' : ''}`}
              onClick={() => onViewChange('grid')}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`px-2 ${view === 'list' ? 'bg-gray-100' : ''}`}
              onClick={() => onViewChange('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <Select defaultValue="newest">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest to Oldest</SelectItem>
            <SelectItem value="oldest">Oldest to Newest</SelectItem>
            <SelectItem value="views">Most Views</SelectItem>
            <SelectItem value="leads">Most Leads</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

