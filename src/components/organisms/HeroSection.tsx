import React from 'react';

import { Button } from '@/components/atoms/Button';
import { SectionHeader } from '@/components/atoms/SectionHeader';
import { StatItem } from '@/components/molecules/StatItem';
import { heroStats } from '@/data/mockData';

export const HeroSection: React.FC = () => {
  return (
    <section id="hero" className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 luxury-overlay z-10"></div>
        <div
          className="w-full h-full bg-cover bg-center"
          style={{
            backgroundImage:
              'url("https://lh3.googleusercontent.com/aida-public/AB6AXuByelIKP6L0600oSSLytaiok4hTPozdYAAYr44Mhe3wEwn09fFpR4EsJQxSjX5tW2qKWKUIdaJy5GNALUKu35aC-b-NJeVLr6_oY576eGjr4igKxkaxOD9JsqcBBG-t5NeN7uvDkdqgNFe0i2aKPAvh4CaQgxNBJdDQoD9_i52q5SRCpb45ZEO0IfcUqLEl3CfxbcIc3nHwuewLY_RgE5JZv1mrlppalLO8EXKLBagl1ACne8lCrVAerIUN58GXdA_QztuXcP6hmA")',
          }}
        ></div>
      </div>

      <div className="relative z-20 max-w-container mx-auto w-full px-4 md:px-margin-desktop">
        <div className="max-w-3xl">
          <SectionHeader
            caption="PREMIUM REAL ESTATE · INDONESIA"
            lineWidth="w-12"
          />
          <h1 className="font-display-hero text-headline-lg-mobile md:text-display-hero text-on-surface mb-8 leading-tight">
            Temukan Properti <br />
            <span className="italic font-normal">Bernilai Tinggi</span> <br />
            untuk Masa Depan Anda.
          </h1>
          <p className="font-body-lg text-on-surface-variant mb-12 max-w-xl">
            Partner terpercaya untuk investasi, jual beli, and pengembangan properti premium di Indonesia — melayani investor, developer, dan pemilik bisnis selama lebih dari satu dekade.
          </p>
          <div className="flex flex-wrap gap-6">
            <Button asAnchor href="#properti" variant="primary" size="lg">
              LIHAT PROPERTI
            </Button>
            <Button asAnchor href="#kontak" variant="outline" size="lg">
              HUBUNGI KONSULTAN
            </Button>
          </div>
        </div>
      </div>

      {/* Floating Stats Banner */}
      <div className="absolute bottom-0 left-0 w-full bg-surface-container/60 backdrop-blur-sm border-t border-outline-variant/10 hidden lg:block">
        <div className="max-w-container mx-auto px-margin-desktop py-8 grid grid-cols-4 gap-gutter">
          {heroStats.map((stat) => (
            <StatItem key={stat.id} stat={stat} variant="hero" />
          ))}
        </div>
      </div>
    </section>
  );
};
