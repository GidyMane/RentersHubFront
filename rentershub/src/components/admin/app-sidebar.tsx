import * as React from "react"
import { GalleryVerticalEnd, House, PlusCircle } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { useSession } from "next-auth/react"
import { useUser } from "@/actions/useUser"



export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useUser()
  const pathname = usePathname()
  const { data:session } = useSession();

  // This is sample data.
  const data = {
    navMain: [
      {
        title: "Dashboard",
        url: "/admin",
        items: [],
        icon: "/dashboard.png"
      },
      {

        title: "Approved Houses",
        url: "/admin/approvedproperty",
        icon: "/property.png"

      },
      {

        title: "Pending Houses",
        url: "/admin/pendingproperties",
        icon: "/feature.png",

      },
      {

        title: "Post House",
        url: "/admin/add-property",
        icon: "/blog.png",

      },
      {

        title: "Connections",
        url: "/admin/connections",
        icon: "/list.png",

      },
     
      // {

      //   title: "Testimonials",
      //   url: "/rentershub/testimonials",
      //   icon: "/testim.png",

      // },
      {

        title: "Approved Landlords",
        url: "/admin/approvedlandlords",
        icon: "/users.png",

      },
      {

        title: "Pending Landlords",
        url: "/admin/pendinglandlords",
        icon: "/access.png",

      },
      {

        title: "Approved Ground Agents",
        url: "/admin/approvedgroundagents",
        icon: "/users.png",

      },
      {

        title: "Pending Ground Agents",
        url: "/admin/pendinggroundagents",
        icon: "/access.png",

      },

      
    ],
  }
  return (
   
    <Sidebar className="h-screen flex justify-between bg-primary"   style={{ fontFamily: "Georgia, serif" }}>
      <SidebarHeader className="h-screen flex justify-between bg-primary/10  overflow-y-auto">
        <div className="px-4 py-6">
          <div className=" flex flex-col gap-4">
            <span className="grid h-10 w-32 place-content-center rounded-lg text-xs text-gray-600">
              <Image width={300} height={300} src={"/RH1.png"} alt={"logo"} className="w-full h-full" />

            </span>
            <div className="flex flex-col gap-0.5 my-4 leading-none">
              <span className="font-semibold text-secondary"></span>
            </div>
          </div>


          <ul className="mt-6 space-y-4">
            {data.navMain.map((item, idx) => (


              <li key={idx}>
                <Link
                  href={item.url}
                  className={`rounded-lg flex gap-2 ${pathname.split("/")[2] === item.url.split("/")[2] ? "bg-secondary text-white" : ""}  px-4 py-2 text-sm font-medium`}
                >
                  <Image width={20} height={20} src={item.icon} alt={item.title} />
                  {item.title}
                </Link >

              </li>


            ))}





          </ul>
        </div >
        <div className="sticky border-e inset-y-0 border-gray-100">
          <Link href="#" className="flex items-center gap-2 bg-white p-4 hover:bg-gray-50">
            <Avatar>
              <AvatarImage src={user.avatar} />
              <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-xs">
                <strong className="block font-medium">{user.name ?? "User"}</strong>
                <span>{user.email ?? "admin@rentershub.com"}</span>
              </p>
            </div>
          </Link>
        </div>
      </SidebarHeader>
      
    </Sidebar >
  )
}
