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
import { signOut, useSession } from "next-auth/react";
import { useUser } from "@/actions/useUser";


export function NavBarDropDown() {
    const router = useRouter()
    const { data: session } = useSession();
    const { user } = useUser()
    //console.log(session, "user")
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild className="cursor-pointer transition-all duration-300"   style={{ fontFamily: "Georgia, serif" }}>
                <Avatar>
                                  <AvatarImage src={user.avatar} />
                                  <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuItem>
                                <Button
                            variant="ghost"
                            className="w-full justify-start text-black-300 "
                            onClick={async () => {
                              await signOut()
                            }}
                          >
                            <LogOut className="h-5 w-5 mr-3" aria-hidden="true"  style={{ fontFamily: "Georgia, serif" }}/>
                            Log Out
                          </Button>
                                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
