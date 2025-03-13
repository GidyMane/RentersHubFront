"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import RoleSelector from "@/components/Auth/role-selector"
import AdminLoginForm from "@/components/Auth/AdminLogin"
import UserLoginForm from "@/components/Auth/user-login-form"

export default function LoginPage() {
  const searchParams = useSearchParams()
  const [selectedRole, setSelectedRole] = useState<string | null>(null)

  // Get role from URL query parameter
  useEffect(() => {
    const role = searchParams.get("role")
    if (role) {
      setSelectedRole(role.toUpperCase())
    }
  }, [searchParams])

  // Render the appropriate login form based on role
  const renderLoginForm = () => {
    if (!selectedRole) {
      return <RoleSelector onRoleSelect={setSelectedRole} />
    }

    if (selectedRole === "ADMIN") {
      return <AdminLoginForm />
    }

    return <UserLoginForm />
  }

  return <div className="min-h-screen bg-gray-50">{renderLoginForm()}</div>
}

