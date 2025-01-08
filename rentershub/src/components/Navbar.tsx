"use client";

import { Bell, Search, LogOut, FileText } from "lucide-react";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import Link from "next/link";
import { usePathname } from "next/navigation"; // Import usePathname hook

export default function Navbar() {
  const pathname = usePathname();

  // If the pathname is '/successmessage', return null to not render the Navbar
  if (pathname === "/successmessage") {
    return null;
  }

  return (
    <nav className="bg-white shadow-md p-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between space-x-6">
        {/* Left Section: Dashboard Title */}
        <h1 className="text-2xl font-bold text-green-600">Landlord Dashboard</h1>

        {/* Center Section: Search Bar */}
        <div className="flex-1 flex justify-end">
          <div className="relative w-96">
            <input
              type="text"
              placeholder="Search properties..."
              className="pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent w-full"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* Right Section: Navbar Actions */}
        <div className="flex items-center space-x-4">
          {/* Notification Button */}
          <button className="text-blue-500 hover:text-blue-600">
            <Bell className="h-6 w-6" />
          </button>

          {/* Terms and Conditions Link with Icon */}
          <Link href="/Terms-and-Conditions" className="flex items-center px-3 py-2 rounded-md bg-gray-100 text-blue-500 hover:bg-blue-500 hover:text-white space-x-2">
            <FileText className="h-5 w-5" />
            <span>Terms and Conditions</span>
          </Link>

          {/* Logout Button */}          
          <button className="text-red-500 hover:text-red-600">
            <LogOut className="h-6 w-6" />
          </button>          
        </div>
      </div>
    </nav>
  );
}
