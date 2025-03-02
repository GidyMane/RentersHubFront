"use client"
import { AppSidebar } from "@/components/admin/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { usePathname } from "next/navigation"
import Image from "next/image"
import React, { ReactNode } from "react"
import { NavBarDropDown } from "./NavBardropdown"
import Link from "next/link"



const AdminLayout = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname()
  return (
    <SidebarProvider>
      <AppSidebar />

      
      <SidebarInset>
        <header className="flex h-16 sticky top-0  w-full z-50 justify-between shrink-0 bg-transparent backdrop-blur-md shadow-md items-center gap-2 border-b">
          <div className="flex items-center gap-2 px-3">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                {pathname.split("/").slice(1).map((item, index) => (



                  index === 0 ? (
                    <BreadcrumbItem className="block" key={index}>
                      <BreadcrumbLink href={`/${item}`} className="text-black">
                        {item}
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                  ) : (
                    <React.Fragment key={index}>

                      <BreadcrumbSeparator className="hidden md:block" />
                      <BreadcrumbItem>
                        <BreadcrumbPage>{item}</BreadcrumbPage>
                      </BreadcrumbItem>

                    </React.Fragment>

                  )



                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="flex items-center gap-2 px-3">
            
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-white text-sidebar-primary-foreground">
  <Link href="/login">
    <Image
      width={600}
      height={600}
      src="/RH2.jpg"
      alt="logo"
      className="w-full h-full cursor-pointer"
    />
  </Link>
</div>        
<NavBarDropDown />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}



export default AdminLayout
