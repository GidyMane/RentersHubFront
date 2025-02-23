
import AdminLayout from "@/components/admin/adminLayout";
import ReduxProvider from "@/providers/reduxProvider";
import type { Metadata } from "next";
import { Jost } from "next/font/google"; // Import Google Font
import Script from 'next/script'

import { Suspense } from "react";




// Import the Lato font from Google Fonts
const lato = Jost({
  weight: ["400", "700", "900"], // Adjust weights as needed
  subsets: ["latin"], // Specify subsets
});

export const metadata: Metadata = {
  title: "Admin- RentersHub ",
  description: "Where Smart Kenyans Come to find houses",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative h-screen bg-white m-0" >
        
        <AdminLayout>
        <ReduxProvider>
          
            <Suspense>
              {children}
            </Suspense>
        </ReduxProvider> 
        </AdminLayout>
     

    </div >

  );
}
