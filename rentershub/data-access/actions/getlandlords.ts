"use server";

import { baseUrl } from "@/utils/constants";
import axios from "axios";
import { auth } from "@/auth"; // Ensure auth is correctly imported

// Generic function to fetch landlords by status
const fetchLandlordsByStatus = async (status: "approved" | "pending") => {
    try {
        const session = await auth(); // Get user session
        const accessToken = session?.user?.accessToken; // Extract token

        if (!accessToken) {
            return [401, "Unauthorized: No access token found"];
        }

        const res = await axios.get(`${baseUrl}accounts/users?status=${status}&role=Landlord`, {
            headers: {
                Authorization: `Bearer ${accessToken}`, // Attach token
                "Content-Type": "application/json",
            },
        });

        console.log(res, `${status} landlords`);
        return [res.status, res.data.result];
    } catch (error: any) {
        console.error(`Error fetching ${status} landlords:`, error);
        return [400, error?.response?.data?.message || error?.message || "An error occurred"];
    }
};

// Fetch approved landlords
export const getLandlords = async () => fetchLandlordsByStatus("approved");

// Fetch pending landlords
export const getPendingLandlords = async () => fetchLandlordsByStatus("pending");
