'use client'

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye, UserPlus, FileText } from 'lucide-react'

interface PropertyCardProps {
  name: string
  address: string
  units: number
  occupancyRate: number
  status: 'Active' | 'Off Market'
  lastUpdated: string
  metrics: {
    views: number
    leads: number
    applications: number
  }
  imageUrl: string
}

export function PropertyCard({
  name,
  address,
  units,
  occupancyRate,
  status,
  lastUpdated,
  metrics,
  imageUrl
}: PropertyCardProps) {
  const statusColor = {
    'Active': 'bg-[#1C4532] text-white',
    'Off Market': 'bg-gray-500 text-white'
  }[status]

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48 overflow-hidden">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>
      <CardHeader className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-lg text-[#1C4532]">{name}</h3>
            <p className="text-sm text-gray-600">{address}</p>
          </div>
          <Badge className={`${statusColor}`}>
            {status}
          </Badge>
        </div>
        <div className="text-sm text-gray-600 mt-1">
          {units} units, {occupancyRate}% occupancy rate
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="text-sm text-gray-500">
          Updated {lastUpdated}
        </div>
        <div className="mt-4 grid grid-cols-3 gap-4 text-center border-t pt-4">
          <div>
            <div className="flex items-center justify-center gap-1 text-[#2C7BE5]">
              <Eye className="w-4 h-4" />
              <span className="font-semibold">{metrics.views}</span>
            </div>
            <div className="text-xs text-gray-600 mt-1">Views</div>
          </div>
          <div>
            <div className="flex items-center justify-center gap-1 text-[#2C7BE5]">
              <UserPlus className="w-4 h-4" />
              <span className="font-semibold">{metrics.leads}</span>
            </div>
            <div className="text-xs text-gray-600 mt-1">Leads</div>
          </div>
          <div>
            <div className="flex items-center justify-center gap-1 text-[#2C7BE5]">
              <FileText className="w-4 h-4" />
              <span className="font-semibold">{metrics.applications}</span>
            </div>
            <div className="text-xs text-gray-600 mt-1">Applications</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

