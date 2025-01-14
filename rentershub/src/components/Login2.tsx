'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Phone, Key } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Image from 'next/image';

const LoginForm = () => {
  const [contact, setContact] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { contact, password };
    setIsLoading(true);

    try {
      const response = await signIn('credentials', {
        contact: payload.contact,
        password: payload.password,
        redirect: false,
      });

      if (response?.ok) {
        toast.success('Login successful!');
        router.push('/');
      } else {
        if (response?.error) {
          if (response.error.includes('No active account')) {
            toast.error('Account not found. Please sign up.');
          } else if (response.error.includes('Invalid credentials')) {
            toast.error('Wrong password or invalid credentials.');
          } else {
            toast.error(response.error);
          }
        } else {
          toast.error('Login failed. Please try again.');
        }
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-[#1C4532]">Welcome RentersHub</h1>
            <p className="text-gray-600">Where Smart Kenyans Come to Find Homes</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="signinContact" className="text-sm font-medium">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  id="signinContact"
                  type="text"
                  placeholder="Enter your phone number"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className="pl-10 h-12 border-gray-200"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="signinPassword" className="text-sm font-medium">Password</Label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  id="signinPassword"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-12 border-gray-200"
                  required
                />
              </div>
            </div>
            <Button
              type="submit"
              className="w-full bg-[#1C4532] hover:bg-[#153726] text-white h-12 text-base font-medium"
              disabled={isLoading}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>
          <p className="text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <a href="/signup" className="text-[#1C4532] hover:underline font-medium">
              Sign up
            </a>
          </p>
        </div>
      </div>
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-[#1C4532] to-[#0F2419] items-center justify-center p-8">
        <div className="max-w-lg text-white space-y-8">
          <h2 className="text-4xl font-serif italic">
            Simplify Your
            <br />
            Rental Management
            <br />
            Experience
          </h2>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 w-full aspect-video relative overflow-hidden">
            <Image
              src="/interior.jpg?height=400&width=600"
              alt="RentersHub Property"
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
          </div>
          <p className="text-lg">
            RentersHub: Your all-in-one solution for efficient rental property management in Kenya.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;

