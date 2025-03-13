import type { Metadata } from "next";
import localFont from "next/font/local";
<<<<<<< HEAD
=======
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
>>>>>>> da2dc9da5fc186335cc48ca707f8b25d5cfb93b6
import "./globals.css";
import { AuthProvider } from "@/providers/KindeAuthProvider";
import { SessionProvider } from "@/context/SessionProvider";
import { EdgeStoreProvider } from "../lib/edgestore";
<<<<<<< HEAD
import { ToastContainer } from "react-toastify";
=======
import Navbar from "@/components/UpdatedLayout/Navbar";
import Footer from "@/components/layout/enhancedfooter";
import { Toaster } from "react-hot-toast";
import { QueryProvider } from "@/providers/TarnstackProvider";
import ReactReduxProvider from "./ReactReduxProvider";


>>>>>>> da2dc9da5fc186335cc48ca707f8b25d5cfb93b6

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
<<<<<<< HEAD
  title: "RentersHub",
  description: "Where Smart Kenyans Come to find homes",
=======
  title: "Renters Hub",
  description: "The Place Where Kenyans Come To Find Vacant Houses.",
>>>>>>> da2dc9da5fc186335cc48ca707f8b25d5cfb93b6
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
<<<<<<< HEAD
    <AuthProvider>      
      <SessionProvider>
      {/* <ToastContainer /> */}
        <EdgeStoreProvider>
          <html lang="en" suppressHydrationWarning>
            <body
              className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
              {children}
            </body>
          </html>
        </EdgeStoreProvider>
=======
    <AuthProvider>
      <SessionProvider>
        <Analytics />
        <SpeedInsights />
        {/* <ToastContainer /> */}
        <QueryProvider>
          <EdgeStoreProvider>
            <html lang="en" suppressHydrationWarning>
              <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
              >
                <div className="relative w-full">

                  <Toaster
                    position="top-center"
                    reverseOrder={false}
                    gutter={8}
                    containerClassName=""
                    containerStyle={{}}
                    toastOptions={{
                      className: '',
                      duration: 5000,
                    }}
                  />
                  <div className="bg-white top-0">
                    <Navbar />
                  </div>
                  <ReactReduxProvider>

                    {children}

                  </ReactReduxProvider>


                  {/* <FloatingNavDemo /> */}
                  <div className="bottom-0 rounded-lg">
                    <Footer />
                  </div>

                </div>
              </body>
            </html>
          </EdgeStoreProvider>
        </QueryProvider>


>>>>>>> da2dc9da5fc186335cc48ca707f8b25d5cfb93b6
      </SessionProvider>
    </AuthProvider>
  );
}
