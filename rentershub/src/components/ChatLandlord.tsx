import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

const ChatWithLandlord = ({ landlordPhone }: { landlordPhone: string }) => {

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (name && phone) {
      setSubmitted(true);
      console.log("User Info Submitted:", { name, phone });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full bg-[#0a3319] hover:bg-[#1EBE5D] text-white flex items-center justify-center gap-2">
          <MessageCircle className="w-5 h-5" /> Chat with Landlord
        </Button>
      </DialogTrigger>
      <DialogContent className="p-6 space-y-4">
        {!submitted ? (
          <>
            <h2 className="text-lg font-semibold">Please enter your details</h2>
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
            <Button className="w-full bg-green-600" onClick={handleSubmit}>
              Connect Me Right Now
            </Button>
          </>
        ) : (
          <div className="text-center">
            <p className="text-green-600 font-semibold">Submission Successful!</p>
            <p>Click the WhatsApp icon below to chat with the landlord:</p>
            <a
              href={`https://wa.me/${landlordPhone}?text=Hello.%0AI%20have%20seen%20this%20vacant%20house%20on%20Renters%20Hub%20Platform.%0A${window.location.href}%0AIs%20it%20still%20available?`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 text-lg font-bold flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-6 h-6" /> Chat on WhatsApp
            </a>
            <p className="text-sm text-gray-500 mt-2">
              We have informed the Landlord that you are about to contact them. Do not send any
              money before physically viewing the house. Pay your first rent only after agreeing
              to the landlord’s terms.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ChatWithLandlord;
