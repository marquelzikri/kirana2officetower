import { useMutation } from '@tanstack/react-query';
import React, { useState } from 'react';

import { Icon } from '@/components/atoms/Icon';
import { Footer } from '@/components/organisms/Footer';
import { Header } from '@/components/organisms/Header';
import { MobileMenu } from '@/components/organisms/MobileMenu';
import { submitContactForm, type SubmitContactInput } from '@/services/contactService';

import { ContactFormCard } from './ContactPage/components/ContactFormCard';
import { ContactHeaderSection } from './ContactPage/components/ContactHeaderSection';
import { ContactInfoCards } from './ContactPage/components/ContactInfoCards';

export const ContactPage: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const [formData, setFormData] = useState<SubmitContactInput>({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    message: '',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const contactMutation = useMutation({
    mutationFn: (data: SubmitContactInput) => submitContactForm(data),
    onSuccess: () => {
      setIsSuccessModalOpen(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        subject: '',
        message: '',
      });
      setFormErrors({});
    },
  });

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) errors.name = 'Nama lengkap wajib diisi';
    if (!formData.email.trim()) {
      errors.email = 'Alamat email wajib diisi';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = 'Format email tidak valid';
    }

    if (!formData.phone.trim()) {
      errors.phone = 'Nomor telepon / WhatsApp wajib diisi';
    } else if (formData.phone.trim().length < 8) {
      errors.phone = 'Nomor telepon terlalu pendek';
    }

    if (!formData.subject.trim()) errors.subject = 'Subjek pesan wajib diisi';
    if (!formData.message.trim()) {
      errors.message = 'Isi pesan wajib diisi';
    } else if (formData.message.trim().length < 10) {
      errors.message = 'Pesan minimal 10 karakter';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      contactMutation.mutate(formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col font-sans antialiased">
      <Header onOpenMobileMenu={() => setIsMobileMenuOpen(true)} />
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

      <main className="flex-grow pt-28 pb-20">
        <ContactHeaderSection />

        <div className="max-w-container mx-auto px-4 md:px-margin-desktop">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <ContactInfoCards />
            <ContactFormCard
              formData={formData}
              formErrors={formErrors}
              isPending={contactMutation.isPending}
              isError={contactMutation.isError}
              errorMessage={(contactMutation.error as any)?.message}
              onChange={handleChange}
              onSubmit={handleSubmit}
            />
          </div>
        </div>

        {/* Location Map Section */}
        <section className="mt-16 max-w-container mx-auto px-4 md:px-margin-desktop">
          <div className="bg-surface-container-high rounded-3xl p-6 md:p-8 border border-outline-variant/20 shadow-sm overflow-hidden">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div>
                <h3 className="text-xl font-bold font-headline-md text-on-surface">Lokasi Strategis Kirana Two</h3>
                <p className="text-xs text-on-surface-variant font-body-md">
                  Terletak di kawasan bisnis utama Kelapa Gading dengan akses langsung tol Wiyoto Wiyono dan LRT Jakarta.
                </p>
              </div>
              <a
                href="https://maps.google.com/?q=Kirana+Two+Office+Tower"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center space-x-2"
              >
                <Icon name="directions" className="text-base text-heritage-red" />
                <span>Buka di Google Maps</span>
              </a>
            </div>

            <div className="w-full h-80 rounded-2xl overflow-hidden bg-slate-200 relative border border-slate-300">
              <iframe
                title="Kirana Two Office Tower Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.721458925434!2d106.9069123!3d-6.1680415!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f53e6b772c67%3A0xb695e1e127dfbc91!2sKirana%20Two%20Office%20Tower!5e0!3m2!1sen!2sid!4v1700000000000!5m2!1sen!2sid"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </section>
      </main>

      {isSuccessModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl animate-fade-in border border-outline-variant/30">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="check_circle" className="text-4xl" />
            </div>
            <h3 className="text-xl font-bold font-headline-md text-on-surface mb-2">Pesan Terkirim!</h3>
            <p className="text-on-surface-variant text-xs leading-relaxed mb-6 font-body-md">
              Terima kasih telah menghubungi Kirana Two Office Tower. Pesan Anda telah tersimpan di database kami dan akan segera ditinjau oleh tim kami.
            </p>
            <button
              onClick={() => setIsSuccessModalOpen(false)}
              className="w-full py-3 bg-heritage-red hover:bg-red-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
            >
              Tutup & Kembalikan
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};
