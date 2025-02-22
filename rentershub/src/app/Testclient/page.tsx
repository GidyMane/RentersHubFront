import { useState, useEffect, Suspense } from "react";

import { Filters } from "@/components/Hunter/filters";
import { PropertyCard } from "@/components/Hunter/PropertyCard";
import { EmptyState } from "@/components/Hunter/empty-state";
import { FullScreenCarousel } from "@/components/UpdatedLayout/HeroSections";
import HeroSearchBar from "@/components/UpdatedLayout/HeroSearchBar";
import { Property } from "@/types/property";
import { fetchProperties } from "@/actions/fetchproperties";
import { motion } from "framer-motion";
import SearchForm from "@/components/SearchForm";
import { getproperties } from "../../../data-access/actions/getProperties";
import { getpropertytype } from "../../../data-access/actions/get-property-type";
import { Loader } from "lucide-react";
import PropertyRender from "@/components/PropertyRender";
import { Pagination } from "@/components/pagination";
import { updatePage } from "../../../data-access/actions/updatePage";

const page = async (props: {
  searchParams: Promise<{
    limit: number;
    offset: number;
    address: string;
    propertytype_name: string;
    rent_price_max: number;
  }>;
}) => {
  const params = await props.searchParams;
  const limit = params?.limit || 4;
  const offset = params?.offset || null;
  const address = params?.address || "Not specified";
  const propertytype_name = params?.propertytype_name || "Not specified";
  const rent_price_max = params?.rent_price_max || 0; // Ensure it's a number

  const formattedRentPrice =
    rent_price_max > 0 ? `KSh ${rent_price_max}/Month` : "Not specified";

  const [apiproperties, propertytypes] = await Promise.all([
    getproperties(limit, offset, address, propertytype_name, rent_price_max),
    getpropertytype(),
  ]);

  console.log(apiproperties, "ap", propertytypes, "pp");

  // WhatsApp message formatting
  const whatsappMessage = encodeURIComponent(
    `Hello. I am from the website, https://rentershub.co.ke and I am searching for a vacant house that meets this criterion:\n\n` +
      `HOUSE TYPE: ${propertytype_name}\n` +
      `LOCATION: ${address}\n` +
      `MAX RENT BUDGET: ${formattedRentPrice}\n` +
      `CONDITION: With WiFi Connection\n\n` +
      `Please help me find the house. Thank you.`
  );

  const whatsappLink = `https://wa.me/254731352350?text=${whatsappMessage}`;

  return (
    <div className="h-full w-full bg-background">
      <div className="h-screen relative w-full">
        <FullScreenCarousel propertytype={propertytypes} />
      </div>

      <div className="flex items-center justify-center md:px-10">
        <div className="my-10">
          <h2 className="text-gray-800 text-3xl font-semibold text-balance">
            Available Houses
          </h2>
          <p className="my-4 text-muted text-md text-center">
            Verified by our team
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 mt-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:px-16 px-6">
        <Suspense
          fallback={
            <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex items-center justify-center my-4">
              <Loader className="text-primary w-6 h-6 animate-spin" />
            </div>
          }
        >
          {apiproperties[0] == 200 && apiproperties[1].results.length > 0 ? (
            apiproperties[1].results?.map((property: any, idx: number) => (
              <PropertyRender property={property} key={idx} />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center text-center bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold text-red-600">
                Hello. Landlords and Property Agents are yet to post such a
                house in that location.
              </h2>
              <p className="mt-2 text-gray-700">
                Please go back and search another house or a different location
                or contact our office for further assistance.
              </p>

              <div className="flex flex-col md:flex-row gap-6 mt-6 w-full justify-center">
                {/* Call Button */}
                <a
                  href="tel:+254731352350"
                  className="px-6 py-3 text-lg font-semibold rounded-lg bg-blue-600 text-white shadow-md hover:bg-blue-700 transition transform hover:scale-105"
                >
                  📞 Call Customer Care
                </a>

                {/* WhatsApp Button */}
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 text-lg font-semibold rounded-lg bg-green-500 text-white shadow-md hover:bg-green-600 transition transform hover:scale-105"
                >
                  💬 WhatsApp Us
                </a>
              </div>
            </div>
          )}
        </Suspense>
      </div>

      <div>
        {apiproperties[0] == 200 && apiproperties[1]?.results.length > 0 && (
          <Pagination
            count={
              apiproperties[0] == 200
                ? Math.round(apiproperties[1].count / 20)
                : 0
            }
            previous={""}
            next={""}
            updatePage={updatePage}
          />
        )}
      </div>
    </div>
  );
};

export default page;
