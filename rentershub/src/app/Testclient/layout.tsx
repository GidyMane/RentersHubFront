import "@/styles/globals.css";
import type React from "react";
import type { Metadata } from "next";
import { Jost } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { Suspense } from "react";
import { Loader } from "lucide-react";
import Navbar from "@/components/UpdatedLayout/Navbar";
import { FloatingNavDemo } from "@/components/layout/FloatingNav";
import Footer from "@/components/layout/enhancedfooter";


// Import the Lato font from Google Fonts
const lato = Jost({
  weight: ["400", "700", "900"], // Adjust weights as needed
  subsets: ["latin"], // Specify subsets
});

export const metadata: Metadata = {
  title: "Rentershub",
  description: "The better way to buy real estate",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>RentersHub</title>
      </head>
      <body className={`${lato.className} antialiased min-h-screen bg-[#FAF9F6]`}>
        <div className="relative">
          <Suspense fallback={<Loader className='animate animate-spin text-secondary400' />}>  
            
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
                <div className="top-0">
                  <Navbar />
                </div>
                {children}
                <FloatingNavDemo />
                <div className="bottom-0 rounded-lg">
                  <Footer />
                </div>
              
          </Suspense>
        </div>
      </body>
    </html>
  );
}
