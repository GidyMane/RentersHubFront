"use client"

import { Suspense, useState } from "react"

import { Loader, SlidersHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"


import PropertyRender from "./PropertyRender"
import SearchForm from "./SearchForm"



export default function PropertyFilter({apiproperties,propertytypes, apikey, whatsappLink }:{apiproperties:any; propertytypes:any; whatsappLink:string; apikey:string;}) {
    // Filter states
    const [isFilterOpen, setIsFilterOpen] = useState(false)

    

    
    return (
        <div className="container mx-auto px-4 py-8">
            {/* Mobile filter toggle */}
            <div className="md:hidden mb-4">
                <Collapsible open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                    <CollapsibleTrigger asChild>
                        <Button variant="outline" className="w-full flex items-center justify-between">
                            <span>Filters</span>
                            <SlidersHorizontal className="h-4 w-4 ml-2" />
                        </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-4">
                        <div className="space-y-4 p-4 border rounded-lg">
                            {/* Mobile filters */}
                            {/* <FilterContent
                                location={location}
                                setLocation={setLocation}
                                propertyType={propertyType}
                                setPropertyType={setPropertyType}
                                maxBudget={maxBudget}
                                setMaxBudget={setMaxBudget}
                                selectedConditions={selectedConditions}
                                toggleCondition={toggleCondition}
                            /> */}
                            <SearchForm propertytypes={propertytypes} api_key={""}/>
                        </div>
                    </CollapsibleContent>
                </Collapsible>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
                {/* Desktop filters */}
                <div className="hidden md:block w-full md:w-1/4 lg:w-1/5">
                    <div className="sticky top-4 space-y-6 p-4 border rounded-lg">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold">Filters</h2>
                            <SlidersHorizontal className="h-4 w-4" />
                        </div>

                        {/* <FilterContent
                            location={location}
                            setLocation={setLocation}
                            propertyType={propertyType}
                            setPropertyType={setPropertyType}
                            maxBudget={maxBudget}
                            setMaxBudget={setMaxBudget}
                            selectedConditions={selectedConditions}
                            toggleCondition={toggleCondition}
                        /> */}
                           <SearchForm propertytypes={propertytypes} api_key={""}/>
                    </div>
                </div>

                {/* Property listings */}
                <div className="w-full md:w-3/4 lg:w-4/5">
                    <div className="mb-4 flex items-center justify-between">
                        <h1 className="text-2xl font-bold">Properties</h1>
                        <p className="text-muted-foreground">{apiproperties[1]?.results?.length} results</p>
                    </div>

                    <div className="space-y-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        <Suspense
                            fallback={
                                <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex items-center justify-center my-4">
                                    <Loader className="text-primary w-6 h-6 animate-spin" />
                                </div>
                            }
                        >
                            {apiproperties[0] == 200 && apiproperties[1].results.length > 0 ? (
                                apiproperties[1].results.map((property: any, idx: number) => (
                                    <PropertyRender property={property} key={idx} />
                                ))
                            ) : (
                                <div
                                    className="col-span-full flex flex-col items-start justify-center bg-white p-8 rounded-xl w-full md:w-3/5 mx-auto text-left"
                                    style={{ fontFamily: "Georgia, serif" }}
                                >
                                    <p className="mt-4 text-gray-700 text-lg leading-relaxed">
                                        Hello. Landlords and Property Agents are yet to post such a house in that location.
                                        <br />
                                        <br />
                                        Please go back and search another house or a different location or.
                                        <br />
                                        <br />
                                        Contact our admin for further assistance.
                                    </p>
                                    <div className="flex flex-col md:flex-row gap-6 mt-6 w-full">
                                        <a
                                            href="tel:+254731352350"
                                            className="px-6 py-3 text-lg font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition transform hover:scale-105"
                                        >
                                            📞 Call Admin
                                        </a>
                                        <a
                                            href={whatsappLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-6 py-3 text-lg font-semibold rounded-lg bg-green-500 text-white hover:bg-green-600 transition transform hover:scale-105"
                                        >
                                            💬 Chat With Admin
                                        </a>
                                    </div>
                                </div>
                            )}
                        </Suspense>
                    </div>
                </div>
            </div>
        </div>
    )
}



