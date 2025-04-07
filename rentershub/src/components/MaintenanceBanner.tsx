"use client"

import type React from "react"
import { AlertTriangle, X } from "lucide-react"

interface MaintenanceBannerProps {
  message?: string
  estimatedUptime?: string
  onClose?: () => void
}

export const MaintenanceBanner: React.FC<MaintenanceBannerProps> = ({
  message = "Some features are temporarily unavailable due to maintenance.",
  estimatedUptime,
  onClose,
}) => {
  return (
    <div className="bg-blue-500 text-white p-3 relative">
      <div className="container mx-auto flex items-center justify-center">
        <AlertTriangle className="mr-2 h-5 w-5 flex-shrink-0" />
        <p className="text-sm md:text-base text-center">
          {message}
          {estimatedUptime && <span className="ml-1">We'll be fully operational {estimatedUptime}.</span>}
        </p>
        {onClose && (
          <button
            onClick={onClose}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-200"
            aria-label="Close banner"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  )
}

