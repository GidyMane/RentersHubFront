"use server";

import { baseUrl } from "@/lib/globalvariables";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import axios from "axios";
import { revalidatePath } from "next/cache";

export const createfeature = async (feature: {
  name: string;
  description: string;
}) => {
  try {
    const data = await axios.post(baseUrl + "feature", {
      ...feature,
    });

    if (data.status == 201) {
      revalidatePath("/intime-admin/managefeatures");
    }
    return [data?.data?.data, 201];
  } catch (e: any) {
    return [e.message, 400];
  }
};
export const updatefeature = async (feature: {
  id: number;
  name: string;
  description: string;
}) => {
  try {
    const data = await axios.patch(baseUrl + "feature", {
      ...feature,
    });

    if (data.status == 201) {
      revalidatePath("/intime-admin/managefeatures");
    }
    return [data?.data?.data, 201];
  } catch (e: any) {
    return [e.message, 400];
  }
};

export const removefeature = async (feature: any) => {
  // const { isAuthenticated } = getKindeServerSession()
  //console.log(feature, "fetures");

  let url = `${feature[0]}/feature`;

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
