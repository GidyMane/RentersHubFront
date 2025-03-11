
import React from 'react'
import { getpropertytype } from '../../../data-access/actions/get-property-type'
import PropertyFilter from '@/components/PropertyFilter'
import { getproperties } from '../../../data-access/actions/getProperties'
import { Pagination } from '@/components/pagination'
import { updatePage } from '../../../data-access/actions/updatePage'

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
        <div className='pt-20 relative'>
            <PropertyFilter apiproperties={apiproperties} propertytypes={propertytypes} whatsappLink={whatsappLink} apikey={key} />
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
    )
}

export default page