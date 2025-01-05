'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Phone, Key } from 'lucide-react';

const LoginForm = ({ onSubmit }: { onSubmit: (data: { contact: string; password: string }) => void }) => {
  const [contact, setContact] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ contact, password });
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
      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg mt-4">
        Sign In
      </Button>
    </form>
  );
};

export default LoginForm;
