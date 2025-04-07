import type React from "react"
import { Mail, Twitter, Facebook, Instagram, AlertTriangle, Clock } from "lucide-react"
import Image from "next/image"

interface MaintenancePageProps {
  estimatedUptime?: string // Optional: "June 15, 2023 at 3:00 PM EST"
  contactEmail?: string // Optional: "support@rentershub.com"
  socialLinks?: {
    twitter?: string
    facebook?: string
    instagram?: string
  }
}

export const MaintenancePage: React.FC<MaintenancePageProps> = ({
  estimatedUptime = "soon",
  contactEmail = "support@rentershub.com",
  socialLinks = {},
}) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header with alert banner */}
        <div className="bg-blue-500 p-4 flex items-center justify-center">
          <AlertTriangle className="text-white mr-2 h-6 w-6" />
          <h1 className="text-xl font-bold text-white">Site Temporarily Unavailable</h1>
        </div>

        <div className="p-8">
          {/* Logo */}
          <div className="flex justify-center mb-6">
  <img src="/RH1.png" alt="Renters Hub Logo" className="h-12" />
</div>

          {/* Main message */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">We're Currently Down for Maintenance</h2>
            <p className="text-gray-600 mb-4">
              We apologize for the inconvenience. Our team is working hard to improve Renters Hub and we'll be back
              online shortly.
            </p>

            {/* Estimated time */}
            <div className="flex items-center justify-center text-blue-600 mb-4">
              <Clock className="mr-2 h-5 w-5" />
              <p className="font-medium">Estimated to be back {estimatedUptime}</p>
            </div>

            {/* Illustration */}
            <div className="my-8 flex justify-center">
              <div className="relative w-64 h-64">
                <Image
                  src="/main.jpg?height=256&width=256"
                  alt="Maintenance illustration"
                  width={256}
                  height={256}
                  className="object-contain"
                />
              </div>
            </div>
          </div>

          {/* Contact information */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Need immediate assistance?</h3>
            <p className="text-gray-600 mb-4">If you have any questions or need help, please :</p>
            <a
                                        href="https://api.whatsapp.com/send?phone=254731352350&text=Hello.%20I%20am%20from%20the%20website,%20https://rentershub.co.ke%20and%20I%20am%20searching%20for%20a%20vacant%20house"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:text-gray-300 block"
                                        style={{ fontFamily: "Georgia, serif" }}
                                    >
                                        Chat with Us
                                    </a>
          </div>

          {/* Social media links */}
          <div className="flex justify-center space-x-4">
            {socialLinks.twitter && (
              <a
                href={socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
            )}
            {socialLinks.facebook && (
              <a
                href={socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
            )}
            {socialLinks.instagram && (
              <a
                href={socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 text-white p-2 rounded-full hover:bg-green-700 transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <p className="mt-8 text-gray-500 text-sm">© {new Date().getFullYear()} Renters Hub. All rights reserved.</p>
    </div>
  )
}

