import { Category, Property, Service, Stat, NavItem } from '../types';

export const navItems: NavItem[] = [
  { label: 'Beranda', href: '#hero', active: true },
  { label: 'Properti', href: '#properti' },
  { label: 'Layanan', href: '#layanan' },
  { label: 'Tentang Kami', href: '#tentang-kami' },
  { label: 'Insight', href: '#insight' },
  { label: 'Kontak', href: '#kontak' },
];

export const heroStats: Stat[] = [
  { id: '1', value: '500+', label: 'Properti Terjual' },
  { id: '2', value: '200+', label: 'Klien Puas' },
  { id: '3', value: '10+', label: 'Tahun Pengalaman' },
  { id: '4', value: '98%', label: 'Kepuasan Klien' },
];

export const trackRecordStats: Stat[] = [
  { id: 'tr-1', value: '500', suffix: '+', label: 'PROPERTI TERJUAL' },
  { id: 'tr-2', value: '200', suffix: '+', label: 'KLIEN PUAS' },
  { id: 'tr-3', value: '10', suffix: '+', label: 'TAHUN PENGALAMAN' },
  { id: 'tr-4', value: '98', suffix: '%', label: 'KEPUASAN KLIEN' },
];

export const propertyCategories: Category[] = [
  { id: 'cat-1', title: 'Residential', count: 48, icon: 'home_work' },
  { id: 'cat-2', title: 'Apartment', count: 62, icon: 'apartment' },
  { id: 'cat-3', title: 'Office Tower', count: 24, icon: 'corporate_fare' },
  { id: 'cat-4', title: 'Retail & Commercial', count: 36, icon: 'storefront' },
  { id: 'cat-5', title: 'Hotel & Hospitality', count: 18, icon: 'hotel' },
  { id: 'cat-6', title: 'Industrial', count: 29, icon: 'factory' },
  { id: 'cat-7', title: 'Development Land', count: 41, icon: 'landscape' },
  { id: 'cat-8', title: 'Mixed-Use', count: 12, icon: 'domain_add' },
];

export const featuredProperties: Property[] = [
  {
    id: 'prop-1',
    title: 'Meridien Office Tower',
    category: 'Office',
    type: 'For Sale',
    location: 'SCBD, Jakarta Selatan',
    price: 'IDR 185 M',
    bathrooms: 6,
    area: '2,400 m² LB',
    image: 'https://lh3.googleusercontent.com/aida/AP1WRLtf1Q4jw8tQA31HT-lR7CpUPonS_7xJV3d-KdHaTG7ytOuaZje5LSXH8BmZ-puWcsOrit0IL-b2l5j0lk6dUeyoZZ-ggU2VCQ-s24uE6O4wuIQpRqO8C4sL872X20E5HtPNSKMUTNxxXyyGKKL47EsnJ7osWC6xF5CTIARp_318aJRTsOMkGmQhNUAqwBxDgUP6Da630VGxhOGzlejJzCY-5Ba9LTGa6n7eB8znQs8LXAkqUE_Va5Gk',
    featured: true,
  },
  {
    id: 'prop-2',
    title: 'Cendana Luxury Residence',
    category: 'House',
    type: 'For Sale',
    location: 'Menteng, Jakarta Pusat',
    price: 'IDR 42 M',
    bedrooms: 5,
    area: '620 m² LB',
    image: 'https://lh3.googleusercontent.com/aida/AP1WRLsgOH1yW_A41R3y31XtPWhs_CSdMO_O5ppv4o-crESZBFujeO72RHSo-dwZ2BAJGfIXyRbizGJC8hLDGODngtbDS-y4DGF1DvoYPHV49AjKfu8F7pjQc5VVkkOipwclwhZUkxFhtp2qGDCfJyScMgbYEb9iGx9Vyf6nsegCGNjUmi7Tygn2IX3il0LHSLbaDpaPmvfOqkk6tIRp5fhYqa46FXstkMGCgq6kD4l16aFsMXHMa6xR25CPGg',
    featured: true,
  },
  {
    id: 'prop-3',
    title: 'Solaria Mixed-Use Development',
    category: 'Mixed-Use',
    type: 'For Sale',
    location: 'Kuningan, Jakarta Selatan',
    price: 'IDR 320 M',
    bathrooms: 8,
    area: '4,800 m² LB',
    image: 'https://lh3.googleusercontent.com/aida/AP1WRLsNMbq-eqHEcuiDYC9Y8kMqvpgv6HwY_sHotmiqzjvdtfYRjL16wdCeQZSuVLWia2NP0AopAjI94ZRDJudHf0L4x-O7R4j6hu7hxNX5VnCkpFosl0ZN43WIAUNY_4QOHdlkHK4n5SKOFbCOSugdk-Vo0iUPIEnxqbNh9efBcz_ZOrzQ3GP7WlMwVG1veaqXgXonr2e8mpaqugI9oeZzPeN1BzOrAO0gkT1zOKi5uBOXcldiO3YV9THAdQ',
    featured: true,
  },
];

export const advisoryServices: Service[] = [
  {
    id: 'srv-1',
    title: 'Investment Consulting',
    description: 'Strategi investasi properti dengan analisis yield, appreciation dan risk-adjusted returns.',
    icon: 'query_stats',
  },
  {
    id: 'srv-2',
    title: 'Property Sales & Acquisition',
    description: 'Representasi eksklusif untuk transaksi jual, beli dan akuisisi aset properti premium.',
    icon: 'handshake',
  },
  {
    id: 'srv-3',
    title: 'Commercial & Office',
    description: 'Layanan penuh untuk gedung perkantoran, retail dan pengembangan komersial.',
    icon: 'location_city',
  },
  {
    id: 'srv-4',
    title: 'Hotel Investment',
    description: 'Advisory investasi hospitality — dari greenfield hingga akuisisi aset yang beroperasi.',
    icon: 'bedroom_parent',
  },
  {
    id: 'srv-5',
    title: 'Legal & Due Diligence',
    description: 'Verifikasi legalitas, sertifikat, zonasi dan uji tuntas komprehensif.',
    icon: 'gavel',
  },
  {
    id: 'srv-6',
    title: 'Valuation & Advisory',
    description: 'Penilaian aset independen sesuai standar SPI dan advisory jangka panjang.',
    icon: 'analytics',
  },
];
