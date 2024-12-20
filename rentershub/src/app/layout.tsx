import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AuthProvider } from "@/providers/KindeAuthProvider";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "RentersHub",
  description: "Where Smart Kenyans Come to find homes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <div className="flex h-screen bg-gray-100 text-gray-800">
            {/* Sidebar */}
            <div className="w-64 bg-green-500 text-white">
              <Sidebar />
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
              {/* Navbar */}
              <div className="bg-white shadow">
                <Navbar />
              </div>

              {/* Page Content */}
              <div className="flex-1 overflow-y-auto p-6">{children}</div>
            </div>
          </div>
        </body>
      </html>
    </AuthProvider>
  );
}
