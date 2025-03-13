"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { User, Shield, ArrowRight } from "lucide-react"

interface RoleSelectorProps {
  onRoleSelect: (role: string) => void
}

export default function RoleSelector({ onRoleSelect }: RoleSelectorProps) {
  return (
    <div className="flex min-h-screen items-center justify-center p-4" style={{ fontFamily: "Georgia, serif" }}>
      <Card className="w-full max-w-md border-none shadow-lg">
        <CardContent className="p-6 sm:p-8">
          <div className="space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="text-2xl sm:text-3xl font-bold text-[#1C4532]">Welcome Back</h1>
              <p className="text-gray-600 text-sm sm:text-base">Please select your account type to continue</p>
            </div>

            <div className="grid gap-4">
              <Button
                onClick={() => onRoleSelect("ADMIN")}
                className="flex items-center justify-between p-6 bg-white hover:bg-gray-50 text-[#1C4532] border-2 border-[#1C4532] hover:border-[#153726] transition-colors"
                variant="outline"
              >
                <div className="flex items-center">
                  <Shield className="h-5 w-5 mr-3" />
                  <span className="font-medium">Admin</span>
                </div>
                <ArrowRight className="h-5 w-5" />
              </Button>

              <Button
                onClick={() => onRoleSelect("USER")}
                className="flex items-center justify-between p-6 bg-[#1C4532] hover:bg-[#153726] text-white transition-colors"
              >
                <div className="flex items-center">
                  <User className="h-5 w-5 mr-3" />
                  <span className="font-medium">Landlord / Ground Agent</span>
                </div>
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

