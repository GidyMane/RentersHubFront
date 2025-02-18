"use server"

import { baseUrl } from "@/utils/constants"
import axios from "axios"

export const getpropertytype = async () => {
    try {
        

        const res = await axios.get(baseUrl + `listing/propertytype`)
        return [res.status, res.data]


    } catch (error: any) {
        return [400, error?.message]
    }

}