import {
    Cloud,
    CreditCard,
    Github,
    Keyboard,
    LifeBuoy,
    LogOut,
    Mail,
    MessageSquare,
    Plus,
    PlusCircle,
    Settings,
    User,
    UserPlus,
    Users,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogoutLink, useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
<<<<<<< HEAD
=======
import { useUser } from "@/actions/useUser";
>>>>>>> da2dc9da5fc186335cc48ca707f8b25d5cfb93b6


export function NavBarDropDown() {
    const router = useRouter()
<<<<<<< HEAD
    const { data:session } = useSession();
    //console.log(session, "user")
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild className="cursor-pointer transition-all duration-300">
                <Avatar>
                    <AvatarImage src="" />
                    <AvatarFallback>{session?.user?.name?.charAt(0).toUpperCase()}</AvatarFallback>
=======
    const { data: session } = useSession();
    const { user } = useUser()
    //console.log(session, "user")
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild className="cursor-pointer transition-all duration-300"   style={{ fontFamily: "Georgia, serif" }}>
                <Avatar>
                                  <AvatarImage src={user.avatar} />
                                  <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
>>>>>>> da2dc9da5fc186335cc48ca707f8b25d5cfb93b6
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuItem>
<<<<<<< HEAD
                    <div className="flex gap-2 hover:cursor-pointer focus:cursor-pointer after:bg-gray-100" onClick={()=>{
                       router.push("/api/auth/signout") 
=======
                    <div className="flex gap-2 hover:cursor-pointer focus:cursor-pointer after:bg-gray-100" onClick={() => {
                        router.push("/api/auth/signout")
>>>>>>> da2dc9da5fc186335cc48ca707f8b25d5cfb93b6
                    }}>
                        <LogOut />
                        <span>Log out</span>
                    </div>

                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
