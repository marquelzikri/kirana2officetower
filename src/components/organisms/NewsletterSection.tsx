import React from 'react';
import { NewsletterForm } from '../molecules/NewsletterForm';

export const NewsletterSection: React.FC = () => {
  return (
    <section className="py-16 bg-surface-container-low border-y border-outline-variant/10">
      <div className="max-w-container mx-auto px-4 md:px-margin-desktop">
        <div className="flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="max-w-md">
            <span className="font-label-caps text-label-sm text-heritage-red mb-3 block">
              NEWSLETTER
            </span>
            <h3 className="font-headline-md text-on-surface">
              Dapatkan insight properti premium langsung ke inbox Anda.
            </h3>
          </div>
          <NewsletterForm />
        </div>
      </div>
    </section>
  );
};
