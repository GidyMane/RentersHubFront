<<<<<<< HEAD
import { auth } from '@/auth';
import DashboardContent from '@/components/Dashboard';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';

import { PropertyMetrics } from '@/types/dashboard';
import React from 'react';

const defaultMetrics: PropertyMetrics = {
  total: 0,
  vacant: 0,
  occupied: 0,
  pendingApproval: 0,
};

const Page = async () => {

  const session = await auth();

  console.log(session, "testing this session")
  
  return (
    <div className="flex h-screen bg-gray-100 text-gray-800">
      {/* Sidebar */}
      {/* <div className="w-64 bg-green-500 text-white">
        <Sidebar />
      </div> */}

      THIS IS BLANK

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        {/* <div className="bg-white shadow">
          <Navbar />
        </div> */}

        {/* Dashboard Content */}
        {/* <div className="flex-1 overflow-y-auto p-6">
          <DashboardContent metrics={defaultMetrics} recentActivities={[]} />
        </div> */}
      </div>
    </div>
  );
};

export default Page;
=======
import { Suspense } from "react"
import { FullScreenCarousel } from "@/components/UpdatedLayout/HeroSections"
import { Loader } from "lucide-react"
import PropertyRender from "@/components/PropertyRender"
import { Pagination } from "@/components/pagination"
import { getpropertytype } from "../../data-access/actions/get-property-type"
import { getproperties } from "../../data-access/actions/getProperties"
import { updatePage } from "../../data-access/actions/updatePage"

const key = process.env.GOOGLE_MAPS_API_KEY!
export const dynamic = "force-dynamic"

const page = async (props: {
  searchParams: Promise<{
    limit: number
    offset: number
    address: string
    propertytype_name: string
    rent_price_max: number
    special_condition: string
  }>
}) => {
  const params = await props.searchParams
  const limit = params?.limit || 20
  const offset = params?.offset || null
  const address = params?.address || null
  const propertytype_name = params?.propertytype_name || null
  const rent_price_max = params?.rent_price_max || null
  const special_condition = params?.special_condition || null

  const formattedRentPrice = rent_price_max ? `KSh ${rent_price_max} pm` : "Not specified"

  const messageParts = [
    `Hello. I am from the website, https://rentershub.co.ke and I am searching for a vacant house that meets this criterion:`,
  ]

  if (propertytype_name) messageParts.push(`HOUSE TYPE: ${propertytype_name}`)
  if (address) messageParts.push(`LOCATION: ${address}`)
  if (rent_price_max) messageParts.push(`MAX RENT BUDGET: ${formattedRentPrice}`)
  if (special_condition) messageParts.push(`CONDITION: ${special_condition}`)

  messageParts.push(`Please help me find the house. Thank you.`)

  const whatsappMessage = encodeURIComponent(messageParts.join("\n\n\n"))

  const whatsappLink = `https://wa.me/254731352350?text=${whatsappMessage}`

  const [apiproperties, propertytypes] = await Promise.all([
    getproperties(limit, offset, address, propertytype_name, rent_price_max, special_condition),
    getpropertytype(),
  ])

  return (
    <Suspense>
      <div className="h-full w-full bg-background font-georgia">
        <div className="h-screen relative w-full">
          <Suspense fallback={<Loader className="animate animate-spin text-secondary400" />}>
            <FullScreenCarousel propertytype={propertytypes} api_key={key} />
          </Suspense>
        </div>
        <div className="flex items-center justify-center md:px-10">
          <div className="my-2"></div>
        </div>
        <div
          id="search-results"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:px-16 px-6"
        >
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
        <div>
          {apiproperties[0] == 200 && apiproperties[1]?.results.length > 0 && (
            <Pagination
              count={apiproperties[0] == 200 ? Math.round(apiproperties[1].count / 20) : 0}
              previous={""}
              next={""}
              updatePage={updatePage}
            />
          )}
        </div>
      </div>
    </Suspense>
  )
}

export default page

>>>>>>> da2dc9da5fc186335cc48ca707f8b25d5cfb93b6
