import { DashboardLayout } from "@/components/Test/Rentershub/DashbordLayout";
import type { Metadata } from "next";


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
    
     <div className="h-screen  bg-gray-100 relative">
     
           <DashboardLayout>
            
             {children}
            
            </DashboardLayout>
  
     </div>
   )
}
