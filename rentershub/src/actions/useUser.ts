import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { baseUrl } from "@/utils/constants";

export const useUser = () => {
  const { data: session } = useSession();
  const [user, setUser] = useState({
    name: "",
    email: "",
    avatar: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      if (!session?.user?.user_id) return;

      try {
        const response = await fetch(`${baseUrl}accounts/user/${session.user.user_id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.user.accessToken}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch user data");

        const data = await response.json();
        const userData = data.result;

        setUser({
          name: `${userData.first_name} ${userData.username}`,
          email: userData.email,
          avatar: userData.avatar || "/placeholder.svg?height=32&width=32",
        });
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserData();
  }, [session]);

  return { user, session };
};
