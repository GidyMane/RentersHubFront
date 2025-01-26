import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AuthProvider } from "@/providers/KindeAuthProvider";
import { SessionProvider } from "@/context/SessionProvider";
import { EdgeStoreProvider } from "../lib/edgestore";
import { ToastContainer } from "react-toastify";

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
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>      
      <SessionProvider>
      {/* <ToastContainer /> */}
        <EdgeStoreProvider>
          <html lang="en">
            <body
              className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
              {children}
            </body>
          </html>
        </EdgeStoreProvider>
      </SessionProvider>
    </AuthProvider>
  );
}
