import React, { useMemo, useState } from 'react';
import { ArrowRight, Check, Play } from 'lucide-react';
import {
  BRAND_ASSETS,
  OKART_CONTACT,
  OKART_PILLARS,
  OKART_PROJECTS,
  OKART_SERVICES,
} from '../data/siteContent';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { GoogleReviewsSection } from '../components/GoogleReviewsSection';
import { NewsletterSection } from '../components/NewsletterSection';

export function SignUpPage() {
  const { signUpAccount, userAccount, navigate } = useStore();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [clientType, setClientType] = useState('Homeowner / Private Client');
  const [password, setPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!phone.trim()) {
      setError('Please provide a phone or WhatsApp number.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (!acceptedTerms) {
      setError('Please accept our Terms & Conditions to create an account.');
      return;
    }
    setError('');
    signUpAccount({
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      clientType,
    });
    navigate('/account');
  };

  return (
    <div className="bg-[#F6F5F3] min-h-screen py-14 px-4">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 bg-white border border-[#E1E0DD] overflow-hidden">
        <div className="lg:col-span-5 relative min-h-[280px] bg-[#2B1E12] text-white p-8 flex flex-col justify-between">
          <img
            src={BRAND_ASSETS.showroomsBanner}
            alt="OKART Interiors Client Universe"
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover opacity-40"
          />
          <div className="relative z-10">
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/80">
              OKART INTERIORS CLIENT PORTAL
            </p>
            <h1 className="font-serif-display text-[38px] leading-tight mt-2">
              Create Your Client Account
            </h1>
            <p className="text-[13px] text-white/85 mt-3 leading-relaxed">
              Save furniture designs, track bespoke workshop quotations, manage kitchen cabinetry briefs, and schedule consultations with our Ibadan studio.
            </p>
          </div>
          <div className="relative z-10 pt-6 border-t border-white/20 text-[12px] text-white/80">
            Direct Assistance: {OKART_CONTACT.phone} · {OKART_CONTACT.email}
          </div>
        </div>

        <div className="lg:col-span-7 p-8 md:p-12">
          {userAccount ? (
            <div className="space-y-4 py-8">
              <p className="text-[10px] uppercase tracking-[0.18em] text-[#777859]">
                Signed In
              </p>
              <h2 className="font-serif-display text-[32px] text-[#2B1E12]">
                Welcome back, {userAccount.fullName}
              </h2>
              <p className="text-[13px] text-[#4F3926]">
                Registered as <strong>{userAccount.clientType}</strong> ({userAccount.email}).
              </p>
              <button
                type="button"
                onClick={() => navigate('/account')}
                className="px-7 py-3 rounded-full bg-[#EDE5D5] border border-[#B9A78B] text-[#2B1E12] text-[11px] uppercase tracking-[0.16em] cursor-pointer"
              >
                Go to My Account
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div>
                <p className="text-[10px] uppercase tracking-[0.18em] text-[#82674F]">
                  SIGN UP
                </p>
                <h2 className="font-serif-display text-[30px] text-[#2B1E12] mt-1">
                  Join OKART Interiors
                </h2>
              </div>

              <div className="space-y-3">
                <div>
                  <label htmlFor="signup-name" className="block text-[11px] uppercase tracking-[0.1em] text-[#4F3926] mb-1">
                    Full Name
                  </label>
                  <input
                    id="signup-name"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Adebayo Ogunleye"
                    className="w-full h-11 px-3.5 bg-[#F6F5F3] border border-[#D5D4D3] text-[13px] focus:outline-none focus:border-[#82674F]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="signup-email" className="block text-[11px] uppercase tracking-[0.1em] text-[#4F3926] mb-1">
                      Email Address
                    </label>
                    <input
                      id="signup-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full h-11 px-3.5 bg-[#F6F5F3] border border-[#D5D4D3] text-[13px] focus:outline-none focus:border-[#82674F]"
                    />
                  </div>
                  <div>
                    <label htmlFor="signup-phone" className="block text-[11px] uppercase tracking-[0.1em] text-[#4F3926] mb-1">
                      Phone / WhatsApp
                    </label>
                    <input
                      id="signup-phone"
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0909 000 0000"
                      className="w-full h-11 px-3.5 bg-[#F6F5F3] border border-[#D5D4D3] text-[13px] focus:outline-none focus:border-[#82674F]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="signup-role" className="block text-[11px] uppercase tracking-[0.1em] text-[#4F3926] mb-1">
                      Client Profile
                    </label>
                    <select
                      id="signup-role"
                      value={clientType}
                      onChange={(e) => setClientType(e.target.value)}
                      className="w-full h-11 px-3.5 bg-[#F6F5F3] border border-[#D5D4D3] text-[13px] focus:outline-none focus:border-[#82674F]"
                    >
                      <option value="Homeowner / Private Client">Homeowner / Private Client</option>
                      <option value="Interior Designer / Architect">Interior Designer / Architect</option>
                      <option value="Corporate / Commercial Buyer">Corporate / Commercial Buyer</option>
                      <option value="Hospitality / Event Planner">Hospitality / Event Planner</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="signup-password" className="block text-[11px] uppercase tracking-[0.1em] text-[#4F3926] mb-1">
                      Create Password
                    </label>
                    <input
                      id="signup-password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      className="w-full h-11 px-3.5 bg-[#F6F5F3] border border-[#D5D4D3] text-[13px] focus:outline-none focus:border-[#82674F]"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  id="signup-terms"
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="w-4 h-4 accent-[#82674F] cursor-pointer"
                />
                <label htmlFor="signup-terms" className="text-[12px] text-[#4F3926] cursor-pointer">
                  I agree to the{' '}
                  <a
                    href="/pages/terms-and-conditions"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate('/pages/terms-and-conditions');
                    }}
                    className="underline text-[#82674F] hover:text-[#2B1E12]"
                  >
                    Terms &amp; Conditions
                  </a>{' '}
                  of OKART Interiors.
                </label>
              </div>

              {error && (
                <p role="alert" className="text-[12px] text-[#8E5235]">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="w-full py-3.5 rounded-full bg-[#EDE5D5] hover:bg-[#DFD2BC] border border-[#B9A78B] text-[#2B1E12] text-[11px] uppercase tracking-[0.18em] transition-colors cursor-pointer"
              >
                Create Account
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export function ServicesPage() {
  const { navigate } = useStore();

  return (
    <div className="bg-[#F6F5F3]">
      <section className="relative h-[320px] md:h-[420px] overflow-hidden bg-[#2B1E12]">
        <img
          src={BRAND_ASSETS.conceptBanner}
          alt="OKART Interiors Services"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#2B1E12]/50 flex items-center justify-center text-center px-6">
          <div className="max-w-2xl text-white">
            <p className="text-[10px] uppercase tracking-[0.22em] text-white/85">
              BRIEF · DESIGN · PRODUCTION · INSTALLATION
            </p>
            <h1 className="font-serif-display text-[42px] md:text-[54px] mt-2">
              Our Services
            </h1>
            <p className="text-[13px] text-white/90 mt-3 leading-relaxed">
              From custom-made furniture, kitchen cabinetry, and upholstery to residential, commercial, hospitality, and event interior installations.
            </p>
          </div>
        </div>
      </section>

      {/* 4 Pillars */}
      <section className="max-w-[1360px] mx-auto px-4 lg:px-10 py-14">
        <div className="text-center max-w-xl mx-auto mb-10">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#82674F]">
            OUR FOUR FUNDAMENTAL PILLARS
          </p>
          <h2 className="font-serif-display text-[36px] text-[#2B1E12] mt-1">
            Quality at Every Stage
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {OKART_PILLARS.map((p) => (
            <div key={p.step} className="bg-white border border-[#E1E0DD] p-6 space-y-3">
              <span className="font-serif-display text-[32px] text-[#82674F]">{p.step}</span>
              <h3 className="font-serif-display text-[26px] text-[#2B1E12]">{p.title}</h3>
              <p className="text-[13px] text-[#4F3926] leading-relaxed">{p.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Detailed Service Offerings */}
      <section className="max-w-[1360px] mx-auto px-4 lg:px-10 pb-16 space-y-8">
        {OKART_SERVICES.map((srv, idx) => (
          <div
            key={srv.id}
            className="bg-white border border-[#E1E0DD] grid grid-cols-1 lg:grid-cols-12 items-stretch"
          >
            <div
              className={`lg:col-span-5 bg-[#ECEBE8] min-h-[280px] overflow-hidden ${
                idx % 2 === 1 ? 'lg:order-2' : ''
              }`}
            >
              <img
                src={srv.image}
                alt={srv.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="lg:col-span-7 p-8 md:p-12 flex flex-col justify-center space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-[10px] uppercase tracking-[0.18em] text-[#82674F]">
                  0{idx + 1} · SERVICE OFFERING
                </p>
                <span className="px-3.5 py-1 bg-[#EDE5D5] border border-[#C8B89F] text-[11px] font-medium text-[#2B1E12] tabular-nums">
                  {srv.priceRange}
                </span>
              </div>
              <h2 className="font-serif-display text-[32px] text-[#2B1E12] leading-tight">
                {srv.title}
              </h2>
              <p className="text-[13px] text-[#4F3926] leading-relaxed">{srv.summary}</p>
              <div className="bg-[#F6F5F3] border border-[#E1E0DD] p-4 space-y-2">
                <p className="text-[10px] uppercase tracking-[0.16em] text-[#82674F]">
                  Nigerian Interior Investment Guide (NGN)
                </p>
                <div className="space-y-1.5">
                  {srv.pricingTiers.map((tier) => (
                    <div
                      key={tier.scope}
                      className="flex flex-wrap items-baseline justify-between gap-2 text-[12px] border-b border-[#E1E0DD]/70 pb-1 last:border-b-0 last:pb-0"
                    >
                      <span className="text-[#4F3926]">{tier.scope}</span>
                      <span className="font-medium text-[#1C1C1C] tabular-nums">{tier.price}</span>
                    </div>
                  ))}
                </div>
              </div>
              <ul className="space-y-1.5 pt-1">
                {srv.deliverables.map((d) => (
                  <li key={d} className="flex items-center gap-2 text-[12px] text-[#2B1E12]">
                    <Check className="w-3.5 h-3.5 text-[#777859]" />
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-3 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => navigate(srv.href)}
                  className="px-6 py-2.5 rounded-full bg-[#EDE5D5] hover:bg-[#DFD2BC] border border-[#B9A78B] text-[#2B1E12] text-[11px] uppercase tracking-[0.14em] cursor-pointer"
                >
                  Explore Service
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/pages/contact')}
                  className="px-6 py-2.5 rounded-full border border-[#D5D4D3] text-[#1C1C1C] hover:border-[#1C1C1C] text-[11px] uppercase tracking-[0.14em] cursor-pointer"
                >
                  Request Quotation
                </button>
              </div>
            </div>
          </div>
        ))}
      </section>

      <GoogleReviewsSection />
      <NewsletterSection />
    </div>
  );
}

export function ProjectsPage() {
  const { navigate, getProductByHandle } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Residential', 'Commercial', 'Hospitality', 'Events'];
  const visibleProjects =
    selectedCategory === 'All'
      ? OKART_PROJECTS
      : OKART_PROJECTS.filter((p) => p.category === selectedCategory);

  return (
    <div className="bg-[#F6F5F3]">
      <section className="relative h-[320px] md:h-[420px] overflow-hidden bg-[#2B1E12]">
        <img
          src={BRAND_ASSETS.shopLookRoom}
          alt="OKART Interiors Completed Projects"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#2B1E12]/50 flex items-center justify-center text-center px-6">
          <div className="max-w-2xl text-white">
            <p className="text-[10px] uppercase tracking-[0.22em] text-white/85">
              PORTFOLIO · INTERIOR PROJECTS
            </p>
            <h1 className="font-serif-display text-[42px] md:text-[54px] mt-2">
              Our Projects
            </h1>
            <p className="text-[13px] text-white/90 mt-3 leading-relaxed">
              Spaces that inspire, connect, and endure—across private residences, executive offices, boutique dining rooms, and architectural events.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-[1360px] mx-auto px-4 lg:px-10 py-12">
        <div className="flex flex-wrap items-center gap-2.5 pb-6 border-b border-[#E1E0DD]">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 rounded-full text-[11px] uppercase tracking-[0.14em] border cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#EDE5D5] text-[#2B1E12] border-[#82674F] font-medium'
                  : 'bg-white text-[#1C1C1C] border-[#D5D4D3] hover:border-[#1C1C1C]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="py-10 grid grid-cols-1 md:grid-cols-2 gap-8">
          {visibleProjects.map((project) => (
            <article
              key={project.id}
              className="bg-white border border-[#E1E0DD] overflow-hidden flex flex-col"
            >
              <div className="aspect-[16/10] bg-[#E1E0DD] overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 md:p-8 flex-1 flex flex-col justify-between space-y-5">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-[#82674F]">
                    {project.category} · {project.location}
                  </p>
                  <h2 className="font-serif-display text-[30px] text-[#2B1E12] mt-1">
                    {project.title}
                  </h2>
                  <p className="text-[12px] text-[#777859] mt-1">{project.scope}</p>
                  <p className="text-[13px] text-[#4F3926] leading-relaxed mt-3">
                    {project.summary}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#F0EFED] flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-2">
                    {project.featuredHandles.map((h) => {
                      const prod = getProductByHandle(h);
                      if (!prod) return null;
                      return (
                        <button
                          key={h}
                          type="button"
                          onClick={() => navigate(`/products/${prod.handle}`)}
                          className="text-[11px] underline text-[#82674F] hover:text-[#1C1C1C] cursor-pointer"
                        >
                          {prod.model}
                        </button>
                      );
                    })}
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate('/pages/contact')}
                    className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.14em] text-[#1C1C1C] hover:text-[#82674F] cursor-pointer"
                  >
                    <span>Discuss a similar project</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <GoogleReviewsSection />
      <NewsletterSection />
    </div>
  );
}

export function VideoLandingPage() {
  const { navigate } = useStore();
  const [selectedChapter, setSelectedChapter] = useState(0);

  const chapters = [
    {
      title: '01. Timber Selection & Joinery',
      desc: 'Seasoned hardwood framing and precision dowelled joinery built in our Oke-Ado workshop.',
    },
    {
      title: '02. Deep Button Tufting & Upholstery',
      desc: 'Hand-pleated rich hides, brass nailhead trim, and curved sofa tailoring performed by master upholsterers.',
    },
    {
      title: '03. Bespoke Kitchen Cabinetry',
      desc: 'Precision-cut millwork fitted on site for residential kitchens, wardrobes, and corporate spaces.',
    },
    {
      title: '04. Seamless Client Installation',
      desc: 'Final inspection, white-glove delivery, and placement—right furniture, right price, right time.',
    },
  ];

  return (
    <div className="bg-[#F6F5F3]">
      <section className="w-full bg-[#2B1E12] text-white border-b border-[#4F3926]">
        <div className="max-w-[1360px] mx-auto px-4 lg:px-10 py-10 md:py-14 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-6 space-y-5">
            <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-white/80">
              <Play className="w-3 h-3 fill-current" />
              <span>OKART INTERIORS FILM · IBADAN &amp; LAGOS</span>
            </div>
            <h1 className="font-serif-display text-[40px] md:text-[54px] leading-[1.06]">
              Crafted Without Shortcuts
            </h1>
            <p className="text-[14px] text-white/85 leading-relaxed max-w-lg">
              Step inside a finished OKART Interiors residence—featuring custom curved seating, sculpted dining silhouettes, architectural wall panelling, and bespoke installation crafted for Nigerian luxury living.
            </p>
            <div className="pt-2 grid grid-cols-2 gap-4 max-w-md border-t border-white/15">
              <div>
                <p className="text-[10px] uppercase tracking-[0.16em] text-white/65">
                  Active Stage
                </p>
                <p className="font-serif-display text-[19px] text-white mt-0.5">
                  {chapters[selectedChapter]?.title}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.16em] text-white/65">
                  Location
                </p>
                <p className="font-serif-display text-[19px] text-white mt-0.5">
                  Oke-Ado, Ibadan
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate('/products')}
                className="px-7 py-3 rounded-full bg-[#EDE5D5] hover:bg-[#DFD2BC] text-[#2B1E12] text-[11px] uppercase tracking-[0.16em] cursor-pointer"
              >
                Explore Products
              </button>
              <button
                type="button"
                onClick={() => navigate('/pages/services')}
                className="px-7 py-3 rounded-full border border-white/40 hover:border-white text-white text-[11px] uppercase tracking-[0.16em] cursor-pointer"
              >
                View Service Pricing (₦)
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 flex justify-center">
            <div className="w-full max-w-[380px] aspect-[9/16] bg-[#1C1C1C] border border-white/15 shadow-2xl overflow-hidden">
              <video
                autoPlay
                loop
                muted
                playsInline
                controls
                poster={BRAND_ASSETS.forestPoster}
                className="w-full h-full object-cover"
              >
                <source src={BRAND_ASSETS.forestVideo} type="video/mp4" />
              </video>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-[1360px] mx-auto px-4 lg:px-10 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {chapters.map((ch, idx) => (
            <button
              key={ch.title}
              type="button"
              onClick={() => setSelectedChapter(idx)}
              className={`text-left p-6 border transition-colors cursor-pointer ${
                selectedChapter === idx
                  ? 'bg-[#EDE5D5] text-[#2B1E12] border-[#82674F]'
                  : 'bg-white text-[#1C1C1C] border-[#E1E0DD] hover:border-[#82674F]'
              }`}
            >
              <h2
                className="font-serif-display text-[22px] text-[#2B1E12]"
              >
                {ch.title}
              </h2>
              <p
                className="text-[12px] mt-2 leading-relaxed text-[#4F3926]"
              >
                {ch.desc}
              </p>
            </button>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => navigate('/products')}
            className="px-8 py-3.5 rounded-full bg-[#EDE5D5] hover:bg-[#DFD2BC] border border-[#B9A78B] text-[#2B1E12] text-[11px] uppercase tracking-[0.16em] cursor-pointer"
          >
            Browse Our Products
          </button>
          <button
            type="button"
            onClick={() => navigate('/pages/bespoke')}
            className="px-8 py-3.5 rounded-full bg-[#777859] hover:bg-[#676A52] text-white text-[11px] uppercase tracking-[0.16em] cursor-pointer"
          >
            Commission a Bespoke Piece
          </button>
        </div>
      </section>

      <NewsletterSection />
    </div>
  );
}

export function BespokePage() {
  const { products, navigate, submitQuoteRequest, userAccount } = useStore();
  const [name, setName] = useState(userAccount?.fullName || '');
  const [phone, setPhone] = useState(userAccount?.phone || '');
  const [email, setEmail] = useState(userAccount?.email || '');
  const [category, setCategory] = useState('Kitchen Cabinetry & Bespoke Furniture');
  const [brief, setBrief] = useState('');
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  const bespokeFeatured = useMemo(
    () =>
      products.filter((p) => p.priceOnRequest).concat(products.slice(2, 6)).slice(0, 4),
    [products]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !brief.trim()) return;
    const record = submitQuoteRequest({
      productTitle: `Bespoke Commission (${category})`,
      variantTitle: 'Custom Made-to-Order Specification',
      customerName: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      notes: brief.trim(),
    });
    setSubmittedRef(record.id);
  };

  return (
    <div className="bg-[#F6F5F3]">
      <section className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 bg-[#EEE8DE] border-b border-[#E1E0DD]">
        <div className="lg:col-span-6 p-8 md:p-16 flex flex-col justify-center space-y-4">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#82674F]">
            BESPOKE FURNITURE &amp; CABINETRY STUDIO
          </p>
          <h1 className="font-serif-display text-[40px] md:text-[50px] text-[#2B1E12] leading-tight">
            Tailored to Your Space, Taste &amp; Budget
          </h1>
          <p className="text-[13px] text-[#4F3926] leading-relaxed">
            Whether commissioning bespoke curved sofas, button-tufted dining suites, or custom kitchen cabinetry, our in-house Ibadan production workshop builds each piece strictly to your brief.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate('/pages/planner')}
              className="px-7 py-3 rounded-full bg-[#EDE5D5] hover:bg-[#DFD2BC] border border-[#B9A78B] text-[#2B1E12] text-[11px] uppercase tracking-[0.16em] cursor-pointer"
            >
              Launch Modular Sofa Planner
            </button>
            <a
              href={OKART_CONTACT.whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="px-7 py-3 rounded-full border border-[#2B1E12] text-[#2B1E12] hover:bg-white text-[11px] uppercase tracking-[0.16em]"
            >
              WhatsApp {OKART_CONTACT.phone}
            </a>
          </div>
        </div>
        <div className="lg:col-span-6 bg-[#ECEBE8] min-h-[340px] flex items-center justify-center p-6">
          <img
            src={BRAND_ASSETS.savannahSofa}
            alt="Bespoke Curved Sofa by OKART Interiors"
            className="w-full max-h-[420px] object-contain"
          />
        </div>
      </section>

      {/* Featured Bespoke Editions */}
      <section className="max-w-[1360px] mx-auto px-4 lg:px-10 py-14">
        <h2 className="font-serif-display text-[32px] text-[#2B1E12] mb-6">
          Signature Bespoke Editions
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {bespokeFeatured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Bespoke Brief Submission Form */}
      <section className="max-w-3xl mx-auto px-6 pb-16">
        <div className="bg-white border border-[#E1E0DD] p-8 md:p-10 space-y-5">
          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] text-[#82674F]">
              STEP 01 · SUBMIT YOUR BRIEF
            </p>
            <h2 className="font-serif-display text-[32px] text-[#2B1E12] mt-1">
              Commission Custom Furniture or Kitchen Cabinetry
            </h2>
          </div>

          {submittedRef ? (
            <div className="bg-[#EEE8DE] p-6 border border-[#D5D4D3] space-y-3 text-[13px] text-[#2B1E12]">
              <p>
                Thank you, <strong>{name}</strong>. Your bespoke project brief ({submittedRef}) has been logged.
              </p>
              <button
                type="button"
                onClick={() => navigate('/account')}
                className="px-6 py-2.5 rounded-full bg-[#EDE5D5] border border-[#B9A78B] text-[#2B1E12] text-[11px] uppercase tracking-[0.14em] cursor-pointer"
              >
                View Quote Status in Account
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full name"
                  className="h-11 px-3.5 border border-[#D5D4D3] text-[13px]"
                />
                <input
                  required
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Phone / WhatsApp number"
                  className="h-11 px-3.5 border border-[#D5D4D3] text-[13px]"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  className="h-11 px-3.5 border border-[#D5D4D3] text-[13px]"
                />
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="h-11 px-3.5 border border-[#D5D4D3] text-[13px]"
                >
                  <option value="Kitchen Cabinetry & Bespoke Furniture">
                    Kitchen Cabinetry &amp; Bespoke Furniture
                  </option>
                  <option value="Sofas & Lounge Seating">Sofas &amp; Lounge Seating</option>
                  <option value="Dining Furniture">Dining Furniture</option>
                  <option value="Bed & Bedroom Furniture">Bed &amp; Bedroom Furniture</option>
                  <option value="Office and Commercial Furniture">Office &amp; Commercial</option>
                  <option value="Events Furniture">Events Furniture</option>
                </select>
              </div>
              <textarea
                required
                rows={4}
                value={brief}
                onChange={(e) => setBrief(e.target.value)}
                placeholder="Describe desired dimensions, room location, preferred upholstery/wood finish, and target timeline..."
                className="w-full p-3.5 border border-[#D5D4D3] text-[13px]"
              />
              <button
                type="submit"
                className="w-full py-3.5 rounded-full bg-[#EDE5D5] hover:bg-[#DFD2BC] border border-[#B9A78B] text-[#2B1E12] text-[11px] uppercase tracking-[0.18em] cursor-pointer"
              >
                Submit Bespoke Brief
              </button>
            </form>
          )}
        </div>
      </section>

      <NewsletterSection />
    </div>
  );
}
