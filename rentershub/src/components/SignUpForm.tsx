'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

export default function SignUpForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [userType, setUserType] = useState('groundAgent')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle sign up logic here
    console.log('Sign Up:', { email, password, userType })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Contact</Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label>Sign Up As</Label>
        <RadioGroup value={userType} onValueChange={setUserType} className="flex space-x-4">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="groundAgent" id="groundAgent" />
            <Label htmlFor="groundAgent">Ground Agent</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="landlord" id="landlord" />
            <Label htmlFor="landlord">Landlord</Label>
          </div>
        </RadioGroup>
      </div>
      <Button type="submit" className="w-full bg-[#2ba808] hover:bg-[#228606]">
        Sign Up
      </Button>
    </form>
  )
}

