"use client"

import { Suspense } from "react"


import { baseUrl } from "@/utils/constants"
import ConnectionsTable from "@/components/admin/Connections/Connections"

export default function ConnectionsPage() {
  return (
    <div className="col-span-3 container">
      
       
          <Suspense fallback={<div className="flex h-40">Loading connections...</div>}>
            <ConnectionsTable apiEndpoint={`${baseUrl}accounts/connections`} />
          </Suspense>
       
     
    </div>
  )
}

