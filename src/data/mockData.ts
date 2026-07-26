import type { Category, Service, Stat, NavItem } from '@/types';
import { featuredProperties, allProperties } from './mockProperties';

export { featuredProperties, allProperties };

export const navItems: NavItem[] = [
  { label: 'Beranda', href: '/' },
  { label: 'Properti', href: '/properti' },
  { label: 'Layanan', href: '/#layanan' },
  { label: 'Tentang Kami', href: '/#tentang-kami' },
  { label: 'Insight', href: '/#insight' },
  { label: 'Kontak', href: '/#kontak' },
];

export const heroStats: Stat[] = [
  { id: '1', value: '50,000+', label: 'm² Total NLA Available' },
  { id: '2', value: '38', label: 'Lantai Office Tower' },
  { id: '3', value: 'Grade A', label: 'Sertifikasi Gedung Premium' },
  { id: '4', value: '99.9%', label: 'Uptime Power & Fiber' },
];

export const trackRecordStats: Stat[] = [
  { id: 'tr-1', value: '500', suffix: '+', label: 'PROPERTI TERJUAL & TERSEWA' },
  { id: 'tr-2', value: '200', suffix: '+', label: 'KLIEN KORPORAT & TENANT' },
  { id: 'tr-3', value: '10', suffix: '+', label: 'TAHUN PENGALAMAN MANAJEMEN' },
  { id: 'tr-4', value: '98', suffix: '%', label: 'OCCUPANCY RATE' },
];

export const propertyCategories: Category[] = [
  { id: 'cat-1', title: 'High Zone Suite', count: 18, icon: 'corporate_fare' },
  { id: 'cat-2', title: 'Mid Zone Suite', count: 24, icon: 'apartment' },
  { id: 'cat-3', title: 'Low Zone Commercial', count: 14, icon: 'storefront' },
  { id: 'cat-4', title: 'Whole Floor Space', count: 8, icon: 'domain' },
  { id: 'cat-5', title: 'Penthouse Executive', count: 4, icon: 'villa' },
  { id: 'cat-6', title: 'Serviced Office', count: 12, icon: 'desk' },
];

export const advisoryServices: Service[] = [
  {
    id: 'srv-1',
    title: 'Office Leasing & Advisory',
    description: 'Strategi persewaan dan penempatan tenant kantor skala menengah hingga corporate headquarters.',
    icon: 'corporate_fare',
  },
  {
    id: 'srv-2',
    title: 'Strata Title Sales & Acquisition',
    description: 'Layanan akuisisi dan penjualan unit ruang kantor berstatus Strata Title dengan kepastian legalitas.',
    icon: 'handshake',
  },
  {
    id: 'srv-3',
    title: 'Tenant Representation',
    description: 'Pendampingan negoisasi harga sewa, service charge, dan fit-out period untuk calon penyewa kantor.',
    icon: 'gavel',
  },
  {
    id: 'srv-4',
    title: 'Fit-out & Workplace Planning',
    description: 'Konsultasi arsitektur interior dan efisiensi tata letak ruang kerja (space planning).',
    icon: 'architecture',
  },
  {
    id: 'srv-5',
    title: 'Property Valuation & SPI Standard',
    description: 'Penilaian independen nilai sewa & nilai pasar aset perkantoran komersial.',
    icon: 'analytics',
  },
  {
    id: 'srv-6',
    title: 'Building Facility Management',
    description: 'Advisory manajemen operasional gedung, efisiensi energi HVAC, dan sertifikasi hijau.',
    icon: 'domain_add',
  },
];
