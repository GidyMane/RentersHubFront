<<<<<<< HEAD
'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { User, Building, Phone, Mail, Lock, UserPlus, CheckCircle2, ArrowLeft, ArrowRight } from 'lucide-react';
import Image from 'next/image';

interface Role {
  pk: number;
  role: string;
}

const SignUpForm = () => {
  const [step, setStep] = useState(1);
  const [roles, setRoles] = useState<Role[]>([]);
  const [userType, setUserType] = useState<string | null>(null);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const baseUrl = 'https://rentershubservicev1.onrender.com/api/v1/';

  const totalSteps = 4;

  const fetchRoles = async () => {
    try {
      const response = await axios.get(`${baseUrl}accounts/roles`);
      const filteredRoles = response.data.result.filter(
        (role: { role: string }) => role.role === 'LANDLORD' || role.role === 'GROUNDAGENT'
      );
      setRoles(filteredRoles);
    } catch (error) {
      toast.error('Error fetching roles. Please try again.');
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleRoleSelect = (role: string) => {
    setUserType(role.toLowerCase());
    setStep(2); // Move to phone number s
  };

  const handleSendOtp = async () => {
    if (!phone) {
      toast.warning('Please enter a valid phone number.');
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.post(`${baseUrl}accounts/create/otp`, { contact: phone });
      console.log('OTP sent response:', response.data);  
      toast.success(`An OTP has been sent to ${phone}`);
      setStep(3);
    } catch (error) {
      toast.error('Failed to send OTP. Please try again.');
      console.error('Error sending OTP:', error);
    } finally {
      setIsLoading(false);
    }
  };
  

  const handleVerifyOtp = async () => {
    if (!otp) {
      toast.warning('Please enter the OTP.');
      return;
    }
    setIsLoading(true);
    try {
      await axios.post(`${baseUrl}accounts/verify/otp`, { otp });
      toast.success('Phone number verified successfully.');
      setStep(4);
    } catch (error) {
      toast.error('Invalid OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }

    const selectedRole = roles.find((role) => role.role.toLowerCase() === userType);
    if (!selectedRole) {
      toast.warning('Please select your role: Ground Agent or Landlord');
      return;
    }

=======
"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"
import { toast, ToastContainer } from "react-toastify"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { User, Building, Mail, Lock, UserPlus, CheckCircle2, ArrowLeft, ArrowRight, EyeOff, Eye } from "lucide-react"
import Image from "next/image"
import { baseUrl } from "@/utils/constants"
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp"

interface Role {
  pk: number
  role: string
}

const SignUpForm = () => {
  const [step, setStep] = useState(1)
  const [roles, setRoles] = useState<Role[]>([])
  const [userType, setUserType] = useState<string | null>(null)
  const [phone, setPhone] = useState("")
  const [otp, setOtp] = useState("")
  const [email, setEmail] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter()

  const totalSteps = 4

  const fetchRoles = useCallback(async () => {
    try {
      const response = await axios.get(`${baseUrl}accounts/roles`)
      const filteredRoles = response.data.result.filter(
        (role: { role: string }) => role.role === "LANDLORD" || role.role === "GROUNDAGENT",
      )
      setRoles(filteredRoles)
    } catch (error) {
      toast.error("Error fetching roles. Please try again.")
    }
  }, [])

  useEffect(() => {
    fetchRoles()
  }, [fetchRoles])

  const handleRoleSelect = (role: string) => {
    setUserType(role.toLowerCase())
    setStep(2) // Move to phone number step
  }

  const handleSendOtp = async () => {
    if (!phone) {
      toast.warning("Please enter a valid phone number.")
      return
    }
    setIsLoading(true)
    try {
      const response = await axios.post(`${baseUrl}accounts/create/otp`, { contact: `0${phone}` })
      toast.success(`An OTP has been sent to 0${phone}`)
      setStep(3)
    } catch (error) {
      toast.error("Failed to send OTP. Please try again.")
      console.error("Error sending OTP:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOtp = async () => {
    if (!otp) {
        toast.warning("Please enter the OTP.");
        return;
    }

    setIsLoading(true);
    try {
        // Ensure the phone number starts with '0'
        const formattedPhone = phone.startsWith("0") ? phone : `0${phone}`;
        

        await axios.post(`${baseUrl}accounts/verify/otp`, { 
            otp, 
            contact: formattedPhone  // Sending phone number with OTP
        });

        toast.success("Phone Number verified Successfully.");
        setStep(4);
    } catch (error) {
        toast.error("Invalid OTP. Please try again.");
    } finally {
        setIsLoading(false);
    }
};


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
  
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!")
      return
    }
  
    const selectedRole = roles.find((role) => role.role.toLowerCase() === userType)
    if (!selectedRole) {
      toast.warning("Please select your role: Ground Agent or Landlord")
      return
    }
  
>>>>>>> da2dc9da5fc186335cc48ca707f8b25d5cfb93b6
    const payload = {
      email,
      password,
      first_name: firstName,
      last_name: lastName,
      role: selectedRole.pk,
      contact: `0${phone}`,
      username,
<<<<<<< HEAD
    };

    setIsLoading(true);
    try {
      await axios.post(`${baseUrl}accounts/create/user/`, payload);
      toast.success('Sign-up completed successfully!');
      router.push('/successmessage'); // Redirect to success page
    } catch (error) {
      toast.error('Failed to complete sign-up. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => setStep((prevStep) => Math.min(prevStep + 1, totalSteps));
  const prevStep = () => setStep((prevStep) => Math.max(prevStep - 1, 1));

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="flex-1 flex items-center justify-center p-8">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="mb-6 text-center">
              <h1 className="text-3xl font-bold text-[#1C4532]">Join RentersHub</h1>
              <p className="text-gray-600 mt-2">Simplify your rental management journey</p>
            </div>

            <Progress value={(step / totalSteps) * 100} className="mb-6" />

            <ToastContainer />

            {step === 1 && (
              <div className="space-y-6">
                <Label className="text-lg font-medium block mb-4">I am a...</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {roles.map((role) => (
                    <Button
                      key={role.pk}
                      type="button"
                      onClick={() => handleRoleSelect(role.role)}
                      className={`h-24 sm:h-32 flex flex-col items-center justify-center ${
                        userType === role.role.toLowerCase()
                          ? 'bg-[#1C4532] text-white'
                          : 'bg-white text-[#1C4532] border-2 border-[#1C4532]'
                      } hover:bg-[#1C4532] hover:text-white transition-all rounded-xl`}
                    >
                      {role.role === 'GROUNDAGENT' ? (
                        <User className="w-8 h-8 mb-2" />
                      ) : (
                        <Building className="w-8 h-8 mb-2" />
                      )}
                      <span className="text-sm sm:text-lg font-medium">{role.role}</span>
                    </Button>
                  ))}
=======
    }
  
    setIsLoading(true)
    try {
      const response = await axios.post(`${baseUrl}accounts/create/user/`, payload)
  
      // Handle successful response
      toast.success(response.data?.message || "Renters Hub has received your application to advertise on the website. Please wait for verification and approval by the admin.")
      router.push("/successmessage") // Redirect to success page
    } catch (error: any) {if (error.response?.data) {
      const errorData = error.response.data

      // Loop through error object and display messages
      Object.entries(errorData).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          // If the error message is an array (Django Rest Framework often returns lists)
          value.forEach((msg) => toast.error(` ${msg}`))
        } else {
          toast.error(`${value}`)
        }
      })
    } else {
      toast.error("Failed to complete sign-up. Please try again.")
    }
    } finally {
      setIsLoading(false)
    }
  }
  
  

  const nextStep = () => setStep((prevStep) => Math.min(prevStep + 1, totalSteps))
  const prevStep = () => setStep((prevStep) => Math.max(prevStep - 1, 1))

  // Get step title based on current step
  const getStepTitle = () => {
    switch (step) {
      case 1:
        return "Select Your Role"
      case 2:
        return "Enter Phone Number"
      case 3:
        return "Verify OTP"
      case 4:
        return "Complete Your Profile"
      default:
        return "Join Renters Hub"
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50" style={{ fontFamily: "Georgia, serif" }}>
      {/* Left side - Form */}
      <div className="flex-1 flex flex-col justify-center p-4 sm:p-6 md:p-8">
        <Card className="w-full max-w-md mx-auto shadow-lg border-0">
          <CardHeader className="pb-2 space-y-1">
            <CardTitle className="text-2xl font-bold text-center text-[#1C4532]">Join Renters Hub</CardTitle>
            <CardDescription className="text-center text-sm">{getStepTitle()}</CardDescription>
          </CardHeader>

          <CardContent className="pt-4">
            <Progress value={(step / totalSteps) * 100} className="h-2 mb-6" />

            <ToastContainer position="top-center" autoClose={3000} />

            {step === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {roles.map((role) => {
                    const displayRole =
                      role.role === "GROUNDAGENT" ? "Ground Agent" : role.role === "LANDLORD" ? "Landlord" : role.role
                    return (
                      <Button
                        key={role.pk}
                        type="button"
                        onClick={() => handleRoleSelect(role.role)}
                        className={`h-20 flex flex-col items-center justify-center ${
                          userType === role.role.toLowerCase()
                            ? "bg-[#1C4532] text-white"
                            : "bg-white text-[#1C4532] border-2 border-[#1C4532]"
                        } hover:bg-[#1C4532] hover:text-white transition-all rounded-xl`}
                      >
                        {role.role === "GROUNDAGENT" ? (
                          <User className="w-6 h-6 mb-1" />
                        ) : (
                          <Building className="w-6 h-6 mb-1" />
                        )}
                        <span className="text-sm font-medium">{displayRole}</span>
                      </Button>
                    )
                  })}
>>>>>>> da2dc9da5fc186335cc48ca707f8b25d5cfb93b6
                </div>
              </div>
            )}

            {step === 2 && (
<<<<<<< HEAD
              <form className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium">Phone Number</Label>
                  <div className="flex">
                    <div className="flex items-center bg-gray-100 px-3 rounded-l-md border border-r-0 border-gray-300">
                      <Image
                        src="/kenya-flag.svg"
                        alt="Kenyan Flag"
                        width={24}
                        height={16}
                        className="mr-2"
                      />
                      <span className="text-gray-500">+254</span>
=======
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium">
                    Phone Number
                  </Label>
                  <div className="flex">
                    <div className="flex items-center bg-gray-100 px-3 rounded-l-md border border-r-0 border-gray-300">
                      <Image src="/kenya-flag.svg" alt="Kenyan Flag" width={20} height={14} className="mr-1" />
                      <span className="text-gray-500 text-sm">+254</span>
>>>>>>> da2dc9da5fc186335cc48ca707f8b25d5cfb93b6
                    </div>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="7XXXXXXXX"
                      value={phone}
<<<<<<< HEAD
                      onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, '').slice(0, 9))}
=======
                      onChange={(e) => {
                        let input = e.target.value.replace(/[^0-9]/g, "")
                        if (input.startsWith("0")) {
                          input = input.slice(1)
                        }
                        setPhone(input.slice(0, 9))
                      }}
>>>>>>> da2dc9da5fc186335cc48ca707f8b25d5cfb93b6
                      className="rounded-l-none flex-1"
                      required
                    />
                  </div>
<<<<<<< HEAD
=======
                  <p className="text-xs text-gray-500 mt-1">We'll send a verification code to this number</p>
>>>>>>> da2dc9da5fc186335cc48ca707f8b25d5cfb93b6
                </div>
                <Button
                  type="button"
                  onClick={handleSendOtp}
                  className="w-full bg-[#1C4532] hover:bg-[#153726] text-white"
                  disabled={isLoading || phone.length !== 9}
                >
<<<<<<< HEAD
                  {isLoading ? 'Sending OTP...' : 'Send OTP'}
=======
                  {isLoading ? "Sending OTP..." : "Send OTP"}
>>>>>>> da2dc9da5fc186335cc48ca707f8b25d5cfb93b6
                </Button>
              </form>
            )}

            {step === 3 && (
<<<<<<< HEAD
              <form className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="otp" className="text-sm font-medium">Enter OTP</Label>
                  <div className="flex justify-between">
                    {[...Array(6)].map((_, index) => (
                      <Input
                        key={index}
                        type="text"
                        maxLength={1}
                        className="w-10 h-12 text-center text-2xl"
                        value={otp[index] || ''}
                        onChange={(e) => {
                          const newOtp = otp.split('');
                          newOtp[index] = e.target.value;
                          setOtp(newOtp.join(''));
                          if (e.target.value && e.target.nextElementSibling) {
                            (e.target.nextElementSibling as HTMLInputElement).focus();
                          }
                        }}
                        required
                      />
                    ))}
                  </div>
=======
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp" className="text-sm font-medium">
                    Enter Verification Code
                  </Label>
                  <InputOTP maxLength={6} value={otp} onChange={(value) => setOtp(value)} className="justify-center">
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                  <p className="text-xs text-gray-500 text-center mt-1">
                    Didn't receive the code?{" "}
                    <Button variant="link" className="text-[#1C4532] p-0 h-auto text-xs" onClick={handleSendOtp}>
                      Resend
                    </Button>
                  </p>
>>>>>>> da2dc9da5fc186335cc48ca707f8b25d5cfb93b6
                </div>
                <Button
                  type="button"
                  onClick={handleVerifyOtp}
                  className="w-full bg-[#1C4532] hover:bg-[#153726] text-white"
                  disabled={isLoading || otp.length !== 6}
                >
<<<<<<< HEAD
                  {isLoading ? 'Verifying...' : 'Verify OTP'}
=======
                  {isLoading ? "Verifying..." : "Verify Code"}
>>>>>>> da2dc9da5fc186335cc48ca707f8b25d5cfb93b6
                </Button>
              </form>
            )}

            {step === 4 && (
<<<<<<< HEAD
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-sm font-medium">First Name</Label>
=======
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid grid-cols-1 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="firstName" className="text-xs font-medium">
                      First Name
                    </Label>
>>>>>>> da2dc9da5fc186335cc48ca707f8b25d5cfb93b6
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="First name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
<<<<<<< HEAD
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-sm font-medium">Last Name</Label>
=======
                      className="h-9"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="lastName" className="text-xs font-medium">
                      Last Name
                    </Label>
>>>>>>> da2dc9da5fc186335cc48ca707f8b25d5cfb93b6
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Last name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
<<<<<<< HEAD
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-sm font-medium">Username</Label>
                  <div className="relative">
                    <UserPlus className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
=======
                      className="h-9"
                    />
                  </div>
                </div>

                {/* <div className="space-y-1">
                  <Label htmlFor="username" className="text-xs font-medium">
                    Username
                  </Label>
                  <div className="relative">
                    <UserPlus className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
>>>>>>> da2dc9da5fc186335cc48ca707f8b25d5cfb93b6
                    <Input
                      id="username"
                      type="text"
                      placeholder="Choose a username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
<<<<<<< HEAD
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Create a strong password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-[#1C4532] hover:bg-[#153726] text-white"
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'}
=======
                      className="pl-8 h-9"
                      required
                    />
                  </div>
                </div> */}
{/* 
                <div className="space-y-1">
                  <Label htmlFor="email" className="text-xs font-medium">
                    Email (optional)
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-8 h-9"
                    />
                  </div>
                </div> */}

<div className="space-y-1">
        <Label htmlFor="password" className="text-xs font-medium">
          Password
        </Label>
        <div className="relative">
          <Lock className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Create a strong password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-8 pr-10 h-9"
            required
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <div className="space-y-1">
        <Label htmlFor="confirmPassword" className="text-xs font-medium">
          Confirm Password
        </Label>
        <div className="relative">
          <Lock className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            id="confirmPassword"
            type={showPassword ? "text" : "password"}
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="pl-8 pr-10 h-9"
            required
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
      </div>
  

                <Button
                  type="submit"
                  className="w-full bg-[#1C4532] hover:bg-[#153726] text-white mt-4"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating Account..." : "Create Account"}
>>>>>>> da2dc9da5fc186335cc48ca707f8b25d5cfb93b6
                </Button>
              </form>
            )}

<<<<<<< HEAD
            <div className="mt-6 flex justify-between">
              {step > 1 && (
                <Button type="button" onClick={prevStep} variant="outline" className="flex items-center">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
              )}
              {step < totalSteps && step !== 3 && (
                <Button type="button" onClick={nextStep} className="ml-auto flex items-center">
                  Next <ArrowRight className="ml-2 h-4 w-4" />
=======
            <div className="mt-4 flex justify-between">
              {step > 1 && (
                <Button type="button" onClick={prevStep} variant="outline" size="sm" className="flex items-center h-8">
                  <ArrowLeft className="mr-1 h-3 w-3" /> Back
                </Button>
              )}
              {step < totalSteps && step !== 2 && step !== 3 && (
                <Button
                  type="button"
                  onClick={nextStep}
                  size="sm"
                  className="ml-auto flex items-center h-8 bg-[#1C4532] hover:bg-[#153726]"
                >
                  Next <ArrowRight className="ml-1 h-3 w-3" />
>>>>>>> da2dc9da5fc186335cc48ca707f8b25d5cfb93b6
                </Button>
              )}
            </div>

<<<<<<< HEAD
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Already have an account?{' '}
                <Button
                  type="button"
                  variant="link"
                  className="text-[#1C4532] hover:underline"
                  onClick={() => router.push('/login')}
=======
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">
                Already have an account?{" "}
                <Button
                  type="button"
                  variant="link"
                  className="text-[#1C4532] hover:underline p-0 h-auto text-xs"
                  onClick={() => router.push("/login")}
>>>>>>> da2dc9da5fc186335cc48ca707f8b25d5cfb93b6
                >
                  Back to Login
                </Button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
<<<<<<< HEAD
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-[#1C4532] to-[#0F2419] items-center justify-center p-2">
        <div className="max-w-lg text-white space-y-8">
          <h2 className="text-4xl font-serif italic">
            Streamline Your
            <br />
            Rental Business
            <br />
            with RentersHub
          </h2>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 w-full aspect-video relative overflow-hidden">
            <Image
              src="/interior3.jpg?height=400&width=600"
              alt="RentersHub Dashboard Preview"
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
          </div>
          <ul className="space-y-2">
            <li className="flex items-center">
              <CheckCircle2 className="mr-2 h-5 w-5 text-green-400" />
              Effortless property management
            </li>
            <li className="flex items-center">
              <CheckCircle2 className="mr-2 h-5 w-5 text-green-400" />
              Secure rent collection
            </li>
            <li className="flex items-center">
              <CheckCircle2 className="mr-2 h-5 w-5 text-green-400" />
              Real-time analytics and reporting
=======

      {/* Right side - Promotional content */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-[#1C4532] to-[#0F2419] items-center justify-center p-8">
        <div className="max-w-md text-white space-y-6">
          <h2 className="text-3xl font-serif italic leading-tight">
            Streamline Your Rental Experience with Renters Hub
          </h2>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 w-full relative overflow-hidden h-64">
            <Image
              src="/interior3.jpg?height=400&width=600"
              alt="RentersHub Dashboard Preview"
              fill
              style={{ objectFit: "cover" }}
              className="rounded-lg"
            />
          </div>

          <ul className="space-y-3 text-sm">
            <li className="flex items-center">
              <CheckCircle2 className="mr-2 h-4 w-4 text-green-400 flex-shrink-0" />
              <span>Effortless property management</span>
            </li>
            <li className="flex items-center">
              <CheckCircle2 className="mr-2 h-4 w-4 text-green-400 flex-shrink-0" />
              <span>Connect You with Tenants</span>
            </li>
            <li className="flex items-center">
              <CheckCircle2 className="mr-2 h-4 w-4 text-green-400 flex-shrink-0" />
              <span>Help You Maintain a Good Reputation </span>
>>>>>>> da2dc9da5fc186335cc48ca707f8b25d5cfb93b6
            </li>
          </ul>
        </div>
      </div>
    </div>
<<<<<<< HEAD
  );
};

export default SignUpForm;
=======
  )
}

export default SignUpForm
>>>>>>> da2dc9da5fc186335cc48ca707f8b25d5cfb93b6

