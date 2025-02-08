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


export function NavBarDropDown() {
    const router = useRouter()
    const { data:session } = useSession();
    //console.log(session, "user")
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild className="cursor-pointer transition-all duration-300">
                <Avatar>
                    <AvatarImage src="" />
                    <AvatarFallback>{session?.user?.name?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuItem>
                    <div className="flex gap-2 hover:cursor-pointer focus:cursor-pointer after:bg-gray-100" onClick={()=>{
                       router.push("/api/auth/signout") 
                    }}>
                        <LogOut />
                        <span>Log out</span>
                    </div>

                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
