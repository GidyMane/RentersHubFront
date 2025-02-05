"use client";
import React from "react";
import { FloatingNav } from "../ui/floating-navbar";
import { IconHome, IconList } from "@tabler/icons-react";
import { usePathname } from "next/navigation";

export function FloatingNavDemo() {
    const path = usePathname();
    const navItems = [
        {
            name: "Vacant Houses",
            link: "#",
            icon: <IconHome className="h-4 w-4 text-neutral-500 dark:text-white" />,
        },
        {
            name: "Post A house",
            link: "/",
            icon: <IconList className="h-4 w-4 text-neutral-500 dark:text-white" />,
        },
        {
            name: "Chat with Us",
            link: "https://api.whatsapp.com/send?phone=254731352350&text=Hello.%20I%20am%20from%20the%20website,%20https://rentershub.co.ke%20and%20I%20am%20searching%20for%20a%20vacant%20house",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-whatsapp text-green-500">
                    <path d="M3 20.7a10.8 10.8 0 0 1 0-17.4 10.6 10.6 0 0 1 16.7 12l3 3-4.2-1.1a10.6 10.6 0 0 1-6.5 1.9z"></path>
                    <path d="M8 12s1 2 3 3 3 1 3 1l2-2"></path>
                </svg>
            ),
        },
    ];

    if (path.includes("intime-admin") || path.startsWith("/intimehomes")) {
        return null;
    }

    return (
        <div className="relative w-full">
            <FloatingNav navItems={navItems} />
        </div>
    );
}
