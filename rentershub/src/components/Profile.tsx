"use client"
import React from 'react';
import { User, Phone, Mail, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ProfileProps {
  user: {
    name: string;
    email: string;
    phone: string;
    profilePicture?: string;
  };
  onEdit: () => void;
}

export const Profile: React.FC<ProfileProps> = ({ user, onEdit }) => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
      <Card className="w-full max-w-3xl rounded-lg shadow-xl bg-white">
        <CardHeader className="text-center py-8">
          <CardTitle className="text-3xl font-bold text-green-600">Landlord Profile</CardTitle>
        </CardHeader>

        <CardContent className="space-y-8 px-8 py-6">
          {/* Avatar Section */}
          <div className="flex justify-center">
            <Avatar className="w-32 h-32">
              <AvatarImage src={user.profilePicture} alt={user.name} />
              <AvatarFallback>
                <User className="w-16 h-16 text-gray-400" />
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Personal Info Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800">Personal Information</h3>
            <div className="flex items-center space-x-4">
              <User className="w-6 h-6 text-blue-500" />
              <div>
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="font-medium">{user.name}</p>
              </div>
            </div>
          </div>

          {/* Contact Info Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800">Contact Information</h3>
            <div className="flex items-center space-x-4">
              <Mail className="w-6 h-6 text-blue-500" />
              <div>
                <p className="text-sm text-gray-500">Email Address</p>
                <p className="font-medium">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Phone className="w-6 h-6 text-blue-500" />
              <div>
                <p className="text-sm text-gray-500">Phone Number</p>
                <p className="font-medium">{user.phone}</p>
              </div>
            </div>
          </div>
        </CardContent>

        {/* Footer Section with Edit Profile Button */}
        <CardFooter className="px-8 pb-8">
          <Button 
            onClick={onEdit} 
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-all duration-200"
          >
            <Edit className="w-5 h-5 mr-2" />
            Edit Profile
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
