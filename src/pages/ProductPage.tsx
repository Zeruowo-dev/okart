import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Heart,
  MessageCircle,
  RotateCw,
  X,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { BRAND_ASSETS, FABRIC_COLLECTIONS, OKART_CONTACT } from '../data/siteContent';
import { ProductCard } from '../components/ProductCard';
import { NewsletterSection } from '../components/NewsletterSection';
import {
  getDeliveryEstimate,
  getSwatchVisual,
} from '../utils/storeLogic';

interface ProductPageProps {
  handle: string;
}

export function ProductPage({ handle }: ProductPageProps) {
  const {
    getProductByHandle,
    products,
    designers,
    navigate,
    addToCart,
    wishlist,
    toggleWishlist,
    submitQuoteRequest,
    userAccount,
  } = useStore();

  const product = getProductByHandle(handle) || products[0];

  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [swatchesModalOpen, setSwatchesModalOpen] = useState(false);
  const [arModalOpen, setArModalOpen] = useState(false);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<'desc' | 'specs' | null>('desc');
  const [lookHotspotIdx, setLookHotspotIdx] = useState(0);

  const [quoteName, setQuoteName] = useState(userAccount?.fullName || '');
  const [quotePhone, setQuotePhone] = useState(userAccount?.phone || '');
  const [quoteEmail, setQuoteEmail] = useState(userAccount?.email || '');
  const [quoteNotes, setQuoteNotes] = useState('');
  const [quoteSubmittedId, setQuoteSubmittedId] = useState<string | null>(null);

  const activeVariant = product.variants[selectedVariantIdx] || product.variants[0];

  const gallery = useMemo(() => {
    const imgs = [...product.images].filter(Boolean);
    if (activeVariant?.image && !imgs.includes(activeVariant.image)) {
      imgs.unshift(activeVariant.image);
    }
    return imgs.length > 0 ? imgs : [BRAND_ASSETS.designOwnSofaInsert];
  }, [product.images, activeVariant]);

  const currentImage =
    selectedVariantIdx > 0 && activeVariant?.image
      ? activeVariant.image
      : gallery[activeImageIdx % gallery.length];

  const goesWellWith = useMemo(() => {
    const preferredHandles = [
      'the-heritage-dining-chair',
      'the-savannah-curved-sofa',
      'holmen-round-dining-table-oak',
      'base-tray-xl-oaktray',
      'umi-oak-bench-small',
    ];
    const items = preferredHandles
      .map((h) => getProductByHandle(h))
      .filter((p): p is NonNullable<typeof p> => Boolean(p))
      .filter((p) => p.handle !== product.handle);
    return items.length > 0 ? items : products.slice(0, 4);
  }, [getProductByHandle, product.handle, products]);

  const designerProfile = useMemo(() => {
    if (!product.designer) return designers[0];
    return (
      designers.find((d) =>
        product.designer.toLowerCase().includes(d.name.toLowerCase().split(' ')[0])
      ) || designers[0]
    );
  }, [designers, product.designer]);

  const shopTheLookProducts = useMemo(() => {
    const handles = [
      'the-heritage-dining-chair',
      'the-savannah-curved-sofa',
      'holmen-round-dining-table-oak',
      'eik-oak-bookcase-large-150x60cm',
    ];
    return handles
      .map((h) => getProductByHandle(h))
      .filter((p): p is NonNullable<typeof p> => Boolean(p));
  }, [getProductByHandle]);

  const isSaved = wishlist.includes(product.handle);

  const handleQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quoteName.trim() || !quotePhone.trim()) return;
    const record = submitQuoteRequest({
      productTitle: product.model,
      variantTitle: activeVariant?.title || 'Standard Finish',
      customerName: quoteName.trim(),
      phone: quotePhone.trim(),
      email: quoteEmail.trim(),
      notes: quoteNotes.trim(),
    });
    setQuoteSubmittedId(record.id);
  };

  return (
    <div className="bg-[#F6F5F3]">
      {/* Breadcrumb */}
      <div className="max-w-[1440px] mx-auto px-4 lg:px-10 pt-5 pb-3">
        <button
          type="button"
          onClick={() => navigate('/products')}
          className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.12em] text-[#82674F] hover:text-[#1C1C1C] cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Our Products</span>
        </button>
      </div>

      {/* Main Split PDP Section */}
      <section className="max-w-[1440px] mx-auto px-4 lg:px-10 pb-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Column: Gallery / 360° Viewer */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative bg-[#ECEBE8] aspect-square max-h-[620px] w-full flex items-center justify-center overflow-hidden">
            <button
              type="button"
              onClick={() => setArModalOpen(true)}
              className="absolute top-4 left-4 z-10 px-4 py-1.5 rounded-full bg-white/90 text-[#1C1C1C] text-[10px] uppercase tracking-[0.14em] border border-[#D5D4D3] hover:bg-white cursor-pointer"
            >
              View in Your Space
            </button>

            <img
              src={currentImage}
              alt={product.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain p-8 transition-all duration-300 mix-blend-multiply"
            />

            {gallery.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedVariantIdx(0);
                    setActiveImageIdx((prev) => (prev - 1 + gallery.length) % gallery.length);
                  }}
                  aria-label="Previous product view"
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center text-[#1C1C1C] shadow-sm cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedVariantIdx(0);
                    setActiveImageIdx((prev) => (prev + 1) % gallery.length);
                  }}
                  aria-label="Next product view"
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center text-[#1C1C1C] shadow-sm cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}
          </div>

          <div className="flex items-center justify-center gap-2.5 overflow-x-auto py-1">
            {gallery.map((img, i) => (
              <button
                key={img + i}
                type="button"
                onClick={() => {
                  setSelectedVariantIdx(0);
                  setActiveImageIdx(i);
                }}
                aria-label={`View angle ${i + 1}`}
                className={`w-14 h-14 bg-[#ECEBE8] p-1 border transition-colors shrink-0 cursor-pointer ${
                  activeImageIdx === i && selectedVariantIdx === 0
                    ? 'border-[#1C1C1C]'
                    : 'border-transparent hover:border-[#BFBCB4]'
                }`}
              >
                <img
                  src={img}
                  alt=""
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain"
                />
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                setSelectedVariantIdx(0);
                setActiveImageIdx((prev) => (prev + 1) % gallery.length);
              }}
              aria-label="Rotate 360 view"
              className="w-14 h-14 bg-[#ECEBE8] border border-[#D5D4D3] flex flex-col items-center justify-center text-[#4F3926] hover:border-[#1C1C1C] shrink-0 cursor-pointer"
            >
              <RotateCw className="w-4 h-4" />
              <span className="text-[9px] mt-0.5">360°</span>
            </button>
          </div>
        </div>

        {/* Right Column: Purchase / Bespoke Quote Module */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          <div className="space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.18em] text-[#82674F] mb-1">
                  {product.productType || 'OKART Interiors Collection'}
                </p>
                <h1 className="font-serif-display text-[36px] md:text-[42px] text-[#2B1E12] leading-none">
                  {product.model}
                </h1>
                {product.subtitle && (
                  <p className="text-[14px] text-[#4F3926] mt-1.5">{product.subtitle}</p>
                )}
              </div>

              <button
                type="button"
                onClick={() => toggleWishlist(product.handle)}
                aria-label={isSaved ? 'Remove from saved pieces' : 'Save design'}
                className="p-2.5 rounded-full border border-[#D5D4D3] bg-white text-[#1C1C1C] hover:border-[#82674F] cursor-pointer"
              >
                <Heart
                  className={`w-4 h-4 ${isSaved ? 'fill-[#82674F] text-[#82674F]' : ''}`}
                />
              </button>
            </div>

            {/* Upholstery / Finish Picker */}
            <div className="pt-3 border-t border-[#E1E0DD]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] uppercase tracking-[0.14em] text-[#82674F]">
                  {product.options[0]?.name || 'Select upholstery & timber'}
                </span>
                <button
                  type="button"
                  onClick={() => navigate('/pages/fabric-types-and-colors')}
                  className="text-[11px] underline text-[#4F3926] hover:text-[#1C1C1C] cursor-pointer"
                >
                  Order fabric samples
                </button>
              </div>

              <div className="flex items-center justify-between bg-white border border-[#D5D4D3] px-3.5 py-2.5 mb-3">
                <span className="text-[12px] text-[#1C1C1C]">
                  {activeVariant?.title || 'Custom Finish'}
                </span>
                <span className="text-[10px] uppercase tracking-[0.12em] text-[#82674F]">
                  {getSwatchVisual(activeVariant?.title || '').materialFamily}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {product.variants.slice(0, 8).map((v, idx) => {
                  const swatch = getSwatchVisual(v.title);
                  const active = idx === selectedVariantIdx;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      title={v.title}
                      aria-label={v.title}
                      onClick={() => setSelectedVariantIdx(idx)}
                      className={`w-7 h-7 rounded-full border transition-transform cursor-pointer ${
                        active
                          ? 'border-[#1C1C1C] scale-110 ring-2 ring-[#1C1C1C]/25 ring-offset-2'
                          : 'border-[#D5D4D3] hover:scale-105'
                      }`}
                      style={{ backgroundColor: swatch.hex }}
                    />
                  );
                })}
                {product.variants.length > 8 && (
                  <button
                    type="button"
                    onClick={() => setSwatchesModalOpen(true)}
                    className="h-7 px-3 rounded-full border border-[#D5D4D3] bg-white text-[11px] text-[#1C1C1C] hover:border-[#1C1C1C] cursor-pointer"
                  >
                    +{product.variants.length - 8}
                  </button>
                )}
              </div>
            </div>

            {/* Workshop Lead Time */}
            <div className="pt-3 border-t border-[#E1E0DD]">
              <p className="text-[12px] text-[#82674F]">
                {getDeliveryEstimate(product)}
              </p>
            </div>

            {/* Primary CTA: Request Quote, Add to Selection Bag & WhatsApp */}
            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => {
                  setQuoteSubmittedId(null);
                  setQuoteModalOpen(true);
                }}
                className="w-full py-4 rounded-full bg-[#EDE5D5] hover:bg-[#DFD2BC] border border-[#B9A78B] text-[#2B1E12] text-[12px] uppercase tracking-[0.2em] transition-colors cursor-pointer"
              >
                Request Custom Quote
              </button>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => addToCart(product, activeVariant, 1)}
                  className="py-3 rounded-full border border-[#1C1C1C] text-[#1C1C1C] hover:bg-white text-[10px] uppercase tracking-[0.14em] cursor-pointer"
                >
                  Add to Selection Bag
                </button>
                <a
                  href={`${OKART_CONTACT.whatsappUrl}?text=${encodeURIComponent(
                    `Hello OKART Interiors, I would like a quotation for ${product.model} (${activeVariant?.title || 'Standard'}).`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="py-3 rounded-full bg-[#777859] hover:bg-[#676A52] text-white text-[10px] uppercase tracking-[0.14em] flex items-center justify-center gap-1.5"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  WhatsApp {OKART_CONTACT.phone}
                </a>
              </div>
            </div>
          </div>

          {/* Goes well with Upsell Strip */}
          <div className="pt-5 border-t border-[#E1E0DD]">
            <p className="text-[11px] uppercase tracking-[0.14em] text-[#82674F] mb-3">
              Complements beautifully with
            </p>
            <div className="grid grid-cols-3 gap-3">
              {goesWellWith.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-[#E1E0DD] p-2.5 flex flex-col justify-between"
                >
                  <button
                    type="button"
                    onClick={() => navigate(`/products/${item.handle}`)}
                    className="block w-full aspect-square bg-[#F0EFED] p-1.5 mb-2 cursor-pointer"
                  >
                    <img
                      src={item.images[0]}
                      alt={item.model}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain"
                    />
                  </button>
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.06em] text-[#1C1C1C] truncate">
                      {item.model}
                    </div>
                    <button
                      type="button"
                      onClick={() => addToCart(item)}
                      className="mt-2 w-full py-1.5 rounded-full bg-[#EDE5D5] border border-[#B9A78B] text-[#2B1E12] text-[9px] uppercase tracking-[0.14em] hover:bg-[#DFD2BC] cursor-pointer"
                    >
                      Select
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Accordions: Description & Specifications */}
      <section className="max-w-4xl mx-auto px-4 lg:px-8 py-8 border-t border-[#E1E0DD]">
        <div className="divide-y divide-[#E1E0DD] border-b border-[#E1E0DD]">
          <div>
            <button
              type="button"
              onClick={() => setOpenAccordion(openAccordion === 'desc' ? null : 'desc')}
              className="w-full py-4 flex items-center justify-between text-left cursor-pointer"
            >
              <span className="text-[13px] uppercase tracking-[0.14em] text-[#1C1C1C]">
                Description
              </span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  openAccordion === 'desc' ? 'rotate-180' : ''
                }`}
              />
            </button>
            {openAccordion === 'desc' && (
              <div className="pb-5 text-[13px] text-[#4F3926] leading-relaxed whitespace-pre-line">
                {product.description ||
                  `${product.title} is crafted in OKART Interiors' workshop with disciplined joinery, premium upholstery, and proportions designed to endure.`}
              </div>
            )}
          </div>

          <div>
            <button
              type="button"
              onClick={() => setOpenAccordion(openAccordion === 'specs' ? null : 'specs')}
              className="w-full py-4 flex items-center justify-between text-left cursor-pointer"
            >
              <span className="text-[13px] uppercase tracking-[0.14em] text-[#1C1C1C]">
                Specifications &amp; Workshop Details
              </span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  openAccordion === 'specs' ? 'rotate-180' : ''
                }`}
              />
            </button>
            {openAccordion === 'specs' && (
              <div className="pb-5 grid grid-cols-1 sm:grid-cols-2 gap-3 text-[12px] text-[#4F3926]">
                <div>
                  <strong className="text-[#1C1C1C]">Maker:</strong>{' '}
                  {product.designer || 'OKART Interiors Atelier'}
                </div>
                <div>
                  <strong className="text-[#1C1C1C]">Category:</strong> {product.productType}
                </div>
                <div>
                  <strong className="text-[#1C1C1C]">Process:</strong> Brief · Design · Production · Installation
                </div>
                <div>
                  <strong className="text-[#1C1C1C]">Workshop Location:</strong> {OKART_CONTACT.address}
                </div>
                <div>
                  <strong className="text-[#1C1C1C]">Reference SKU:</strong>{' '}
                  {activeVariant?.sku || product.handle.toUpperCase()}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Full-bleed Textile Detail Divider */}
      <section className="w-full h-44 md:h-64 overflow-hidden my-8">
        <img
          src={BRAND_ASSETS.fabricMacro}
          alt="Woven upholstery textile detail"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
      </section>

      {/* Shop the Look */}
      <section className="max-w-[1360px] mx-auto px-4 lg:px-10 py-14">
        <h2 className="font-serif-display text-[32px] text-[#2B1E12] text-center mb-8">
          Shop the look
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 relative aspect-[4/3] bg-[#E1E0DD] overflow-hidden">
            <img
              src={BRAND_ASSETS.shopLookRoom}
              alt="Curated interior dining and lounge setting"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            {[
              { x: '30%', y: '60%' },
              { x: '52%', y: '68%' },
              { x: '70%', y: '56%' },
            ].map((dot, idx) => (
              <button
                key={idx}
                type="button"
                aria-label={`Inspect item ${idx + 1} in room`}
                onClick={() => setLookHotspotIdx(idx % shopTheLookProducts.length)}
                style={{ left: dot.x, top: dot.y }}
                className={`absolute w-6 h-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-md transition-transform cursor-pointer ${
                  lookHotspotIdx === idx ? 'bg-[#82674F] scale-125' : 'bg-white/90'
                }`}
              />
            ))}
          </div>
          <div className="lg:col-span-5">
            {shopTheLookProducts[lookHotspotIdx] && (
              <ProductCard product={shopTheLookProducts[lookHotspotIdx]} />
            )}
          </div>
        </div>
      </section>

      {/* OKART Workshop & Materials */}
      <section className="max-w-[1360px] mx-auto px-4 lg:px-10 py-14 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-6 aspect-[4/3] bg-[#E1E0DD] overflow-hidden">
          <img
            src={BRAND_ASSETS.designOwnSofaInsert}
            alt="Tailored upholstery fabrics and finishes"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="lg:col-span-6 space-y-4">
          <h2 className="font-serif-display text-[34px] text-[#2B1E12]">
            A world of tailored fabrics &amp; hides
          </h2>
          <p className="text-[13px] text-[#4F3926] leading-relaxed">
            Every OKART Interiors piece can be upholstered to complement your architecture—whether rich full-grain brown leather with deep button tufting, dimensional striped linens, or sculptural bouclé weaves.
          </p>
          <p className="text-[13px] text-[#4F3926] leading-relaxed">
            Visit our showroom at {OKART_CONTACT.address} or explore our fabric library online to pick your ideal material combination.
          </p>
          <div className="flex flex-wrap gap-3 pt-1">
            <button
              type="button"
              onClick={() => navigate('/pages/fabric-types-and-colors')}
              className="px-7 py-3 rounded-full bg-[#EDE5D5] hover:bg-[#DFD2BC] border border-[#B9A78B] text-[#2B1E12] text-[11px] uppercase tracking-[0.16em] cursor-pointer"
            >
              Explore Fabric Library
            </button>
            <button
              type="button"
              onClick={() => navigate(`/blogs/designers/${designerProfile.slug}`)}
              className="px-6 py-3 rounded-full border border-[#D5D4D3] text-[#4F3926] text-[11px] uppercase tracking-[0.16em] cursor-pointer"
            >
              Design Studio Story
            </button>
          </div>
        </div>
      </section>

      {/* Mission Quote */}
      <section className="w-full bg-[#EEE8DE] py-16 px-6">
        <div className="max-w-xl mx-auto">
          <h2 className="font-serif-display text-[32px] text-[#2B1E12]">
            The OKART Interiors Promise
          </h2>
          <blockquote className="text-[13px] text-[#4F3926] leading-relaxed mt-4 italic">
            &ldquo;Our mission is simple: the right furniture, at the right price, and at the right time. We believe in doing things properly, upholding high standards, and delivering on our promises. No shortcuts. No excuses. It really is that simple.&rdquo;
          </blockquote>
          <p className="text-[12px] text-[#82674F] mt-3">— OKART Interiors, Ibadan</p>
        </div>
      </section>

      <NewsletterSection />

      {/* Full Upholstery Swatches Modal */}
      {swatchesModalOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-[#2B1E12]/40"
            onClick={() => setSwatchesModalOpen(false)}
          />
          <div className="relative z-10 w-full max-w-md bg-white h-full overflow-y-auto p-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#E1E0DD]">
              <h3 className="font-serif-display text-[26px] text-[#2B1E12] normal-case">
                All Finishes ({product.variants.length})
              </h3>
              <button
                type="button"
                onClick={() => setSwatchesModalOpen(false)}
                className="p-2 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-2.5">
              {product.variants.map((v, idx) => {
                const sw = getSwatchVisual(v.title);
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => {
                      setSelectedVariantIdx(idx);
                      setSwatchesModalOpen(false);
                    }}
                    className={`p-3 border text-left flex items-center gap-3 cursor-pointer ${
                      idx === selectedVariantIdx
                        ? 'border-[#82674F] bg-[#EDE5D5]/55'
                        : 'border-[#E1E0DD] hover:border-[#82674F]'
                    }`}
                  >
                    <span
                      className="w-7 h-7 rounded-full border border-[#D5D4D3] shrink-0"
                      style={{ backgroundColor: sw.hex }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-[12px] text-[#1C1C1C] truncate">{v.title}</div>
                      <div className="text-[10px] uppercase tracking-[0.12em] text-[#82674F]">
                        {sw.materialFamily}
                      </div>
                    </div>
                    {v.sku && (
                      <span className="text-[10px] uppercase tracking-[0.08em] text-[#82674F] tabular-nums">
                        {v.sku}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Custom Quote Request Modal */}
      {quoteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-[#2B1E12]/50"
            onClick={() => setQuoteModalOpen(false)}
          />
          <div className="relative z-10 bg-white max-w-lg w-full p-6 md:p-8 border border-[#E1E0DD] space-y-4">
            <button
              type="button"
              onClick={() => setQuoteModalOpen(false)}
              aria-label="Close quotation form"
              className="absolute top-4 right-4 p-1.5 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <p className="text-[10px] uppercase tracking-[0.18em] text-[#82674F]">
              OKART INTERIORS QUOTATION
            </p>
            <h3 className="font-serif-display text-[30px] text-[#2B1E12] leading-tight">
              Request Quote: {product.model}
            </h3>

            {quoteSubmittedId ? (
              <div className="bg-[#EEE8DE] p-5 border border-[#D5D4D3] space-y-3 text-[13px] text-[#2B1E12]">
                <p>
                  Thank you, <strong>{quoteName}</strong>. Your quotation request (Ref:{' '}
                  <span className="tabular-nums font-medium">{quoteSubmittedId}</span>) has been logged for{' '}
                  <strong>{product.model}</strong> ({activeVariant?.title || 'Standard'}).
                </p>
                <p className="text-[12px] text-[#4F3926]">
                  Our workshop team will contact you shortly via phone/WhatsApp ({OKART_CONTACT.phone}) or email.
                </p>
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setQuoteModalOpen(false);
                      navigate('/account');
                    }}
                    className="px-5 py-2.5 rounded-full bg-[#EDE5D5] border border-[#B9A78B] text-[#2B1E12] text-[10px] uppercase tracking-[0.14em] cursor-pointer"
                  >
                    View My Quotes
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuoteModalOpen(false)}
                    className="px-5 py-2.5 rounded-full border border-[#D5D4D3] text-[#1C1C1C] text-[10px] uppercase tracking-[0.14em] cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleQuoteSubmit} className="space-y-3">
                <p className="text-[12px] text-[#4F3926]">
                  Specification: <strong>{activeVariant?.title}</strong>
                </p>
                <input
                  required
                  type="text"
                  value={quoteName}
                  onChange={(e) => setQuoteName(e.target.value)}
                  placeholder="Full name"
                  className="w-full h-10 px-3.5 border border-[#D5D4D3] text-[13px]"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    required
                    type="tel"
                    value={quotePhone}
                    onChange={(e) => setQuotePhone(e.target.value)}
                    placeholder="Phone / WhatsApp number"
                    className="h-10 px-3.5 border border-[#D5D4D3] text-[13px]"
                  />
                  <input
                    type="email"
                    value={quoteEmail}
                    onChange={(e) => setQuoteEmail(e.target.value)}
                    placeholder="Email address"
                    className="h-10 px-3.5 border border-[#D5D4D3] text-[13px]"
                  />
                </div>
                <textarea
                  rows={3}
                  value={quoteNotes}
                  onChange={(e) => setQuoteNotes(e.target.value)}
                  placeholder="Quantity, preferred finish, delivery city, or project timeline..."
                  className="w-full p-3.5 border border-[#D5D4D3] text-[13px]"
                />
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-full bg-[#EDE5D5] hover:bg-[#DFD2BC] border border-[#B9A78B] text-[#2B1E12] text-[11px] uppercase tracking-[0.18em] cursor-pointer"
                >
                  Submit Quotation Request
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* AR / Spatial Preview Modal */}
      {arModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-[#2B1E12]/50"
            onClick={() => setArModalOpen(false)}
          />
          <div className="relative z-10 bg-white max-w-lg w-full p-6 border border-[#E1E0DD] text-center space-y-4">
            <button
              type="button"
              onClick={() => setArModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <p className="text-[10px] uppercase tracking-[0.16em] text-[#82674F]">
              Spatial Preview
            </p>
            <h3 className="font-serif-display text-[28px] text-[#2B1E12] normal-case">
              {product.model} in your space
            </h3>
            <div className="bg-[#ECEBE8] p-6 aspect-square max-h-72 mx-auto flex items-center justify-center">
              <img
                src={currentImage}
                alt={product.model}
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain"
              />
            </div>
            <p className="text-[12px] text-[#4F3926]">
              Want tailored dimension &amp; fabric guidance? Speak with our Ibadan workshop specialists on {OKART_CONTACT.phone} or explore {FABRIC_COLLECTIONS[0].name}.
            </p>
            <div className="flex gap-3 justify-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setArModalOpen(false);
                  navigate('/pages/contact');
                }}
                className="px-6 py-2.5 rounded-full bg-[#EDE5D5] hover:bg-[#DFD2BC] border border-[#B9A78B] text-[#2B1E12] text-[11px] uppercase tracking-[0.14em] cursor-pointer"
              >
                Book Consultation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
