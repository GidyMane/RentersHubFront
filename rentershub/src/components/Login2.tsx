"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Phone, Key, Loader2, Eye, EyeOff, Home } from "lucide-react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { useId } from "react"

const LoginForm = () => {
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
      const response = await signIn("credentials", {
        contact: payload.contact,
        password: payload.password,
        redirect: false,
      })

      if (response?.ok) {
        toast.success("Login successful!")

        // Fetch session data to get user details
        const session = await fetch("/api/auth/session").then((res) => res.json())

        if (session?.user?.role) {
          const userRole = session.user.role

          if (userRole === "ADMIN") {
            router.push("/admin")
          } else if (["LANDLORD", "GROUND AGENT"].includes(userRole)) {
            router.push("/rentershub/Dashboard")
          } else {
            router.push("/") // Default redirect if role is unknown
          }
        } else {
          toast.warning("Your account is pending approval. Please wait for admin approval.")
        }
      } else {
        // Handle specific error cases
        if (response?.error) {
          if (response.error.includes("Invalid credentials")) {
            toast.error("Wrong password or phone number. Please try again.")
          } else if (response.error.includes("Account not found")) {
            toast.error("Account not found. Please sign up to create an account.")
          } else {
            toast.error(response.error)
          }
        } else {
          toast.error("Login failed. Please check your details and try again.")
        }
      }
    } catch (error: any) {
      console.error("Login error:", error)
      toast.error("Connection error. Please check your internet and try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className="flex min-h-screen flex-col lg:flex-row bg-gray-50"   style={{ fontFamily: "Georgia, serif" }}>
        {/* Home link - improved with better tap target for mobile */}
        <Link
          href="/"
          className="fixed top-4 left-4 flex items-center gap-2 text-[#1C4532] hover:text-[#153726] transition-colors z-10 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-sm"
          aria-label="Return to home page"
        >
          <Home className="h-5 w-5" />
          <span className="text-sm font-medium hidden sm:inline">Home</span>
        </Link>

        {/* Login Form Section */}
        <div className="flex-1 flex items-center justify-center p-4 sm:p-8 lg:p-12 pt-16 sm:pt-8">
          <Card className="w-full max-w-md border-none shadow-lg">
            <CardContent className="p-6 sm:p-8">
              <div className="space-y-6">
                <div className="space-y-2 text-center">
                  <h1 className="text-2xl sm:text-3xl font-bold text-[#1C4532]">Welcome to Renters Hub</h1>
                  <p className="text-gray-600 text-sm sm:text-base">
                    The Place Where Kenyans Come To Find Vacant Houses
                  </p>
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

                <div className="pt-2">
                  <p className="text-center text-sm text-gray-600">
                    Don't have an account?{" "}
                    <Link href="/signup" className="text-[#1C4532] hover:underline font-medium transition-colors">
                      Sign up
                    </Link>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Marketing Section - Improved with responsive image handling */}
        <div className="hidden lg:flex flex-1 bg-gradient-to-br from-[#1C4532] to-[#0F2419] items-center justify-center p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>
          <div className="max-w-lg text-white space-y-8 relative z-10">
            <h2 className="text-4xl font-serif italic leading-tight">
              Simplify Your
              <br />
              Rental Management
              <br />
              Experience
            </h2>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2 w-full aspect-video relative overflow-hidden shadow-xl transform transition-transform hover:scale-[1.02]">
              <div className="relative w-full h-full min-h-[200px]">
                <Image
                  src="/interior.jpg?height=400&width=600"
                  alt="RentersHub Property"
                  fill
                  sizes="(max-width: 768px) 100vw, 600px"
                  className="rounded-lg object-cover"
                  priority
                />
              </div>
            </div>
            <p className="text-lg">
              Renters Hub: Your all-in-one solution for efficient rental property management in Kenya.
            </p>
          </div>
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
    </>
  )
}

export default LoginForm

