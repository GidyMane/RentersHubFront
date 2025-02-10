"use server"

import { revalidatePath } from "next/cache"


export const RevalidatePath = (path:string)=>{
    return revalidatePath(path)
}