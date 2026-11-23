import React, { useState } from 'react';
import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import { BRAND_ASSETS, OKART_CONTACT, SHOWROOMS } from '../data/siteContent';
import { NewsletterSection } from '../components/NewsletterSection';
import { useStore } from '../context/StoreContext';

export function ShowroomsPage({ initialCity }: { initialCity?: string }) {
  const { showToast } = useStore();
  const [selectedCity, setSelectedCity] = useState<string>(initialCity || 'all');
  const [bookingName, setBookingName] = useState('');
  const [bookingEmail, setBookingEmail] = useState('');
  const [bookingStore, setBookingStore] = useState('Ibadan');
  const [bookingDate, setBookingDate] = useState('');
  const [booked, setBooked] = useState(false);

  const visibleStores =
    selectedCity === 'all'
      ? SHOWROOMS
      : SHOWROOMS.filter((s) => s.id === selectedCity.toLowerCase());

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingName.trim() || !bookingEmail.trim()) return;
    setBooked(true);
    showToast(`Consultation requested at OKART Interiors (${bookingStore})`);
  };

  return (
    <div className="bg-[#F6F5F3]">
      {/* Hero Banner */}
      <section className="relative h-[340px] md:h-[440px] overflow-hidden bg-[#2B1E12]">
        <img
          src={BRAND_ASSETS.showroomsBanner}
          alt="OKART Interiors Ibadan Showroom & Workshop"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#2B1E12]/45 flex items-center justify-center text-center px-6">
          <div className="max-w-xl text-white">
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/85">
              OKE-ADO, IBADAN · NATIONWIDE INSTALLATION
            </p>
            <h1 className="font-serif-display text-[44px] md:text-[54px] mt-2">
              Showroom &amp; Workshop
            </h1>
            <p className="text-[13px] text-white/90 leading-relaxed mt-3">
              Visit us at {OKART_CONTACT.address} to inspect custom upholstery, wood joinery, and active furniture commissions.
            </p>
          </div>
        </div>
      </section>

      {/* Filter Pills */}
      <section className="max-w-[1360px] mx-auto px-4 lg:px-10 pt-10">
        <div className="flex flex-wrap items-center gap-2.5 pb-6 border-b border-[#E1E0DD]">
          {[{ id: 'all', city: 'All Locations' }, ...SHOWROOMS].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedCity(item.id)}
              className={`px-5 py-2 rounded-full text-[11px] uppercase tracking-[0.14em] border cursor-pointer ${
                selectedCity === item.id
                  ? 'bg-[#EDE5D5] text-[#2B1E12] border-[#82674F] font-medium'
                  : 'bg-white text-[#1C1C1C] border-[#D5D4D3] hover:border-[#1C1C1C]'
              }`}
            >
              {item.city}
            </button>
          ))}
        </div>

        {/* Store Cards */}
        <div className="py-10 grid grid-cols-1 md:grid-cols-2 gap-8">
          {visibleStores.map((store) => (
            <article
              key={store.id}
              className="bg-white border border-[#E1E0DD] overflow-hidden flex flex-col"
            >
              <div className="aspect-[16/10] bg-[#E1E0DD] overflow-hidden">
                <img
                  src={store.image}
                  alt={`OKART Interiors ${store.city}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 md:p-8 flex-1 flex flex-col justify-between space-y-5">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-[#82674F]">
                    {store.country}
                  </p>
                  <h2 className="font-serif-display text-[32px] text-[#2B1E12] mt-1">
                    {store.city}
                  </h2>
                  <p className="text-[13px] text-[#4F3926] leading-relaxed mt-3">
                    {store.note}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#F0EFED] text-[12px] text-[#4F3926]">
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-[#82674F] shrink-0 mt-0.5" />
                      <span>
                        {store.address}
                        <br />
                        {store.postalCity}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-[#82674F] shrink-0" />
                      <span>{store.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-[#82674F] shrink-0" />
                      <span>{store.email}</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.14em] text-[#82674F] mb-2">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Opening hours</span>
                    </div>
                    <ul className="space-y-1">
                      {store.hours.map((h) => (
                        <li key={h.day} className="flex justify-between gap-2 text-[12px]">
                          <span>{h.day}</span>
                          <span className="tabular-nums text-[#1C1C1C]">{h.time}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Consultation Booking */}
        <section className="my-10 bg-[#EEE8DE] border border-[#E1E0DD] p-8 md:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-3">
            <p className="text-[10px] uppercase tracking-[0.18em] text-[#82674F]">
              Personal Design Advice
            </p>
            <h2 className="font-serif-display text-[32px] text-[#2B1E12]">
              Book a Showroom or Virtual Consultation
            </h2>
            <p className="text-[13px] text-[#4F3926] leading-relaxed">
              Our interior specialists assist with residential seating, bespoke kitchen cabinetry layouts, wood stains, and commercial or event specifications.
            </p>
          </div>

          <div className="lg:col-span-6">
            {booked ? (
              <div className="bg-white p-6 border border-[#D5D4D3] text-[13px] text-[#2B1E12]">
                Thank you, {bookingName}. Your consultation request for{' '}
                <strong>{bookingStore}</strong> has been logged—we will confirm your appointment shortly.
              </div>
            ) : (
              <form onSubmit={handleBooking} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  value={bookingName}
                  onChange={(e) => setBookingName(e.target.value)}
                  placeholder="Your name"
                  className="h-10 px-3.5 bg-white border border-[#D5D4D3] text-[13px]"
                />
                <input
                  type="email"
                  required
                  value={bookingEmail}
                  onChange={(e) => setBookingEmail(e.target.value)}
                  placeholder="Email address"
                  className="h-10 px-3.5 bg-white border border-[#D5D4D3] text-[13px]"
                />
                <select
                  value={bookingStore}
                  onChange={(e) => setBookingStore(e.target.value)}
                  className="h-10 px-3.5 bg-white border border-[#D5D4D3] text-[13px]"
                >
                  <option value="Ibadan Showroom (52 Liberty Stadium Road)">
                    Ibadan Showroom (Oke-Ado)
                  </option>
                  <option value="WhatsApp Video Consultation">WhatsApp Video Advice</option>
                  <option value="On-Site Measurement">On-Site Measurement Visit</option>
                </select>
                <input
                  type="date"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="h-10 px-3.5 bg-white border border-[#D5D4D3] text-[13px]"
                />
                <button
                  type="submit"
                  className="sm:col-span-2 py-3 rounded-full bg-[#EDE5D5] hover:bg-[#DFD2BC] border border-[#B9A78B] text-[#2B1E12] text-[11px] uppercase tracking-[0.16em] cursor-pointer"
                >
                  Book Consultation
                </button>
              </form>
            )}
          </div>
        </section>
      </section>

      <NewsletterSection />
    </div>
  );
}
