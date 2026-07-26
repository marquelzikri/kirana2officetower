import React from 'react';

import { Button } from '@/components/atoms/Button';
import { Icon } from '@/components/atoms/Icon';
import { Input } from '@/components/atoms/Input';
import { Label } from '@/components/atoms/Label';
import { Select } from '@/components/atoms/Select';
import { Textarea } from '@/components/atoms/Textarea';
import type { SubmitContactInput } from '@/services/contactService';

interface ContactFormCardProps {
  formData: SubmitContactInput;
  formErrors: Record<string, string>;
  isPending: boolean;
  isError: boolean;
  errorMessage?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const ContactFormCard: React.FC<ContactFormCardProps> = ({
  formData,
  formErrors,
  isPending,
  isError,
  errorMessage,
  onChange,
  onSubmit,
}) => {
  return (
    <div className="lg:col-span-7">
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-outline-variant/30 shadow-lg">
        <div className="mb-6">
          <h2 className="text-2xl font-bold font-headline-md text-on-surface mb-2">
            Kirim Pesan / Inkuiri
          </h2>
          <p className="text-on-surface-variant text-xs font-body-md">
            Isi formulir di bawah ini. Tim pengelola Kirana Two Office Tower akan menghubungi Anda kembali dalam waktu maksimal 1x24 jam kerja.
          </p>
        </div>

        {isError && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center space-x-3">
            <Icon name="error" className="text-xl shrink-0" />
            <span>{errorMessage || 'Gagal mengirim pesan. Silakan coba lagi.'}</span>
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <Label required className="text-xs">Nama Lengkap</Label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={onChange}
                placeholder="Contoh: Budi Santoso"
                className={`text-xs py-3 ${formErrors.name ? 'border-red-500 bg-red-50/20' : ''}`}
              />
              {formErrors.name && (
                <span className="text-[11px] text-red-500 font-semibold mt-1 block">{formErrors.name}</span>
              )}
            </div>

            <div>
              <Label required className="text-xs">Alamat Email</Label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={onChange}
                placeholder="nama@perusahaan.com"
                className={`text-xs py-3 ${formErrors.email ? 'border-red-500 bg-red-50/20' : ''}`}
              />
              {formErrors.email && (
                <span className="text-[11px] text-red-500 font-semibold mt-1 block">{formErrors.email}</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <Label required className="text-xs">Nomor HP / WhatsApp</Label>
              <Input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={onChange}
                placeholder="081234567890"
                className={`text-xs py-3 ${formErrors.phone ? 'border-red-500 bg-red-50/20' : ''}`}
              />
              {formErrors.phone && (
                <span className="text-[11px] text-red-500 font-semibold mt-1 block">{formErrors.phone}</span>
              )}
            </div>

            <div>
              <Label className="text-xs">
                Nama Perusahaan <span className="text-on-surface-variant text-[10px] font-normal">(Opsional)</span>
              </Label>
              <Input
                type="text"
                name="company"
                value={formData.company}
                onChange={onChange}
                placeholder="PT Nusantara Tech"
                className="text-xs py-3"
              />
            </div>
          </div>

          <div>
            <Label required className="text-xs">Subjek / Perihal</Label>
            <Select
              name="subject"
              value={formData.subject}
              onChange={onChange}
              className={`text-xs py-3 ${formErrors.subject ? 'border-red-500 bg-red-50/20' : ''}`}
            >
              <option value="">-- Pilih Perihal Inkuiri --</option>
              <option value="Sewa Ruang Kantor (Office Space Lease)">Sewa Ruang Kantor (Office Space Lease)</option>
              <option value="Jual / Beli Unit Properti">Jual / Beli Unit Properti</option>
              <option value="Serviced Office & Coworking">Serviced Office & Coworking</option>
              <option value="Jadwal Site Visit / Survey Gedung">Jadwal Site Visit / Survey Gedung</option>
              <option value="Pertanyaan Manajemen Tenant & Facility">Pertanyaan Manajemen Tenant & Facility</option>
              <option value="Lainnya">Lainnya</option>
            </Select>
            {formErrors.subject && (
              <span className="text-[11px] text-red-500 font-semibold mt-1 block">{formErrors.subject}</span>
            )}
          </div>

          <div>
            <Label required className="text-xs">Isi Pesan / Pertanyaan Detail</Label>
            <Textarea
              name="message"
              rows={5}
              value={formData.message}
              onChange={onChange}
              placeholder="Jelaskan kebutuhan luas kantor, jumlah karyawan, target tanggal masuk, atau pertanyaan lainnya..."
              className={`text-xs py-3 ${formErrors.message ? 'border-red-500 bg-red-50/20' : ''}`}
            />
            {formErrors.message && (
              <span className="text-[11px] text-red-500 font-semibold mt-1 block">{formErrors.message}</span>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            disabled={isPending}
            className="w-full py-4 rounded-xl text-xs font-bold justify-center transition-all shadow-md"
          >
            {isPending ? (
              <span className="flex items-center space-x-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Mengirim Pesan...</span>
              </span>
            ) : (
              <span className="flex items-center space-x-2">
                <Icon name="send" className="text-sm" />
                <span>Kirim Pesan Sekarang</span>
              </span>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};
