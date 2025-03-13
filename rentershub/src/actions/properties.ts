"use server";

import { baseUrl } from "@/utils/constants";
import axios from "axios";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth"; // Import auth to get session

export const updateProperty = async (property: {
  id: number;
  title: string;
  propertytype: { id: number; name: string };
  postedby: string;
  managed_by: string;
  address: string;
  rent_price: string;
  is_available: boolean;
}) => {
  try {
    // Get the session and access token
    const session = await auth();
    const accessToken = session?.user?.accessToken;

    if (!accessToken) {
      return ["Unauthorized: No access token", 401];
    }

    const data = await axios.patch(
      `${baseUrl}listing/property/${property.id}/`,
      {
        title: property.title,
        propertytype: property.propertytype.id, 
        postedby: property.postedby,
        managed_by: property.managed_by,
        address: property.address,
        rent_price: property.rent_price,
        is_available: property.is_available,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    // console.log(data, "data");

    if (data.status == 200) {
      revalidatePath("/admin/properties");
    }
    return [data.data, data.status];
  } catch (e: any) {
    return [e.message, 400];
  }
};

export const ApproveProperty = async (property: {
  id: number;
  is_approved:boolean
}) => {
  try {
    // Get the session and access token
    const session = await auth();
    const accessToken = session?.user?.accessToken;

    if (!accessToken) {
      return ["Unauthorized: No access token", 401];
    }

    const data = await axios.patch(
      `${baseUrl}listing/property/${property.id}/`,
      {
       is_approved:property.is_approved
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    // console.log(data, "data");

    if (data.status == 200) {
      revalidatePath("/admin/properties");
    }
    return [data.data, data.status];
  } catch (e: any) {
    return [e.message, 400];
  }
};
