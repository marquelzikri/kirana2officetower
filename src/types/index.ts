export interface Property {
  id: string;
  title: string;
  category: string; // e.g. 'Office', 'House', 'Mixed-Use'
  type: string; // e.g. 'For Sale', 'For Rent'
  location: string;
  price: string;
  bathrooms?: number;
  bedrooms?: number;
  area: string; // e.g. '2,400 m² LB'
  image: string;
  featured?: boolean;
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
