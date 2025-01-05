'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Building, Key, CheckCircle2, Phone } from 'lucide-react';

const SignUpForm = ({ onSubmit }: { onSubmit: (data: { contact: string; password: string; userType: string }) => void }) => {
  const [contact, setContact] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    if (!userType) {
      alert('Please select your role: Ground Agent or Landlord');
      return;
    }
    onSubmit({ contact, password, userType });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="signupContact" className="text-lg">Contact</Label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            id="signupContact"
            type="text"
            placeholder="Enter your phone number"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            className="pl-10 py-6 text-lg"
            required
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="signupPassword" className="text-lg">Password</Label>
        <div className="relative">
          <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            id="signupPassword"
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-10 py-6 text-lg"
            required
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-lg">Confirm Password</Label>
        <div className="relative">
          <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="pl-10 py-6 text-lg"
            required
          />
        </div>
      </div>
      <div className="space-y-4">
        <Label className="text-lg">I am a...</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setUserType('groundAgent')}
            className={`relative h-40 rounded-lg border-2 p-4 flex flex-col items-center justify-center ${
              userType === 'groundAgent' ? 'border-[#2ba808] bg-green-50' : 'border-gray-300'
            }`}
          >
            <User className="w-16 h-16 mb-2" />
            <span className="text-lg font-semibold">Ground Agent</span>
          </button>
          <button
            type="button"
            onClick={() => setUserType('landlord')}
            className={`relative h-40 rounded-lg border-2 p-4 flex flex-col items-center justify-center ${
              userType === 'landlord' ? 'border-blue-600 bg-blue-50' : 'border-gray-300'
            }`}
          >
            <Building className="w-16 h-16 mb-2" />
            <span className="text-lg font-semibold">Landlord</span>
          </button>
        </div>
      </div>
      <Button type="submit" className="w-full bg-[#2ba808] hover:bg-[#228606] text-white py-6 text-lg mt-4">
        Sign Up
      </Button>
    </form>
  );
};

export default SignUpForm;
