"use server";

import { baseUrl } from "@/utils/constants";
import axios from "axios";
import { auth } from "@/auth"; // Assuming auth is correctly imported

export const getLandlords = async () => {
    try {
        const session = await auth(); // Get the session
        const accessToken = session?.user?.accessToken; // Extract access token

        if (!accessToken) {
            return [401, "Unauthorized: No access token found"];
        }

        const res = await axios.get(`${baseUrl}accounts/users?status=approved&role=Landlord`, {
            headers: {
                Authorization: `Bearer ${accessToken}`, // Attach the token
                "Content-Type": "application/json",
            },
        });

        console.log(res, "landlord");
        return [res.status, res.data.result];
    } catch (error: any) {
        console.error("Error fetching landlords:", error);
        return [400, error?.response?.data?.message || error?.message || "An error occurred"];
    }
};
