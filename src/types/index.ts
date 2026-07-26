export type OfficeZone = 'Low Zone' | 'Mid Zone' | 'High Zone' | 'Penthouse';
export type OfficeCondition = 'Bare Shell' | 'Semi-Fitted' | 'Fully Fitted' | 'Serviced Office';
export type PropertyType = 'For Rent' | 'For Sale';

export interface Property {
  id: string;
  title: string;
  towerName: string;
  unitCode: string;
  floor: number;
  zone: OfficeZone;
  condition: OfficeCondition;
  type: PropertyType;
  category: string; // e.g. 'Office Tower', 'Executive Suite', 'Whole Floor'
  location: string; // e.g. 'Kelapa Gading, Jakarta Utara'
  sizeSqm: number; // e.g. 380
  area: string; // e.g. '380 m²'
  price: string; // e.g. 'IDR 83.6 Mio / bln' or 'IDR 12.5 M'
  numericPrice: number; // e.g. 83600000 (monthly or total for sorting)
  rentalRateSqm?: number; // e.g. 220000 (IDR / m² / month)
  serviceChargeSqm?: number; // e.g. 55000 (IDR / m² / month)
  ceilingHeight?: string; // e.g. '2.80 m'
  electricityCapacity?: string; // e.g. '35 kVA'
  parkingRatio?: string; // e.g. '1 : 100 m²'
  viewType?: string; // e.g. 'City Skyline North'
  image: string;
  galleryImages?: string[];
  floorPlanImage?: string;
  features?: string[];
  description?: string;
  featured?: boolean;
  bathrooms?: number;
  bedrooms?: number;
}

export interface Category {
  id: string;
  title: string;
  count: number;
  icon: string;
  href?: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface Stat {
  id: string;
  value: string;
  suffix?: string;
  label: string;
}

export interface NavItem {
  label: string;
  href: string;
  active?: boolean;
}

export type UserRole = 'owner' | 'admin';

export interface User {
  id: string;
  username: string;
  role: UserRole;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserDbRow {
  id: string;
  username: string;
  password_hash: string;
  salt: string;
  role: UserRole;
  name: string;
  created_at?: string;
  updated_at?: string;
}

export interface JwtPayload {
  userId: string;
  username: string;
  role: UserRole;
  name: string;
  iat: number;
  exp: number;
}

export type ContactStatus = 'unread' | 'read' | 'replied';

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  subject: string;
  message: string;
  status: ContactStatus;
  createdAt: string;
  updatedAt?: string;
}


