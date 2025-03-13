'use client';

import { useState } from 'react';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Phone, MessageSquare } from 'lucide-react';
import { baseUrl } from "@/utils/constants";
import axios from 'axios';

const CallLandlordForm = ({ landlordPhone, propertyId, propId }: { landlordPhone: string, propertyId: string, propId:number}) => {  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [phoneError, setPhoneError] = useState('');

  const formatPhoneNumber = (phone: string) => {
    if (phone.startsWith('0')) {
      return `+254${phone.slice(1)}`;
    }
    return phone;
  };

  const formattedPhone = formatPhoneNumber(landlordPhone);
  const houseLink = encodeURIComponent(`${propertyId}`);
  const fullHouseLink = `https://rentershub.co.ke/property/${houseLink}`;

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/\D/g, '');
    setPhone(input);

    if (input.length < 10) {
      setPhoneError("Phone number must be at least 10 digits.");
    } else {
      setPhoneError("");
    }
  };

  const handleSubmit = async () => {
    if (phone.length < 10) {
      setPhoneError("Phone number must be at least 10 digits.");
      return;
    }

    const payload = {
      connectionfullname: name,
      contact: phone,
      propertylink: fullHouseLink,
      property: propId,
      commission: "0.00"
    };

    console.log("Submitting connection with payload:", payload);

    try {
      const response = await axios.post(`${baseUrl}accounts/connections`, payload);
      console.log("Connection submitted successfully:", response.data);
      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting connection:", error);
    }
  };

  const handleReveal = () => {
    setRevealed(true);
    sendSmsToLandlord();
  };

  const sendSmsToLandlord = async () => {
    const landlordSmsMessage = `Hello. Renters Hub has shared your contacts with ${name} (${phone}) who wants to rent your house %0A%0A ${fullHouseLink} .Please receive them.`;
    try {
      await axios.post("/api/sms/send-sms", {
        phone: formattedPhone,
        message: landlordSmsMessage
      });
    } catch (error) {
      console.error("Error sending SMS:", error);
    }
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="w-full bg-secondary hover:bg-[#29335f] text-white flex items-center justify-center gap-2">
            <Phone className="w-5 h-5" /> Call Landlord
          </Button>
        </DialogTrigger>
        <DialogContent className="p-6 max-w-lg text-center">
          {!submitted ? (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Get Connected with the Landlord</h2>
              <p className="text-gray-700">Please enter your name and phone number to be connected.</p>
              <Input placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} />
              <Input placeholder="Your Phone Number" value={phone} onChange={handlePhoneChange} type="tel" />
              {phoneError && <p className="text-red-500 text-sm">{phoneError}</p>}
              <Button className="w-full bg-[#B5A887] hover:bg-[#A39775] text-white" onClick={handleSubmit} disabled={!name || !phone || phone.length < 10}>
                Connect Me Right Now
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-green-600">
              Submission Successful!
            </h2>
            <p className="text-gray-700">
              Click the button below to reveal the landlord's number.
            </p>
            <p className="text-gray-700">
              We have informed the landlord that you are about to contact them.
            </p>
            <p className="text-gray-700">
              Do not send any money before physically viewing the house.
            </p>
            <p className="text-gray-700">
              Good Luck.
            </p>
              {!revealed ? (
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={handleReveal}>
                  Reveal Landlord&apos;s Number
                </Button>
              ) : (
                <div className="space-y-4">
                  <a href={`tel:${formattedPhone}`} className="block bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md font-bold">
                    📞 {formattedPhone} – Call Now
                  </a>
                  <a href={`https://wa.me/${formattedPhone.replace('+', '')}?text=Hello,%20I%20have%20seen%20your%20vacant%20house%20on%20Renters%20Hub.%20Is%20it%20still%20available?%20${fullHouseLink}`} target="_blank" rel="noopener noreferrer" className="block bg-[#25D366] hover:bg-[#1ebe57] text-white py-2 px-4 rounded-md font-bold">
                    <MessageSquare className="w-5 h-5 inline mr-2" /> Message via WhatsApp
                  </a>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CallLandlordForm;
