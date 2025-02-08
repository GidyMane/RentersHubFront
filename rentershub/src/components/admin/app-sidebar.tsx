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



export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

  const pathname = usePathname()
  const { data:session } = useSession();

  // This is sample data.
  const data = {
    navMain: [
      {
        title: "Dashboard",
        url: "/intime-admin",
        items: [],
        icon: "/dashboard.png"
      },
      {

        title: "property listing",
        url: "/intime-admin/managelisting",
        icon: "/property.png"

      },
      {

        title: "feature listing",
        url: "/intime-admin/managefeatures",
        icon: "/feature.png",

      },
      {

        title: "Property Type listing",
        url: "/intime-admin/manage-property-types",
        icon: "/list.png",

      },
      {

        title: "Blogs",
        url: "/intime-admin/blogs",
        icon: "/blog.png",

      },
      {

        title: "Testimonials",
        url: "/intime-admin/testimonials",
        icon: "/testim.png",

      },
      {

        title: "Users",
        url: "/intime-admin/users",
        icon: "/users.png",

      },
      {

        title: "Requested Access",
        url: "/intime-admin/requestaccess",
        icon: "/access.png",

      }

      
    ],
  }
  return (
    // <Sidebar {...props}>
    //   <SidebarHeader className="bg-primary300/15">
    //     <SidebarMenu>
    //       <SidebarMenuItem>
    //         <SidebarMenuButton size="lg" className="hover:bg-primary300" asChild>
    //           <Link href="#">
    //             <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
    //               <Image width={300} height={300} src={"/logo.jpeg"} alt={"logo"} className="w-full h-full" />
    //             </div>
    //             <div className="flex flex-col gap-0.5 leading-none">
    //               <span className="font-semibold text-secondary500">Intime Homes Consultancy</span>
    //               <span className="">v1.0.0</span>
    //             </div>
    //           </Link>
    //         </SidebarMenuButton>
    //       </SidebarMenuItem>
    //     </SidebarMenu>
    //   </SidebarHeader>
    //   <SidebarContent className="bg-primary200/15">
    //     <SidebarGroup>
    //       <SidebarMenu>
    //         {data.navMain.map((item) => (
    //           <SidebarMenuItem key={item.title}>
    //             <SidebarMenuButton asChild className="my-4">
    //               <Link href={item.url} className="font-medium">
    //                 {item.title}
    //               </Link>
    //             </SidebarMenuButton>
    //             {item.items?.length ? (
    //               <SidebarMenuSub>
    //                 {item.items.map((item) => (
    //                   <SidebarMenuSubItem key={item.title}>
    //                     <SidebarMenuSubButton className={``} asChild isActive={pathname.split("/")[2] === item.url.split("/")[2]}>
    //                       <div>
    //                         {item.icon}
    //                         <Link href={item.url}>{item.title}</Link>

    //                       </div>
    //                     </SidebarMenuSubButton>
    //                   </SidebarMenuSubItem>
    //                 ))}
    //               </SidebarMenuSub>
    //             ) : null}
    //           </SidebarMenuItem>
    //         ))}
    //       </SidebarMenu>
    //     </SidebarGroup>
    //   </SidebarContent>
    //   <SidebarRail />
    // </Sidebar>
    <Sidebar className="h-screen flex justify-between bg-primary ">
      <SidebarHeader className="h-screen flex justify-between bg-primary/10">
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
        <div className="sticky  border-e inset-y-0 border-gray-100">
          <Link href="#" className="flex items-center gap-2 bg-white p-4 hover:bg-gray-50">
            <Avatar>
              <AvatarImage src="" />
              <AvatarFallback>{session?.user?.name?.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>

            <div>
              <p className="text-xs">
                <strong className="block font-medium">{session?.user?.name ?? "user"}</strong>

                <span> {session?.user?.email ?? "adminq@rentershub.com"}</span>
              </p>
            </div>
          </Link>
        </div>
      </SidebarHeader>
      
    </Sidebar >
  )
}
