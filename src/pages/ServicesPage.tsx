import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

import { Icon } from '@/components/atoms/Icon';
import { SectionHeader } from '@/components/atoms/SectionHeader';
import { CTASection } from '@/components/organisms/CTASection';
import { NewsletterSection } from '@/components/organisms/NewsletterSection';
import { MainLayout } from '@/components/templates/MainLayout';
import { advisoryServices } from '@/data/mockData';

export const ServicesPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Layanan — Kirana Two Office Tower';
  }, []);

  return (
    <MainLayout>
      {/* Hero Header Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20 bg-surface-container-low border-b border-outline-variant/10">
        <div className="max-w-container mx-auto px-4 md:px-margin-desktop">
          <div className="max-w-3xl">
            <SectionHeader caption="LAYANAN ADVISORY" />
            <h1 className="font-headline-xl text-on-surface text-3xl md:text-5xl font-bold tracking-tight mb-6 leading-tight">
              Advisory menyeluruh untuk siklus kepemilikan properti.
            </h1>
            <p className="font-body-lg text-on-surface-variant text-base md:text-lg leading-relaxed">
              Dari konsultasi awal hingga pengelolaan jangka panjang, layanan kami mencakup setiap tahapan siklus kepemilikan aset properti — dengan tim yang sama dari awal hingga akhir.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid Section */}
      <section className="py-16 md:py-24 bg-surface">
        <div className="max-w-container mx-auto px-4 md:px-margin-desktop">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {advisoryServices.map((service, index) => (
              <div
                key={service.id}
                className="group relative p-8 rounded-2xl bg-surface-container-lowest border border-outline-variant/15 hover:border-heritage-red/30 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-xl bg-heritage-red/10 group-hover:bg-heritage-red group-hover:text-white text-heritage-red flex items-center justify-center transition-colors duration-300">
                      <Icon name={service.icon} className="text-2xl" />
                    </div>
                    <span className="text-xs font-mono text-outline font-semibold">
                      0{index + 1}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-on-surface mb-3 group-hover:text-heritage-red transition-colors">
                    {service.title}
                  </h2>
                  <p className="text-on-surface-variant text-sm leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy & Engagement Section */}
      <section className="py-16 md:py-20 bg-surface-container-low border-y border-outline-variant/10">
        <div className="max-w-container mx-auto px-4 md:px-margin-desktop">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider text-heritage-red uppercase bg-heritage-red/10 rounded-full">
              PENDEKATAN KAMI
            </span>
            <h2 className="text-2xl md:text-4xl font-bold text-on-surface mb-6 leading-snug">
              Diskusi awal yang menyeluruh, kemudian eksekusi yang tegas.
            </h2>
            <p className="text-on-surface-variant text-base md:text-lg mb-8 leading-relaxed">
              Setiap engagement dimulai dari percakapan privat tanpa komitmen. Kami hanya melangkah setelah memahami tujuan investasi, timeline dan profil risiko Anda secara utuh.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link
                to="/kontak"
                className="w-full sm:w-auto px-8 py-4 bg-heritage-red hover:bg-red-800 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 text-center flex items-center justify-center space-x-2"
              >
                <span>Jadwalkan Konsultasi</span>
                <Icon name="arrow_forward" className="text-lg" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main CTA & Newsletter */}
      <CTASection />
      <NewsletterSection />
    </MainLayout>
  );
};
