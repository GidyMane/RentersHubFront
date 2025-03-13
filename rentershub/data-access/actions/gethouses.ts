"use server";

import { baseUrl } from "@/utils/constants";
import axios from "axios";

// Generic function to fetch properties based on approval status
const fetchPropertiesByApproval = async (isApproved: boolean) => {
    try {
        const res = await axios.get(`${baseUrl}listing/property?is_approved=${isApproved}`, {
            headers: {
                "Content-Type": "application/json",
            },
        });

        console.log(res, `Properties (Approved: ${isApproved})`);
        return [res.status, res.data.results];
    } catch (error: any) {
        console.error(`Error fetching properties (Approved: ${isApproved}):`, error);
        return [400, error?.response?.data?.message || error?.message || "An error occurred"];
    }
};

// Fetch approved properties
export const getApprovedProperties = async () => fetchPropertiesByApproval(true);

// Fetch pending properties
export const getPendingProperties = async () => fetchPropertiesByApproval(false);
