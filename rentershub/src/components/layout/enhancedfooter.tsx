"use client"

import Image from "next/image"
import Link from "next/link"
import { Facebook, Instagram, Youtube, ArrowUp } from 'lucide-react'
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Footer() {
    const path = usePathname();
    const [details, setDetails] = useState<any[]>([]);

    if (path.includes("intime-admin") || path.startsWith("/intimehomes")) {
        return null;
    }

    return (
        <footer className="w-full bg-[#0e3522] text-white">
            <div className="container mx-auto px-4">
                <div className="flex justify-end py-4">
                    <button
                        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                        className="hover:text-secondary700 flex items-center"
                    >
                        <ArrowUp className="mr-2 h-4 w-4" />
                        Back to top
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8 border-secondary500">
                    <div>
                        <Image src="/RH1.png" alt="RentersHub Logo" width={50} height={50} />
                        <p className='text-headlineSmall text-secondary500 text-balance'>RentersHub</p>
                        <p className="text-sm mb-4">
                            RentersHub: where we make it easy for Kenyans to find their dream houses.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-8">
                        <nav>
                            <ul className="space-y-2">
                                <li><Link href="/listing?limit=200&page=0" className="hover:text-gray-900">Properties</Link></li>
                                <li><Link href="/blogs" className="hover:text-gray-900">Blogs</Link></li>
                                <li><Link href="/about" className="hover:text-gray-900">About Us</Link></li>
                                <li><Link href="/contact" className="hover:text-gray-900">Contact Us</Link></li>
                            </ul>
                        </nav>
                        <nav>
                            <ul className="space-y-2">
                                <li><Link href="/intimehomes/sign-in" className="hover:text-gray-900">Admin panel</Link></li>
                            </ul>
                        </nav>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center py-4">
                    <p className="text-sm">
                        © {new Date().getFullYear()} RentersHub. All rights reserved.
                    </p>
                    <div className="flex space-x-4 mt-4 md:mt-0">
                        <Link href="/privacy" className="text-sm hover:text-gray-900">Privacy Policy</Link>
                        <Link href="/terms" className="text-sm hover:text-gray-900">Do Not Sell or Share My Info</Link>
                    </div>
                </div>

                <div className="flex justify-center space-x-4 py-4">
                    <Link href="https://x.com" className="hover:text-gray-900">
                        <Image src="/x.png" alt="X" width={24} height={24} />
                        <span className="sr-only">X</span>
                    </Link>
                    <Link href="https://instagram.com" className="hover:text-gray-900">
                        <Image src="/instagram.png" alt="Instagram" width={24} height={24} />
                        <span className="sr-only">Instagram</span>
                    </Link>
                    <Link href="https://facebook.com" className="hover:text-gray-900">
                        <Image src="/facebook.png" alt="Facebook" width={24} height={24} />
                        <span className="sr-only">Facebook</span>
                    </Link>
                    <Link href="https://youtube.com" className="hover:text-gray-900">
                        <Image src="/youtube.png" alt="YouTube" width={24} height={24} />
                        <span className="sr-only">YouTube</span>
                    </Link>
                    <Link href="https://linkedin.com" className="hover:text-gray-900">
                        <Image src="/linkedin.png" alt="YouTube" width={24} height={24} />
                        <span className="sr-only">LinkedIN</span>
                    </Link>
                </div>
            </div>
        </footer>
    )
}