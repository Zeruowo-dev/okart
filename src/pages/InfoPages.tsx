import React, { useState } from 'react';
import { Check, ChevronDown, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import {
  BRAND_ASSETS,
  FABRIC_COLLECTIONS,
  FAQ_ITEMS,
  OKART_CONTACT,
  OKART_PILLARS,
  OKART_TERMS_SECTIONS,
} from '../data/siteContent';
import { useStore } from '../context/StoreContext';
import { GoogleReviewsSection } from '../components/GoogleReviewsSection';
import { NewsletterSection } from '../components/NewsletterSection';

export function FabricSamplesPage() {
  const { addCustomCartLine, showToast } = useStore();
  const [selectedSamples, setSelectedSamples] = useState<
    { name: string; hex: string; family: string }[]
  >([]);

  const toggleSample = (item: { name: string; hex: string; family: string }) => {
    setSelectedSamples((prev) => {
      const exists = prev.some((s) => s.name === item.name);
      if (exists) return prev.filter((s) => s.name !== item.name);
      if (prev.length >= 6) {
        showToast('You can select up to 6 swatches per sample kit.');
        return prev;
      }
      return [...prev, item];
    });
  };

  const handleOrderSamples = () => {
    if (selectedSamples.length === 0) return;
    addCustomCartLine(
      {
        key: `samples-${selectedSamples.map((s) => s.name).join('|')}`,
        productId: 888001,
        handle: 'fabric-samples',
        model: `OKART Swatch Sample Kit (${selectedSamples.length} swatches)`,
        subtitle: selectedSamples.map((s) => s.name).join(', '),
        variantId: 888001,
        variantTitle: 'Workshop Sample Selection · Quote Dispatch',
        unitPrice: 0,
        image: BRAND_ASSETS.fabricMacro,
        isQuoteItem: true,
      },
      1
    );
  };

  return (
    <div className="bg-[#F6F5F3]">
      <section className="relative h-[300px] md:h-[380px] overflow-hidden bg-[#2B1E12]">
        <img
          src={BRAND_ASSETS.fabricMacro}
          alt="OKART Interiors tailored upholstery fabrics and leathers"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#2B1E12]/50 flex items-center justify-center text-center px-6">
          <div className="max-w-2xl text-white">
            <p className="text-[10px] uppercase tracking-[0.2em]">
              TAILORED UPHOLSTERY &amp; FULL-GRAIN LEATHER LIBRARY
            </p>
            <h1 className="font-serif-display text-[42px] md:text-[52px] mt-2">
              Fabric Types &amp; Colours
            </h1>
            <p className="text-[13px] text-white/90 mt-2">
              Select up to 6 fabric and hide swatches to review alongside your interior finishes and lighting.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-[1360px] mx-auto px-4 lg:px-10 py-14 space-y-12">
        <div className="bg-white border border-[#E1E0DD] p-5 flex flex-wrap items-center justify-between gap-4 sticky top-20 z-20">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[11px] uppercase tracking-[0.14em] text-[#82674F] tabular-nums">
              Selected swatches ({selectedSamples.length}/6):
            </span>
            {selectedSamples.length === 0 ? (
              <span className="text-[12px] text-[#4F3926]">
                Click any colour swatch below to add to your swatch kit
              </span>
            ) : (
              selectedSamples.map((s) => (
                <button
                  key={s.name}
                  type="button"
                  onClick={() => toggleSample(s)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F6F5F3] border border-[#D5D4D3] text-[11px] text-[#1C1C1C] cursor-pointer"
                >
                  <span
                    className="w-3 h-3 rounded-full border border-[#D5D4D3]"
                    style={{ backgroundColor: s.hex }}
                  />
                  <span>{s.name}</span>
                </button>
              ))
            )}
          </div>
          <button
            type="button"
            disabled={selectedSamples.length === 0}
            onClick={handleOrderSamples}
            className="px-6 py-2.5 rounded-full bg-[#EDE5D5] hover:bg-[#DFD2BC] border border-[#B9A78B] disabled:opacity-40 text-[#2B1E12] text-[11px] uppercase tracking-[0.16em] cursor-pointer"
          >
            Request Swatch Kit
          </button>
        </div>

        <div className="space-y-10">
          {FABRIC_COLLECTIONS.map((fc) => (
            <div
              key={fc.id}
              className="bg-white border border-[#E1E0DD] p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
              <div className="lg:col-span-5 space-y-3">
                <p className="text-[10px] uppercase tracking-[0.18em] text-[#82674F]">
                  {fc.certification} · {fc.martindale}
                </p>
                <h2 className="font-serif-display text-[30px] text-[#2B1E12]">
                  {fc.name}
                </h2>
                <p className="text-[12px] text-[#82674F]">{fc.composition}</p>
                <p className="text-[13px] text-[#4F3926] leading-relaxed">
                  {fc.description}
                </p>
              </div>

              <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-4">
                {fc.swatches.map((sw) => {
                  const isSelected = selectedSamples.some((s) => s.name === sw.name);
                  return (
                    <button
                      key={sw.name}
                      type="button"
                      onClick={() =>
                        toggleSample({ name: sw.name, hex: sw.hex, family: fc.name })
                      }
                      className={`p-3 border text-left transition-colors cursor-pointer ${
                        isSelected
                          ? 'border-[#82674F] bg-[#EDE5D5]/55'
                          : 'border-[#E1E0DD] hover:border-[#82674F]'
                      }`}
                    >
                      <div
                        className="w-full h-16 rounded-sm border border-[#D5D4D3] relative flex items-center justify-center"
                        style={{ backgroundColor: sw.hex }}
                      >
                        {isSelected && (
                          <span className="w-6 h-6 rounded-full bg-[#EDE5D5] border border-[#82674F] text-[#2B1E12] flex items-center justify-center">
                            <Check className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-[#1C1C1C] mt-2 leading-snug">
                        {sw.name}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      <NewsletterSection />
    </div>
  );
}

export function GenericInfoPage({ slug }: { slug: string }) {
  const { navigate, showToast, submitQuoteRequest } = useStore();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [contactSent, setContactSent] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');

  if (slug === 'about-us') {
    return (
      <div className="bg-[#F6F5F3]">
        <section className="relative h-[300px] md:h-[400px] overflow-hidden bg-[#2B1E12]">
          <img
            src={BRAND_ASSETS.conceptBanner}
            alt="About OKART Interiors"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#2B1E12]/50 flex items-center justify-center text-center px-6">
            <div className="max-w-2xl text-white">
              <p className="text-[10px] uppercase tracking-[0.22em] text-white/85">
                ABOUT OKART INTERIORS
              </p>
              <h1 className="font-serif-display text-[38px] md:text-[50px] mt-2 leading-tight">
                Thoughtfully Designed. Beautifully Crafted. Expertly Delivered.
              </h1>
            </div>
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-6 py-14 space-y-6 text-[#4F3926] text-[14px] leading-[1.8]">
          <p>
            At Okart Interiors, we believe that great interiors do more than fill a space; they create connections. Connections between people, their surroundings, and the creativity that transforms a space into something truly personal.
          </p>
          <p>
            Whether for residential, commercial, or hospitality environments, we design and produce bespoke furniture, cabinetry, and upholstery that bring our clients&apos; visions to life. Every project is approached with care, creativity, and attention to detail, combining contemporary design with timeless craftsmanship to create pieces that are as functional as they are beautiful.
          </p>
          <p>
            Our approach is built on four fundamental pillars: <strong>Brief, Design, Production, and Installation</strong>. From understanding your needs and translating your vision into thoughtful designs to crafting each piece in our in-house production workshop and delivering a seamless installation, we are committed to quality at every stage. By combining time-honoured artisanal techniques with modern production methods, we create distinctive, functional solutions tailored to each client&apos;s space, taste, and budget.
          </p>
          <p>
            Our mission is simple: the right furniture, at the right price, and at the right time. We believe in doing things properly, upholding high standards, and delivering on our promises. No shortcuts. No excuses. It really is that simple.
          </p>
          <p className="text-[#2B1E12] font-medium">
            We look forward to working with you to create spaces that inspire, connect, and endure.
          </p>
        </section>

        {/* Four Pillars Grid */}
        <section className="max-w-[1360px] mx-auto px-4 lg:px-10 pb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {OKART_PILLARS.map((p) => (
              <div key={p.step} className="bg-white border border-[#E1E0DD] p-6 space-y-3">
                <span className="font-serif-display text-[30px] text-[#82674F]">{p.step}</span>
                <h2 className="font-serif-display text-[26px] text-[#2B1E12]">{p.title}</h2>
                <p className="text-[12px] text-[#4F3926] leading-relaxed">{p.description}</p>
              </div>
            ))}
          </div>
        </section>

        <GoogleReviewsSection />
        <NewsletterSection />
      </div>
    );
  }

  if (slug === 'terms-and-conditions' || slug === 'refund-policy') {
    return (
      <div className="bg-[#F6F5F3]">
        <div className="max-w-4xl mx-auto px-6 py-14 space-y-10">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#82674F]">
              OKART INTERIORS POLICIES
            </p>
            <h1 className="font-serif-display text-[40px] md:text-[48px] text-[#2B1E12] mt-2 leading-tight">
              {slug === 'refund-policy'
                ? 'Refund, Cancellation & Terms Policy'
                : 'Terms & Conditions'}
            </h1>
            <p className="text-[13px] text-[#4F3926] mt-2">
              Governing website enquiries, bespoke quotations, project orders, production timelines, refunds, and installation.
            </p>
          </div>

          <div className="space-y-8 border-t border-[#E1E0DD] pt-8">
            {OKART_TERMS_SECTIONS.map((sec) => (
              <div key={sec.heading} className="bg-white border border-[#E1E0DD] p-6 space-y-2">
                <h2 className="font-serif-display text-[26px] text-[#2B1E12]">
                  {sec.heading}
                </h2>
                <p className="text-[13px] text-[#4F3926] leading-[1.75]">{sec.body}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => navigate('/pages/contact')}
              className="px-7 py-3 rounded-full bg-[#EDE5D5] hover:bg-[#DFD2BC] border border-[#B9A78B] text-[#2B1E12] text-[11px] uppercase tracking-[0.16em] cursor-pointer"
            >
              Contact Us Regarding an Order
            </button>
            <button
              type="button"
              onClick={() => navigate('/products')}
              className="px-7 py-3 rounded-full border border-[#2B1E12] text-[#2B1E12] text-[11px] uppercase tracking-[0.16em] cursor-pointer"
            >
              Browse Our Products
            </button>
          </div>
        </div>
        <NewsletterSection />
      </div>
    );
  }

  if (slug === 'contact') {
    return (
      <div className="bg-[#F6F5F3]">
        <section className="relative h-[280px] md:h-[340px] overflow-hidden bg-[#2B1E12]">
          <img
            src={BRAND_ASSETS.showroomsBanner}
            alt="Contact OKART Interiors"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#2B1E12]/50 flex items-center justify-center text-center px-6">
            <div className="max-w-xl text-white">
              <p className="text-[10px] uppercase tracking-[0.22em]">
                IBADAN WORKSHOP &amp; SHOWROOM
              </p>
              <h1 className="font-serif-display text-[42px] md:text-[52px] mt-2">
                Contact Us
              </h1>
            </div>
          </div>
        </section>

        <section className="max-w-[1320px] mx-auto px-4 lg:px-10 py-14 grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Exact Contact Details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-[#E1E0DD] p-8 space-y-5">
              <h2 className="font-serif-display text-[30px] text-[#2B1E12]">
                Direct Channels
              </h2>

              <div className="space-y-4 text-[13px] text-[#4F3926]">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#82674F] shrink-0 mt-1" />
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.14em] text-[#82674F]">
                      Business Address
                    </div>
                    <p className="text-[#1C1C1C] mt-0.5">{OKART_CONTACT.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-[#82674F] shrink-0 mt-1" />
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.14em] text-[#82674F]">
                      Phone Number
                    </div>
                    <a
                      href={`tel:${OKART_CONTACT.phone}`}
                      className="text-[#1C1C1C] tabular-nums hover:underline"
                    >
                      {OKART_CONTACT.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MessageCircle className="w-4 h-4 text-[#82674F] shrink-0 mt-1" />
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.14em] text-[#82674F]">
                      WhatsApp Direct
                    </div>
                    <a
                      href={OKART_CONTACT.whatsappUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#1C1C1C] tabular-nums underline"
                    >
                      {OKART_CONTACT.whatsapp} (Open WhatsApp)
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-[#82674F] shrink-0 mt-1" />
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.14em] text-[#82674F]">
                      Email Address
                    </div>
                    <a
                      href={`mailto:${OKART_CONTACT.email}`}
                      className="text-[#1C1C1C] hover:underline"
                    >
                      {OKART_CONTACT.email}
                    </a>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#E1E0DD]">
                <p className="text-[10px] uppercase tracking-[0.14em] text-[#82674F]">
                  Social Media
                </p>
                <a
                  href={OKART_CONTACT.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block mt-1.5 text-[13px] text-[#82674F] hover:text-[#2B1E12] underline"
                >
                  Instagram: @{OKART_CONTACT.instagramHandle}
                </a>
              </div>
            </div>
          </div>

          {/* Enquiry Form */}
          <div className="lg:col-span-7 bg-white border border-[#E1E0DD] p-8 md:p-10 space-y-5">
            <h2 className="font-serif-display text-[30px] text-[#2B1E12]">
              Send an Enquiry or Request a Quotation
            </h2>

            {contactSent ? (
              <div className="bg-[#EEE8DE] p-6 border border-[#D5D4D3] text-[13px] text-[#2B1E12]">
                Thank you, {contactName}. Our Ibadan studio team has received your enquiry and will respond via phone/WhatsApp ({OKART_CONTACT.phone}) or email ({OKART_CONTACT.email}).
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!contactName.trim() || !contactEmail.trim() || !contactMessage.trim()) return;
                  submitQuoteRequest({
                    productTitle: 'General Consultation / Project Brief',
                    variantTitle: 'Contact Us Page',
                    customerName: contactName.trim(),
                    phone: OKART_CONTACT.phone,
                    email: contactEmail.trim(),
                    notes: contactMessage.trim(),
                  });
                  setContactSent(true);
                  showToast('Inquiry received by OKART Interiors');
                }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    required
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Full name"
                    className="h-11 px-3.5 border border-[#D5D4D3] text-[13px]"
                  />
                  <input
                    required
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="Email address"
                    className="h-11 px-3.5 border border-[#D5D4D3] text-[13px]"
                  />
                </div>
                <textarea
                  required
                  rows={5}
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  placeholder="Tell us about your project, product enquiry (e.g. The Heritage Dining Chair), or schedule a workshop visit..."
                  className="w-full p-3.5 border border-[#D5D4D3] text-[13px]"
                />
                <button
                  type="submit"
                  className="px-8 py-3.5 rounded-full bg-[#EDE5D5] hover:bg-[#DFD2BC] border border-[#B9A78B] text-[#2B1E12] text-[11px] uppercase tracking-[0.16em] cursor-pointer"
                >
                  Send Enquiry
                </button>
              </form>
            )}

            {/* FAQ */}
            <div className="pt-8 border-t border-[#E1E0DD]">
              <h3 className="font-serif-display text-[26px] text-[#2B1E12] mb-3">
                Frequently Asked Questions
              </h3>
              <div className="divide-y divide-[#E1E0DD] border-y border-[#E1E0DD]">
                {FAQ_ITEMS.map((item, idx) => (
                  <div key={item.q}>
                    <button
                      type="button"
                      onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                      className="w-full py-3.5 flex items-center justify-between text-left cursor-pointer"
                    >
                      <span className="text-[13px] text-[#1C1C1C] font-medium">
                        {item.q}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 shrink-0 transition-transform ${
                          openFaq === idx ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {openFaq === idx && (
                      <p className="pb-4 text-[12px] text-[#4F3926] leading-relaxed">
                        {item.a}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <NewsletterSection />
      </div>
    );
  }

  // Fallback for FAQ / customer-service / other informational slugs
  const title = slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  return (
    <div className="bg-[#F6F5F3]">
      <div className="max-w-4xl mx-auto px-6 py-14 space-y-8">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#82674F]">
            OKART INTERIORS
          </p>
          <h1 className="font-serif-display text-[40px] md:text-[48px] text-[#2B1E12] mt-2 leading-tight">
            {title}
          </h1>
          <p className="text-[14px] text-[#4F3926] leading-relaxed mt-3">
            Thoughtfully Designed. Beautifully Crafted. Expertly Delivered. Reach our Ibadan team on {OKART_CONTACT.phone} or {OKART_CONTACT.email}.
          </p>
        </div>

        <div className="divide-y divide-[#E1E0DD] border-y border-[#E1E0DD]">
          {FAQ_ITEMS.map((item, idx) => (
            <div key={item.q}>
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full py-4 flex items-center justify-between text-left cursor-pointer"
              >
                <span className="text-[13px] text-[#1C1C1C] font-medium">{item.q}</span>
                <ChevronDown
                  className={`w-4 h-4 shrink-0 transition-transform ${
                    openFaq === idx ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openFaq === idx && (
                <p className="pb-4 text-[13px] text-[#4F3926] leading-relaxed">{item.a}</p>
              )}
            </div>
          ))}
        </div>

        <div className="pt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => navigate('/products')}
            className="px-7 py-3 rounded-full bg-[#EDE5D5] hover:bg-[#DFD2BC] border border-[#B9A78B] text-[#2B1E12] text-[11px] uppercase tracking-[0.16em] cursor-pointer"
          >
            Our Products
          </button>
          <button
            type="button"
            onClick={() => navigate('/pages/contact')}
            className="px-7 py-3 rounded-full bg-[#777859] text-white text-[11px] uppercase tracking-[0.16em] cursor-pointer"
          >
            Contact Us
          </button>
        </div>
      </div>

      <NewsletterSection />
    </div>
  );
}
