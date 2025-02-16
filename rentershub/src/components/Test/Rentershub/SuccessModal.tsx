'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { CheckCircle2 } from 'lucide-react'

interface SuccessModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SuccessModal({ isOpen, onClose }: SuccessModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            <div className="flex flex-col items-center">
              <CheckCircle2 className="h-12 w-12 text-[#1C4532] mb-4" />
              <span className="text-2xl font-bold text-[#1C4532]">SUCCESS!</span>
            </div>
          </DialogTitle>
        </DialogHeader>
        <div className="text-center space-y-4">
          <p className="text-gray-600">
            Renters Hub has received information regarding your vacant house.
          </p>
          <p className="text-gray-600">
            Please wait for the admin's verification and approval.
          </p>
          <p className="text-[#1C4532] font-medium">
            Thank you.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}

