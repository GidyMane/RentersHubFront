"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowUp } from 'lucide-react'
import { usePathname } from "next/navigation";

export default function Footer() {
    const path = usePathname();

    if (path.includes("admin") || path.startsWith("/rentershub") || path.includes("/login") || path.includes("/signup") || path.includes("/successmessage") || path.includes("/auth2")) {
        return null;
    }

    return (
        <footer className="w-full bg-[#0e3522] text-white">
            <div className="container mx-auto px-4">
                <div className="flex justify-end py-4">
                    <button
                        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                        className="hover:text-gray-300 flex items-center"
                    >
                        <ArrowUp className="mr-2 h-4 w-4" />
                        Back to top
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8 border-secondary500">
                    <div>
                        <Image src="/RH1.png" alt="RentersHub Logo" width={50} height={50} />
                        <p className='text-headlineSmall text-secondary500 text-balance'>Renters Hub</p>
                        <p className="text-sm mb-4">
                            Renters Hub: where we make it easy for Kenyans to find their dream houses.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-8">
                        <nav>
                            <ul className="space-y-2">
                                <li><Link href="/" className="hover:text-gray-300">Vacant Houses</Link></li>
                                <li><Link href="/rentershub/Dashboard" className="hover:text-gray-300">Manage Properties</Link></li>
                                <li><a href="https://api.whatsapp.com/send?phone=254731352350&text=Hello.%20I%20am%20from%20the%20website,%20https://rentershub.co.ke%20and%20I%20am%20searching%20for%20a%20vacant%20house" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300">Chat with Us</a></li>
                            </ul>
                        </nav>
                        <nav>
                            {/* <ul className="space-y-2">
                                <li><Link href="/admin" className="hover:text-gray-300">Admin panel</Link></li>
                            </ul> */}
                        </nav>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center py-4">
                    <p className="text-sm">
                        © {new Date().getFullYear()} Renters Hub. All rights reserved.
                    </p>
                </div>

                <div className="flex justify-center space-x-4 py-4">
                    <Link href="https://www.instagram.com/rentershub.co.ke?igsh=MTVzcmh5Z2EwY3IwZg==" className="hover:text-gray-300">
                        <Image src="/instagram.png" alt="Instagram" width={24} height={24} />
                        <span className="sr-only">Instagram</span>
                    </Link>
                    <Link href="https://www.facebook.com/rentershub.co.ke?mibextid=wwXIfr&mibextid=wwXIfr" className="hover:text-gray-300">
                        <Image src="/facebook.png" alt="Facebook" width={24} height={24} />
                        <span className="sr-only">Facebook</span>
                    </Link>
                    <Link href="https://www.youtube.com/channel/UCvUY01TbD9Fc9oZLPDVJbrw" className="hover:text-gray-300">
                        <Image src="/youtube.png" alt="YouTube" width={24} height={24} />
                        <span className="sr-only">YouTube</span>
                    </Link>
                    <Link href="https://www.linkedin.com/company/renters-hub" className="hover:text-gray-300">
                        <Image src="/linkedin.png" alt="LinkedIn" width={24} height={24} />
                        <span className="sr-only">LinkedIn</span>
                    </Link>
                </div>
            </div>
        </footer>
    )
}
