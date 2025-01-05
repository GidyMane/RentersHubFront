"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

const ClientLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const pathname = usePathname();
  const isAuthRoute = pathname.startsWith("/auth");

  if (isAuthRoute) {
    // Layout for `/auth` routes
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex flex-col">
        {/* <header className="w-full bg-white shadow-md p-4">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-[#2ba808] rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">RH</span>
              </div>
              <span className="text-2xl font-bold text-[#2ba808]">
                RentersHub
              </span>
            </div>
            <nav>
              <ul className="flex space-x-4">
                <li>
                  <a href="#" className="text-blue-600 hover:text-blue-800">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#" className="text-blue-600 hover:text-blue-800">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="text-blue-600 hover:text-blue-800">
                    Contact
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </header> */}
        <main className="flex-grow container mx-auto px-4 py-8">
          {children}
        </main>
        {/* <footer className="w-full mt-4 py-4 bg-white text-center text-sm text-gray-600">
          &copy; {new Date().getFullYear()} RentersHub. All rights reserved.
        </footer> */}
      </div>
    );
  }

  // Layout for non-`/auth` routes
  return (
    <div className="flex h-screen bg-gray-100 text-gray-800">
      <div className="w-64 bg-green-500 text-white">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col">
        <div className="bg-white shadow">
          <Navbar />
        </div>
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  );
};

export default ClientLayout;

