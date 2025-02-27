import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { phone, message } = req.body;

  if (!phone || !message) {
    return res.status(400).json({ error: "Phone and message are required" });
  }

  try {
    const response = await fetch("https://quicksms.advantasms.com/api/services/sendsms/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        apikey: process.env.SMS_API_KEY,
        partnerID: "4283",
        message: message,
        shortcode: "RENTERS_HUB",
        mobile: phone,
      }),
    });

    const data = await response.json();
    console.log("SMS Response:", data);

    if (!response.ok) {
      return res.status(response.status).json({ error: "Failed to send SMS" });
    }

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("SMS API Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
