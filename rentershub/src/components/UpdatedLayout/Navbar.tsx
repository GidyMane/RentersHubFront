"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, CircleUserRound, Dock, Facebook, Instagram, Menu, X } from 'lucide-react'
import React from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import Image from 'next/image' // Importing the Image component

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isMobile, setIsMobile] = useState(false)
    const path = usePathname()

    const searchparams = useSearchParams()
    const url = new URLSearchParams(searchparams)

    url.forEach((v, k) => {
        url.delete(k)
    })

    url.set("limit", "200")
    url.set("page", "0")

    useEffect(() => {
        if (typeof window === "undefined") return;

        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener("resize", checkMobile);

        return () => {
            window.removeEventListener("resize", checkMobile);
        };
    }, []);

    const NavItem = ({ href, children }: { href: string; children: React.ReactNode }) => (
        <Link href={href} className={`block py-2 text-labelLarge transition-all ${path.split("/")[1] == href.split("/")[1] && "bg-black rounded-full text-white"} duration-300 px-2`}>
            {children}
        </Link>
    )

    const DropdownNavItem = ({ title, items }: { title: string; items: string[] }) => (
        <div className="group relative">
            <button className="flex items-center gap-1 py-2 text-labelLarge hover:text-secondary300">
                {title}
                <ChevronDown className="h-4 w-4" />
            </button>
            <div className="absolute left-0 mt-2 w-48 rounded-md z-20 bg-secondary600 backdrop-blur-lg opacity-80 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                {items.map((item, index) => (
                    <div key={index}>
                        <Link href={`/property/${item}`} className="block px-4 py-2 text-sm text-white hover:bg-secondary300 ">
                            {item}
                        </Link>
                        {index < items.length - 1 && <hr className="border-white/20" />}
                    </div>
                ))}
            </div>
        </div>
    )

    if (path.includes("admin") || path.startsWith("/rentershub") || path.includes("/login")) {
        return null
    }

    return (
        <div className='my-4 flex items-center justify-between gap-2 w-full px-8'>
            <div className='flex gap-2 items-center justify-center'>
                <Image src="/RH1.png" alt="RentersHub Logo" width={40} height={40}  />
                <p className='text-headlineSmall text-secondary500 text-balance'>RentersHub</p>
            </div>

            <div className='md:hidden flex'>
                <AnimatePresence>
                    {(isMenuOpen || !isMobile) && (
                        <motion.div
                            initial={isMobile ? { x: "-100%" } : { opacity: 1 }}
                            animate={isMobile ? { x: 0 } : { opacity: 1 }}
                            exit={isMobile ? { x: "-100%" } : { opacity: 1 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className={`fixed md:relative top-0 left-0 bottom-0 w-64 md:w-auto ${isMobile ? "bg-black opacity-2 text-white" : "hidden md:flex"} z-[100] md:z-auto flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8 p-6 md:p-0`}
                        >
                            <div className='flex gap-2 items-center justify-center'>
                                <div className='flex flex-col gap-2'>
                                    <Image src="/RH1.png" alt="RentersHub Logo" width={40} height={40}  />
                                    <p className='text-headlineSmall text-secondary500 text-balance'>RentersHub</p>
                                </div>
                                <Button variant="ghost" size="icon" className="self-end justify-end items-end flex mb-4" onClick={() => setIsMenuOpen(false)}>
                                    <X className="h-6 w-6" />
                                </Button>
                            </div>

                            <NavItem href="/">Vacant Houses</NavItem>
                            <NavItem href={`/rentershub/Dashboard`}>Post a House</NavItem>
                            <NavItem href="/admin">Manage Rentals</NavItem>
                            <a
    href="https://api.whatsapp.com/send?phone=254731352350&text=Hello.%20I%20am%20from%20the%20website,%20https://rentershub.co.ke%20and%20I%20am%20searching%20for%20a%20vacant%20house"
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-all"
>
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-whatsapp">
        <path d="M3 20.7a10.8 10.8 0 0 1 0-17.4 10.6 10.6 0 0 1 16.7 12l3 3-4.2-1.1a10.6 10.6 0 0 1-6.5 1.9z"></path>
        <path d="M8 12s1 2 3 3 3 1 3 1l2-2"></path>
    </svg>
    <span className="text-bodySmall font-semibold">Chat With Us</span>
</a>

                            <div className='bottom-0 mt-6 flex gap-4 justify-center items-center mx-2'>
                                <NavItem href='https://www.instagram.com/rentershub.co.ke?igsh=MTVzcmh5Z2EwY3IwZg=='><Instagram /></NavItem>
                                <NavItem href='https://www.facebook.com/rentershub.co.ke?mibextid=wwXIfr&mibextid=wwXIfr'><Facebook /></NavItem>
                                <NavItem href=''>
                                    <svg xmlns="http://www.w3.org/2000/svg" className='text-white' x="0px" y="0px" width="50" height="50" viewBox="0 0 50 50">
                                        <path d="M 5.9199219 6 L 20.582031 27.375 L 6.2304688 44 L 9.4101562 44 L 21.986328 29.421875 L 31.986328 44 L 44 44 L 28.681641 21.669922 L 42.199219 6 L 39.029297 6 L 27.275391 19.617188 L 17.933594 6 L 5.9199219 6 z M 9.7167969 8 L 16.880859 8 L 40.203125 42 L 33.039062 42 L 9.7167969 8 z"></path>
                                    </svg>
                                </NavItem>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className='items-center gap-4 justify-around hidden md:flex'>
                <NavItem href="#">
                    <div className='text-bodyMedium flex items-center justify-center rounded-full gap-0.5'>
                        <Dock className='w-4 h-4 font-extrabold' />
                        Vacant Houses
                    </div>
                </NavItem>               
                <NavItem href={`/rentershub/Dashboard`}>Post A House</NavItem>                
                <a
    href="https://api.whatsapp.com/send?phone=254731352350&text=Hello.%20I%20am%20from%20the%20website,%20https://rentershub.co.ke%20and%20I%20am%20searching%20for%20a%20vacant%20house"
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-all"
>
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-whatsapp">
        <path d="M3 20.7a10.8 10.8 0 0 1 0-17.4 10.6 10.6 0 0 1 16.7 12l3 3-4.2-1.1a10.6 10.6 0 0 1-6.5 1.9z"></path>
        <path d="M8 12s1 2 3 3 3 1 3 1l2-2"></path>
    </svg>
    <span className="text-bodySmall font-semibold">Chat With Us</span>
</a>


            </div>

            <div className='flex gap-2'>
                <div className="flex-1 flex items-center justify-center md:hidden">
                    <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        <Menu className="h-6 w-6" />
                    </Button>
                </div>
                <div className='hidden md:flex gap-2 items-center justify-center'>
                    <Button variant={'outline'} className='text-black bg-secondary400 rounded-3xl text-bodySmall'>
                        Manage Rentals
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default Navbar
