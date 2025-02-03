"use server"


import { baseUrl } from "@/utils/constants"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import axios from "axios"
import { revalidatePath } from "next/cache"


export const createpropertytype = async (propertytype: {
    name: string;
    
}) => {
    

        try {

            const data = await axios.post(baseUrl + "propertytype", {
                ...propertytype
            })

            if (data.status == 201) {
                revalidatePath("/intime-admin/manage-property-types")
            }
            return [data?.data?.data, 201]

        } catch (e: any) {
            return [e.message, 400]
        }

   
}

export const updateproperty = async (propertytype: {
    id:number;
    name: string;
    
}) => {
 

        try {

            const data = await axios.patch(baseUrl + "propertytype", {
                ...propertytype
            })

            if (data.status == 201) {
                revalidatePath("/intime-admin/manage-property-types")
            }
            return [data?.data?.data, 201]

        } catch (e: any) {
            return [e.message, 400]
        }

   
}


export const removefeature = async (feature: any) => {
    const { isAuthenticated } = getKindeServerSession()
   // console.log(feature, "fetures")

    let url = `${feature[0]}/feature`

    // if (feature.length > 1) {
    //     url = 'features'
    // }

    // if (await isAuthenticated()) {

    //     try {

    //         if (feature.length > 1) {
    //             const data = await axios.post(baseUrl + url, {
    //                 features: feature
    //             })


    //         } else {
    //             const data = await axios.delete(baseUrl + url)


    //         }

    //         revalidatePath("/intime-admin/managefeatures")

    //         return [{}, 204]

    //     } catch (e: any) {
    //         return [e.message, 400]
    //     }

    // } else {
    //     return ["unauthorized", 403]
    // }
}


export const getpropertytypes = async()=>{
  

        try {

            const data = await axios.get(baseUrl + "propertytypes")

        
            return [data?.data?.data, data.status]

        } catch (e: any) {
            return [e.message, 400]
        }

    

}
export const getpropertytypebyname = async(name:string)=>{
  

        try {

            const data = await axios.get(baseUrl + `${name}/propertytypebyname`)
            console.log(data)

        
            return [data?.data?.data, data.status]

        } catch (e: any) {
            return [e.message, 400]
        }

    

}



