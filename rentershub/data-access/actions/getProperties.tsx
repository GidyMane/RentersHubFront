"use server"


import { baseUrl } from "@/utils/constants"
import axios from "axios"

export const getproperties = async (limit: number | null, offset: number | null, address:string | null, propertytype_name:string |null , rent_price_max:number | null) => {
    try {
        const searchparams = new URLSearchParams()
        if (limit || offset || address || propertytype_name || rent_price_max) {
            searchparams.set("limit", limit?.toString() ?? "20")
            searchparams.set("limit", offset?.toString() ?? "0")
            searchparams.set("address", address?.toString() ?? "")
            searchparams.set("propertytype_name", propertytype_name?.toString() ?? "")
            searchparams.set("rent_price_max", rent_price_max?.toString() ?? "")
        }       

        const res = await axios.get(baseUrl + `listing/property?${searchparams.toString()}`)
        return [res.status, res.data]


    } catch (error: any) {
        return [400, error?.message]
    }

}