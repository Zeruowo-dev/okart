import React, { useMemo } from 'react';
import { ArrowLeft } from 'lucide-react';
import { BRAND_ASSETS } from '../data/siteContent';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { NewsletterSection } from '../components/NewsletterSection';

export function DesignersPage() {
  const { designers, navigate } = useStore();

  return (
    <div className="bg-[#F6F5F3]">
      <section className="relative h-[320px] md:h-[400px] overflow-hidden bg-[#2B1E12]">
        <img
          src={BRAND_ASSETS.designersBanner}
          alt="OKART Interiors Design Inspirations"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#2B1E12]/45 flex items-center justify-center text-center px-6">
          <div className="max-w-2xl text-white">
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/85">
              OKART INTERIORS STUDIO ARCHIVE
            </p>
            <h1 className="font-serif-display text-[42px] md:text-[52px] mt-2">
              Design &amp; Craft Inspirations
            </h1>
            <p className="text-[13px] text-white/90 mt-3 leading-relaxed">
              Architectural inspirations and studio signatures reflected across OKART Interiors’ bespoke seating, solid wood tables, and joinery.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-[1360px] mx-auto px-4 lg:px-10 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {designers.map((designer) => (
          <article
            key={designer.slug}
            className="bg-white border border-[#E1E0DD] overflow-hidden flex flex-col group"
          >
            <a
              href={`/blogs/designers/${designer.slug}`}
              onClick={(e) => {
                e.preventDefault();
                navigate(`/blogs/designers/${designer.slug}`);
              }}
              className="aspect-[4/4.6] overflow-hidden bg-[#E1E0DD]"
            >
              <img
                src={designer.image}
                alt={designer.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-[1.03]"
              />
            </a>
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <h2 className="font-serif-display text-[28px] text-[#2B1E12]">
                  {designer.name}
                </h2>
                <p className="text-[12px] text-[#4F3926] leading-relaxed mt-2 line-clamp-3">
                  {designer.paragraphs[0]}
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate(`/blogs/designers/${designer.slug}`)}
                className="self-start px-6 py-2 rounded-full bg-[#777859] hover:bg-[#676A52] text-white text-[10px] uppercase tracking-[0.16em] cursor-pointer"
              >
                Read more
              </button>
            </div>
          </article>
        ))}
      </section>

      <NewsletterSection />
    </div>
  );
}

export function DesignerDetailPage({ slug }: { slug: string }) {
  const { designers, products, navigate } = useStore();
  const designer = designers.find((d) => d.slug === slug) || designers[0];

  const designerProducts = useMemo(() => {
    const firstWord = designer.name.toLowerCase().split(' ')[0];
    const matched = products.filter(
      (p) =>
        p.designer.toLowerCase().includes(firstWord) ||
        p.description.toLowerCase().includes(firstWord)
    );
    return matched.length > 0 ? matched.slice(0, 8) : products.slice(0, 4);
  }, [designer.name, products]);

  return (
    <div className="bg-[#F6F5F3]">
      <div className="max-w-[1360px] mx-auto px-4 lg:px-10 pt-8 pb-16">
        <button
          type="button"
          onClick={() => navigate('/pages/designers')}
          className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.14em] text-[#82674F] hover:text-[#1C1C1C] mb-8 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>All inspirations</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-5 bg-[#E1E0DD] aspect-[4/4.8] overflow-hidden">
            <img
              src={designer.image}
              alt={designer.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover grayscale"
            />
          </div>

          <div className="lg:col-span-7 space-y-5">
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#82674F]">
              OKART INTERIORS STUDIO ARCHIVE
            </p>
            <h1 className="font-serif-display text-[42px] md:text-[52px] text-[#2B1E12] leading-tight">
              {designer.name}
            </h1>
            <div className="space-y-4 text-[14px] text-[#4F3926] leading-[1.75]">
              {designer.paragraphs.map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 pt-12 border-t border-[#E1E0DD]">
          <h2 className="font-serif-display text-[32px] text-[#2B1E12] mb-8">
            Related Furniture &amp; Editions
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {designerProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </div>

      <NewsletterSection />
    </div>
  );
}
