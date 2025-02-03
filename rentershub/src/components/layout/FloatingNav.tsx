"use client";
import React from "react";
import { FloatingNav } from "../ui/floating-navbar";
import { IconHome, IconList, IconMessage, IconUser } from "@tabler/icons-react";
import { usePathname } from "next/navigation";
export function FloatingNavDemo() {
    const path = usePathname()
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
            link: "/contact",
            icon: (
                <IconMessage className="h-4 w-4 text-neutral-500 dark:text-white" />
            ),
        },
    ];
    if (path.includes("intime-admin") || path.startsWith("/intimehomes")) {
        return null
    }
    return (
        <div className="relative  w-full">
            <FloatingNav navItems={navItems} />
            {/* <DummyContent /> */}
        </div>
    );
}

