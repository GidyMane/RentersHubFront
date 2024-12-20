export interface PropertyFormData {
    postTitle: string;
    houseType: string;
    location: string;
    locationCounty: string;
    managedBy: string;
    phoneNumber: string;
    rentPrice: number;
    depositAmount: number;
    garbageFees?: number;
    securityFees?: number;
    waterCharges?: number;
    waterDeposit?: number;
    otherFees?: string;
    propertyDescription: string;
    features: string[];
    photos: string[];
  }
  
  export const houseTypes = [
    "Bedsitters",
    "One Bedroom Apartments",
    "Two Bedroom Apartments",
    "Three Bedroom Apartments",
    "Four Bedroom Apartments",
    "Five Bedroom Apartments",
    "2BR Own Compound",
    "3BR Own Compound",
    "4BR Own Compound",
    "5+BR Own Compound",
    "Singles",
    "Doubles",
    "Shops",
    "Offices",
  ];
  
  export const features = [
    "Parking",
    "WiFi",
    "Secure Compound",
    "Children Friendly",
    "Pets Allowed",
  ];
  
  export const counties = [
    "Nairobi",
    "Mombasa",
    "Kisumu",
    "Nakuru",
    "Kiambu",
    // Add all 47 counties here
  ];
  
  