"use client"

import { CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export function SuccessModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 text-center">
        <div className="mb-4 flex justify-center">
          <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <h3 className="text-xl font-bold mb-2">SUCCESS!</h3>
        <p className="text-gray-700 mb-6">
          Renters Hub has received information regarding your vacant house.
          <br />
          <br />
          Please wait for the admin's verification and approval.
          <br />
          <br />
          Thank you.
        </p>
        <Button onClick={onClose} className="w-full h-12 text-base">
          Close
        </Button>
      </div>
    </div>
  )
}

