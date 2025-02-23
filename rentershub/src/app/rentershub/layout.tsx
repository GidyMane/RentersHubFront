import { DashboardLayout } from "@/components/Test/Rentershub/DashbordLayout";
import type { Metadata } from "next";


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
    
     <div className="flex h-screen bg-gray-100 relative">
     
           <DashboardLayout>
            
             {children}
            
            </DashboardLayout>
  
     </div>
   )
}
