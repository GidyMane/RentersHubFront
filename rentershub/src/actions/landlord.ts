"use server";

import { baseUrl } from "@/utils/constants";
import axios from "axios";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth"; // Import auth to get session

export const updateUser = async (user: {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  contact: string;
  username: string;
  approval_status: string;
}) => {
  try {
    // Get the session and access token
    const session = await auth();
    const accessToken = session?.user?.accessToken;

    if (!accessToken) {
      return ["Unauthorized: No access token", 401];
    }

    const data = await axios.patch(
      `${baseUrl}accounts/update/user/${user.id}`,
      {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        contact: user.contact,
        username: user.username,
        approval_status: user.approval_status,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );


    console.log(data, "data")

    if (data.status == 200) {
      revalidatePath("/admin/approvedlandlords");
    }
    return [data.data, data.status];
  } catch (e: any) {
    return [e.message, 400];
  }
};



export const removefeature = async (feature: any) => {
  // const { isAuthenticated } = getKindeServerSession()
  //console.log(feature, "fetures");

  // const url = `${feature[0]}/feature`;

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
};
