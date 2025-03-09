"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Building, User, LogIn, ChevronDown, ChevronUp } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useRouter } from "next/navigation"

const AuthOptions: React.FC = () => {
  const router = useRouter()
  const [showLandlordTerms, setShowLandlordTerms] = useState(false)
  const [showAgentTerms, setShowAgentTerms] = useState(false)
  const [agreedLandlord, setAgreedLandlord] = useState(false)
  const [agreedAgent, setAgreedAgent] = useState(false)

  const landlordTerms = `
    1. This is an agreement between you and Renters Hub.

    2. Renters Hub will connect you with tenants from all over the country. You will welcome them to your vacant houses.
    
    3. Renters Hub charges you commission for every tenant you get from the platform as follows: Singles, Doubles and Bedsitters= Ksh 1000, 1 Bedrooms= Ksh 2000, 2 Bedrooms= Ksh 3000 and others = Ksh 5000. Commission is due immediately the tenant makes the first payment to you.

    4. Renters Hub does not accept any other mode of payment than MPESA to the Pay Bill number 4078389, Account= COMMISSION.

    5. Renters Hub expects you to give accurate information to the house hunters all the time. Give a lot of information while posting so that you're called only by ready-to-rent tenants. We do not approve scanty information.

    6. While posting houses on our website, upload at least 10 photos covering as many details of the house as possible. We don't approve less than 10 photos.

    7. Renters Hub does not share your personal information you have provided with anyone else. We use the information to verify that you are indeed a genuine property owner/manager.

    8. If your house gets a tenant, mark it as occupied so that you are not bombarded with unnecessary calls from house hunters.

    9. If you are reported and verified as a scammer, you will be deregistered and exposed to Kenyans as someone they should avoid and prosecute.

    10. You must conduct yourself with the highest level of professionalism possible by giving accurate information to your tenants and doing what you promise them.

    11. Paying the agreed commission is mandatory. If you fail to pay even after we have delivered good tenants, you will be banned from using Renters Hub services.
  `

  const agentTerms = `1. This is a simple partnership agreement between you and Renters Hub.  

2. Your roles include:  
(a) Doing house hunting for Kenyans.  
(b) Establishing the first working relationship between Renters Hub and landlords or managing property agents with vacant houses who are not online.  
(c) Recruiting offline rental property owners and property agents to advertise their vacant houses on Renters Hub.  
(d) Negotiating a commission on behalf of Renters Hub and recording it while posting that house.  
(e) Advertising vacant houses on behalf of rental property owners.  
(f) Receiving prospective tenants on behalf of landlords and introducing them to the houses (letting the houses).  
(g) Ensuring the landlord has paid the agreed commission to the Paybill number 4078389.  

3. Renters Hub's roles include:  
(a) Marketing the posted houses to the masses countrywide in a scalable way for you to receive as many calls from prospective tenants as possible.  
(b) Keeping records of financial transactions between you and rental property owners for transparency.  
(c) Forwarding your commission immediately once received by the admins via MPESA PAYBILL.  
(d) Branding the business so that you will be perceived as a genuine and professional agent by Kenyans. Renters Hub is seen as the safest platform for rentals because we guarantee Kenyans a money-back policy if they are ever scammed on our website.  

4. Renters Hub will keep commissions as follows: Singles, Doubles, and Bedsitters = Ksh 1000, 1 Bedroom = Ksh 2000, 2 Bedrooms = Ksh 3000, and others = Ksh 5000. You will keep anything you negotiate above those figures.  

5. Renters Hub does not accept any other mode of payment than MPESA to the Paybill number 4078389, Account = COMMISSION.  

6. If the landlord insists on paying cash, you should send Renters Hub's cut to the PAYBILL number. The Admin will call you for this.  

7. Renters Hub expects you to give accurate information to landlords and house hunters at all times. Provide detailed information while posting so that you are contacted only by tenants ready to rent. Those callers not ready to move within 5 days should be asked to call when ready unless they pay a deposit for the house.  

8. While posting houses on our website, upload at least 10 photos or a video covering as many details of the house as possible. Images sell.  

9. Renters Hub does not share your personal information with anyone else. We use the information to verify you. Your private information remains between you and Renters Hub. We don't tax you on behalf of the government, nor do we share your information with any government office.  

10. You must conduct yourself with utmost professionalism. If you are reported to have deceived, misled, or scammed a client, you will be deregistered, permanently banned, and prosecuted. Lying to Renters Hub's admins will lead to instant deregistration.  

11. You are not restricted to any location in Kenya as long as you can reliably serve Kenyans. If you want to hire your own assistants, you have our blessings. We will enable tenants to call or WhatsApp you. Respond promptly with accurate information. If you are unable to assist due to lack of available houses, either provide a date when you'll have one or refer them back to our admin for further assistance.  

12. Renters Hub does not allow you to charge viewing fees or any other charges from prospective tenants. We earn money from the commission landlords and managing property agents pay.  

13. If all the units of the houses you have posted on the website are occupied, mark the post as OCCUPIED so that you are not contacted for unavailable houses.  

14. Renters Hub's admins will ask you for your ID card photo or other documents for verification on WhatsApp. Send a View Once image of the documents. If you are not comfortable sharing such, do not proceed with registration.`;

  return (
    <div className="min-h-screen bg-primary from-[#1C4532] to-[#2A9D8F] mt-12 flex items-center justify-center p-4 md:p-8"   style={{ fontFamily: "Georgia, serif" }}>
      <Card className="w-full max-w-4xl mx-auto shadow-2xl overflow-hidden rounded-2xl border-0">
        <CardContent className="p-0">
          <div className="bg-white p-6 md:p-10 relative">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#E9F5F2] rounded-bl-full opacity-50 -z-10"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#E9F5F2] rounded-tr-full opacity-50 -z-10"></div>

            <div className="mb-10 text-center">
              <h1 className="text-2xl md:text-2xl font-bold text-[#1C4532] mb-4">Welcome to Renters Hub</h1>              
            </div>

            <div className="space-y-6">
              <div className="transition-all duration-300 ease-in-out">
                <OptionButton
                  icon={<Building className="h-6 w-6 sm:h-5 sm:w-5" />}
                  title="Register as Landlord"
                  description=""
                  onClick={() => {
                    setShowLandlordTerms(!showLandlordTerms)
                    if (showAgentTerms) setShowAgentTerms(false)
                  }}
                  isOpen={showLandlordTerms}
                />
                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${showLandlordTerms ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"}`}
                >
                  {showLandlordTerms && (
                    <TermsSection
                      terms={landlordTerms}
                      agreed={agreedLandlord}
                      setAgreed={setAgreedLandlord}
                      userType="Landlord"
                      router={router}
                    />
                  )}
                </div>
              </div>

              <div className="transition-all duration-300 ease-in-out">
                <OptionButton
                  icon={<User className="h-6 w-6 sm:h-5 sm:w-5" />}
                  title="Register as Ground Agent"
                  description=""
                  onClick={() => {
                    setShowAgentTerms(!showAgentTerms)
                    if (showLandlordTerms) setShowLandlordTerms(false)
                  }}
                  isOpen={showAgentTerms}
                />
                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${showAgentTerms ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"}`}
                >
                  {showAgentTerms && (
                    <TermsSection
                      terms={agentTerms}
                      agreed={agreedAgent}
                      setAgreed={setAgreedAgent}
                      userType="Ground Agent"
                      router={router}
                    />
                  )}
                </div>
              </div>

              <div className="transition-all duration-300 ease-in-out">
              <OptionButton
  icon={<LogIn className="h-8 w-8" />}
  title="Login to Your Account"
  description=""
  onClick={async () => {
    try {
      const res = await fetch("/api/auth/session"); 
      const data = await res.json();
      
      if (data?.user?.role) {
        const role = data.user.role;
        if (role === "ADMIN") {
          router.push("/admin");
        } else if (role === "LANDLORD" || role === "GROUNDAGENT") {
          router.push("/rentershub/dashboard");
        } else {
          router.push("/login");
        }
      } else {
        router.push("/login");
      }
    } catch (error) {
      console.error("Session check failed:", error);
      router.push("/login");
    }
  }}
  variant="default"
/>

              </div>
            </div>

            <div className="mt-10 text-center text-sm text-gray-500">
              <p>© {new Date().getFullYear()} Renters Hub. All rights reserved.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

interface OptionButtonProps {
  icon: React.ReactNode
  title: string
  description: string
  onClick: () => void
  isOpen?: boolean
  variant?: "default" | "outline"
}

const OptionButton: React.FC<OptionButtonProps> = ({
  icon,
  title,
  description,
  onClick,
  isOpen,
  variant = "default",
}) => (
  <Button
    className={`w-full h-auto py-5 px-6 text-left flex items-center space-x-4 p-2 ${
      variant === "outline"
        ? "bg-primary "
        : "bg-primary from-[#1C4532] to-[#2A9D8F] hover:from-[#153726] hover:to-[#238779] text-white p-2"
    } rounded-xl transition-all duration-300 ease-in-out transform hover:scale-[1.02] hover:shadow-lg`}
    onClick={onClick}
  >
    <div className="flex-shrink-0 bg-white bg-opacity-20 p-3 rounded-full">{icon}</div>
    <div className="flex-grow">
      <h2 className="font-semibold mb-1">{title}</h2>
      <p className="text-sm opacity-90">{description}</p>
    </div>
    {isOpen !== undefined && (
      <div className="flex-shrink-0 self-center ml-2">
        {isOpen ? (
          <ChevronUp className="h-6 w-6 transition-transform duration-300" />
        ) : (
          <ChevronDown className="h-6 w-6 transition-transform duration-300" />
        )}
      </div>
    )}
  </Button>
)

interface TermsSectionProps {
  terms: string
  agreed: boolean
  setAgreed: (value: boolean) => void
  userType: string
  router: ReturnType<typeof useRouter>
}

const TermsSection: React.FC<TermsSectionProps> = ({ terms, agreed, setAgreed, userType, router }) => (
  <div className="mt-4 bg-[#F7FBFA] rounded-xl p-6 space-y-4 border border-[#E0F0ED]">
    <h3 className="font-semibold text-lg text-[#1C4532]">Terms and Conditions for {userType}s:</h3>

    <ScrollArea className="h-64 w-full rounded-lg border border-[#E0F0ED] p-5 bg-white shadow-inner">
      <div className="space-y-4">
        <p className="whitespace-pre-line text-sm leading-relaxed text-gray-700">{terms}</p>
      </div>
    </ScrollArea>

    <div className="flex items-start space-x-3 p-3 bg-white rounded-lg border border-[#E0F0ED]">
      <Checkbox
        id={`agree-${userType}`}
        checked={agreed}
        onCheckedChange={(checked) => setAgreed(!!checked)}
        className="mt-1 data-[state=checked]:bg-[#2A9D8F] data-[state=checked]:border-[#2A9D8F]"
      />
      <label htmlFor={`agree-${userType}`} className="text-sm font-medium text-gray-700">
        I have read and agree to the terms and conditions for {userType}s on Renters Hub
      </label>
    </div>

    <Button
      className="w-full py-6 bg-gradient-to-r from-[#2A9D8F] to-[#3EB7A8] hover:from-[#238779] hover:to-[#2A9D8F] text-white font-medium rounded-xl transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
      disabled={!agreed}
      onClick={() => router.push("/signup")}
    >
      {/* Register as {userType} Now */}
      Register Me Right Now
    </Button>
  </div>
)

export default AuthOptions

