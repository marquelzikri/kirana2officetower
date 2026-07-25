import React from 'react';
import { Link } from 'react-router-dom';
import { MainLayout } from '../components/templates/MainLayout';
import { PropertyListingSection } from '../components/organisms/PropertyListingSection';
import { CTASection } from '../components/organisms/CTASection';
import { NewsletterSection } from '../components/organisms/NewsletterSection';
import { Icon } from '../components/atoms/Icon';

export const PropertyListingPage: React.FC = () => {
  return (
    <MainLayout>
      {/* Header Hero Banner */}
      <section className="pt-28 pb-12 bg-surface-container-low border-b border-outline-variant/10">
        <div className="max-w-container mx-auto px-4 md:px-margin-desktop">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-on-surface-variant text-body-sm mb-4">
            <Link to="/" className="hover:text-heritage-red transition-colors">
              Beranda
            </Link>
            <Icon name="chevron_right" className="text-[14px]" />
            <span className="text-on-surface font-semibold">Properti</span>
          </nav>

          <div className="max-w-3xl">
            <span className="font-metadata text-[11px] uppercase tracking-widest text-heritage-red font-semibold block mb-2">
              KIRANA TWO & PARTNER PREMIUM TOWERS
            </span>
            <h1 className="font-headline-lg text-on-surface text-3xl md:text-5xl mb-4 font-bold">
              Ketersediaan Unit Ruang Kantor
            </h1>
            <p className="text-on-surface-variant text-body-md leading-relaxed">
              Jelajahi pilihan unit perkantoran komersial terbaik — dari High Zone Sky Suite, Serviced Office siap pakai, hingga 1 Lantai Penuh Strata Title.
            </p>
          </div>
        </div>
      </section>

      {/* Property Filter & Grid Section */}
      <PropertyListingSection />

      {/* CTA & Newsletter */}
      <CTASection />
      <NewsletterSection />
    </MainLayout>
  );
};

export default PropertyListingPage;
