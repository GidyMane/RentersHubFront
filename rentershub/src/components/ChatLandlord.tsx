'use client';

import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

const ChatWithLandlord = ({ landlordPhone }: { landlordPhone: string }) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Format the landlord's phone number by replacing a leading "0" with "+254"
  const formatPhoneNumber = (phone: string) => {
    if (phone.startsWith("0")) {
      return `+254${phone.slice(1)}`;
    }
    return phone;
  };

  const formattedPhone = formatPhoneNumber(landlordPhone);

  const handleSubmit = () => {
    if (name && phone) {
      setSubmitted(true);
      console.log("User Info Submitted:", { name, phone });
    }
  };

  // Use window.location.href as the house link (if available)
  const houseLink =
    typeof window !== "undefined" ? window.location.href : "the house link";

  // Pre-filled message for WhatsApp (line breaks will be converted in the URL)
  const preFilledMessage = `Hello.
I have seen this vacant house on Renters Hub Platform.
${houseLink}
Is it still available?`;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full bg-[#0a3319] hover:bg-[#1EBE5D] text-white flex items-center justify-center gap-2">
          <MessageCircle className="w-5 h-5" /> Chat with Landlord
        </Button>
      </DialogTrigger>
      <DialogContent className="p-6 space-y-6">
        {!submitted ? (
          <div className="space-y-4 text-center">
            <h2 className="text-2xl font-semibold">Enter Your Details</h2>
            <p className="text-gray-700">
              Please enter your name and phone number so we can connect you with the landlord.
            </p>
            <Input
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              placeholder="Your Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <Button
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              onClick={handleSubmit}
              disabled={!name || !phone}
            >
              Connect Me Right Now
            </Button>
          </div>
        ) : (
          <div className="space-y-6 text-center">
            <h2 className="text-2xl font-semibold text-green-600">Submission Successful!</h2>
            <p className="text-gray-700">
              Click the WhatsApp icon below to chat with the landlord.
            </p>
            <p className="text-gray-700">
              We have informed the landlord that you are about to contact him.
            </p>
            <p className="text-gray-700">
              Do not send any money before physically viewing the house. Pay your first rent only at the moment of moving in and after reading/agreeing to the landlord’s terms and conditions.
            </p>
            <p className="text-gray-700">Good Luck.</p>
            <p className="text-lg font-bold text-gray-800">Landlord's Number: {formattedPhone}</p>
            <a
              href={`https://wa.me/${formattedPhone.replace("+", "")}?text=${encodeURIComponent(preFilledMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe57] text-white py-2 px-4 rounded-md font-bold"
            >
              <MessageCircle className="w-6 h-6" /> Chat on WhatsApp
            </a>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ChatWithLandlord;
