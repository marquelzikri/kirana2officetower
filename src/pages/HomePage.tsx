import React from 'react';
import { MainLayout } from '@/components/templates/MainLayout';
import { HeroSection } from '@/components/organisms/HeroSection';
import { AboutSection } from '@/components/organisms/AboutSection';
import { CategoriesSection } from '@/components/organisms/CategoriesSection';
import { FeaturedListingsSection } from '@/components/organisms/FeaturedListingsSection';
import { ServicesSection } from '@/components/organisms/ServicesSection';
import { TrackRecordSection } from '@/components/organisms/TrackRecordSection';
import { CTASection } from '@/components/organisms/CTASection';
import { NewsletterSection } from '@/components/organisms/NewsletterSection';

export const HomePage: React.FC = () => {
  return (
    <MainLayout>
      <HeroSection />
      <AboutSection />
      <CategoriesSection />
      <FeaturedListingsSection />
      <ServicesSection />
      <TrackRecordSection />
      <CTASection />
      <NewsletterSection />
    </MainLayout>
  );
};
