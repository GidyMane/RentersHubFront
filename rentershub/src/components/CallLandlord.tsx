'use client';

import { useState } from 'react';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
<<<<<<< HEAD
import { Phone } from 'lucide-react';

const CallLandlordForm = ({ landlordPhone }: { landlordPhone: string }) => 
 {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    // Simulate sending details to admin
    console.log('Sending details:', { name, phone });

    // Simulate successful submission
    setSubmitted(true);
=======
import { Phone, MessageSquare } from 'lucide-react';



const CallLandlordForm = ({ landlordPhone, propertyId }: { landlordPhone: string, propertyId: string}) => {  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [phoneError, setPhoneError] = useState('');

  // Format the landlord's phone number
  const formatPhoneNumber = (phone: string) => {
    if (phone.startsWith('0')) {
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

  const handleSubmit = async () => {
    if (phone.length < 10) {
      setPhoneError("Phone number must be at least 10 digits.");
      return;
    }

    setSubmitted(true);
    // console.log("User Info Submitted:", { name, phone });
  };

  const handleReveal = () => {
    setRevealed(true);
    sendSmsToLandlord();
  };


  // Generate house link
  const houseLink = encodeURIComponent(`https://rentershub.co.ke/property/${propertyId}`);

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
      // console.log("SMS sent:", data);
    } catch (error) {
      console.error("Error sending SMS:", error);
    }
>>>>>>> da2dc9da5fc186335cc48ca707f8b25d5cfb93b6
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
<<<<<<< HEAD
        

<Button className="w-full bg-secondary hover:bg-[#29335f] text-white flex items-center justify-center gap-2">
  <Phone className="w-5 h-5" /> Call Landlord
</Button>

        </DialogTrigger>
        <DialogContent className="p-6 max-w-lg text-center">
          {!submitted ? (
            <>
              <h2 className="text-xl font-semibold mb-4">
                Please enter your name and phone number to be connected.
              </h2>
=======
          <Button className="w-full bg-secondary hover:bg-[#29335f] text-white flex items-center justify-center gap-2">
            <Phone className="w-5 h-5" /> Call Landlord
          </Button>
        </DialogTrigger>
        <DialogContent className="p-6 max-w-lg text-center">
          {!submitted ? (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">
                Get Connected with the Landlord
              </h2>
              <p className="text-gray-700">
                Please enter your name and phone number to be connected.
              </p>
>>>>>>> da2dc9da5fc186335cc48ca707f8b25d5cfb93b6
              <Input
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Input
                placeholder="Your Phone Number"
                value={phone}
<<<<<<< HEAD
                onChange={(e) => setPhone(e.target.value)}
                type="tel"
              />
              <Button
                className="w-full bg-[#B5A887] hover:bg-[#A39775] text-white mt-4"
                onClick={handleSubmit}
                disabled={!name || !phone}
              >
                Connect Me Right Now
              </Button>
            </>
          ) : (
            <>
              <h2 className="text-xl font-semibold mb-4 text-green-600">
                Submission successful
              </h2>
              <p className="text-gray-700 mb-2">
                Click the phone number to call the landlord.
              </p>
              <p className="text-sm text-gray-600">
                We have informed the landlord that you are about to contact
                them.
              </p>
              <p className="text-sm text-gray-600 font-semibold mt-2">
                Do not send any money before physically viewing the house.
              </p>
              <p className="text-sm text-gray-600">
                Pay your first rent only at the moment of moving in and after
                reading/agreeing to the landlord’s terms and conditions.
              </p>
              <a
                href={`tel:${landlordPhone}`}
                className="block mt-4 text-lg font-bold text-blue-600 hover:underline"
              >
                📞 {landlordPhone}  Call Now
              </a>
            </>
=======
                onChange={handlePhoneChange}
                type="tel"
              />
              {phoneError && <p className="text-red-500 text-sm">{phoneError}</p>}
              <Button
                className="w-full bg-[#B5A887] hover:bg-[#A39775] text-white"
                onClick={handleSubmit}
                disabled={!name || !phone || phone.length < 10}
              >
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
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={handleReveal}
                >
                  Reveal Landlord&apos;s Number
                </Button>
              ) : (
                <div className="space-y-4">
                  <a
                    href={`tel:${formattedPhone}`}
                    className="block bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md font-bold"
                  >
                    📞 {formattedPhone} – Call Now
                  </a>
                  <a
                    href={`https://wa.me/${formattedPhone.replace('+', '')}?text=Hello,%20I%20have%20seen%20your%20vacant%20house%20on%20Renters%20Hub.%20Is%20it%20still%20available?`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-[#25D366] hover:bg-[#1ebe57] text-white py-2 px-4 rounded-md font-bold"
                    onClick={sendSmsToLandlord}
                  >
                    <MessageSquare className="w-5 h-5 inline mr-2" /> Message via WhatsApp
                  </a>
                </div>
              )}
            </div>
>>>>>>> da2dc9da5fc186335cc48ca707f8b25d5cfb93b6
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CallLandlordForm;
