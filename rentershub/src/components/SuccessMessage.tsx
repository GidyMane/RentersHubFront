"use client"
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';




const SuccessMessage = () => {
  const router = useRouter();
  return (
    <Card className="w-full justify-center max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-[#2ba808] to-blue-600 text-white p-6 flex flex-col items-center">
        <CheckCircle className="w-16 h-16 mb-4" />
        <CardTitle className="text-3xl font-bold text-center">Welcome to Renters Hub!</CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <h2 className="text-2xl font-bold text-center text-[#235a14]">🎉 Account Creation Successful! 🎉</h2>
        <p className="text-center">
          Thank you for joining the Renters Hub community! Your account has been successfully created, and we are thrilled to have you on board.
        </p>
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
          <h3 className="font-bold mb-2">Next Steps:</h3>
          <p>
            🔒 Your application is currently under review by our administrators. Once your application is approved, you will gain full access to our platform, 
          </p>
        </div>
        <p>
          While you wait for the approval, feel free to explore our platform and prepare for your journey with Renters Hub. You'll receive a notification as soon as your application is approved.
        </p>
        <p>
          We are excited to help you make your renting experience smooth and seamless. If you have any questions or need assistance, don't hesitate to reach out to our support team.
        </p>
        <p className="font-bold text-center">
          Welcome aboard, and we look forward to having you with us!
        </p>
        <p className="text-center text-xl">
          🌟 The Renters Hub Team 🌟
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
          <Button 
            
            className="bg-[#0f4e12] hover:bg-[#228606] text-white py-6 px-8 text-lg"
            onClick={() => router.push('/login')}
          >
            Go to Login
          </Button>
          <Button 
             
            className="bg-blue-600 hover:bg-blue-700 text-white py-6 px-8 text-lg"
            onClick={() => router.push('/')}
          >
            Explore Platform
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SuccessMessage;

