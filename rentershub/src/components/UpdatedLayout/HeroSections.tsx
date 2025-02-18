"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import useEmblaCarousel from "embla-carousel-react"
import { ChevronLeft, ChevronRight, Pause, Play, Plus } from "lucide-react"
import Image from "next/image"
import Autoplay from 'embla-carousel-autoplay'
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"

import Link from "next/link"
import SearchForm from "../SearchForm"
import { Button } from "../ui/button"




const images = [
    "/interior.jpg?height=1080&width=1920",
    "/kilimani.jpg?height=1080&width=1920",
    "/interior3.jpg?height=1080&width=1920",
    "/kabiria.jpg?height=1080&width=1920",
    "/kilimani.jpg?height=1080&width=1920",
    "/regen.jpg?height=1080&width=1920",
    "/uthiru.jpg?height=1080&width=1920",
]

export function FullScreenCarousel({propertytype}:{propertytype:any }) {
    const autoplay = Autoplay({ stopOnInteraction: true, delay: 4000 });


    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: true,
        duration: 5,
        skipSnaps: false,
        dragFree: false,
        // containScroll: "trimSnaps",
    }, [autoplay])
    const [isPaused, setIsPaused] = useState(false)
    const [currentIndex, setCurrentIndex] = useState(0)
    const [autoPlayInterval, setAutoPlayInterval] = useState<NodeJS.Timeout | null>(null)



    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev()
    }, [emblaApi])

    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext()
    }, [emblaApi])

    const togglePause = useCallback(() => {
        setIsPaused((prev) => !prev)
    }, [])

    const onSelect = useCallback(() => {
        if (!emblaApi) return
        setCurrentIndex(emblaApi.selectedScrollSnap())
    }, [emblaApi])

    useEffect(() => {
        if (!emblaApi) return
        onSelect()
        emblaApi.on("select", onSelect)
        return () => {
            emblaApi.off("select", onSelect)
        }
    }, [emblaApi, onSelect])

    //   useEffect(() => {
    //     if (!emblaApi || isPaused) return

    //     const autoPlay = () => {
    //       if (!emblaApi || emblaApi.isPlaying()) return

    //       if (!emblaApi.canScrollNext()) {
    //         emblaApi.scrollTo(0, true)
    //       } else {
    //         emblaApi.scrollNext({ duration: 30 })
    //       }
    //     }

    //     const interval = setInterval(autoPlay, 4000)
    //     setAutoPlayInterval(interval)

    //     return () => {
    //       if (autoPlayInterval) clearInterval(autoPlayInterval)
    //     }
    //   }, [emblaApi, isPaused])

    useEffect(() => {
        if (isPaused && autoPlayInterval) {
            clearInterval(autoPlayInterval)
            setAutoPlayInterval(null)
        }
    }, [isPaused, autoPlayInterval])


    // useEffect(() => {
    //     if (!emblaApi) return;
    //     autoplay.play(); // Ensure autoplay starts correctly after initialization.
    // }, [emblaApi, autoplay]);

    return (
        <div className="relative rounded h-full w-full md:overflow-hidden">
            {/* Overlay for text content */}
            <div className="absolute inset-0 z-20 bg-gradient-to-r  from-black/50 to-transparent">
                <motion.div
                    initial={{ opacity: 0, y: -40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    exit={{ y: -40, opacity: 0 }}
                    className='w-full flex justify-between bg-transparent  p-8 md:px-16 items-center'>
                    {/* <div className='flex gap-4 items-center justify-center'>
                        <Link href="/">     
                                           <Image src={"/RH2.jpg"} alt='rentershublogo' width={50} height={50} />
                        </Link>
                        <ul className='md:flex hidden'>
                            <li>
                                <Link href={"/"} className='hover:cursor-pointer text-white text-sm font-medium hover:text-primary'>
                                    Chat with us
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div className='flex gap-4'>
                        <Button className='flex gap-2'><Plus /> Post a house</Button>
                        <Button className='' variant="outline">Login</Button>
                    </div> */}
                </motion.div>
                <div className="container mx-auto flex flex-col md:mt-20 mt-10 items-center justify-center px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="max-w-2xl text-white items-center justify-center flex flex-col">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="mb-6 text-5xl text-white font-bold leading-tight md:text-6xl"
                        >
                            The Place Where Smart Kenyans Come To Find Houses
                        </motion.h1>
                        <motion.p initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                            className="mb-8 text-lg md:text-xl">
                            Finding your dream house is just a click away!
                        </motion.p>

                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        className="bg-white/40 shadow-md h-fit w-full md:w-fit p-2"
                    >

                        <div className="bg-white w-full h-full p-4">
                            <SearchForm propertytypes={propertytype}/>

                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Navigation controls */}
            <div className="absolute inset-x-0 bottom-8 z-30 flex justify-center space-x-4">
                <button
                    className="rounded-full bg-black/20 p-3 text-white backdrop-blur-sm transition-all hover:bg-black/40"
                    onClick={scrollPrev}
                >
                    <ChevronLeft size={24} />
                </button>
                <button
                    className="rounded-full bg-black/20 p-3 text-white backdrop-blur-sm transition-all hover:bg-black/40"
                    onClick={togglePause}
                >
                    {isPaused ? <Play size={24} /> : <Pause size={24} />}
                </button>
                <button
                    className="rounded-full bg-black/20 p-3 text-white backdrop-blur-sm transition-all hover:bg-black/40"
                    onClick={scrollNext}
                >
                    <ChevronRight size={24} />
                </button>
            </div>


            {/* Carousel */}
            <div className="h-full w-full" ref={emblaRef}>
                <div className="flex h-full">
                    {images.map((src, index) => (
                        <div
                            key={index}
                            className="relative h-full w-full flex-[0_0_100%] transition-all duration-700 ease-out"
                            style={{
                                opacity: index === currentIndex ? 1 : 0.6, // Keep opacity consistent.
                                transform: 'scale(1)', // Avoid scaling down for inactive slides.
                                transition: 'opacity 0.5s ease', // Smooth opacity transition.
                            }}
                        >
                            <Image
                                src={src || "/placeholder.svg"}
                                alt={`Slide ${index + 1}`}
                                fill
                                className="object-cover"
                                priority={index === 0}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

