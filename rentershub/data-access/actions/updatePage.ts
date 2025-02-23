"use server"

import { revalidatePath } from "next/cache"

export const updatePage = async () => {

    revalidatePath("/")
}