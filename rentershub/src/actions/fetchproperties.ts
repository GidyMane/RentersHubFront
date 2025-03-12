"use server"
import axios from "axios"
import { baseUrl } from "@/utils/constants"
import { Property } from "@/types/property"

export async function fetchProperties(): Promise<Property[]> {
  try {
    const response = await axios.get(`${baseUrl}listing/property`)
    console.log(response.data, "res from server")
    return response.data?.results ?? []
  } catch (error) {
    console.error("Error fetching properties:", error)
    throw new Error("Failed to fetch properties")
  }
}


export const fetchPropertyById = async (id: number) => {
  try {
    const response = await axios.get(`${baseUrl}listing/property/${id}`)
    console.log(response.data, "res from server")
    return response?.data ?? [];
    
  } catch (error) {
    console.error("Error fetching property:", error)
    throw new Error("Failed to fetch property")
  }
}
export const fetchPropertyByName = async (name: string) => {
  try {
    const response = await axios.get(`${baseUrl}listing/propertybyname/${name}/`)
    console.log(response.data, "res from server")
    return response?.data ?? [];
    
  } catch (error) {
    console.error("Error fetching property:", error)
    throw new Error("Failed to fetch property")
  }
}


export async function fetchSimilarProperties(address:string): Promise<Property[]> {
  try {
    const response = await axios.get(`${baseUrl}listing/property`, {
      params:{
        address
      }
    })
    // console.log(response.data, "res from server")
    return [response.status,response.data?.results.slice(1) ?? []]
  } catch (error) {
    console.error("Error fetching properties:", error)
    throw new Error("Failed to fetch properties")
  }
}