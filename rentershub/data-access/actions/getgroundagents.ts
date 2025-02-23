"use server";

import { baseUrl } from "@/utils/constants";
import axios from "axios";
import { auth } from "@/auth"; // Ensure auth is correctly imported

// Generic function to fetch users by role and status
const fetchUsersByRoleAndStatus = async (role: string, status: "approved" | "pending") => {
    try {
        const session = await auth(); // Get user session
        const accessToken = session?.user?.accessToken; // Extract token

        if (!accessToken) {
            return [401, "Unauthorized: No access token found"];
        }

        const res = await axios.get(`${baseUrl}accounts/users?status=${status}&role=${role}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`, // Attach token
                "Content-Type": "application/json",
            },
        });

        console.log(res, `${status} ${role}s`);
        return [res.status, res.data.result];
    } catch (error: any) {
        console.error(`Error fetching ${status} ${role}s:`, error);
        return [400, error?.response?.data?.message || error?.message || "An error occurred"];
    }
};

// Fetch approved Ground Agents
export const getApprovedGroundAgents = async () => fetchUsersByRoleAndStatus("GroundAgent", "approved");

// Fetch pending Ground Agents
export const getPendingGroundAgents = async () => fetchUsersByRoleAndStatus("GroundAgent", "pending");
