"use client"

import { Suspense, useState } from "react"
import { Loader, SlidersHorizontal, Search, MapPin, Home, DollarSign, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import PropertyRender from "./PropertyRender"
import SearchForm from "./SearchForm"

export default function PropertyFilter({
  apiproperties,
  propertytypes,
  apikey,
  whatsappLink,
}: {
  apiproperties: any
  propertytypes: any
  whatsappLink: string
  apikey: string
}) {
  // Filter states
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Mobile filter toggle */}
      <div className="md:hidden mb-6">
        <Collapsible open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <CollapsibleTrigger asChild>
            <Button
              variant="outline"
              className="w-full flex items-center justify-between bg-white shadow-sm border border-gray-200 rounded-lg py-3 px-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center">
                <Filter className="h-5 w-5 text-primary mr-2" />
                <span className="font-medium">Search Filters</span>
              </div>
              <SlidersHorizontal className="h-4 w-4 text-gray-500" />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4">
            <div className="p-5 border border-gray-200 rounded-lg bg-white shadow-md">
              <div className="mb-4 pb-3 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <Search className="h-4 w-4 mr-2 text-primary" />
                  Find Your Perfect Home
                </h3>
                <p className="text-sm text-gray-500 mt-1">Customize your search criteria below</p>
              </div>
              <SearchForm propertytypes={propertytypes} api_key={""} />
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Desktop filters */}
        <div className="hidden md:block w-full md:w-1/4 lg:w-1/5">
          <div className="sticky top-24 overflow-auto max-h-[calc(100vh-120px)] bg-white border border-gray-200 rounded-lg shadow-sm">
            {/* Filter Header */}
            <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-primary/5 to-transparent">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
                <SlidersHorizontal className="h-4 w-4 text-primary" />
              </div>
              <p className="text-sm text-gray-500">Find your perfect property</p>
            </div>

            {/* Filter Categories */}
            <div className="p-5">
              <div className="space-y-1 mb-4">
                <div className="flex items-center text-sm font-medium text-gray-700">
                  <MapPin className="h-4 w-4 mr-2 text-primary" />
                  Location
                </div>
                <div className="flex items-center text-sm font-medium text-gray-700">
                  <Home className="h-4 w-4 mr-2 text-primary" />
                  Property Type
                </div>
                <div className="flex items-center text-sm font-medium text-gray-700">
                  <DollarSign className="h-4 w-4 mr-2 text-primary" />
                  Budget
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100">
                <SearchForm propertytypes={propertytypes} api_key={""} />
              </div>
            </div>
          </div>
        </div>

        {/* Property listings */}
        <div className="w-full md:w-3/4 lg:w-4/5">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <h1 className="text-2xl font-bold text-gray-800 mb-2 sm:mb-0">Properties</h1>
            <div className="flex items-center">
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                {apiproperties[1]?.results?.length || 0} results
              </span>
            </div>
          </div>

          {/* Updated grid with proper spacing */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            <Suspense
              fallback={
                <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex items-center justify-center my-12 py-12">
                  <div className="flex flex-col items-center">
                    <Loader className="text-primary w-8 h-8 animate-spin mb-3" />
                    <p className="text-gray-500">Loading properties...</p>
                  </div>
                </div>
              }
            >
              {apiproperties[0] == 200 && apiproperties[1].results.length > 0 ? (
                apiproperties[1].results.map((property: any, idx: number) => (
                  <PropertyRender property={property} key={idx} />
                ))
              ) : (
                <div
                  className="col-span-full flex flex-col items-start justify-center bg-white p-8 rounded-xl shadow-md border border-gray-100 w-full md:w-3/5 mx-auto text-left"
                  style={{ fontFamily: "Georgia, serif" }}
                >
                  <div className="w-full flex justify-center mb-6">
                    <div className="bg-gray-100 p-4 rounded-full">
                      <Search className="h-10 w-10 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">No Properties Found</h3>
                  <p className="text-gray-700 text-lg leading-relaxed">
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
                      className="px-6 py-3 text-lg font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition transform hover:scale-105 flex items-center justify-center"
                    >
                      📞 Call Admin
                    </a>
                    <a
                      href={whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 text-lg font-semibold rounded-lg bg-green-500 text-white hover:bg-green-600 transition transform hover:scale-105 flex items-center justify-center"
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

