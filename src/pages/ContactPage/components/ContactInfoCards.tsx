import React from 'react';

import { Icon } from '@/components/atoms/Icon';

export const ContactInfoCards: React.FC = () => {
  return (
    <div className="lg:col-span-5 space-y-8">
      <div>
        <span className="text-heritage-red font-label-md text-xs font-bold uppercase tracking-widest block mb-2">
          INFORMASI KONTAK
        </span>
        <h2 className="text-2xl font-bold font-headline-md text-on-surface mb-4">
          Kantor Pengelola & Sales Gallery
        </h2>
        <p className="text-on-surface-variant text-sm font-body-md leading-relaxed">
          Kunjungi kantor manajemen kami di Kirana Two Office Tower untuk konsultasi langsung, perizinan fit-out, atau peninjauan lokasi (site visit).
        </p>
      </div>

      <div className="space-y-4">
        <div className="bg-white p-5 rounded-2xl border border-outline-variant/30 shadow-sm flex items-start space-x-4">
          <div className="w-12 h-12 rounded-xl bg-heritage-red/10 text-heritage-red flex items-center justify-center shrink-0">
            <Icon name="location_on" className="text-2xl" />
          </div>
          <div>
            <h3 className="font-headline-md font-bold text-on-surface text-sm mb-1">Alamat Gedung</h3>
            <p className="text-on-surface-variant text-xs leading-relaxed">
              Kirana Two Office Tower, Lt. Ground / Management Office<br />
              Jl. Boulevard Timur No. 88, Kelapa Gading<br />
              Jakarta Utara 14240, Indonesia
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-outline-variant/30 shadow-sm flex items-start space-x-4">
          <div className="w-12 h-12 rounded-xl bg-heritage-red/10 text-heritage-red flex items-center justify-center shrink-0">
            <Icon name="call" className="text-2xl" />
          </div>
          <div>
            <h3 className="font-headline-md font-bold text-on-surface text-sm mb-1">Telepon & WhatsApp</h3>
            <p className="text-on-surface-variant text-xs leading-relaxed">
              Office: +62 21 2938 8888<br />
              Hotline & WA: +62 811 8888 2938
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-outline-variant/30 shadow-sm flex items-start space-x-4">
          <div className="w-12 h-12 rounded-xl bg-heritage-red/10 text-heritage-red flex items-center justify-center shrink-0">
            <Icon name="mail" className="text-2xl" />
          </div>
          <div>
            <h3 className="font-headline-md font-bold text-on-surface text-sm mb-1">Email Resmi</h3>
            <p className="text-on-surface-variant text-xs leading-relaxed">
              Leasing & Sales: leasing@kiranatwo.co.id<br />
              Informasi Umum: info@kiranatwo.co.id
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-outline-variant/30 shadow-sm flex items-start space-x-4">
          <div className="w-12 h-12 rounded-xl bg-heritage-red/10 text-heritage-red flex items-center justify-center shrink-0">
            <Icon name="schedule" className="text-2xl" />
          </div>
          <div>
            <h3 className="font-headline-md font-bold text-on-surface text-sm mb-1">Jam Operasional</h3>
            <p className="text-on-surface-variant text-xs leading-relaxed">
              Senin - Jumat: 08:00 - 18:00 WIB<br />
              Sabtu: 08:00 - 13:00 WIB<br />
              Minggu & Hari Libur: Tutup (Layanan Tenant 24/7 Security)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
