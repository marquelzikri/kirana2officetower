import React, { useState } from 'react';
import { Input } from '../atoms/Input';
import { Button } from '../atoms/Button';

export const NewsletterForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setEmail('');
      }, 4000);
    }
  };

  return (
    <div className="w-full max-w-lg">
      {submitted ? (
        <div className="bg-heritage-red/10 border border-heritage-red text-heritage-red px-6 py-4 rounded font-label-md transition-all">
          ✓ Terima kasih! Email Anda ({email}) telah terdaftar untuk menerima newsletter.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row w-full">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Alamat email Anda"
            required
          />
          <Button type="submit" variant="primary" className="px-8 py-4 whitespace-nowrap">
            LANGGANAN
          </Button>
        </form>
      )}
    </div>
  );
};
