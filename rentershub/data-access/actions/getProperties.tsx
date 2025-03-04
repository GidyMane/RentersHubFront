"use server"

import { baseUrl } from "@/utils/constants"
import axios from "axios"

export const getproperties = async (
    limit: number | null,
    offset: number | null,
    address: string | null,
    propertytype_name: string | null,
    rent_price_max: number | null,
    special_condition: string | null
) => {
    try {
        const searchparams = new URLSearchParams()

        // Set default values and add necessary parameters
        searchparams.set("limit", limit?.toString() ?? "20")
        searchparams.set("offset", offset?.toString() ?? "0")
        searchparams.set("address", address?.toString() ?? "")
        searchparams.set("propertytype_name", propertytype_name?.toString() ?? "")
        searchparams.set("rent_price_max", rent_price_max?.toString() ?? "")
        searchparams.set("special_condition", special_condition?.toString() ?? "")

        // Ensure we only fetch properties where is_approved is true
        searchparams.set("is_approved", "true")

        const res = await axios.get(`${baseUrl}listing/property?${searchparams.toString()}`)

        return [res.status, res.data]

    } catch (error: any) {
        return [400, error?.message]
    }
}
