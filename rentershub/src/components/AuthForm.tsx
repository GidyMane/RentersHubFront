'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, Home, Key, Mail, Phone, User, CheckCircle2 } from 'lucide-react';

const AuthForm = () => {
  const [activeTab, setActiveTab] = useState('signin');
  const [contact, setContact] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState('');

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Sign In:', { contact, password });
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    if (!userType) {
      alert('Please select your role: Ground Agent or Landlord');
      return;
    }
    console.log('Sign Up:', { contact, password, userType });
  };

  return (
    <Card className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-[#2ba808] to-blue-600 text-white p-6">
        <CardTitle className="text-2xl font-bold">Welcome to RentersHub</CardTitle>
        <CardDescription className="text-white/80">
          Your gateway to smart Kenyan homes
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="signin" className="text-lg">Sign In</TabsTrigger>
            <TabsTrigger value="signup" className="text-lg">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="signin">
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signinContact" className="text-lg">Contact</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    id="signinContact"
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
                <Label htmlFor="signinPassword" className="text-lg">Password</Label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    id="signinPassword"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 py-6 text-lg"
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg mt-4">
                Sign In
              </Button>
            </form>
          </TabsContent>
          <TabsContent value="signup">
            <form onSubmit={handleSignUp} className="space-y-4">
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
                <div className="relative">
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-2 bg-white text-sm text-gray-500">Choose your role</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setUserType('groundAgent')}
                    className={`relative h-40 rounded-lg border-2 p-4 flex flex-col items-center justify-center hover:border-[#2ba808] transition-all ${
                      userType === 'groundAgent' ? 'border-[#2ba808] bg-green-50' : 'border-gray-300'
                    }`}
                  >
                    <User className={`w-16 h-16 mb-2 ${userType === 'groundAgent' ? 'text-[#2ba808]' : 'text-gray-400'}`} />
                    <span className="text-lg font-semibold">Ground Agent</span>
                    <span className="text-sm text-center">I help people find their perfect homes</span>
                    {userType === 'groundAgent' && (
                      <CheckCircle2 className="absolute top-2 right-2 w-6 h-6 text-[#2ba808]" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setUserType('landlord')}
                    className={`relative h-40 rounded-lg border-2 p-4 flex flex-col items-center justify-center hover:border-blue-600 transition-all ${
                      userType === 'landlord' ? 'border-blue-600 bg-blue-50' : 'border-gray-300'
                    }`}
                  >
                    <Building className={`w-16 h-16 mb-2 ${userType === 'landlord' ? 'text-blue-600' : 'text-gray-400'}`} />
                    <span className="text-lg font-semibold">Landlord</span>
                    <span className="text-sm text-center">I have properties to rent out</span>
                    {userType === 'landlord' && (
                      <CheckCircle2 className="absolute top-2 right-2 w-6 h-6 text-blue-600" />
                    )}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full bg-[#2ba808] hover:bg-[#228606] text-white py-6 text-lg mt-4">
                Sign Up
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AuthForm;

