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

  const agentTerms = `
    1. This is a simple partnership agreement between you and Renters Hub.
    2. Your roles include:
      (a) Doing house hunting for Kenyans.
      (b) Establishing the first working relationship between Renters Hub and landlords or managing property agents with vacant houses and who are not online.
      (c) Recruiting the offline rental property owners and property agents to advertise their vacant houses on Renters Hub.
      (d) Negotiating a commission on behalf of Renters Hub and recording it while posting that house.
      (e) Advertising vacant houses on behalf of the rental property owners.
      (f) Receiving prospective tenants on behalf of the landlords and introducing them to the houses: letting the houses.
  `

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1C4532] to-[#2A9D8F] mt-12 flex items-center justify-center p-4 md:p-8">
      <Card className="w-full max-w-4xl mx-auto shadow-2xl overflow-hidden rounded-2xl border-0">
        <CardContent className="p-0">
          <div className="bg-white p-6 md:p-10 relative">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#E9F5F2] rounded-bl-full opacity-50 -z-10"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#E9F5F2] rounded-tr-full opacity-50 -z-10"></div>

            <div className="mb-10 text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-[#1C4532] mb-4">Welcome to Renters Hub</h1>              
            </div>

            <div className="space-y-6">
              <div className="transition-all duration-300 ease-in-out">
                <OptionButton
                  icon={<Building className="h-8 w-8" />}
                  title="Register as Landlord"
                  description="List your properties"
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
                  icon={<User className="h-8 w-8" />}
                  title="Register as Ground Agent"
                  description="Help connect landlords in your area"
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
                  description="Access your properties"
                  onClick={() => router.push("/rentershub/add-property")}
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
    className={`w-full h-auto py-5 px-6 text-left flex items-center space-x-4 ${
      variant === "outline"
        ? "bg-white text-[#1C4532] hover:bg-[#E9F5F2] border-2 border-[#1C4532]"
        : "bg-gradient-to-r from-[#1C4532] to-[#2A9D8F] hover:from-[#153726] hover:to-[#238779] text-white"
    } rounded-xl transition-all duration-300 ease-in-out transform hover:scale-[1.02] hover:shadow-lg`}
    onClick={onClick}
  >
    <div className="flex-shrink-0 bg-white bg-opacity-20 p-3 rounded-full">{icon}</div>
    <div className="flex-grow">
      <h2 className="text-xl font-semibold mb-1">{title}</h2>
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
      Register as {userType} Now
    </Button>
  </div>
)

export default AuthOptions

