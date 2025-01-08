"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Home, Building, PlusSquare, User, LogOut } from "lucide-react";
import { NavItem, LandlordProfile } from "../types/dashboard";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { usePathname } from "next/navigation"; // Import usePathname hook
import { signOut } from "next-auth/react";

const navItems: NavItem[] = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/my-properties", label: "My Properties", icon: Building },
  { href: "/add-property", label: "Add Property", icon: PlusSquare },
  { href: "/profile", label: "Profile", icon: User },
];

interface SidebarProps {
  profile?: LandlordProfile;
}

export default function Sidebar({ profile = {} as LandlordProfile }: SidebarProps) {
  const [activeItem, setActiveItem] = useState("/dashboard");
  const pathname = usePathname();

  // If the pathname is '/successmessage', return null to not render the Sidebar
  if (pathname === "/successmessage") {
    return null;
  }

  return (
    <aside className="bg-green-600 text-white w-64 min-h-screen p-4">
      {/* Profile Section */}
      <div className="flex flex-col items-center mb-6">
        <div className="w-24 h-24 rounded-full overflow-hidden mb-2">
          {profile?.avatarUrl ? (
            <Image
              src={profile.avatarUrl}
              alt={profile.name || "User"}
              width={96}
              height={96}
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-blue-500 flex items-center justify-center text-2xl font-bold">
              {profile?.name?.charAt(0) || "U"}
            </div>
          )}
        </div>
        <h2 className="text-lg font-semibold">{profile?.name || "User"}</h2>
        <p className="text-sm text-green-200">{profile?.email || "No email provided"}</p>
      </div>

      {/* Navigation Links */}
      <nav>
        <ul>
          {navItems.map((item) => (
            <li key={item.href} className="mb-2">
              <Link
                href={item.href}
                className={`flex items-center p-2 rounded-lg transition-colors ${
                  activeItem === item.href ? "bg-blue-500" : "hover:bg-green-500"
                }`}
                onClick={() => setActiveItem(item.href)}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.label}
              </Link>
            </li>
          ))}

          {/* Logout Link */}
          <li className="mb-2">
           
              <button
                className="flex items-center w-full p-2 rounded-lg transition-colors hover:bg-red-500"
                onClick= {async()=>{
                  await signOut()
                  }}
              >

                <LogOut className="mr-3 h-5 w-5" />
                Log out
              </button>
            
          </li>
        </ul>
      </nav>
    </aside>
  );
}
