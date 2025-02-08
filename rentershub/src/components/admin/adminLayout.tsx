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



const AdminLayout = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname()
  return (
    <SidebarProvider>
      <AppSidebar />

      
      <SidebarInset>
        <header className="flex h-16 sticky top-0  w-full  justify-between shrink-0 bg-transparent backdrop-blur-md shadow-md items-center gap-2 border-b">
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
            <NavBarDropDown />
            {/* <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <Image width={300} height={300} src={"/logo.jpeg"} alt={"logo"} className="w-full h-full" />
            </div>
            <div className="flex flex-col gap-0.5 leading-none">
              <span className="font-semibold text-secondary300">Intime Homes Consultancy</span>
              <span className="">v1.0.0</span>
            </div> */}

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
