'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/Test/Rentershub/DashbordLayout'
import { AvatarUpload } from '@/components/Test/Rentershub/AvatarUpload'
import { ChangePassword } from '@/components/Test/Rentershub/ChangePassword'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { baseUrl } from '@/utils/constants'
import { getSession } from 'next-auth/react'

export default function ProfilePage() {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: '',
  })

  const fetchUserData = async () => {
    try {
      const session = await getSession(); 
      const userId = session?.user?.user_id;
      
      if (!userId) {
        toast.error("User ID not found in session");
        return;
      }

      const response = await fetch(`${baseUrl}accounts/user/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.user?.accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const data = await response.json();
      const user = data.result;

      setProfile({
        firstName: user.first_name,
        lastName: user.username, 
        email: user.email,
        phone: user.contact,
        role: user.role_name.role,
      });
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while fetching user data");
    }
  }

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleInputChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  }

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      const session = await getSession();
      const userId = session?.user?.user_id;
      
      if (!userId) {
        toast.error("User ID not found in session");
        return;
      }

      const response = await fetch(`${baseUrl}accounts/update/user/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.user?.accessToken}`,
        },
        body: JSON.stringify({
          first_name: profile.firstName,
          username: profile.lastName,
          email: profile.email,
          contact: profile.phone,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      toast.success("Profile updated successfully");
      setIsEditing(false);
      fetchUserData();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile");
    }
  }

  return (
<<<<<<< HEAD
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8">
=======
   
      <div className="p-4 sm:p-6 lg:p-8" style={{ fontFamily: "Georgia, serif" }}>
>>>>>>> da2dc9da5fc186335cc48ca707f8b25d5cfb93b6
        <ToastContainer />
        <div className="max-w-2xl mx-auto space-y-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1C4532]">My Profile</h1>

          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" name="firstName" value={profile.firstName} onChange={handleInputChange} disabled={!isEditing} required />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" name="lastName" value={profile.lastName} onChange={handleInputChange} disabled={!isEditing} required />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" value={profile.email} onChange={handleInputChange} disabled={!isEditing} required />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" name="phone" type="tel" value={profile.phone} onChange={handleInputChange} disabled={!isEditing} required />
                </div>

                <div>
                  <Label htmlFor="role">Role</Label>
                  <Input id="role" name="role" value={profile.role} disabled />
                </div>

                {isEditing ? (
                  <div className="flex justify-end space-x-4">
                    <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                    <Button type="submit">Save Changes</Button>
                  </div>
                ) : (
                  <div className="flex justify-end">
                    <Button type="button" onClick={() => setIsEditing(true)}>Edit Profile</Button>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>

          <ChangePassword />
        </div>
      </div>
<<<<<<< HEAD
    </DashboardLayout>
=======
   
>>>>>>> da2dc9da5fc186335cc48ca707f8b25d5cfb93b6
  )
}
