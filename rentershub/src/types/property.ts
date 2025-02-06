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
  
  // /types/Property.ts
export interface Property {
  id: string
  title: string
  rent_price: string // Change rentPrice to string based on your API response
  address: string
  city: string
  state: string
  price: string
  main_image_url: {id:string, url:string}
  coordinates: [number, number]
  propertytype:{
    id:number,
    name:string
  }
  postal_code:string
  bedrooms:number
  bathrooms:number
  size:number
}
