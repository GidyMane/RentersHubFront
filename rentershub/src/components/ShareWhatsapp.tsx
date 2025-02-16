import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const ShareButton = ({ propertyLink }: { propertyLink: string }) => {
  const shareMessage = encodeURIComponent(
    `Hello. Please check this vacant house I saw on Renters Hub:\n${propertyLink}\nI would like to hear your thoughts about it.\nThank you.`
  );

  const whatsappUrl = `https://wa.me/?text=${shareMessage}`;

  return (
    <Button
      className="w-full bg-white hover:bg-[#1EBE5D] text-primary flex items-center justify-center gap-2 border border-primary"
      onClick={() => window.open(whatsappUrl, "_blank")}
    >
      <Share2 className="w-5 h-5" /> Share 
    </Button>
  );
};

export default ShareButton;
