'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Menu, Bell, Search, User, LogOut } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getSession, signOut } from 'next-auth/react'
import { toast } from 'react-toastify'
import { baseUrl } from '@/utils/constants'

interface NavbarProps {
  toggleSidebar: () => void
<<<<<<< HEAD
}

export function Navbar({ toggleSidebar }: NavbarProps) {
=======
  isOpen:boolean
}

export function Navbar({ toggleSidebar, isOpen }: NavbarProps) {
>>>>>>> da2dc9da5fc186335cc48ca707f8b25d5cfb93b6
  const [user, setUser] = useState<{ name: string, email: string, avatar?: string }>({
    name: '',
    email: '',
    avatar: '',
  });

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
          'Authorization': `Bearer ${session?.user?.accessToken}`
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const data = await response.json();
      const userData = data.result;

      setUser({
<<<<<<< HEAD
        name: userData.first_name + ' ' + userData.username,
=======
        // name: userData.first_name + ' ' + userData.username,
        name:  userData.username,
>>>>>>> da2dc9da5fc186335cc48ca707f8b25d5cfb93b6
        email: userData.email,
        avatar: userData.avatar || "/placeholder.svg?height=32&width=32",
      });
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while fetching user data");
    }
  }

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
<<<<<<< HEAD
    <header className="sticky top-0 z-40 bg-white border-b shadow-sm">
=======
    <header className={`top-0 ${isOpen ? "z-30" :"z-50"} w-full bg-white sticky border-b shadow-sm`} style={{ fontFamily: "Georgia, serif" }}>
>>>>>>> da2dc9da5fc186335cc48ca707f8b25d5cfb93b6
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={toggleSidebar} className="lg:hidden mr-2">
              <Menu className="h-6 w-6" />
            </Button>
            <div className="hidden md:block">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search..."
                  className="pl-8 w-[300px]"
                />
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
<<<<<<< HEAD
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
=======
                <Button variant="ghost" className="relative h-8 w-8 rounded-full" style={{ fontFamily: "Georgia, serif" }}>
>>>>>>> da2dc9da5fc186335cc48ca707f8b25d5cfb93b6
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
<<<<<<< HEAD
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
=======
              <DropdownMenuContent className="w-56" align="end" style={{ fontFamily: "Georgia, serif" }} forceMount>
                <DropdownMenuLabel className="font-normal" style={{ fontFamily: "Georgia, serif" }}>
>>>>>>> da2dc9da5fc186335cc48ca707f8b25d5cfb93b6
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/rentershub/profile">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                <Button
            variant="ghost"
<<<<<<< HEAD
            className="w-full justify-start text-black-300 hover:bg-[#db3131] dark:hover:bg-[#df3535] hover:text-white"
=======
            className="w-full justify-start text-black-300 "
>>>>>>> da2dc9da5fc186335cc48ca707f8b25d5cfb93b6
            onClick={async () => {
              await signOut()
            }}
          >
<<<<<<< HEAD
            <LogOut className="h-5 w-5 mr-3" aria-hidden="true" />
=======
            <LogOut className="h-5 w-5 mr-3" aria-hidden="true"  style={{ fontFamily: "Georgia, serif" }}/>
>>>>>>> da2dc9da5fc186335cc48ca707f8b25d5cfb93b6
            Log Out
          </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}
