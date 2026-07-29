import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

import { Icon } from '@/components/atoms/Icon';
import { SectionHeader } from '@/components/atoms/SectionHeader';
import { CTASection } from '@/components/organisms/CTASection';
import { TrackRecordSection } from '@/components/organisms/TrackRecordSection';
import { MainLayout } from '@/components/templates/MainLayout';

export const AboutPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Tentang Kami — Kirana Two Office Marketing';
  }, []);

  const coreValues = [
    {
      id: 'val-1',
      number: '01',
      title: 'Riset & Data',
      description:
        'Setiap rekomendasi didukung oleh analisis pasar, uji tuntas legal, dan proyeksi finansial yang transparan.',
      icon: 'analytics',
    },
    {
      id: 'val-2',
      number: '02',
      title: 'Diskresi & Integritas',
      description:
        'Kami merepresentasikan kepentingan klien dengan integritas penuh. Banyak transaksi kami bersifat off-market.',
      icon: 'verified_user',
    },
    {
      id: 'val-3',
      number: '03',
      title: 'Hubungan Jangka Panjang',
      description:
        'Kami tetap menjadi advisor Anda jauh setelah transaksi selesai — untuk stewardship, resale dan strategi portofolio.',
      icon: 'handshake',
    },
    {
      id: 'val-4',
      number: '04',
      title: 'Strategic Advisory & Execution',
      description:
        'Kombinasi wawasan pasar yang tajam dan eksekusi transaksi yang disiplin untuk mengoptimalkan imbal hasil investasi Anda.',
      icon: 'military_tech',
    },
  ];

  const highlights = [
    'Transaksi Off-Market & Confidential Advisory',
    'Pendampingan End-to-End dari Due Diligence hingga Closing',
    'Jaringan Investor & Corporate Tenant Nasional & Regional',
    'Portofolio Aset Residensial, Komersial, Perhotelan & Lahan',
  ];

  return (
    <MainLayout>
      {/* Hero Header Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20 bg-surface-container-low border-b border-outline-variant/10">
        <div className="max-w-container mx-auto px-4 md:px-margin-desktop">
          <div className="max-w-4xl">
            <SectionHeader caption="TENTANG KAMI / KONSULTAN PROPERTI" />
            <h1 className="font-headline-xl text-on-surface text-3xl md:text-5xl font-bold tracking-tight mb-6 leading-tight">
              Konsultan properti dan mitra investasi Indonesia.
            </h1>
            <p className="font-body-lg text-on-surface-variant text-base md:text-xl leading-relaxed mb-10 max-w-3xl">
              Kirana Two Office Marketing didirikan untuk mendampingi investor, developer dan pemilik bisnis dalam mengambil keputusan properti yang berbasis data dan berorientasi jangka panjang.
            </p>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-outline-variant/15">
              <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/10">
                <div className="text-2xl md:text-3xl font-bold text-heritage-red mb-1">10+</div>
                <div className="text-xs text-on-surface-variant font-medium">Tahun Pengalaman</div>
              </div>
              <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/10">
                <div className="text-2xl md:text-3xl font-bold text-heritage-red mb-1">500+</div>
                <div className="text-xs text-on-surface-variant font-medium">Transaksi Sukses</div>
              </div>
              <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/10">
                <div className="text-2xl md:text-3xl font-bold text-heritage-red mb-1">200+</div>
                <div className="text-xs text-on-surface-variant font-medium">Klien Korporat</div>
              </div>
              <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/10">
                <div className="text-2xl md:text-3xl font-bold text-heritage-red mb-1">98%</div>
                <div className="text-xs text-on-surface-variant font-medium">Client Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Narrative & Experience Section */}
      <section className="py-16 md:py-24 bg-surface">
        <div className="max-w-container mx-auto px-4 md:px-margin-desktop">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Image Column */}
            <div className="lg:col-span-5 relative">
              <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl border border-outline-variant/15 aspect-[4/5]">
                <img
                  src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80"
                  alt="Modern Office Building & Architecture"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Decorative Accent */}
              <div className="absolute -bottom-6 -right-6 w-3/4 h-3/4 bg-heritage-red/5 rounded-2xl -z-0 hidden md:block"></div>
            </div>

            {/* Content Column */}
            <div className="lg:col-span-7">
              <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider text-heritage-red uppercase bg-heritage-red/10 rounded-full">
                REKAM JEJAK & REPUTASI
              </span>
              <h2 className="text-2xl md:text-4xl font-bold text-on-surface mb-6 leading-snug">
                Lebih dari satu dekade pengalaman di real estate premium.
              </h2>

              <div className="space-y-4 text-on-surface-variant text-base md:text-lg leading-relaxed mb-8">
                <p>
                  Dari kantor pusat kami di Jakarta, Kirana Two Office Marketing telah mendampingi ratusan transaksi properti — mulai dari residensial premium, gedung perkantoran Grade-A, aset perhotelan, hingga lahan pengembangan strategis di seluruh Indonesia.
                </p>
                <p>
                  Kami tidak mengejar volume. Fokus kami adalah membangun hubungan jangka panjang dengan investor, developer dan corporate client — melalui eksekusi yang disiplin dan advisory yang objektif.
                </p>
              </div>

              {/* Highlights List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {highlights.map((item, idx) => (
                  <div key={idx} className="flex items-start space-x-3">
                    <div className="w-5 h-5 rounded-full bg-heritage-red/10 text-heritage-red flex items-center justify-center shrink-0 mt-0.5">
                      <Icon name="check" className="text-sm" />
                    </div>
                    <span className="text-sm text-on-surface font-medium">{item}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-outline-variant/15 flex flex-wrap gap-4 items-center">
                <Link
                  to="/kontak"
                  className="px-6 py-3 bg-heritage-red hover:bg-red-800 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 text-sm inline-flex items-center space-x-2"
                >
                  <span>Hubungi Tim Advisor</span>
                  <Icon name="arrow_forward" className="text-base" />
                </Link>
                <Link
                  to="/layanan"
                  className="px-6 py-3 border border-outline-variant text-on-surface hover:border-heritage-red hover:text-heritage-red font-bold rounded-xl transition-all duration-200 text-sm"
                >
                  Lihat Layanan Kami
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-16 md:py-24 bg-surface-container-low border-y border-outline-variant/10">
        <div className="max-w-container mx-auto px-4 md:px-margin-desktop">
          <div className="max-w-3xl mb-14">
            <SectionHeader caption="NILAI UTAMA KAMI" />
            <h2 className="text-2xl md:text-4xl font-bold text-on-surface mb-4 leading-snug">
              Nilai yang menopang setiap engagement.
            </h2>
            <p className="text-on-surface-variant text-base md:text-lg">
              Prinsip-prinsip ini memandu seluruh analisis, rekomendasi, dan negosiasi transaksi yang kami lakukan demi menjaga kepercayaan klien.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {coreValues.map((val) => (
              <div
                key={val.id}
                className="group p-8 rounded-2xl bg-surface-container-lowest border border-outline-variant/15 hover:border-heritage-red/30 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-heritage-red/10 group-hover:bg-heritage-red group-hover:text-white text-heritage-red flex items-center justify-center transition-colors duration-300">
                      <Icon name={val.icon} className="text-2xl" />
                    </div>
                    <span className="text-xs font-mono text-outline font-semibold">
                      {val.number}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-on-surface mb-3 group-hover:text-heritage-red transition-colors">
                    {val.title}
                  </h3>
                  <p className="text-on-surface-variant text-sm leading-relaxed">
                    {val.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Track Record Section */}
      <TrackRecordSection />

      {/* Main CTA & Newsletter */}
      <CTASection />
    </MainLayout>
  );
};
