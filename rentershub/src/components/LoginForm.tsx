'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Phone, Key } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

const LoginForm = () => {
  const [contact, setContact] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      contact,
      password,
    };

    setIsLoading(true);

    try {
      const response = await signIn('credentials', {
        contact: payload.contact,
        password: payload.password,
        redirect: false,
      });

      if (response?.ok) {
        toast.success('Login successful!');
        router.push('/'); // Redirect to the home page
      } else {
        // Check the error message and display appropriate toast
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
    <form onSubmit={handleSubmit} className="space-y-4">
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
      <Button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg mt-4"
        disabled={isLoading}
      >
        {isLoading ? 'Signing In...' : 'Sign In'}
      </Button>
    </form>
  );
};

export default LoginForm;
