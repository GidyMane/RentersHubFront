export interface NavItem {
    href: string;
    label: string;
    icon: React.ElementType;
  }
  
  export interface LandlordProfile {
    name: string;
    email: string;
    avatarUrl?: string;
  }
  
  export interface PropertyMetrics {
    total: number;
    vacant: number;
    occupied: number;
    pendingApproval: number;
  }
  
  export interface ActivityItem {
    id: string;
    message: string;
    timestamp: string;
  }
  
  export interface NavItem {
    href: string;
    label: string;
    icon: React.ElementType;
  }
  
  export interface LandlordProfile {
    name: string;
    email: string;
    avatarUrl?: string;
  }
  
  export interface PropertyMetrics {
    total: number;
    vacant: number;
    occupied: number;
    pendingApproval: number;
  }
  
  export interface ActivityItem {
    id: string;
    message: string;
    timestamp: string;
  }
  
  export interface Property {
    id: string;
    name: string;
    location: string;
    status: 'Approved' | 'Vacant' | 'Occupied' | 'Pending';
    monthlyRent: number;
  }
  
  