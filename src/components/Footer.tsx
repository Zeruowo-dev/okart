import React from 'react';
import { CATEGORY_CARDS, OKART_CONTACT } from '../data/siteContent';
import { useStore } from '../context/StoreContext';

const EXPLORE_LINKS = [
  { label: 'About Us', href: '/pages/about-us' },
  { label: 'Our Products', href: '/products' },
  { label: 'Our Services', href: '/pages/services' },
  { label: 'Our Projects', href: '/pages/projects' },
  { label: 'Bespoke Studio', href: '/pages/bespoke' },
  { label: 'The Video Showcase', href: '/pages/video' },
  { label: 'Modular Sofa Planner', href: '/pages/planner' },
  { label: 'Fabric & Leather Library', href: '/pages/fabric-types-and-colors' },
];

const POLICY_LINKS = [
  { label: 'Terms & Conditions', href: '/pages/terms-and-conditions' },
  { label: 'Refund & Returns Policy', href: '/pages/refund-policy' },
  { label: 'Contact Us', href: '/pages/contact' },
  { label: 'Sign Up / Client Account', href: '/signup' },
  { label: 'Frequently Asked Questions', href: '/pages/customer-service' },
  { label: 'Ibadan Showroom', href: '/pages/showrooms' },
  { label: 'Request a Quotation', href: '/pages/contact' },
];

export function Footer() {
  const { navigate } = useStore();

  return (
    <footer className="w-full bg-[#F6F5F3] border-t border-[#E1E0DD] text-[#1C1C1C]">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 pt-14 pb-10">
        {/* 4 Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Contact Column */}
          <div className="space-y-5">
            <div>
              <p className="text-[11px] uppercase tracking-[0.14em] font-semibold text-[#1C1C1C]">
                OKART Interiors
              </p>
              <h4 className="text-[20px] font-normal text-[#1C1C1C] mt-1.5 tabular-nums">
                <a href={`tel:${OKART_CONTACT.phone}`} className="hover:underline">
                  {OKART_CONTACT.phone}
                </a>
              </h4>
              <p className="text-[12px] text-[#4F3926] mt-1">
                <a href={`mailto:${OKART_CONTACT.email}`} className="hover:underline">
                  {OKART_CONTACT.email}
                </a>
              </p>
              <p className="text-[12px] text-[#4F3926] mt-2 leading-relaxed">
                {OKART_CONTACT.address}
              </p>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-[0.14em] text-[#82674F]">
                Showroom & Workshop Hours
              </p>
              <p className="text-[12px] text-[#4F3926] leading-relaxed mt-1.5">
                Monday – Friday: 09.00 – 18.00
                <br />
                Saturday: 10.00 – 16.00
              </p>
            </div>
          </div>

          {/* 7 Product Categories */}
          <div>
            <p className="text-[11px] uppercase tracking-[0.14em] text-[#82674F] mb-3">
              Product Categories
            </p>
            <ul className="space-y-2">
              {CATEGORY_CARDS.map((cat) => (
                <li key={cat.id}>
                  <a
                    href={cat.href}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(cat.href);
                    }}
                    className="text-[12px] text-[#4F3926] hover:text-[#1C1C1C] hover:underline underline-offset-4"
                  >
                    {cat.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Explore OKART */}
          <div>
            <p className="text-[11px] uppercase tracking-[0.14em] text-[#82674F] mb-3">
              Explore OKART
            </p>
            <ul className="space-y-2">
              {EXPLORE_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(link.href);
                    }}
                    className="text-[12px] text-[#4F3926] hover:text-[#1C1C1C] hover:underline underline-offset-4"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies & Client Care */}
          <div>
            <p className="text-[11px] uppercase tracking-[0.14em] text-[#82674F] mb-3">
              Policies & Support
            </p>
            <ul className="space-y-2">
              {POLICY_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(link.href);
                    }}
                    className="text-[12px] text-[#4F3926] hover:text-[#1C1C1C] hover:underline underline-offset-4"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Socials, Pillars Badges & Legal */}
        <div className="mt-12 pt-8 border-t border-[#E1E0DD] flex flex-col gap-6">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="flex flex-wrap items-center gap-5 text-[12px] text-[#4F3926]">
              <a
                href={OKART_CONTACT.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#1C1C1C] underline underline-offset-4"
              >
                Instagram @{OKART_CONTACT.instagramHandle}
              </a>
              <a
                href={OKART_CONTACT.whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#1C1C1C] underline underline-offset-4"
              >
                WhatsApp {OKART_CONTACT.whatsapp}
              </a>
              <a
                href={`mailto:${OKART_CONTACT.email}`}
                className="hover:text-[#1C1C1C] underline underline-offset-4"
              >
                {OKART_CONTACT.email}
              </a>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-[10px] uppercase tracking-[0.16em] text-[#4F3926]">
              <div className="border border-[#D5D4D3] px-3 py-1.5 bg-white">
                In-House Production Workshop
              </div>
              <div className="border border-[#D5D4D3] px-3 py-1.5 bg-white">
                4.9 ★ Verified Google Reviews
              </div>
            </div>
          </div>

          <p className="text-[11px] text-[#82674F] text-center pt-4">
            © {new Date().getFullYear()} OKART Interiors · {OKART_CONTACT.address} · Tel: {OKART_CONTACT.phone} · {OKART_CONTACT.email}
          </p>
        </div>
      </div>
    </footer>
  );
}
