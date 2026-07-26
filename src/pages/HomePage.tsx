import React from 'react';

import { AboutSection } from '@/components/organisms/AboutSection';
import { CategoriesSection } from '@/components/organisms/CategoriesSection';
import { CTASection } from '@/components/organisms/CTASection';
import { FeaturedListingsSection } from '@/components/organisms/FeaturedListingsSection';
import { HeroSection } from '@/components/organisms/HeroSection';
import { NewsletterSection } from '@/components/organisms/NewsletterSection';
import { ServicesSection } from '@/components/organisms/ServicesSection';
import { TrackRecordSection } from '@/components/organisms/TrackRecordSection';
import { MainLayout } from '@/components/templates/MainLayout';

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
