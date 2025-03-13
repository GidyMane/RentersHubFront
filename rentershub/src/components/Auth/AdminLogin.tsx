"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Phone, Key, Loader2, Eye, EyeOff, ArrowLeft, Home } from "lucide-react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Link from "next/link"
import { useId } from "react"

export default function AdminLoginForm() {
  const [contact, setContact] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  // Generate unique IDs for accessibility
  const contactId = useId()
  const passwordId = useId()

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    if (!contact.trim()) {
      toast.error("Please enter your phone number")
      return
    }

    if (!password.trim()) {
      toast.error("Please enter your password")
      return
    }

    const payload = { contact, password }
    setIsLoading(true)

    try {
      // Attempt to sign in
      const response = await signIn("credentials", {
        contact: payload.contact,
        password: payload.password,
        redirect: false,
      })

      // Handle response based on status and error
      if (response?.status === 200) {
        if (!response.error) {
          // Fetch session data to determine user role
          const session = await fetch("/api/auth/session").then((res) => res.json())

          if (session?.user?.role === "ADMIN") {
            toast.success("Admin login successful!")
            router.push("/admin")
          } else {
            toast.error("You don't have admin privileges")
          }
        } else {
          toast.warning(response.error || "Authentication failed")
        }
      } else {
        toast.error("Wrong password or phone number. Please try again.")
      }
    } catch (error: any) {
      console.error("Login error:", error)
      toast.error("Connection error. Please check your internet and try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col lg:flex-row bg-gray-50" style={{ fontFamily: "Georgia, serif" }}>
        {/* Home link - improved with better tap target for mobile */}
                <Link
                  href="/"
                  className="fixed top-4 left-4 flex items-center gap-2 text-[#1C4532] hover:text-[#153726] transition-colors z-10 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-sm"
                  aria-label="Return to home page"
                >
                  <Home className="h-5 w-5" />
                  <span className="text-sm font-medium hidden sm:inline">Home</span>
                </Link>
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 lg:p-12 pt-16 sm:pt-8">
        <Card className="w-full max-w-md border-none shadow-lg">
          <CardContent className="p-6 sm:p-8">
            <div className="space-y-6">
              <Button
                variant="ghost"
                className="p-0 h-8 text-gray-500 hover:text-[#1C4532] -mt-2"
                onClick={() => router.push("/login")}
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to selection
              </Button>

              <div className="space-y-2 text-center">
                <h1 className="text-2xl sm:text-3xl font-bold text-[#1C4532]">Admin Login</h1>
                <p className="text-gray-600 text-sm sm:text-base">Access your admin dashboard</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor={contactId} className="text-sm font-medium">
                    Phone Number
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      id={contactId}
                      type="tel"
                      inputMode="tel"
                      placeholder="Enter your phone number"
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      className="pl-10 h-12 border-gray-200 rounded-md focus:ring-2 focus:ring-[#1C4532]/20 transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor={passwordId} className="text-sm font-medium">
                      Password
                    </Label>
                    <Link href="/forgot-password" className="text-xs text-[#1C4532] hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      id={passwordId}
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 h-12 border-gray-200 rounded-md focus:ring-2 focus:ring-[#1C4532]/20 transition-all"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={togglePasswordVisibility}
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-10 w-10 p-0"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-500" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-500" />
                      )}
                    </Button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#1C4532] hover:bg-[#153726] text-white h-12 text-base font-medium rounded-md transition-colors"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Signing In...
                    </span>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Admin-specific sidebar */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-[#1C4532] to-[#0F2419] items-center justify-center p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>
        <div className="max-w-lg text-white space-y-8 relative z-10">
          <h2 className="text-4xl font-serif italic leading-tight">
            Admin Portal
            <br />
            Renters Hub
            <br />
            Management
          </h2>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2 w-full aspect-video relative overflow-hidden shadow-xl">
            <div className="relative w-full h-full min-h-[200px]">
              <img
                src="/interior3.jpg?height=400&width=600"
                alt="Admin Dashboard"
                className="rounded-lg object-cover w-full h-full"
              />
            </div>
          </div>
          <p className="text-lg">Access your admin dashboard to manage properties, users, and platform settings.</p>
        </div>
      </div>

      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  )
}

