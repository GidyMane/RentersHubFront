import { useState, useEffect, Suspense } from "react"

import { Filters } from "@/components/Hunter/filters"
import { PropertyCard } from "@/components/Hunter/PropertyCard"
import { EmptyState } from "@/components/Hunter/empty-state"
import { FullScreenCarousel } from "@/components/UpdatedLayout/HeroSections"
import HeroSearchBar from "@/components/UpdatedLayout/HeroSearchBar"
import { Property } from "@/types/property"
import { fetchProperties } from "@/actions/fetchproperties"
import { motion } from "framer-motion"
import SearchForm from "@/components/SearchForm"
import { getproperties } from "../../../data-access/actions/getProperties"
import { getpropertytype } from "../../../data-access/actions/get-property-type"
import { Loader } from "lucide-react"
import PropertyRender from "@/components/PropertyRender"
import { Pagination } from "@/components/pagination"
import { updatePage } from "../../../data-access/actions/updatePage"

const page = async (props: {
  searchParams: Promise<{ limit: number; offset: number; address: string; propertytype_name: string; rent_price_max: number }>
}) => {

  const params = await (props).searchParams
  const limit = params?.limit || 4
  const offset = params?.offset || null
  const address = params?.address || null
  const propertytype_name = params?.propertytype_name || null
  const rent_price_max = params?.rent_price_max || null
  const [apiproperties, propertytypes] = await Promise.all([getproperties(limit, offset, address, propertytype_name, rent_price_max), getpropertytype()])
  console.log(apiproperties, "ap", propertytypes, "pp")
  
  // Fetch properties asynchronously
  const properties = await fetchProperties()


  return (
    <div className="h-full w-full bg-background">
      <div className="h-screen relative w-full ">
        <FullScreenCarousel propertytype={propertytypes} />
        {/*
        <div className="absolute -bottom-10 z-30 flex justify-center mx-auto inset-x-0">
          <div className="w-fit bg-[#F0F8FF] py-2 px-4 rounded-lg shadow-lg backdrop-blur-lg">
            <h3 className="text-labelLarge p-2 font-bold">
              Find your next dream house
            </h3>
            <div className="my-2 p-2">
              <HeroSearchBar />
            </div>
          </div>
        </div>
        */}
      </div>

      <div className='flex items-center justify-center md:px-10'>
          <div className='my-10'>
            <h2 className='text-gray-800 text-3xl font-semibold text-balance'>Available Houses</h2>

            <p className='my-4 text-muted text-md text-center'>Verified by our team</p>

          </div>
        </div>
  

      <div className="grid grid-cols-1 mt-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:px-16 px-6">
          <Suspense fallback={<div className='col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex items-center justify-center my-4'>
            <Loader className='text-primary w-6 h-6 animate-spin' />
          </div>}>
            {apiproperties[0] == 200 && apiproperties[1].results.length > 0 ? apiproperties[1].results?.map((property: any, idx: number) => (
              <PropertyRender property={property} key={idx} />
            )) : (
              <div className='flex items-center justify-center'>
                <div className='max-w-xl'>
                  <p className='text-balance leading-4 tracking-wide '>
                    Something went wrong, please check your internet, meanwhile our team is working to ensure you find your home in no time. Thank you for your patience
                  </p>
                </div>
              </div>
            )}
          </Suspense>




        </div>
        <div>
          {apiproperties[0] == 200 && apiproperties[1]?.results.length > 0 &&(
            <Pagination count={apiproperties[0] == 200 ? Math.round(apiproperties[1].count / 20) as number : 0} previous={""} next={""} updatePage={updatePage} />

          )}
        </div>
    </div>
  )
}

export default page
