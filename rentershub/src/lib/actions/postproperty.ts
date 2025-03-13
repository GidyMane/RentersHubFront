'use server'

import { auth } from "@/auth";
import { baseUrl } from "@/utils/constants";
import axios from "axios";
import { error } from "console";
import { revalidatePath } from "next/cache";



type apiResponse={
    success?:string;
    error?:string | undefined;
}



export const createPropertyAction=async(data:any)=>{
    const session = await auth()

    console.dir(data, session, )
    try{
        if(session){
            console.log("action")
            const res= await axios.post("https://rentershubservicev1.onrender.com/api/v1/listing/property", data, {
                headers:{
                    Authorization:`Bearer ${session?.user.accessToken}`
                }
            })

            console.dir(res)

            if(res.status == 201){
                console.log(res.data)
                return {success:"property listed successfully", error:""}
            }
            console.log(res.data)
            throw new Error(JSON.stringify(res.data)) 
        }

        throw new Error("Session is not available")
        
    }catch(e:any){
        return {
            error:e?.message
        }

    }
    
}