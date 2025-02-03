"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import useEmblaCarousel from "embla-carousel-react"
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react"
import Image from "next/image"
import Autoplay from 'embla-carousel-autoplay'
import { motion } from "framer-motion"
import { Button } from "../ui/button"
import { useRouter } from "next/navigation"


const images = [
    "/FrontApartment.jpg?height=1080&width=1920",
    "/dining.jpg?height=1080&width=1920",
    "/bungalow.jpg?height=1080&width=1920",
    "/villa.jpg?height=1080&width=1920",
    "/apartment.jpg?height=1080&width=1920",
    "/insideapartment.jpg?height=1080&width=1920",
    "/apartment2.jpg?height=1080&width=1920",
]

export function FullScreenCarousel() {
    const autoplay = Autoplay({ stopOnInteraction: true, delay: 4000 });

    const router = useRouter()
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
        <div className="relative h-full w-full rounded-lg shadow-lg backdrop-blur-sm overflow-hidden">
            {/* Overlay for text content */}
            <div className="absolute inset-0 z-20 bg-gradient-to-r from-black/50 to-transparent">
                <div className="container mx-auto flex h-full items-center px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="max-w-xl text-white">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="mb-6 text-5xl text-secondary300 font-bold leading-tight md:text-6xl"
                        >
                            Discover Exceptional Properties
                        </motion.h1>
                        <motion.p initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                            className="mb-8 text-lg md:text-xl">
                            Explore our curated collection of luxury real estate across prime locations
                        </motion.p>
                        <Button className="rounded-full bg-white px-8 py-3 text-lg font-semibold text-gray-900 transition-colors hover:bg-gray-100" onClick={()=>{
                            router.push("/listing")
                        }}>
                            View Properties
                        </Button>
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

