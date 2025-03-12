'use client';

import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

const ChatWithLandlord = ({ landlordPhone, propertyId }: { landlordPhone: string, propertyId: string }) => {
 console.log(propertyId, "id ya property")
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [phoneError, setPhoneError] = useState("");

  // Format the landlord's phone number
  const formatPhoneNumber = (phone: string) => {
    if (phone.startsWith("0")) {
      return `+254${phone.slice(1)}`;
    }
    return phone;
  };

  const formattedPhone = formatPhoneNumber(landlordPhone);

  // Validate phone number input
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/\D/g, '');
    setPhone(input);

    if (input.length < 10) {
      setPhoneError("Phone number must be at least 10 digits.");
    } else {
      setPhoneError("");
    }
  };

  const handleSubmit = () => {
    if (phone.length < 10) {
      setPhoneError("Phone number must be at least 10 digits.");
      return;
    }
  
    setSubmitted(true);
    // console.log("User Info Submitted:", { name, phone });
  
    // Send SMS to landlord after submission
    sendSmsToLandlord();
  };
  
   
  // Generate house link
  const houseLink = `https://rentershub.co.ke/property/${propertyId}`;

  // WhatsApp message template
  const preFilledMessage = `Hello. 
I have seen this vacant house on Renters Hub Platform. 
${houseLink} 
Is it still available?`;

  // SMS message template
  const landlordSmsMessage = `Hello. Renters Hub has shared your contacts with ${name} (${phone}) who wants to rent your house ${houseLink}. Please receive them.`;

  // Function to send SMS
  const sendSmsToLandlord = async () => {
    try {
      const response = await fetch("/api/sms/send-sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: formattedPhone, message: landlordSmsMessage }),
      });
  
      const data = await response.json();
      if (data.success) {
        // console.log("SMS sent successfully:", data);
      } else {
        console.error("Failed to send SMS:", data.error);
      }
    } catch (error) {
      console.error("Error sending SMS:", error);
    }
  };
  

  // Handle WhatsApp button click
  const handleWhatsAppClick = () => {
    sendSmsToLandlord();
  };

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
              onChange={handlePhoneChange}
              type="tel"
            />
            {phoneError && <p className="text-red-500 text-sm">{phoneError}</p>}
            <Button
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              onClick={handleSubmit}
              disabled={!name || !phone || phone.length < 10}
            >
              Connect Me Right Now
            </Button>
          </div>
        ) : (
          <div className="space-y-6 text-center">
            <h2 className="text-2xl font-semibold text-green-600">Submission Successful!</h2>
            <p className="text-gray-700">
              Click the WhatsApp button below to chat with the landlord.
            </p>
            <p className="text-gray-700">
              We have informed the landlord that you are about to contact them.
            </p>
            <p className="text-gray-700">
              Do not send any money before physically viewing the house.
            </p>
            <p className="text-gray-700">Good Luck.</p>
            <p className="text-lg font-bold text-gray-800">Landlord's Number: {formattedPhone}</p>
            <a
              href={`https://wa.me/${formattedPhone.replace("+", "")}?text=${encodeURIComponent(preFilledMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe57] text-white py-2 px-4 rounded-md font-bold"
              onClick={handleWhatsAppClick}
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
