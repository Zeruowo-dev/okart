import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';

export function NewsletterSection() {
  const { navigate, newsletterSubscribed, subscribeNewsletter } = useStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!accepted) {
      setError('Please accept the terms and conditions.');
      return;
    }
    setError('');
    subscribeNewsletter(name.trim(), email.trim());
  };

  return (
    <section className="w-full bg-[#F6F5F3] py-16 md:py-20 border-t border-[#E1E0DD]">
      <div className="max-w-md mx-auto px-4 text-center">
        <h2 className="font-sans-body text-[15px] uppercase tracking-[0.22em] text-[#2B1E12] font-normal">
          STAY UPDATED
        </h2>
        <p className="text-[12px] text-[#4F3926] leading-relaxed mt-3">
          Sign up for OKART Interiors updates to receive new bespoke furniture releases, project lookbooks, and showroom invitations.
        </p>

        {newsletterSubscribed ? (
          <div className="mt-6 p-5 bg-[#EEE8DE] border border-[#D5D4D3] text-[#2B1E12] text-[13px]">
            Thank you for subscribing to OKART Interiors. We look forward to inspiring your next space.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-3 text-left" noValidate>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label htmlFor="newsletter-name" className="sr-only">
                  Name
                </label>
                <input
                  id="newsletter-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Name"
                  className="w-full h-10 px-3.5 bg-white border border-[#D5D4D3] rounded-sm text-[13px] text-[#1C1C1C] placeholder:text-[#A29E95] focus:outline-none focus:border-[#777859]"
                />
              </div>
              <div>
                <label htmlFor="newsletter-email" className="sr-only">
                  Email
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  required
                  className="w-full h-10 px-3.5 bg-white border border-[#D5D4D3] rounded-sm text-[13px] text-[#1C1C1C] placeholder:text-[#A29E95] focus:outline-none focus:border-[#777859]"
                />
              </div>
            </div>

            <div className="pt-1 flex items-center gap-2">
              <input
                id="newsletter-consent"
                type="checkbox"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
                className="w-3.5 h-3.5 accent-[#777859] cursor-pointer"
              />
              <label
                htmlFor="newsletter-consent"
                className="text-[11px] text-[#4F3926] cursor-pointer"
              >
                I accept the conditions
              </label>
            </div>

            <p className="text-[11px] text-[#4F3926]">
              Read our{' '}
              <a
                href="/pages/terms-and-conditions"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/pages/terms-and-conditions');
                }}
                className="underline text-[#395B7A] hover:text-[#2B1E12]"
              >
                terms and conditions
              </a>
            </p>

            {error && (
              <p role="alert" className="text-[12px] text-[#8E5235]">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full h-10 rounded-full bg-[#777859] hover:bg-[#676A52] text-[#F6F6F1] text-[11px] uppercase tracking-[0.2em] transition-colors cursor-pointer"
            >
              SUBSCRIBE
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
