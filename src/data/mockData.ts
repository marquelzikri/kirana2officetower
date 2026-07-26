import type { Category, NavItem,Service, Stat } from '@/types';

import { allProperties,featuredProperties } from './mockProperties';

export { allProperties,featuredProperties };

export const navItems: NavItem[] = [
  { label: 'Beranda', href: '/' },
  { label: 'Properti', href: '/properti' },
  { label: 'Layanan', href: '/layanan' },
  { label: 'Tentang Kami', href: '/tentang-kami' },
  { label: 'Insight', href: '/insight' },
  { label: 'Kontak', href: '/kontak' },
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
    title: 'Investment Consulting',
    description: 'Strategi investasi properti berbasis analisis yield, appreciation dan risk-adjusted returns untuk investor individu maupun institusional.',
    icon: 'trending_up',
  },
  {
    id: 'srv-2',
    title: 'Property Sales',
    description: 'Representasi eksklusif untuk transaksi jual properti premium dengan network qualified buyer domestik dan internasional.',
    icon: 'sell',
  },
  {
    id: 'srv-3',
    title: 'Property Acquisition',
    description: 'Pencarian dan akuisisi aset properti sesuai mandate — on-market maupun off-market — dengan negosiasi profesional.',
    icon: 'shopping_bag',
  },
  {
    id: 'srv-4',
    title: 'Commercial Property',
    description: 'Layanan menyeluruh untuk gedung perkantoran, retail dan pengembangan komersial di kawasan strategis.',
    icon: 'corporate_fare',
  },
  {
    id: 'srv-5',
    title: 'Hotel Investment',
    description: 'Advisory investasi hospitality — akuisisi, disposal, dan repositioning aset hotel dengan analisis operasional mendalam.',
    icon: 'hotel',
  },
  {
    id: 'srv-6',
    title: 'Property Management',
    description: 'Pengelolaan aset properti termasuk leasing, tenant relations, facility management dan optimasi pendapatan.',
    icon: 'domain',
  },
  {
    id: 'srv-7',
    title: 'Legal Assistance',
    description: 'Uji tuntas legal, verifikasi sertifikat, review perjanjian dan pendampingan proses transaksi dengan legal counsel terpercaya.',
    icon: 'gavel',
  },
  {
    id: 'srv-8',
    title: 'Valuation',
    description: 'Penilaian aset properti independen sesuai Standar Penilaian Indonesia (SPI) untuk keperluan transaksi, pembiayaan dan pelaporan.',
    icon: 'analytics',
  },
];

