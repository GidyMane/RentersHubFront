import type { Metadata } from "next";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import "./globals.css";
import { AuthProvider } from "@/providers/KindeAuthProvider";
import { SessionProvider } from "@/context/SessionProvider";
import { EdgeStoreProvider } from "../lib/edgestore";
import Navbar from "@/components/UpdatedLayout/Navbar";
import { FloatingNavDemo } from "@/components/layout/FloatingNav";
import Footer from "@/components/layout/enhancedfooter";
import { Toaster } from "react-hot-toast";
import { QueryProvider } from "@/providers/TarnstackProvider";


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
  title: "Renters Hub",
  description: "The Place Where Kenyans Come To Find Vacant Houses.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <SessionProvider>
      <Analytics/>
      <SpeedInsights/>

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
                

                  {children}

                  
             

                {/* <FloatingNavDemo /> */}
                <div className="bottom-0 rounded-lg">
                  <Footer />
                </div>

              </div>
            </body>
          </html>
        </EdgeStoreProvider>
        </QueryProvider>
      </SessionProvider>
    </AuthProvider>
  );
}
