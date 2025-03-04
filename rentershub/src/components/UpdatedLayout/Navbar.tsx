"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, CircleUserRound, Dock, Facebook, Home, Instagram, Menu, X } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

const Navbar: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const path = usePathname();

    useEffect(() => {
        if (typeof window === "undefined") return;

        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener("resize", checkMobile);

        return () => {
            window.removeEventListener("resize", checkMobile);
        };
    }, []);

    const closeMenu = () => {
        if (isMobile) setIsMenuOpen(false);
    };

    interface NavItemProps {
        href: string;
        children: React.ReactNode;
    }

    const NavItem: React.FC<NavItemProps> = ({ href, children }) => (
        <Link 
            href={href} 
            className={`block py-2 text-labelLarge transition-all ${
                path.split("/")[1] === href.split("/")[1] ? "bg-black rounded-full text-white" : ""
            } duration-300 px-2`}
            onClick={closeMenu}
        >
            {children}
        </Link>
    );

    interface DropdownNavItemProps {
        title: string;
        items: string[];
    }

    const DropdownNavItem: React.FC<DropdownNavItemProps> = ({ title, items }) => (
        <div className="group relative">
            <button className="flex items-center gap-1 py-2 text-labelLarge hover:text-secondary300"   style={{ fontFamily: "Georgia, serif" }}>
                {title}
                <ChevronDown className="h-4 w-4" />
            </button>
            <div className="absolute left-0 mt-2 w-48 rounded-md z-20 bg-secondary600 backdrop-blur-lg opacity-80 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                {items.map((item, index) => (
                    <div key={index}>
                        <Link href={`/property/${item}`} className="block px-4 py-2 text-sm text-white hover:bg-secondary300" onClick={closeMenu}>
                            {item}
                        </Link>
                        {index < items.length - 1 && <hr className="border-white/20" />}
                    </div>
                ))}
            </div>
        </div>
    );

    if (path.includes("admin") || path.startsWith("/rentershub") || path.includes("/login") || path.includes("/signup") || path.includes("/successmessage")) {
        return null;
    }

    return (
        <div className="py-2 flex items-center justify-between gap-2 w-full px-8 fixed bg-white z-[100]">
            <div className="flex gap-2 items-center justify-center">
                <Link href="/" className="flex items-center gap-2 cursor-pointer">
                    <Image src="/RH1.png" alt="RentersHub Logo" width={40} height={40} />
                    <p className="text-headlineSmall text-secondary500"   style={{ fontFamily: "Georgia, serif" }}>Renters Hub</p>
                </Link>
            </div>

            <div className="md:hidden flex">
                <AnimatePresence>
                    {(isMenuOpen || !isMobile) && (
                        <motion.div
                            initial={isMobile ? { x: "-100%" } : { opacity: 1 }}
                            animate={isMobile ? { x: 0 } : { opacity: 1 }}
                            exit={isMobile ? { x: "-100%" } : { opacity: 1 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className={`fixed md:relative top-0 left-0 bottom-0 w-64 md:w-auto ${
                                isMobile ? "bg-black text-white" : "hidden md:flex"
                            } z-[100] md:z-auto flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8 p-6 md:p-0`}
                        >
                            <div className="flex gap-2 items-center justify-center">
                                <Link href="/" className="flex flex-col gap-2 items-center cursor-pointer">
                                    <Image src="/RH1.png" alt="RentersHub Logo" width={40} height={40} />
                                    <p className="text-headlineSmall text-secondary500"   style={{ fontFamily: "Georgia, serif" }}>Renters Hub</p>
                                </Link>

                                <Button variant="ghost" size="icon" className="self-end justify-end items-end flex mb-4" onClick={() => setIsMenuOpen(false)}>
                                    <X className="h-6 w-6" />
                                </Button>
                            </div>

                            <NavItem href="/">Vacant Houses</NavItem>
                            <NavItem href="/auth2">Post a House</NavItem>
                            <NavItem href="/admin">Manage Rentals</NavItem>

                            <a
                                href="https://api.whatsapp.com/send?phone=254731352350&text=Hello.%20I%20am%20from%20the%20website,%20https://rentershub.co.ke%20and%20I%20am%20searching%20for%20a%20vacant%20house"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-all"
                            >
                                <span className="text-bodySmall font-semibold"   style={{ fontFamily: "Georgia, serif" }}>Chat With Us</span>
                            </a>

                            <div className="bottom-0 mt-6 flex gap-4 justify-center items-center mx-2">
                                <NavItem href="https://www.instagram.com/rentershub.co.ke"><Instagram /></NavItem>
                                <NavItem href="https://www.facebook.com/rentershub.co.ke"><Facebook /></NavItem>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="items-center gap-4 justify-around hidden md:flex">
                <NavItem href="/">
                    <div className="text-bodyMedium flex items-center justify-center rounded-full gap-0.5"   style={{ fontFamily: "Georgia, serif" }}>
                        <Home className="w-4 h-4 font-extrabold"   style={{ fontFamily: "Georgia, serif" }}/>
                        Vacant Houses
                    </div>
                </NavItem>
                <div   style={{ fontFamily: "Georgia, serif" }}>
                <NavItem href="/auth2">Post A House</NavItem>
                </div>
                <a
                    href="https://api.whatsapp.com/send?phone=254731352350&text=Hello.%20I%20am%20from%20the%20website,%20https://rentershub.co.ke%20and%20I%20am%20searching%20for%20a%20vacant%20house"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-all"
                >
                    <span className="text-bodySmall font-semibold"   style={{ fontFamily: "Georgia, serif" }}>Chat With Us</span>
                </a>
            </div>

            <div className="flex gap-2">
                <div className="flex-1 flex items-center justify-center md:hidden">
                    <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        <Menu className="h-6 w-6" />
                    </Button>
                </div>
                <div className="hidden md:flex gap-2 items-center justify-center">
  <Link href="/rentershub/add-property">
    <Button variant="outline" className="text-black bg-secondary400 rounded-3xl text-bodySmall"   style={{ fontFamily: "Georgia, serif" }}>
      Manage Rentals
    </Button>
  </Link>
</div>
            </div>
        </div>
    );
};

export default Navbar;
