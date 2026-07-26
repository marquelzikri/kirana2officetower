import React, { useState } from 'react';

import { Button } from '@/components/atoms/Button';
import { Icon } from '@/components/atoms/Icon';
import { Input } from '@/components/atoms/Input';
import { Label } from '@/components/atoms/Label';
import { Select } from '@/components/atoms/Select';
import { Textarea } from '@/components/atoms/Textarea';
import type { Property } from '@/types';

interface ScheduleSurveyModalProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ScheduleSurveyModal: React.FC<ScheduleSurveyModalProps> = ({
  property,
  isOpen,
  onClose,
}) => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    surveyDate: '',
    preferredTime: '10:00 AM',
    notes: '',
  });

  if (!isOpen || !property) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl max-w-xl w-full p-6 md:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-on-surface-variant hover:text-on-surface p-2 rounded-full hover:bg-surface-container transition-colors"
          aria-label="Close modal"
        >
          <Icon name="close" className="text-[24px]" />
        </button>

        {submitted ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-heritage-red/10 text-heritage-red rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="check_circle" className="text-[36px]" />
            </div>
            <h3 className="font-headline-md text-on-surface mb-2">Permintaan Survey Terkirim!</h3>
            <p className="text-on-surface-variant text-body-md mb-6 max-w-md mx-auto">
              Tim Advisory Kirana Two Office Tower akan menghubungi Anda via WhatsApp/Telepon untuk mengonfirmasi jadwal kunjungan unit <span className="font-semibold text-on-surface">{property.title} ({property.unitCode})</span>.
            </p>
            <Button variant="primary" onClick={handleReset}>
              Tutup & Kembali
            </Button>
          </div>
        ) : (
          <div>
            <div className="mb-6 border-b border-outline-variant/10 pb-4">
              <span className="font-metadata text-[11px] uppercase tracking-wider text-heritage-red block mb-1">
                JADWALKAN KUNJUNGAN SURVEY UNIT
              </span>
              <h3 className="font-headline-md text-on-surface">{property.title}</h3>
              <p className="text-on-surface-variant text-body-sm mt-1">
                Lantai {property.floor} • Unit {property.unitCode} ({property.sizeSqm} m²)
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Nama Lengkap *</Label>
                  <Input
                    type="text"
                    required
                    placeholder="Budi Santoso"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div>
                  <Label>Nama Perusahaan / PT *</Label>
                  <Input
                    type="text"
                    required
                    placeholder="PT Teknologi Nusantara"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Email Kantor *</Label>
                  <Input
                    type="email"
                    required
                    placeholder="budi@perusahaan.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div>
                  <Label>No. WhatsApp / HP *</Label>
                  <Input
                    type="tel"
                    required
                    placeholder="081234567890"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Rencana Tanggal Kunjungan *</Label>
                  <Input
                    type="date"
                    required
                    value={formData.surveyDate}
                    onChange={(e) => setFormData({ ...formData, surveyDate: e.target.value })}
                  />
                </div>

                <div>
                  <Label>Waktu Kunjungan *</Label>
                  <Select
                    value={formData.preferredTime}
                    onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                  >
                    <option value="09:30 AM">Pagi (09.30 - 11.30 WIB)</option>
                    <option value="02:00 PM">Siang (14.00 - 16.00 WIB)</option>
                    <option value="04:00 PM">Sore (16.00 - 17.30 WIB)</option>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Catatan Kebutuhan Khusus (Opsional)</Label>
                <Textarea
                  rows={3}
                  placeholder="Kebutuhan kapasitas meja, spesifikasi kelistrikan khusus, dll."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onClose}
                  className="rounded-lg"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  className="rounded-lg shadow-md"
                >
                  Konfirmasi Survey
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
