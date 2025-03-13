'use client';

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';

const AuthForm = () => {
  const [activeTab, setActiveTab] = useState('signin');

  const handleSignInSubmit = (data: { contact: string; password: string }) => {
    console.log('Sign In:', data);
  };

  const handleSignUpSubmit = (data: { contact: string; password: string; userType: string }) => {
    console.log('Sign Up:', data);
  };

  return (
    <Card className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-[#2ba808] to-blue-600 text-white p-6">
<<<<<<< HEAD
        <CardTitle className="text-2xl font-bold">Welcome to RentersHub</CardTitle>
=======
        <CardTitle className="text-2xl font-bold">Welcome to Renters Hub</CardTitle>
>>>>>>> da2dc9da5fc186335cc48ca707f8b25d5cfb93b6
        <CardDescription className="text-white/80">Your gateway to smart Kenyan homes</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          {/* <TabsContent value="signin">
            <LoginForm onSubmit={handleSignInSubmit} />
          </TabsContent>
          <TabsContent value="signup">
            <SignUpForm onSubmit={handleSignUpSubmit} />
          </TabsContent> */}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AuthForm;
