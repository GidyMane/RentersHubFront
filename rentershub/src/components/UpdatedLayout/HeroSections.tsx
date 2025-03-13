"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import useEmblaCarousel from "embla-carousel-react"
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react"
import Image from "next/image"
import Autoplay from 'embla-carousel-autoplay'
import { motion } from "framer-motion"
<<<<<<< HEAD
import { Button } from "../ui/button"
import { useRouter } from "next/navigation"


const images = [
    "/interior.jpg?height=1080&width=1920",
    "/kilimani.jpg?height=1080&width=1920",
    "/interior3.jpg?height=1080&width=1920",
    "/kabiria.jpg?height=1080&width=1920",
    "/kilimani.jpg?height=1080&width=1920",
    "/regen.jpg?height=1080&width=1920",
    "/uthiru.jpg?height=1080&width=1920",
]

export function FullScreenCarousel() {
    const autoplay = Autoplay({ stopOnInteraction: true, delay: 4000 });

    const router = useRouter()
=======
import SearchForm from "../SearchForm"

// const images = [
//     "/interior.jpg?height=1080&width=1920",
//     "/kilimani.jpg?height=1080&width=1920",
//     "/interior3.jpg?height=1080&width=1920",
//     "/kabiria.jpg?height=1080&width=1920",
//     "/kilimani.jpg?height=1080&width=1920",
//     "/regen.jpg?height=1080&width=1920",
//     "/uthiru.jpg?height=1080&width=1920",
// ]

const images = [
    "/regen.jpg?height=1080&width=1920",

]
export function FullScreenCarousel({ propertytype, api_key }: { propertytype: any, api_key:string; }) {
    const autoplay = Autoplay({ stopOnInteraction: true, delay: 4000 });
>>>>>>> da2dc9da5fc186335cc48ca707f8b25d5cfb93b6
    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: true,
        duration: 5,
        skipSnaps: false,
        dragFree: false,
<<<<<<< HEAD
        // containScroll: "trimSnaps",
    }, [autoplay])
    const [isPaused, setIsPaused] = useState(false)
    const [currentIndex, setCurrentIndex] = useState(0)
    const [autoPlayInterval, setAutoPlayInterval] = useState<NodeJS.Timeout | null>(null)


=======
    }, [autoplay])
    const [isPaused, setIsPaused] = useState(false)
    const [currentIndex, setCurrentIndex] = useState(0)
>>>>>>> da2dc9da5fc186335cc48ca707f8b25d5cfb93b6

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

<<<<<<< HEAD
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
=======
    return (
        <div className="relative rounded h-full w-full overflow-x-hidden">
            <div className="absolute inset-0 z-20 bg-gradient-to-r from-black/50 to-transparent">
                <div className="container mx-auto flex flex-col md:mt-20 mt-10 items-center justify-center px-4">
>>>>>>> da2dc9da5fc186335cc48ca707f8b25d5cfb93b6
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
<<<<<<< HEAD
                        className="max-w-xl text-white">
=======
                        className="max-w-2xl text-white items-start justify-start flex flex-col">
>>>>>>> da2dc9da5fc186335cc48ca707f8b25d5cfb93b6
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
<<<<<<< HEAD
                            className="mb-6 text-5xl text-secondary300 font-bold leading-tight md:text-6xl"
                        >
                            The Place Where Smart Kenyans Come To Find Houses
                        </motion.h1>
                        <motion.p initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                            className="mb-8 text-lg md:text-xl">
                            Finding your dream house is just a click away!
                        </motion.p>
                        {/* <Button className="rounded-full bg-white px-8 py-3 text-lg font-semibold text-gray-900 transition-colors hover:bg-gray-100" onClick={()=>{
                            router.push("/listing")
                        }}>
                            View Properties
                        </Button> */}
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
=======
                            className="mb-2 text-3xl mt-20 md:text-4xl lg:text-4xl font-bold leading-tight"
                            style={{ fontFamily: "Georgia, serif" }}
                        >
                            The Place Where Kenyans Come To Find Vacant Houses
                        </motion.h1>
                        {/* <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                            className="mb-8 text-base md:text-lg lg:text-xl"
                        >
                            Finding your dream house is just a click away!
                        </motion.p> */}
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        className="bg-white/40 shadow-md h-fit w-full md:w-fit p-2 mt-10"
                    >
                        <div className="bg-white w-full h-full p-4">
                            <SearchForm api_key={api_key} propertytypes={propertytype} classname="flex md:flex-row flex-col gap-4 md:items-center md:justify-center w-full"/>
                        </div>
                    </motion.div>
                </div>
            </div>
            {/* <div className="absolute inset-x-0 bottom-8 z-30 flex justify-center space-x-4">
                <button className="rounded-full bg-black/20 p-3 text-white backdrop-blur-sm transition-all hover:bg-black/40" onClick={scrollPrev}>
                    <ChevronLeft size={24} />
                </button>
                <button className="rounded-full bg-black/20 p-3 text-white backdrop-blur-sm transition-all hover:bg-black/40" onClick={togglePause}>
                    {isPaused ? <Play size={24} /> : <Pause size={24} />}
                </button>
                <button className="rounded-full bg-black/20 p-3 text-white backdrop-blur-sm transition-all hover:bg-black/40" onClick={scrollNext}>
                    <ChevronRight size={24} />
                </button>
            </div> */}
>>>>>>> da2dc9da5fc186335cc48ca707f8b25d5cfb93b6
            <div className="h-full w-full" ref={emblaRef}>
                <div className="flex h-full">
                    {images.map((src, index) => (
                        <div
                            key={index}
                            className="relative h-full w-full flex-[0_0_100%] transition-all duration-700 ease-out"
                            style={{
<<<<<<< HEAD
                                opacity: index === currentIndex ? 1 : 0.6, // Keep opacity consistent.
                                transform: 'scale(1)', // Avoid scaling down for inactive slides.
                                transition: 'opacity 0.5s ease', // Smooth opacity transition.
=======
                                opacity: index === currentIndex ? 1 : 0.6,
                                transform: 'scale(1)',
                                transition: 'opacity 0.5s ease',
>>>>>>> da2dc9da5fc186335cc48ca707f8b25d5cfb93b6
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
<<<<<<< HEAD

=======
>>>>>>> da2dc9da5fc186335cc48ca707f8b25d5cfb93b6
