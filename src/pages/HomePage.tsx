import React, { useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import {
  BRAND_ASSETS,
  CATEGORY_CARDS,
  HOMEPAGE_BESTSELLER_HANDLES,
  HOMEPAGE_NEWS_HANDLES,
  PRESS_LOGOS,
  REAL_HOMES_GALLERY,
  TRUE_COST_PILLARS,
  type RealHomePost,
} from '../data/siteContent';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { RealHomesModal } from '../components/RealHomesModal';
import { GoogleReviewsSection } from '../components/GoogleReviewsSection';
import { NewsletterSection } from '../components/NewsletterSection';

export function HomePage() {
  const { navigate, getProductByHandle, products } = useStore();
  const [selectedHomePost, setSelectedHomePost] = useState<RealHomePost | null>(null);
  const [activeRealHomeDot, setActiveRealHomeDot] = useState(0);

  const catScrollRef = useRef<HTMLDivElement>(null);
  const bestsellerScrollRef = useRef<HTMLDivElement>(null);
  const realHomesScrollRef = useRef<HTMLDivElement>(null);
  const newsScrollRef = useRef<HTMLDivElement>(null);

  const bestsellerProducts = useMemo(() => {
    const matched = HOMEPAGE_BESTSELLER_HANDLES.map((h) => getProductByHandle(h)).filter(
      (p): p is NonNullable<typeof p> => Boolean(p)
    );
    return matched.length >= 4 ? matched : products.slice(0, 8);
  }, [getProductByHandle, products]);

  const newsProducts = useMemo(() => {
    const matched = HOMEPAGE_NEWS_HANDLES.map((h) => getProductByHandle(h)).filter(
      (p): p is NonNullable<typeof p> => Boolean(p)
    );
    return matched.length >= 4 ? matched : products.slice(8, 16);
  }, [getProductByHandle, products]);

  const scrollTrack = (ref: React.RefObject<HTMLDivElement | null>, dir: -1 | 1) => {
    if (!ref.current) return;
    const step = ref.current.clientWidth * 0.72;
    ref.current.scrollBy({ left: dir * step, behavior: 'smooth' });
  };

  return (
    <div className="bg-[#F6F5F3]">
      {/* 1. HERO BANNER */}
      <section className="relative w-full h-[540px] md:h-[680px] overflow-hidden bg-[#2B1E12]">
        <picture>
          <source media="(max-width: 767px)" srcSet={BRAND_ASSETS.heroMobile} />
          <img
            src={BRAND_ASSETS.heroDesktop}
            alt="OKART Interiors — Thoughtfully Designed, Beautifully Crafted Furniture & Spaces"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center"
          />
        </picture>
        <div className="absolute inset-0 bg-[#1C1C1C]/45 bg-gradient-to-b from-[#1C1C1C]/40 via-[#2B1E12]/45 to-[#1C1C1C]/55" />

        <div className="absolute inset-0 max-w-[1440px] mx-auto px-6 lg:px-14 flex items-center justify-center text-center">
          <div className="max-w-2xl mx-auto text-white flex flex-col items-center">
            <p className="text-[12px] md:text-[13px] tracking-[0.14em] uppercase text-white/90 mb-3">
              Custom Furniture Manufacturers · Ibadan, Nigeria
            </p>
            <h1 className="font-serif-display text-[48px] md:text-[64px] leading-[1.02] tracking-tight">
              OKART Interiors
            </h1>
            <p className="font-serif-display text-[28px] md:text-[38px] leading-[1.12] mt-2 text-white/95">
              Thoughtfully Designed. Beautifully Crafted.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 mt-7">
              <a
                href="/products"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/products');
                }}
                className="inline-block px-8 py-3.5 rounded-full bg-[#EDE5D5] hover:bg-[#DFD2BC] text-[#2B1E12] border border-[#C8B89F] text-[11px] uppercase tracking-[0.18em] transition-colors"
              >
                Explore Our Products
              </a>
              <a
                href="/pages/bespoke"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/pages/bespoke');
                }}
                className="inline-block px-7 py-3.5 rounded-full bg-white/90 hover:bg-white text-[#1C1C1C] text-[11px] uppercase tracking-[0.16em] transition-colors"
              >
                Bespoke Studio
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 2. USP TRUST STRIP */}
      <section className="w-full bg-[#EEE8DE] border-y border-[#E1E0DD]">
        <ul className="max-w-[1100px] mx-auto px-4 py-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <li className="flex items-center justify-center gap-2.5 text-[12px] tracking-[0.06em] text-[#2B1E12]">
            <svg aria-hidden="true" fill="none" strokeWidth="1.5" className="w-5 h-5" viewBox="0 0 24 24">
              <path
                clipRule="evenodd"
                d="M10.075 20.383a7.197 7.197 0 0 1-7.196-7.197c0-10.436 12.56-5.08 18.605-10.097a.445.445 0 0 1 .458-.046c.151.063.26.2.287.361 1.846 10.81-6.112 16.979-12.154 16.979Z"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12.954 11.262a23.872 23.872 0 0 0-8.226 4.095L1 18.539"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>In-House Workshop Craftsmanship</span>
          </li>
          <li className="flex items-center justify-center gap-2.5 text-[12px] tracking-[0.06em] text-[#2B1E12]">
            <svg aria-hidden="true" fill="none" strokeWidth="1.5" className="w-5 h-5" viewBox="0 0 24 24">
              <path
                d="M6 13.223 8.45 16.7a1.049 1.049 0 0 0 1.707.051L18 6.828"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                clipRule="evenodd"
                d="M12 23.249c6.213 0 11.25-5.037 11.25-11.25S18.213.749 12 .749.75 5.786.75 11.999 5.787 23.249 12 23.249Z"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>Right Price · Right Time · No Shortcuts</span>
          </li>
          <li className="flex items-center justify-center gap-2.5 text-[12px] tracking-[0.06em] text-[#2B1E12]">
            <svg aria-hidden="true" fill="none" strokeWidth="1.5" className="w-5 h-5" viewBox="0 0 24 24">
              <path
                d="M12 2.5l2.9 5.88 6.5.95-4.7 4.58 1.11 6.47L12 17.32l-5.81 3.06 1.11-6.47-4.7-4.58 6.5-.95L12 2.5Z"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>4.9 Verified Google Reviews</span>
          </li>
        </ul>
      </section>

      {/* 3. 7 PRODUCT CATEGORIES CAROUSEL */}
      <section className="relative w-full bg-[#F6F5F3]">
        <div
          ref={catScrollRef}
          className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory gap-1"
        >
          {CATEGORY_CARDS.map((cat) => (
            <a
              key={cat.id}
              href={cat.href}
              onClick={(e) => {
                e.preventDefault();
                navigate(cat.href);
              }}
              className="group relative flex-none w-[74%] sm:w-[44%] md:w-[30%] lg:w-[26.5%] aspect-[3/3.6] overflow-hidden snap-start bg-[#E1E0DD]"
            >
              <img
                src={cat.image}
                alt={cat.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#2B1E12]/55 via-[#2B1E12]/15 to-transparent" />
              <span
                className="absolute left-9 bottom-18 font-serif-display text-[28px] md:text-[34px] text-white tracking-tight leading-none origin-bottom-left -rotate-90 whitespace-nowrap drop-shadow-sm"
              >
                {cat.shortLabel}
              </span>
              <span className="absolute left-5 bottom-5 px-5 py-2 rounded-full bg-white text-[#1C1C1C] text-[10px] uppercase tracking-[0.16em] group-hover:bg-[#EDE5D5] group-hover:text-[#2B1E12] transition-colors">
                See more
              </span>
            </a>
          ))}
        </div>

        <button
          type="button"
          onClick={() => scrollTrack(catScrollRef, -1)}
          aria-label="Previous categories"
          className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 text-[#1C1C1C] items-center justify-center shadow hover:bg-white cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={() => scrollTrack(catScrollRef, 1)}
          aria-label="Next categories"
          className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 text-[#1C1C1C] items-center justify-center shadow hover:bg-white cursor-pointer"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </section>

      {/* 4. DISCIPLINES BAR */}
      <section className="w-full bg-[#F6F5F3] py-10 border-b border-[#E1E0DD]/70">
        <div className="max-w-[1320px] mx-auto px-6 flex flex-wrap items-center justify-around gap-8">
          {PRESS_LOGOS.map((item) => (
            <span
              key={item.name}
              className="font-serif-display text-[17px] md:text-[20px] tracking-[0.18em] text-[#4F3926]/80 uppercase"
            >
              {item.label}
            </span>
          ))}
        </div>
      </section>

      {/* 5. SIGNATURE PIECES & BESTSELLERS */}
      <section className="max-w-[1440px] mx-auto px-4 lg:px-8 py-12 md:py-14 relative">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] text-[#82674F]">
              OKART INTERIORS COLLECTION
            </p>
            <h2 className="font-serif-display text-[32px] md:text-[38px] text-[#2B1E12]">
              Signature Pieces &amp; Bestsellers
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scrollTrack(bestsellerScrollRef, -1)}
              aria-label="Previous bestsellers"
              className="w-9 h-9 rounded-full border border-[#D5D4D3] bg-white flex items-center justify-center text-[#1C1C1C] hover:border-[#1C1C1C] cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollTrack(bestsellerScrollRef, 1)}
              aria-label="Next bestsellers"
              className="w-9 h-9 rounded-full border border-[#D5D4D3] bg-white flex items-center justify-center text-[#1C1C1C] hover:border-[#1C1C1C] cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div
          ref={bestsellerScrollRef}
          className="flex gap-5 overflow-x-auto no-scrollbar snap-x snap-mandatory"
        >
          {bestsellerProducts.map((product) => (
            <div
              key={product.id}
              className="flex-none w-[78%] sm:w-[46%] lg:w-[23.8%] snap-start"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </section>

      {/* 6. DESIGNED FOR REAL SPACES */}
      <section className="max-w-[1440px] mx-auto px-4 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif-display text-[32px] md:text-[38px] text-[#2B1E12]">
            Designed for real spaces
          </h2>
          <a
            href="/pages/projects"
            onClick={(e) => {
              e.preventDefault();
              navigate('/pages/projects');
            }}
            className="text-[11px] uppercase tracking-[0.16em] text-[#4F3926] hover:text-[#1C1C1C] underline underline-offset-4"
          >
            Our Projects
          </a>
        </div>

        <div
          ref={realHomesScrollRef}
          onScroll={() => {
            if (!realHomesScrollRef.current) return;
            const { scrollLeft, scrollWidth, clientWidth } = realHomesScrollRef.current;
            const ratio = scrollWidth > clientWidth ? scrollLeft / (scrollWidth - clientWidth) : 0;
            setActiveRealHomeDot(Math.round(ratio * (REAL_HOMES_GALLERY.length - 1)));
          }}
          className="flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory"
        >
          {REAL_HOMES_GALLERY.map((post) => (
            <button
              key={post.id}
              type="button"
              onClick={() => setSelectedHomePost(post)}
              className="group flex-none w-[68%] sm:w-[38%] md:w-[28%] lg:w-[21%] text-left snap-start cursor-pointer"
            >
              <div className="aspect-[4/4.6] overflow-hidden bg-[#E1E0DD]">
                <img
                  src={post.image}
                  alt={`Interior installation ${post.handle}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
              </div>
              <p className="text-[11px] text-[#4F3926] mt-2">{post.handle}</p>
            </button>
          ))}
        </div>

        <div className="flex items-center justify-center gap-2 mt-5">
          {REAL_HOMES_GALLERY.map((post, idx) => (
            <button
              key={post.id}
              type="button"
              aria-label={`View space ${idx + 1}`}
              onClick={() => {
                setActiveRealHomeDot(idx);
                if (realHomesScrollRef.current) {
                  const targetLeft =
                    (realHomesScrollRef.current.scrollWidth / REAL_HOMES_GALLERY.length) * idx;
                  realHomesScrollRef.current.scrollTo({ left: targetLeft, behavior: 'smooth' });
                }
              }}
              className={`w-1.5 h-1.5 rounded-full transition-colors cursor-pointer ${
                activeRealHomeDot === idx ? 'bg-[#1C1C1C]' : 'bg-[#BFBCB4]'
              }`}
            />
          ))}
        </div>
      </section>

      {/* 7. NEW ARRIVALS & BESPOKE CAROUSEL */}
      <section className="max-w-[1440px] mx-auto px-4 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif-display text-[34px] md:text-[42px] text-[#2B1E12] tracking-wide">
            BESPOKE &amp; NEW
          </h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scrollTrack(newsScrollRef, -1)}
              aria-label="Previous new arrivals"
              className="w-9 h-9 rounded-full border border-[#D5D4D3] bg-white flex items-center justify-center text-[#1C1C1C] hover:border-[#1C1C1C] cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollTrack(newsScrollRef, 1)}
              aria-label="Next new arrivals"
              className="w-9 h-9 rounded-full border border-[#D5D4D3] bg-white flex items-center justify-center text-[#1C1C1C] hover:border-[#1C1C1C] cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div
          ref={newsScrollRef}
          className="flex gap-5 overflow-x-auto no-scrollbar snap-x snap-mandatory"
        >
          {newsProducts.map((product) => (
            <div
              key={product.id}
              className="flex-none w-[78%] sm:w-[46%] lg:w-[23.8%] snap-start"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </section>

      {/* 8. FOUR PILLARS: BRIEF, DESIGN, PRODUCTION, INSTALLATION */}
      <section className="max-w-[1360px] mx-auto px-4 lg:px-8 py-16 md:py-20">
        <div className="text-center mb-10">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#82674F]">
            BRIEF · DESIGN · PRODUCTION · INSTALLATION
          </p>
          <h2 className="font-serif-display text-[36px] md:text-[42px] text-[#2B1E12] mt-1">
            Our Craftsmanship Standard
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {TRUE_COST_PILLARS.map((pillar) => (
            <div key={pillar.title} className="text-center flex flex-col items-center">
              <div className="w-full aspect-square overflow-hidden bg-[#E1E0DD]">
                <img
                  src={pillar.image}
                  alt={pillar.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-serif-display text-[26px] md:text-[28px] text-[#2B1E12] mt-5 normal-case">
                {pillar.title}
              </h3>
              <p className="text-[12px] text-[#4F3926] leading-relaxed mt-2 max-w-sm">
                {pillar.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 9. VIDEO LANDING SHOWCASE BAND */}
      <section className="relative w-full h-[380px] md:h-[520px] overflow-hidden bg-[#2A3323]">
        <video
          autoPlay
          loop
          muted
          playsInline
          poster={BRAND_ASSETS.forestPoster}
          className="w-full h-full object-cover"
        >
          <source src={BRAND_ASSETS.forestVideo} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-[#2B1E12]/45 flex items-center justify-center text-center px-6">
          <div className="max-w-xl text-white">
            <p className="text-[10px] uppercase tracking-[0.22em] text-white/85">
              INSIDE THE OKART INTERIORS WORKSHOP
            </p>
            <h2 className="font-serif-display text-[38px] md:text-[48px] mt-2 leading-tight">
              Watch Our Craftsmanship Story
            </h2>
            <p className="text-[13px] text-white/90 mt-3 leading-relaxed">
              Experience how our artisans combine traditional joinery, upholstery, and modern precision from initial brief to final installation.
            </p>
            <button
              type="button"
              onClick={() => navigate('/pages/video')}
              className="mt-6 inline-flex items-center gap-2.5 px-7 py-3 rounded-full bg-white text-[#1C1C1C] hover:bg-[#EDE5D5] hover:text-[#2B1E12] text-[11px] uppercase tracking-[0.16em] transition-colors cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Open Video Landing Page</span>
            </button>
          </div>
        </div>
      </section>

      {/* 10. GOOGLE REVIEWS SECTION */}
      <GoogleReviewsSection />

      {/* 11. ABOUT US EDITORIAL STORY */}
      <section className="max-w-2xl mx-auto px-6 py-16 md:py-20 text-[#2B1E12]">
        <h2 className="font-serif-display text-[32px] md:text-[38px] leading-tight text-[#2B1E12]">
          Thoughtfully Designed. Beautifully Crafted. Expertly Delivered.
        </h2>
        <div className="mt-5 space-y-4 text-[13px] text-[#4F3926] leading-[1.75]">
          <p>
            At OKART Interiors, we believe that great interiors do more than fill a space; they create connections. Connections between people, their surroundings, and the creativity that transforms a space into something truly personal.
          </p>
          <p>
            Whether for residential, commercial, or hospitality environments, we design and produce bespoke furniture, cabinetry, and upholstery that bring our clients&apos; visions to life. Every project is approached with care, creativity, and attention to detail, combining contemporary design with timeless craftsmanship to create pieces that are as functional as they are beautiful.
          </p>
          <p>
            Our approach is built on four fundamental pillars: <strong>Brief, Design, Production, and Installation</strong>. Our mission is simple: the right furniture, at the right price, and at the right time. No shortcuts. No excuses.
          </p>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => navigate('/pages/about-us')}
            className="px-6 py-2.5 rounded-full bg-[#EDE5D5] hover:bg-[#DFD2BC] border border-[#B9A78B] text-[#2B1E12] text-[11px] uppercase tracking-[0.16em] cursor-pointer"
          >
            Read About OKART Interiors
          </button>
          <button
            type="button"
            onClick={() => navigate('/pages/contact')}
            className="px-6 py-2.5 rounded-full border border-[#2B1E12] text-[#2B1E12] hover:bg-white text-[11px] uppercase tracking-[0.16em] cursor-pointer"
          >
            Contact Showroom
          </button>
        </div>
      </section>

      {/* 13. STAY UPDATED NEWSLETTER */}
      <NewsletterSection />

      {/* REAL SPACES MODAL */}
      <RealHomesModal
        post={selectedHomePost}
        onClose={() => setSelectedHomePost(null)}
      />
    </div>
  );
}
