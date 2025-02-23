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
        propertytype: property.propertytype.id, // Assuming API expects ID
        postedby: property.postedby,
        managed_by: property.managed_by,
        address: property.address,
        rent_price: property.rent_price,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log(data, "data");

    if (data.status == 200) {
      revalidatePath("/admin/properties");
    }
    return [data.data, data.status];
  } catch (e: any) {
    return [e.message, 400];
  }
};
