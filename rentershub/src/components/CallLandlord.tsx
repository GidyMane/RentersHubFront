'use client';

import { useState } from 'react';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

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
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="w-full bg-[#B5A887] hover:bg-[#A39775] text-white">
            Call Landlord
          </Button>
        </DialogTrigger>
        <DialogContent className="p-6 max-w-lg text-center">
          {!submitted ? (
            <>
              <h2 className="text-xl font-semibold mb-4">
                Please enter your name and phone number to be connected.
              </h2>
              <Input
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Input
                placeholder="Your Phone Number"
                value={phone}
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
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CallLandlordForm;
