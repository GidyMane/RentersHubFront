"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import useEmblaCarousel from "embla-carousel-react"
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react"
import Image from "next/image"
import Autoplay from 'embla-carousel-autoplay'
import { motion } from "framer-motion"
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
    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: true,
        duration: 5,
        skipSnaps: false,
        dragFree: false,
    }, [autoplay])
    const [isPaused, setIsPaused] = useState(false)
    const [currentIndex, setCurrentIndex] = useState(0)

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

    return (
        <div className="relative rounded h-full w-full overflow-x-hidden">
            <div className="absolute inset-0 z-20 bg-gradient-to-r from-black/50 to-transparent">
                <div className="container mx-auto flex flex-col md:mt-20 mt-10 items-center justify-center px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="max-w-2xl text-white items-center justify-start flex flex-col">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="mb-2 text-3xl mt-20 md:text-4xl lg:text-4xl font-bold leading-tight"
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
                            <SearchForm api_key={api_key} propertytypes={propertytype} />
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
            <div className="h-full w-full" ref={emblaRef}>
                <div className="flex h-full">
                    {images.map((src, index) => (
                        <div
                            key={index}
                            className="relative h-full w-full flex-[0_0_100%] transition-all duration-700 ease-out"
                            style={{
                                opacity: index === currentIndex ? 1 : 0.6,
                                transform: 'scale(1)',
                                transition: 'opacity 0.5s ease',
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
