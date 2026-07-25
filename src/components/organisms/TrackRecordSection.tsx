import React from 'react';
import { SectionHeader } from '../atoms/SectionHeader';
import { StatItem } from '../molecules/StatItem';
import { trackRecordStats } from '../../data/mockData';

export const TrackRecordSection: React.FC = () => {
  return (
    <section id="insight" className="py-section-gap-desktop bg-surface relative overflow-hidden">
      <div className="max-w-container mx-auto relative z-10 px-4 md:px-margin-desktop">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 gap-10">
          <div className="max-w-xl">
            <SectionHeader caption="TRACK RECORD" />
            <h2 className="font-headline-lg text-on-surface">
              Angka yang membangun kepercayaan.
            </h2>
          </div>
          <p className="text-on-surface-variant font-body-md max-w-sm md:text-right">
            Pengalaman satu dekade dalam mendampingi transaksi properti premium di seluruh Indonesia — dengan hasil yang terukur.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
          {trackRecordStats.map((stat) => (
            <StatItem key={stat.id} stat={stat} variant="trackRecord" />
          ))}
        </div>
      </div>
    </section>
  );
};
