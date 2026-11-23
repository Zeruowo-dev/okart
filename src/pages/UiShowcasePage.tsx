import React, { useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Copy,
  Heart,
  Layers,
  Loader2,
  MapPin,
  Menu,
  MessageCircle,
  MessageSquare,
  Minus,
  Plus,
  Search,
  Send,
  ShoppingBag,
  SlidersHorizontal,
  Star,
  Trash2,
  User,
  X,
} from 'lucide-react';
import {
  BRAND_ASSETS,
  CATEGORY_CARDS,
  GOOGLE_REVIEWS,
  OKART_CONTACT,
  OKART_SERVICES,
  OKART_TOP_NAV,
  REAL_HOMES_GALLERY,
  TRUE_COST_PILLARS,
} from '../data/siteContent';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { RealHomesModal } from '../components/RealHomesModal';
import { getSwatchVisual } from '../utils/storeLogic';

interface UiShowcasePageProps {
  onExitShowcase: () => void;
}

type ShowcaseSectionFilter = 'all' | 'tokens' | 'components' | 'states';

interface ColorToken {
  group: string;
  name: string;
  variable: string;
  hex: string;
  usage: string;
  darkText?: boolean;
}

const COLOR_TOKENS: ColorToken[] = [
  // Primary Warm Cream Accents
  {
    group: 'Cream & Accent Surface',
    name: 'Champagne Cream',
    variable: '--cream-accent',
    hex: '#EDE5D5',
    usage: 'Primary CTAs, Announcement Bar, Badges, Chat Header',
    darkText: true,
  },
  {
    group: 'Cream & Accent Surface',
    name: 'Cream Hover',
    variable: '--cream-accent-hover',
    hex: '#DFD2BC',
    usage: 'Hover state on primary buttons & interactive pills',
    darkText: true,
  },
  {
    group: 'Cream & Accent Surface',
    name: 'Cream Border',
    variable: '--cream-border',
    hex: '#B9A78B',
    usage: 'Primary pill borders & high-contrast outlines',
    darkText: true,
  },
  {
    group: 'Cream & Accent Surface',
    name: 'Warm Subtle Border',
    variable: '--cream-border-soft',
    hex: '#C8B89F',
    usage: 'Badge borders & secondary subtle separators',
    darkText: true,
  },
  // Espresso & Walnut Bronze Scale
  {
    group: 'Espresso & Walnut Bronze',
    name: 'Deep Espresso',
    variable: '--brown-01',
    hex: '#2B1E12',
    usage: 'Display headings, dark contrast ink on cream CTAs',
  },
  {
    group: 'Espresso & Walnut Bronze',
    name: 'Walnut Espresso',
    variable: '--brown-02',
    hex: '#4F3926',
    usage: 'Body copy, navigation secondary links, captions',
  },
  {
    group: 'Espresso & Walnut Bronze',
    name: 'Walnut Bronze',
    variable: '--brown-03',
    hex: '#82674F',
    usage: 'Active nav underlines, eyebrows, focus rings, icons',
  },
  {
    group: 'Espresso & Walnut Bronze',
    name: 'Warm Linen',
    variable: '--brown-05',
    hex: '#EEE8DE',
    usage: 'USP bar, Reviews band, Cart banner background',
    darkText: true,
  },
  // Architectural Neutrals
  {
    group: 'Editorial Neutrals',
    name: 'Alabaster Canvas',
    variable: '--background-primary',
    hex: '#F6F5F3',
    usage: 'Global page ground & input field fill',
    darkText: true,
  },
  {
    group: 'Editorial Neutrals',
    name: 'Gallery White',
    variable: '--background-secondary',
    hex: '#FFFFFF',
    usage: 'Header, modals, review cards & form containers',
    darkText: true,
  },
  {
    group: 'Editorial Neutrals',
    name: 'Studio Plate',
    variable: '--grey-02 / plate',
    hex: '#ECEBE8',
    usage: 'Product photography container plates',
    darkText: true,
  },
  {
    group: 'Editorial Neutrals',
    name: 'Hairline & Border',
    variable: '--grey-02 / --border',
    hex: '#D5D4D3',
    usage: 'Card & form field 1px dividers (#E1E0DD / #D5D4D3)',
    darkText: true,
  },
  {
    group: 'Editorial Neutrals',
    name: 'Charcoal Ink',
    variable: '--text-primary',
    hex: '#1C1C1C',
    usage: 'Primary text, dark outline CTAs & numeral labels',
  },
  // Semantic & Functional Accents
  {
    group: 'Semantic & Functional',
    name: 'Atelier Sage',
    variable: '--green-02',
    hex: '#777859',
    usage: 'Newsletter Subscribe, WhatsApp CTA pill',
  },
  {
    group: 'Semantic & Functional',
    name: 'Antique Gold',
    variable: '--star-gold',
    hex: '#A67C46',
    usage: 'Verified 5-Star Google Review rating icons',
  },
  {
    group: 'Semantic & Functional',
    name: 'Terracotta Alert',
    variable: '--error',
    hex: '#8E5235',
    usage: 'Form validation messages & error borders',
  },
];

const RADIUS_SPECS = [
  {
    label: 'Pill Buttons, Swatches & Badges',
    token: 'rounded-full (48px / 9999px)',
    cssVar: '--button-border-radius: 48px',
    previewClass: 'rounded-full',
  },
  {
    label: 'Search & Compact Inputs',
    token: 'rounded-sm (2px)',
    cssVar: 'Header search & Newsletter fields',
    previewClass: 'rounded-sm',
  },
  {
    label: 'Cards, Modals, Drawers & Plates',
    token: 'rounded-none (0px)',
    cssVar: 'Architectural sharp corners',
    previewClass: 'rounded-none',
  },
];

const SPACING_TOKENS = [
  { name: 'xs', px: '4px', tailwind: 'gap-1 / p-1' },
  { name: 'sm', px: '8px', tailwind: 'gap-2 / p-2' },
  { name: 'md', px: '16px', tailwind: 'gap-4 / p-4' },
  { name: 'lg', px: '24px', tailwind: 'gap-6 / p-6' },
  { name: 'xl', px: '32px', tailwind: 'gap-8 / p-8' },
  { name: '2xl', px: '48px–80px', tailwind: 'py-12 / py-20' },
];

export function UiShowcasePage({ onExitShowcase }: UiShowcasePageProps) {
  const { products, getProductByHandle, navigate, setCartOpen, showToast } = useStore();
  const [sectionFilter, setSectionFilter] = useState<ShowcaseSectionFilter>('all');

  // Interactive Component Demos
  const [isLoadingBtn, setIsLoadingBtn] = useState(false);
  const [loadingDone, setLoadingDone] = useState(false);
  const [demoQty, setDemoQty] = useState(2);
  const [demoInputVal, setDemoInputVal] = useState('Bodija Villa Dining Suite');
  const [demoSelectVal, setDemoSelectVal] = useState('Interior Designer / Architect');
  const [demoCheckbox, setDemoCheckbox] = useState(true);
  const [demoAccordionOpen, setDemoAccordionOpen] = useState(true);
  const [selectedSwatchIdx, setSelectedSwatchIdx] = useState(0);
  const [activeCatIdx, setActiveCatIdx] = useState(0);
  const [savedHeart, setSavedHeart] = useState(true);
  const [sandboxErrorMode, setSandboxErrorMode] = useState(false);
  const [sandboxEmail, setSandboxEmail] = useState('client@okartinteriors.ng');

  // Live modal testers inside Showcase
  const [demoRealHomeOpen, setDemoRealHomeOpen] = useState(false);
  const [demoQuoteModalOpen, setDemoQuoteModalOpen] = useState(false);
  const [demoQuoteSubmitted, setDemoQuoteSubmitted] = useState(false);

  const heritageChair = getProductByHandle('the-heritage-dining-chair') || products[0];
  const secondaryProduct =
    getProductByHandle('basecamp-small-open-end-right-2-modules-140x210cm') ||
    products.find((p) => p.handle !== 'the-heritage-dining-chair' && p.images.length > 0) ||
    products[2];

  const swatchOptions = [
    'Rich Brown Leather / Solid Walnut',
    'Champagne Cream Velvet',
    'Cosmo Beige Linen nr. 40',
    'Black Steel / Smoked Oak',
  ];

  const handleCopyHex = (hex: string, name: string) => {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(hex).catch(() => undefined);
    }
    showToast(`Copied ${name} (${hex})`);
  };

  const handleTriggerLoading = () => {
    if (isLoadingBtn) return;
    setLoadingDone(false);
    setIsLoadingBtn(true);
    window.setTimeout(() => {
      setIsLoadingBtn(false);
      setLoadingDone(true);
    }, 1400);
  };

  const showTokens = sectionFilter === 'all' || sectionFilter === 'tokens';
  const showComponents = sectionFilter === 'all' || sectionFilter === 'components';
  const showStates = sectionFilter === 'all' || sectionFilter === 'states';

  return (
    <div className="min-h-screen bg-[#F6F5F3] text-[#1C1C1C] pb-24">
      {/* Showcase Header Artboard Bar */}
      <div className="bg-white border-b border-[#E1E0DD]">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-10 py-8">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EDE5D5] border border-[#C8B89F] text-[10px] uppercase tracking-[0.16em] text-[#2B1E12] mb-3">
                <Layers className="w-3.5 h-3.5 text-[#82674F]" />
                <span>OKART Interiors · UI Component Showcase &amp; Figma Spec</span>
              </div>
              <h1 className="font-serif-display text-[36px] md:text-[46px] text-[#2B1E12] leading-tight">
                Design System &amp; Component Inventory
              </h1>
              <p className="text-[13px] text-[#4F3926] max-w-2xl mt-2 leading-relaxed">
                Complete visual catalog of every color token, typographic style, spacing rule, button, form control, card, badge, navigation bar, modal, and interactive state across OKART Interiors.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                onClick={onExitShowcase}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#EDE5D5] hover:bg-[#DFD2BC] border border-[#B9A78B] text-[#2B1E12] text-[11px] uppercase tracking-[0.16em] transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Storefront</span>
              </button>
            </div>
          </div>

          {/* Section Filter Tabs */}
          <div className="mt-7 pt-5 border-t border-[#E1E0DD] flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              {(
                [
                  { id: 'all', label: 'All Sections (1–3)' },
                  { id: 'tokens', label: '1. Design Tokens' },
                  { id: 'components', label: '2. Core Components' },
                  { id: 'states', label: '3. Interactive States' },
                ] as const
              ).map((tab) => {
                const active = sectionFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setSectionFilter(tab.id)}
                    className={`px-5 py-2 rounded-full text-[11px] uppercase tracking-[0.14em] transition-colors cursor-pointer ${
                      active
                        ? 'bg-[#EDE5D5] text-[#2B1E12] border border-[#82674F]'
                        : 'bg-white text-[#4F3926] border border-[#D5D4D3] hover:border-[#82674F]'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <div className="text-[11px] uppercase tracking-[0.12em] text-[#82674F]">
              Max Width Frame: 1440px · OKART Bespoke Design System
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 lg:px-10 pt-10 space-y-16">
        {/* ================================================================
            1. DESIGN TOKENS
        ================================================================ */}
        {showTokens && (
          <section aria-labelledby="tokens-heading" className="space-y-10 scroll-mt-12">
            <div className="border-b border-[#E1E0DD] pb-4 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#82674F]">
                  SECTION 01 · FOUNDATIONS
                </p>
                <h2 id="tokens-heading" className="font-serif-display text-[32px] md:text-[38px] text-[#2B1E12]">
                  Design Tokens
                </h2>
              </div>
              <span className="text-[11px] text-[#82674F]">Click any swatch to copy HEX</span>
            </div>

            {/* 1A. Color Swatches Grid */}
            <div className="space-y-6">
              <h3 className="text-[12px] uppercase tracking-[0.16em] text-[#4F3926] font-medium">
                Color Palette ({COLOR_TOKENS.length} Brand &amp; Semantic Tokens)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {COLOR_TOKENS.map((token) => (
                  <button
                    key={token.name}
                    type="button"
                    onClick={() => handleCopyHex(token.hex, token.name)}
                    className="group text-left bg-white border border-[#E1E0DD] hover:border-[#82674F] transition-colors flex flex-col cursor-pointer"
                  >
                    <div
                      className="h-24 w-full relative flex items-end justify-between p-3 border-b border-[#E1E0DD]"
                      style={{ backgroundColor: token.hex }}
                    >
                      <span
                        className={`text-[10px] uppercase tracking-[0.12em] ${
                          token.darkText ? 'text-[#2B1E12]/80' : 'text-white/90'
                        }`}
                      >
                        {token.group}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] uppercase tracking-[0.08em] ${
                          token.darkText
                            ? 'bg-white/75 text-[#2B1E12]'
                            : 'bg-black/30 text-white'
                        }`}
                      >
                        <Copy className="w-2.5 h-2.5" />
                        {token.hex}
                      </span>
                    </div>
                    <div className="p-3.5 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[13px] font-medium text-[#1C1C1C]">
                          {token.name}
                        </span>
                        <code className="text-[10px] text-[#82674F] bg-[#F6F5F3] px-1.5 py-0.5">
                          {token.variable}
                        </code>
                      </div>
                      <p className="text-[11px] text-[#4F3926] leading-snug">{token.usage}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 1B. Typography Hierarchy + 1C. Spacing & Border-Radius Rules */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 bg-white border border-[#E1E0DD] p-6 md:p-8 space-y-5">
                <div className="flex items-center justify-between border-b border-[#F0EFED] pb-3">
                  <h3 className="text-[12px] uppercase tracking-[0.16em] text-[#4F3926] font-medium">
                    Typography Hierarchy
                  </h3>
                  <span className="text-[11px] text-[#82674F]">
                    Meno Banner / Cormorant Garamond + Avenir Next Pro
                  </span>
                </div>

                <div className="divide-y divide-[#F0EFED]">
                  <div className="py-3 flex flex-wrap items-baseline justify-between gap-4">
                    <div className="font-serif-display text-[44px] md:text-[52px] leading-[1.02] text-[#2B1E12]">
                      OKART Interiors
                    </div>
                    <span className="text-[11px] text-[#82674F] tabular-nums">
                      H1 Hero · 64px / 1.02 · Serif
                    </span>
                  </div>
                  <div className="py-3 flex flex-wrap items-baseline justify-between gap-4">
                    <div className="font-serif-display text-[34px] md:text-[38px] leading-[1.1] text-[#2B1E12]">
                      Our Products &amp; Collections
                    </div>
                    <span className="text-[11px] text-[#82674F] tabular-nums">
                      H1/H2 Section · 38–46px / 1.1 · Serif
                    </span>
                  </div>
                  <div className="py-3 flex flex-wrap items-baseline justify-between gap-4">
                    <div className="font-serif-display text-[24px] leading-[1.2] text-[#2B1E12]">
                      Brief &amp; Thoughtful Design
                    </div>
                    <span className="text-[11px] text-[#82674F] tabular-nums">
                      H3 Card / Drawer · 22–28px · Serif
                    </span>
                  </div>
                  <div className="py-3 flex flex-wrap items-baseline justify-between gap-4">
                    <div className="text-[10px] uppercase tracking-[0.2em] text-[#82674F]">
                      OKART INTERIORS · CUSTOM FURNITURE MANUFACTURERS
                    </div>
                    <span className="text-[11px] text-[#82674F] tabular-nums">
                      Eyebrow Label · 10px Uppercase · 0.2em
                    </span>
                  </div>
                  <div className="py-3 flex flex-wrap items-baseline justify-between gap-4">
                    <p className="text-[13px] leading-[1.7] text-[#4F3926] max-w-md">
                      Every furniture piece, cabinet, and tufted frame is crafted in our own workshop combining artisanal techniques with modern precision.
                    </p>
                    <span className="text-[11px] text-[#82674F] tabular-nums">
                      Body Editorial · 13px / 1.7 · Sans
                    </span>
                  </div>
                  <div className="py-3 flex flex-wrap items-baseline justify-between gap-4">
                    <span className="text-[12px] uppercase tracking-[0.06em] text-[#1C1C1C] tabular-nums">
                      171 Pieces · 140 × 210 cm · 4.9 Rating
                    </span>
                    <span className="text-[11px] text-[#82674F] tabular-nums">
                      Metadata &amp; Numerals · 11–12px · tabular-nums
                    </span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 space-y-6">
                {/* Border-Radius Rules */}
                <div className="bg-white border border-[#E1E0DD] p-6 space-y-4">
                  <h3 className="text-[12px] uppercase tracking-[0.16em] text-[#4F3926] font-medium border-b border-[#F0EFED] pb-2.5">
                    Border-Radius Architecture
                  </h3>
                  <div className="space-y-3">
                    {RADIUS_SPECS.map((r) => (
                      <div key={r.label} className="flex items-center gap-4">
                        <div
                          className={`w-16 h-10 bg-[#EDE5D5] border border-[#B9A78B] shrink-0 ${r.previewClass}`}
                        />
                        <div className="min-w-0">
                          <div className="text-[12px] font-medium text-[#1C1C1C]">{r.label}</div>
                          <div className="text-[11px] text-[#82674F]">
                            {r.token} · {r.cssVar}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Spacing Scale */}
                <div className="bg-white border border-[#E1E0DD] p-6 space-y-4">
                  <h3 className="text-[12px] uppercase tracking-[0.16em] text-[#4F3926] font-medium border-b border-[#F0EFED] pb-2.5">
                    Spacing &amp; Grid Scale
                  </h3>
                  <div className="space-y-2.5">
                    {SPACING_TOKENS.map((s) => (
                      <div key={s.name} className="flex items-center justify-between gap-3 text-[12px]">
                        <div className="flex items-center gap-3">
                          <span className="w-8 uppercase tracking-[0.1em] text-[#82674F] text-[10px]">
                            {s.name}
                          </span>
                          <div
                            className="h-3 bg-[#82674F]/35 border border-[#82674F]"
                            style={{
                              width:
                                s.name === 'xs'
                                  ? '8px'
                                  : s.name === 'sm'
                                  ? '16px'
                                  : s.name === 'md'
                                  ? '32px'
                                  : s.name === 'lg'
                                  ? '48px'
                                  : s.name === 'xl'
                                  ? '64px'
                                  : '96px',
                            }}
                          />
                        </div>
                        <span className="text-[11px] text-[#4F3926] tabular-nums">
                          {s.px} <span className="text-[#82674F]">({s.tailwind})</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ================================================================
            2. CORE COMPONENTS
        ================================================================ */}
        {showComponents && (
          <section aria-labelledby="components-heading" className="space-y-10 scroll-mt-12">
            <div className="border-b border-[#E1E0DD] pb-4 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#82674F]">
                  SECTION 02 · ORGANIZED REUSABLE LIBRARY
                </p>
                <h2 id="components-heading" className="font-serif-display text-[32px] md:text-[38px] text-[#2B1E12]">
                  Core Components &amp; Layout Blocks
                </h2>
              </div>
              <span className="text-[11px] text-[#82674F]">
                Buttons · Inputs · Dropdowns · Badges · Cards · Navigation · Modals
              </span>
            </div>

            {/* 2A. Buttons + Badges */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Buttons Panel */}
              <div className="lg:col-span-7 bg-white border border-[#E1E0DD] p-6 md:p-7 space-y-5">
                <div className="flex items-center justify-between border-b border-[#F0EFED] pb-2.5">
                  <h3 className="text-[12px] uppercase tracking-[0.16em] text-[#4F3926] font-medium">
                    Buttons &amp; Interactive Actions
                  </h3>
                  <span className="text-[10px] uppercase tracking-[0.12em] text-[#82674F]">
                    Radius: 9999px (--button-border-radius)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3.5 bg-[#F6F5F3] border border-[#E1E0DD] space-y-2">
                    <span className="text-[10px] uppercase tracking-[0.12em] text-[#82674F] block">
                      Primary Cream CTA
                    </span>
                    <button
                      type="button"
                      onClick={() => showToast('Primary CTA clicked')}
                      className="px-7 py-3 rounded-full bg-[#EDE5D5] hover:bg-[#DFD2BC] border border-[#B9A78B] text-[#2B1E12] text-[11px] uppercase tracking-[0.16em] transition-colors cursor-pointer"
                    >
                      Explore Our Products
                    </button>
                  </div>

                  <div className="p-3.5 bg-[#F6F5F3] border border-[#E1E0DD] space-y-2">
                    <span className="text-[10px] uppercase tracking-[0.12em] text-[#82674F] block">
                      Secondary Outline Pill
                    </span>
                    <button
                      type="button"
                      onClick={() => showToast('Secondary outline clicked')}
                      className="px-7 py-3 rounded-full border border-[#2B1E12] text-[#2B1E12] hover:bg-white text-[11px] uppercase tracking-[0.16em] transition-colors cursor-pointer"
                    >
                      Contact Showroom
                    </button>
                  </div>

                  <div className="p-3.5 bg-[#F6F5F3] border border-[#E1E0DD] space-y-2">
                    <span className="text-[10px] uppercase tracking-[0.12em] text-[#82674F] block">
                      Sage Workshop / WhatsApp CTA
                    </span>
                    <button
                      type="button"
                      onClick={() => showToast('WhatsApp Atelier action triggered')}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#777859] hover:bg-[#676A52] text-[#F6F6F1] text-[11px] uppercase tracking-[0.16em] transition-colors cursor-pointer"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp Atelier</span>
                    </button>
                  </div>

                  <div className="p-3.5 bg-[#2B1E12] border border-[#4F3926] space-y-2">
                    <span className="text-[10px] uppercase tracking-[0.12em] text-white/75 block">
                      Hero Dark Overlay Secondary
                    </span>
                    <button
                      type="button"
                      onClick={() => showToast('Bespoke Studio clicked')}
                      className="px-6 py-3 rounded-full bg-white/90 hover:bg-white text-[#1C1C1C] text-[11px] uppercase tracking-[0.16em] transition-colors cursor-pointer"
                    >
                      Bespoke Studio
                    </button>
                  </div>

                  <div className="p-3.5 bg-[#F6F5F3] border border-[#E1E0DD] space-y-2">
                    <span className="text-[10px] uppercase tracking-[0.12em] text-[#82674F] block">
                      Disabled State
                    </span>
                    <button
                      type="button"
                      disabled
                      className="px-7 py-3 rounded-full bg-[#EDE5D5]/60 border border-[#D5D4D3] text-[#82674F]/70 text-[11px] uppercase tracking-[0.16em] opacity-60 cursor-not-allowed"
                    >
                      Unavailable Finish
                    </button>
                  </div>

                  <div className="p-3.5 bg-[#F6F5F3] border border-[#E1E0DD] space-y-2">
                    <span className="text-[10px] uppercase tracking-[0.12em] text-[#82674F] block">
                      Loading / Async Submit (Click to test)
                    </span>
                    <button
                      type="button"
                      onClick={handleTriggerLoading}
                      disabled={isLoadingBtn}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#EDE5D5] hover:bg-[#DFD2BC] border border-[#B9A78B] text-[#2B1E12] text-[11px] uppercase tracking-[0.16em] transition-colors cursor-pointer disabled:opacity-75"
                    >
                      {isLoadingBtn ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Submitting Brief...</span>
                        </>
                      ) : loadingDone ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-[#4B4C1E]" />
                          <span>Brief Received (Click Again)</span>
                        </>
                      ) : (
                        <span>Test Loading State</span>
                      )}
                    </button>
                  </div>
                </div>

                {/* Icon Controls, Wishlist & Quantity Stepper */}
                <div className="pt-3 border-t border-[#F0EFED] flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-2.5">
                    <span className="text-[10px] uppercase tracking-[0.12em] text-[#82674F]">
                      Carousel &amp; Icon Controls:
                    </span>
                    <button
                      type="button"
                      aria-label="Demo prev"
                      className="w-9 h-9 rounded-full border border-[#D5D4D3] bg-white flex items-center justify-center text-[#1C1C1C] hover:border-[#1C1C1C] cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      aria-label="Demo next"
                      className="w-9 h-9 rounded-full border border-[#D5D4D3] bg-white flex items-center justify-center text-[#1C1C1C] hover:border-[#1C1C1C] cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setSavedHeart((p) => !p)}
                      aria-label="Toggle wishlist demo"
                      className="p-2.5 rounded-full border border-[#D5D4D3] bg-white text-[#1C1C1C] hover:border-[#82674F] cursor-pointer"
                    >
                      <Heart
                        className={`w-4 h-4 ${savedHeart ? 'fill-[#82674F] text-[#82674F]' : ''}`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[10px] uppercase tracking-[0.12em] text-[#82674F]">
                      Stepper:
                    </span>
                    <div className="inline-flex items-center border border-[#D5D4D3] bg-[#F6F5F3]">
                      <button
                        type="button"
                        onClick={() => setDemoQty((q) => Math.max(1, q - 1))}
                        aria-label="Decrease demo quantity"
                        className="w-8 h-8 flex items-center justify-center text-[#1C1C1C] hover:bg-[#E1E0DD] cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-9 text-center text-[12px] tabular-nums">{demoQty}</span>
                      <button
                        type="button"
                        onClick={() => setDemoQty((q) => q + 1)}
                        aria-label="Increase demo quantity"
                        className="w-8 h-8 flex items-center justify-center text-[#1C1C1C] hover:bg-[#E1E0DD] cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Badges, Chips & Status Pills */}
              <div className="lg:col-span-5 bg-white border border-[#E1E0DD] p-6 md:p-7 space-y-5">
                <h3 className="text-[12px] uppercase tracking-[0.16em] text-[#4F3926] font-medium border-b border-[#F0EFED] pb-2.5">
                  Badges, Pills &amp; Micro-Indicators
                </h3>

                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.12em] text-[#82674F] block mb-2">
                      Product Plate Badges
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {['SIGNATURE PIECE', 'BESPOKE EDITION', 'BESTSELLER', 'NEW COLOURS', '10 YEAR WARRANTY'].map(
                        (badge) => (
                          <span
                            key={badge}
                            className="px-3 py-1 rounded-full bg-[#EDE5D5] text-[#2B1E12] border border-[#C8B89F] text-[9px] uppercase tracking-[0.14em] leading-none"
                          >
                            {badge}
                          </span>
                        )
                      )}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase tracking-[0.12em] text-[#82674F] block mb-2">
                      Service Tier &amp; Floating Chat Launchers
                    </span>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="px-3 py-1 rounded-full bg-[#EDE5D5] text-[#2B1E12] border border-[#C8B89F] text-[10px] uppercase tracking-[0.12em]">
                        Bespoke Commission
                      </span>
                      <span className="inline-flex items-center gap-2 h-10 px-4 rounded-full bg-[#EDE5D5] text-[#2B1E12] border border-[#B9A78B] shadow-md text-[11px] uppercase tracking-[0.14em]">
                        <MessageSquare className="w-3.5 h-3.5" />
                        Chat with Us
                      </span>
                      <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-[#EDE5D5] border border-[#82674F] text-[#2B1E12] text-[10px] tabular-nums">
                        3
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase tracking-[0.12em] text-[#82674F] block mb-2">
                      Quick-Prompt Chips &amp; Review Trust Badge
                    </span>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="px-2.5 py-1 rounded-full bg-[#F6F5F3] border border-[#D5D4D3] text-[10px] text-[#4F3926]">
                        Quote for The Heritage Dining Chair
                      </span>
                      <span className="px-2.5 py-1 rounded-full bg-[#F6F5F3] border border-[#D5D4D3] text-[10px] text-[#4F3926]">
                        Book Ibadan showroom visit
                      </span>
                    </div>
                    <div className="inline-flex items-center gap-3 bg-[#EEE8DE] border border-[#D5D4D3] px-4 py-2">
                      <span className="text-[20px] leading-none text-[#1C1C1C] tabular-nums">4.9</span>
                      <div className="flex items-center gap-0.5 text-[#A67C46]">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <Star key={idx} className="w-3 h-3 fill-[#A67C46]" />
                        ))}
                      </div>
                      <span className="text-[10px] uppercase tracking-[0.12em] text-[#82674F]">
                        Google Rating
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase tracking-[0.12em] text-[#82674F] block mb-2">
                      Toast Notification Banner
                    </span>
                    <div className="px-4 py-2.5 bg-[#2B1E12] text-white text-[12px] tracking-[0.06em] border border-[#4F3926]">
                      Added The Heritage Dining Chair to Quote Selection Bag
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 2B. Form Inputs, Selects, Dropdowns, Swatches & Accordions */}
            <div className="bg-white border border-[#E1E0DD] p-6 md:p-7 space-y-6">
              <div className="flex items-center justify-between border-b border-[#F0EFED] pb-2.5">
                <h3 className="text-[12px] uppercase tracking-[0.16em] text-[#4F3926] font-medium">
                  Form Inputs, Selects, Accordions &amp; Mega-Menu Dropdown
                </h3>
                <span className="text-[11px] text-[#82674F]">Live Interactive Controls</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Column 1: Inputs */}
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="ui-project-input"
                      className="block text-[11px] uppercase tracking-[0.1em] text-[#4F3926] mb-1"
                    >
                      Standard Sharp Input
                    </label>
                    <input
                      id="ui-project-input"
                      type="text"
                      value={demoInputVal}
                      onChange={(e) => setDemoInputVal(e.target.value)}
                      placeholder="Enter brief title..."
                      className="w-full h-11 px-3.5 bg-[#F6F5F3] border border-[#D5D4D3] text-[13px] text-[#1C1C1C] focus:outline-none focus:border-[#82674F]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="ui-search-input"
                      className="block text-[11px] uppercase tracking-[0.1em] text-[#4F3926] mb-1"
                    >
                      Header Catalog Search (rounded-sm)
                    </label>
                    <div className="relative flex items-center">
                      <Search className="w-3.5 h-3.5 text-[#777859] absolute left-3 pointer-events-none" />
                      <input
                        id="ui-search-input"
                        type="search"
                        placeholder="Search furniture..."
                        className="w-full h-10 pl-8 pr-3 text-[12px] bg-[#F6F5F3] border border-[#E1E0DD] rounded-sm text-[#1C1C1C] placeholder:text-[#82674F]/70 focus:outline-none focus:border-[#82674F]"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="ui-notes-area"
                      className="block text-[11px] uppercase tracking-[0.1em] text-[#4F3926] mb-1"
                    >
                      Bespoke Notes Textarea
                    </label>
                    <textarea
                      id="ui-notes-area"
                      rows={2}
                      defaultValue="Custom 360cm curved sofa with solid walnut plinth."
                      className="w-full p-3 bg-[#F6F5F3] border border-[#D5D4D3] text-[12px] text-[#1C1C1C] focus:outline-none focus:border-[#82674F]"
                    />
                  </div>
                </div>

                {/* Column 2: Select, Checkbox & Swatch Picker */}
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="ui-select-profile"
                      className="block text-[11px] uppercase tracking-[0.1em] text-[#4F3926] mb-1"
                    >
                      Client Profile Dropdown
                    </label>
                    <select
                      id="ui-select-profile"
                      value={demoSelectVal}
                      onChange={(e) => setDemoSelectVal(e.target.value)}
                      className="w-full h-11 px-3.5 bg-[#F6F5F3] border border-[#D5D4D3] text-[13px] text-[#1C1C1C] focus:outline-none focus:border-[#82674F]"
                    >
                      <option value="Homeowner / Private Client">Homeowner / Private Client</option>
                      <option value="Interior Designer / Architect">Interior Designer / Architect</option>
                      <option value="Corporate / Commercial Buyer">Corporate / Commercial Buyer</option>
                      <option value="Hospitality / Event Planner">Hospitality / Event Planner</option>
                    </select>
                  </div>

                  <div>
                    <span className="block text-[11px] uppercase tracking-[0.1em] text-[#4F3926] mb-2">
                      Material &amp; Upholstery Swatch Selector
                    </span>
                    <div className="flex items-center justify-between bg-[#F6F5F3] border border-[#D5D4D3] px-3 py-2 mb-2.5 text-[12px]">
                      <span className="truncate">{swatchOptions[selectedSwatchIdx]}</span>
                      <span className="text-[10px] uppercase tracking-[0.12em] text-[#82674F]">
                        {getSwatchVisual(swatchOptions[selectedSwatchIdx]).materialFamily}
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      {swatchOptions.map((label, idx) => {
                        const swatch = getSwatchVisual(label);
                        const active = idx === selectedSwatchIdx;
                        return (
                          <button
                            key={label}
                            type="button"
                            onClick={() => setSelectedSwatchIdx(idx)}
                            title={label}
                            aria-label={`Select ${label}`}
                            className={`w-7 h-7 rounded-full border transition-transform cursor-pointer ${
                              active
                                ? 'border-[#1C1C1C] scale-110 ring-2 ring-[#1C1C1C]/25 ring-offset-2'
                                : 'border-[#D5D4D3] hover:scale-105'
                            }`}
                            style={{ backgroundColor: swatch.hex }}
                          />
                        );
                      })}
                    </div>
                  </div>

                  <div className="pt-2 flex items-center gap-2.5">
                    <input
                      id="ui-terms-check"
                      type="checkbox"
                      checked={demoCheckbox}
                      onChange={(e) => setDemoCheckbox(e.target.checked)}
                      className="w-4 h-4 accent-[#82674F] cursor-pointer"
                    />
                    <label htmlFor="ui-terms-check" className="text-[12px] text-[#4F3926] cursor-pointer">
                      I agree to OKART Interiors Terms &amp; Conditions
                    </label>
                  </div>
                </div>

                {/* Column 3: Accordion & Mega-Menu Preview */}
                <div className="space-y-4">
                  <div className="border border-[#E1E0DD]">
                    <button
                      type="button"
                      onClick={() => setDemoAccordionOpen((o) => !o)}
                      className="w-full px-4 py-3 bg-[#F6F5F3] flex items-center justify-between text-[11px] uppercase tracking-[0.14em] text-[#1C1C1C] cursor-pointer"
                    >
                      <span>Product Specifications Accordion</span>
                      <ChevronDown
                        className={`w-4 h-4 text-[#82674F] transition-transform ${
                          demoAccordionOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {demoAccordionOpen && (
                      <div className="p-4 text-[12px] text-[#4F3926] bg-white border-t border-[#E1E0DD] leading-relaxed">
                        Kiln-dried solid Nigerian mahogany &amp; oak frames, 10-year structural joinery warranty, custom fabric or saddle leather upholstery.
                      </div>
                    )}
                  </div>

                  {/* Mini Mega-Menu Featured Card Dropdown Block */}
                  <div className="bg-[#F6F5F3] border border-[#E1E0DD] p-3.5 space-y-2">
                    <span className="text-[10px] uppercase tracking-[0.14em] text-[#82674F] block">
                      Mega-Menu Dropdown Preview
                    </span>
                    <div className="grid grid-cols-2 gap-3 bg-white p-2.5 border border-[#E1E0DD]">
                      <div className="space-y-1">
                        <div className="text-[9px] uppercase tracking-[0.14em] text-[#82674F]">
                          7 Categories
                        </div>
                        <div className="text-[11px] text-[#82674F] underline underline-offset-4">
                          Sofas &amp; Lounge
                        </div>
                        <div className="text-[11px] text-[#1C1C1C]">Dining Furniture</div>
                        <div className="text-[11px] text-[#1C1C1C]">Kitchen Cabinetry</div>
                      </div>
                      <div className="bg-[#ECEBE8] p-1.5 flex flex-col items-center justify-center">
                        <img
                          src={BRAND_ASSETS.heritageChair}
                          alt="Mega Menu Preview"
                          className="h-12 object-contain"
                        />
                        <span className="text-[9px] uppercase tracking-[0.1em] text-[#1C1C1C] mt-1">
                          Signature Piece
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 2C. Cards Grid */}
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-[12px] uppercase tracking-[0.16em] text-[#4F3926] font-medium">
                  Card Components (Product, Category Filter, Review, Service &amp; Pillar Cards)
                </h3>
                <span className="text-[11px] text-[#82674F]">Sharp 0px image plates &amp; containers</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {/* 1. Live ProductCard (Price on Request) */}
                <div className="bg-white border border-[#E1E0DD] p-4 flex flex-col justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.14em] text-[#82674F] mb-3">
                      Product Card · Quote Item
                    </p>
                    {heritageChair && <ProductCard product={heritageChair} />}
                  </div>
                </div>

                {/* 2. Live ProductCard (Modular Suite Edition) */}
                <div className="bg-white border border-[#E1E0DD] p-4 flex flex-col justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.14em] text-[#82674F] mb-3">
                      Product Card · Modular Edition
                    </p>
                    {secondaryProduct && <ProductCard product={secondaryProduct} />}
                  </div>
                </div>

                {/* 3. Verified Google Review Card */}
                <div className="bg-white border border-[#E1E0DD] p-5 flex flex-col justify-between space-y-5">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.14em] text-[#82674F] mb-3">
                      Google Review Card
                    </p>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-0.5 text-[#A67C46]">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <Star key={idx} className="w-3.5 h-3.5 fill-[#A67C46]" />
                        ))}
                      </div>
                      <span className="text-[10px] uppercase tracking-[0.12em] text-[#82674F]">
                        Google
                      </span>
                    </div>
                    <p className="text-[13px] text-[#4F3926] leading-[1.65]">
                      &ldquo;{GOOGLE_REVIEWS[0].comment}&rdquo;
                    </p>
                  </div>
                  <div className="pt-4 border-t border-[#F0EFED]">
                    <div className="text-[12px] uppercase tracking-[0.08em] text-[#1C1C1C]">
                      {GOOGLE_REVIEWS[0].author}
                    </div>
                    <div className="text-[11px] text-[#82674F] mt-0.5">
                      {GOOGLE_REVIEWS[0].role} · {GOOGLE_REVIEWS[0].projectType}
                    </div>
                  </div>
                </div>

                {/* 4. Service Tier Card + Category Sub-Filter Card */}
                <div className="space-y-4 flex flex-col justify-between">
                  <div className="bg-white border border-[#E1E0DD] p-4 space-y-2.5 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] uppercase tracking-[0.14em] text-[#82674F]">
                        Service Card
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-[#EDE5D5] border border-[#C8B89F] text-[10px] text-[#2B1E12]">
                        {OKART_SERVICES[0].priceRange}
                      </span>
                    </div>
                    <h4 className="font-serif-display text-[22px] text-[#2B1E12] leading-tight">
                      {OKART_SERVICES[0].title}
                    </h4>
                    <p className="text-[12px] text-[#4F3926] leading-relaxed line-clamp-3">
                      {OKART_SERVICES[0].summary}
                    </p>
                  </div>

                  <div className="bg-white border border-[#E1E0DD] p-4 space-y-2">
                    <span className="text-[10px] uppercase tracking-[0.14em] text-[#82674F] block">
                      Category Sub-Cards (Click to switch)
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      {CATEGORY_CARDS.slice(0, 2).map((cat, idx) => {
                        const active = activeCatIdx === idx;
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => setActiveCatIdx(idx)}
                            className={`text-left p-2 border transition-colors cursor-pointer ${
                              active
                                ? 'bg-[#EDE5D5] text-[#2B1E12] border-[#82674F] ring-1 ring-[#82674F]'
                                : 'bg-white text-[#1C1C1C] border-[#D5D4D3] hover:border-[#82674F]'
                            }`}
                          >
                            <div className="aspect-[16/10] w-full overflow-hidden bg-[#ECEBE8] mb-1.5">
                              <img
                                src={cat.image}
                                alt={cat.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <span className="text-[10px] uppercase tracking-[0.06em] block leading-tight">
                              {cat.shortLabel}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Cards: Craftsmanship Pillar & Cart Line Card */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="bg-white border border-[#E1E0DD] p-5 flex items-center gap-5">
                  <img
                    src={TRUE_COST_PILLARS[0].image}
                    alt={TRUE_COST_PILLARS[0].title}
                    className="w-24 h-24 object-cover bg-[#E1E0DD] shrink-0"
                  />
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase tracking-[0.14em] text-[#82674F]">
                      Craftsmanship Pillar Card
                    </span>
                    <h4 className="font-serif-display text-[22px] text-[#2B1E12]">
                      {TRUE_COST_PILLARS[0].title}
                    </h4>
                    <p className="text-[12px] text-[#4F3926] leading-relaxed">
                      {TRUE_COST_PILLARS[0].body}
                    </p>
                  </div>
                </div>

                <div className="bg-white border border-[#E1E0DD] p-5 flex items-center gap-4">
                  <div className="w-20 h-20 bg-[#F0EFED] p-1.5 shrink-0 flex items-center justify-center">
                    <img
                      src={BRAND_ASSETS.heritageChair}
                      alt="Cart Line Preview"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] uppercase tracking-[0.14em] text-[#82674F]">
                        Cart Line Item Card
                      </span>
                      <Trash2 className="w-3.5 h-3.5 text-[#82674F]" />
                    </div>
                    <div className="text-[12px] uppercase tracking-[0.08em] text-[#1C1C1C] mt-0.5">
                      The Heritage Dining Chair
                    </div>
                    <div className="text-[11px] text-[#4F3926] truncate">
                      Rich Brown Leather / Solid Walnut Frame
                    </div>
                    <div className="mt-2 flex items-center justify-between text-[12px] tabular-nums">
                      <span className="text-[#82674F]">Qty: 4</span>
                      <span className="text-[#1C1C1C]">Quote Request</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 2D. Navigation Bars & Collection Toolbars */}
            <div className="bg-white border border-[#E1E0DD] p-6 md:p-7 space-y-6">
              <h3 className="text-[12px] uppercase tracking-[0.16em] text-[#4F3926] font-medium border-b border-[#F0EFED] pb-2.5">
                Navigation Bars &amp; Storefront Toolbars
              </h3>

              {/* Announcement Bar Frame */}
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase tracking-[0.12em] text-[#82674F] block">
                  1. Announcement Bar (#EDE5D5 / #2B1E12)
                </span>
                <div className="w-full bg-[#EDE5D5] text-[#2B1E12] border border-[#D5C9B4] h-9 px-4 flex items-center justify-center gap-6">
                  <ChevronLeft className="w-3.5 h-3.5 text-[#4F3926]" />
                  <span className="text-[11px] tracking-[0.14em] uppercase underline underline-offset-4 decoration-[#82674F]/60">
                    THOUGHTFULLY DESIGNED. BEAUTIFULLY CRAFTED. EXPERTLY DELIVERED.
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#4F3926]" />
                </div>
              </div>

              {/* Desktop Top Header Navigation Bar Frame */}
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase tracking-[0.12em] text-[#82674F] block">
                  2. Primary Desktop Header Navigation (64px height, 6 top routes + search + account + bag)
                </span>
                <div className="w-full bg-white border border-[#E1E0DD] px-5 h-16 flex items-center justify-between gap-4 overflow-x-auto">
                  <div className="flex items-center gap-2 shrink-0">
                    <Menu className="w-4 h-4 text-[#1C1C1C] lg:hidden" />
                    <img
                      src={BRAND_ASSETS.logoPrimary}
                      alt="OKART Logo"
                      className="h-10 w-auto object-contain"
                    />
                  </div>
                  <div className="flex items-center gap-5 shrink-0">
                    {OKART_TOP_NAV.map((item, idx) => (
                      <span
                        key={item.id}
                        className={`text-[11px] uppercase tracking-[0.13em] whitespace-nowrap ${
                          idx === 2
                            ? 'text-[#82674F] underline underline-offset-8'
                            : 'text-[#1C1C1C]'
                        }`}
                      >
                        {item.label}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="w-36 h-8 pl-2.5 bg-[#F6F5F3] border border-[#E1E0DD] rounded-sm flex items-center gap-2 text-[11px] text-[#82674F]/70">
                      <Search className="w-3 h-3 text-[#777859]" />
                      <span>Search...</span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.12em] text-[#1C1C1C]">
                      <User className="w-3.5 h-3.5" />
                      Sign Up
                    </span>
                    <span className="relative p-1.5">
                      <ShoppingBag className="w-4 h-4" />
                      <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#EDE5D5] border border-[#82674F] text-[9px] flex items-center justify-center">
                        2
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Collection Toolbar Frame */}
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase tracking-[0.12em] text-[#82674F] block">
                  3. Collection Catalog Toolbar
                </span>
                <div className="w-full px-4 py-3 border border-[#E1E0DD] bg-[#F6F5F3] flex flex-wrap items-center justify-between gap-4">
                  <span className="text-[11px] uppercase tracking-[0.16em] text-[#82674F] tabular-nums">
                    171 PIECES
                  </span>
                  <div className="flex items-center gap-4">
                    <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.14em] text-[#1C1C1C]">
                      <SlidersHorizontal className="w-3.5 h-3.5" />
                      Filters
                    </span>
                    <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.12em]">
                      <span className="text-[#82674F]">Sort:</span>
                      <span className="border border-[#D5D4D3] bg-white px-2.5 py-1 text-[#1C1C1C]">
                        Featured ▾
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 2E. Modals, Drawers & Live Chat Panel */}
            <div className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-[12px] uppercase tracking-[0.16em] text-[#4F3926] font-medium">
                  Modals, Drawers &amp; Overlays (Inspect Inline + Launch Live)
                </h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setDemoRealHomeOpen(true)}
                    className="px-4 py-2 rounded-full bg-[#EDE5D5] hover:bg-[#DFD2BC] border border-[#B9A78B] text-[#2B1E12] text-[10px] uppercase tracking-[0.14em] cursor-pointer"
                  >
                    Launch Real Spaces Modal
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDemoQuoteSubmitted(false);
                      setDemoQuoteModalOpen(true);
                    }}
                    className="px-4 py-2 rounded-full border border-[#2B1E12] text-[#2B1E12] hover:bg-white text-[10px] uppercase tracking-[0.14em] cursor-pointer"
                  >
                    Launch Custom Quote Modal
                  </button>
                  <button
                    type="button"
                    onClick={() => setCartOpen(true)}
                    className="px-4 py-2 rounded-full border border-[#82674F] text-[#4F3926] hover:bg-white text-[10px] uppercase tracking-[0.14em] cursor-pointer"
                  >
                    Open Selection Bag Drawer
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Modal Anatomy Frame: Real Spaces Modal */}
                <div className="bg-white border border-[#E1E0DD] shadow-sm grid grid-cols-1 sm:grid-cols-12 overflow-hidden">
                  <div className="sm:col-span-5 bg-[#F0EFED] min-h-[210px]">
                    <img
                      src={REAL_HOMES_GALLERY[0].image}
                      alt="Modal Installation"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="sm:col-span-7 p-5 bg-[#F6F5F3] flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase tracking-[0.16em] text-[#82674F]">
                          Split Modal Anatomy
                        </span>
                        <span className="w-7 h-7 rounded-full bg-white flex items-center justify-center border border-[#E1E0DD]">
                          <X className="w-3.5 h-3.5" />
                        </span>
                      </div>
                      <h4 className="font-serif-display text-[22px] text-[#2B1E12] mt-1">
                        {REAL_HOMES_GALLERY[0].handle}
                      </h4>
                      <div className="flex items-center gap-1 text-[11px] text-[#82674F] mt-0.5">
                        <MapPin className="w-3 h-3" />
                        <span>{REAL_HOMES_GALLERY[0].location}</span>
                      </div>
                      <p className="text-[12px] text-[#4F3926] mt-2 line-clamp-2">
                        {REAL_HOMES_GALLERY[0].caption}
                      </p>
                    </div>
                    <div className="bg-white p-2.5 border border-[#E1E0DD] flex items-center justify-between gap-2">
                      <span className="text-[11px] uppercase tracking-[0.08em] text-[#1C1C1C]">
                        Heritage Dining Chair
                      </span>
                      <span className="px-3 py-1 rounded-full bg-[#EDE5D5] border border-[#B9A78B] text-[#2B1E12] text-[10px] uppercase tracking-[0.12em]">
                        Quote
                      </span>
                    </div>
                  </div>
                </div>

                {/* Live Chat Overlay Anatomy Frame */}
                <div className="bg-white border border-[#D5D4D3] shadow-sm flex flex-col overflow-hidden">
                  <div className="bg-[#EDE5D5] text-[#2B1E12] border-b border-[#D5C9B4] px-5 py-3 flex items-center justify-between">
                    <div>
                      <p className="text-[9px] uppercase tracking-[0.18em] text-[#82674F]">
                        Live Chat Panel Anatomy
                      </p>
                      <h4 className="font-serif-display text-[19px] leading-tight">
                        Live Design Chat
                      </h4>
                    </div>
                    <X className="w-4 h-4 text-[#4F3926]" />
                  </div>
                  <div className="p-4 bg-[#F6F5F3] space-y-2.5 flex-1">
                    <div className="max-w-[80%] px-3 py-2 bg-white border border-[#E1E0DD] text-[12px] text-[#1C1C1C]">
                      Welcome to OKART Interiors. How can we assist with your project today?
                    </div>
                    <div className="flex justify-end">
                      <div className="max-w-[80%] px-3 py-2 bg-[#EDE5D5] border border-[#D5C9B4] text-[12px] text-[#2B1E12]">
                        Quote for 8 Heritage Dining Chairs in Walnut &amp; Rich Leather
                      </div>
                    </div>
                  </div>
                  <div className="p-2.5 bg-white border-t border-[#E1E0DD] flex items-center gap-2">
                    <div className="flex-1 h-8 px-3 bg-[#F6F5F3] border border-[#D5D4D3] flex items-center text-[11px] text-[#82674F]">
                      Write your enquiry...
                    </div>
                    <span className="h-8 px-3 rounded-full bg-[#EDE5D5] border border-[#B9A78B] flex items-center justify-center text-[#2B1E12]">
                      <Send className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ================================================================
            3. INTERACTIVE STATES (DEFAULT / HOVER / ACTIVE / ERROR)
        ================================================================ */}
        {showStates && (
          <section aria-labelledby="states-heading" className="space-y-8 scroll-mt-12">
            <div className="border-b border-[#E1E0DD] pb-4 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#82674F]">
                  SECTION 03 · INTERACTION &amp; VALIDATION MATRIX
                </p>
                <h2 id="states-heading" className="font-serif-display text-[32px] md:text-[38px] text-[#2B1E12]">
                  Interactive States Side-by-Side
                </h2>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setSandboxErrorMode((prev) => !prev)}
                  className={`px-4 py-2 rounded-full text-[10px] uppercase tracking-[0.14em] border transition-colors cursor-pointer ${
                    sandboxErrorMode
                      ? 'bg-[#8E5235] text-white border-[#8E5235]'
                      : 'bg-white text-[#2B1E12] border-[#B9A78B]'
                  }`}
                >
                  {sandboxErrorMode ? 'Live Sandbox: Error Mode ON' : 'Toggle Live Error Sandbox'}
                </button>
              </div>
            </div>

            {/* Live Interactive Sandbox Strip */}
            <div className="bg-white border border-[#E1E0DD] p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-4 space-y-1">
                <span className="text-[10px] uppercase tracking-[0.16em] text-[#82674F]">
                  Live Validation Sandbox
                </span>
                <h3 className="font-serif-display text-[24px] text-[#2B1E12]">
                  Test Focus, Input &amp; Error Feedback
                </h3>
                <p className="text-[12px] text-[#4F3926]">
                  Clear the email below or toggle Error Mode to test real-time border &amp; alert styling.
                </p>
              </div>

              <div className="md:col-span-5">
                <label
                  htmlFor="sandbox-email"
                  className="block text-[11px] uppercase tracking-[0.1em] text-[#4F3926] mb-1"
                >
                  Client Email Address
                </label>
                <input
                  id="sandbox-email"
                  type="email"
                  value={sandboxEmail}
                  onChange={(e) => setSandboxEmail(e.target.value)}
                  className={`w-full h-11 px-3.5 text-[13px] border focus:outline-none transition-colors ${
                    sandboxErrorMode || !sandboxEmail.includes('@')
                      ? 'bg-[#8E5235]/5 border-[#8E5235] text-[#1C1C1C]'
                      : 'bg-[#F6F5F3] border-[#D5D4D3] focus:border-[#82674F] text-[#1C1C1C]'
                  }`}
                />
                {(sandboxErrorMode || !sandboxEmail.includes('@')) && (
                  <p role="alert" className="mt-1.5 inline-flex items-center gap-1.5 text-[11px] text-[#8E5235]">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Please enter a valid email address (e.g. client@okartinteriors.ng).</span>
                  </p>
                )}
              </div>

              <div className="md:col-span-3 flex flex-col gap-2">
                <button
                  type="button"
                  disabled={sandboxErrorMode || !sandboxEmail.includes('@')}
                  onClick={() => showToast(`Validated: ${sandboxEmail}`)}
                  className="w-full py-3 rounded-full bg-[#EDE5D5] hover:bg-[#DFD2BC] border border-[#B9A78B] text-[#2B1E12] text-[11px] uppercase tracking-[0.16em] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  Validate &amp; Save
                </button>
              </div>
            </div>

            {/* 4-Column Side-by-Side Matrix */}
            <div className="bg-white border border-[#E1E0DD] overflow-x-auto">
              <div className="min-w-[880px]">
                {/* Column Header */}
                <div className="grid grid-cols-12 bg-[#EEE8DE] border-b border-[#E1E0DD] px-5 py-3 text-[10px] uppercase tracking-[0.16em] text-[#4F3926] font-medium">
                  <div className="col-span-2">Component</div>
                  <div className="col-span-2">Default</div>
                  <div className="col-span-3">Hover</div>
                  <div className="col-span-3">Active / Focus / Selected</div>
                  <div className="col-span-2">Error / Disabled</div>
                </div>

                {/* Row 1: Primary Cream Button */}
                <div className="grid grid-cols-12 items-center gap-4 px-5 py-5 border-b border-[#F0EFED]">
                  <div className="col-span-2">
                    <div className="text-[12px] font-medium text-[#1C1C1C]">Primary Cream CTA</div>
                    <div className="text-[10px] text-[#82674F]">#EDE5D5 Pill</div>
                  </div>
                  <div className="col-span-2">
                    <button
                      type="button"
                      className="px-5 py-2.5 rounded-full bg-[#EDE5D5] border border-[#B9A78B] text-[#2B1E12] text-[10px] uppercase tracking-[0.14em]"
                    >
                      Request Quote
                    </button>
                  </div>
                  <div className="col-span-3">
                    <button
                      type="button"
                      className="px-5 py-2.5 rounded-full bg-[#DFD2BC] border border-[#82674F] text-[#2B1E12] text-[10px] uppercase tracking-[0.14em] shadow-xs"
                    >
                      Request Quote
                    </button>
                    <span className="block text-[10px] text-[#82674F] mt-1">bg-[#DFD2BC]</span>
                  </div>
                  <div className="col-span-3">
                    <button
                      type="button"
                      className="px-5 py-2.5 rounded-full bg-[#DFD2BC] border border-[#2B1E12] ring-2 ring-[#82674F]/40 ring-offset-2 text-[#2B1E12] text-[10px] uppercase tracking-[0.14em] scale-[0.98]"
                    >
                      Request Quote
                    </button>
                    <span className="block text-[10px] text-[#82674F] mt-1">ring-[#82674F]/40 · scale(0.98)</span>
                  </div>
                  <div className="col-span-2">
                    <button
                      type="button"
                      disabled
                      className="px-5 py-2.5 rounded-full bg-[#EDE5D5]/55 border border-[#D5D4D3] text-[#82674F] opacity-55 text-[10px] uppercase tracking-[0.14em] cursor-not-allowed"
                    >
                      Disabled
                    </button>
                  </div>
                </div>

                {/* Row 2: Secondary Outline Button */}
                <div className="grid grid-cols-12 items-center gap-4 px-5 py-5 border-b border-[#F0EFED]">
                  <div className="col-span-2">
                    <div className="text-[12px] font-medium text-[#1C1C1C]">Secondary Outline</div>
                    <div className="text-[10px] text-[#82674F]">#2B1E12 Border</div>
                  </div>
                  <div className="col-span-2">
                    <button
                      type="button"
                      className="px-5 py-2.5 rounded-full border border-[#2B1E12] text-[#2B1E12] text-[10px] uppercase tracking-[0.14em]"
                    >
                      View Bag
                    </button>
                  </div>
                  <div className="col-span-3">
                    <button
                      type="button"
                      className="px-5 py-2.5 rounded-full border border-[#2B1E12] bg-[#F6F5F3] text-[#2B1E12] text-[10px] uppercase tracking-[0.14em]"
                    >
                      View Bag
                    </button>
                    <span className="block text-[10px] text-[#82674F] mt-1">bg-[#F6F5F3] / #FFFFFF</span>
                  </div>
                  <div className="col-span-3">
                    <button
                      type="button"
                      className="px-5 py-2.5 rounded-full border-2 border-[#82674F] bg-[#EDE5D5] text-[#2B1E12] text-[10px] uppercase tracking-[0.14em]"
                    >
                      Selected
                    </button>
                  </div>
                  <div className="col-span-2">
                    <button
                      type="button"
                      disabled
                      className="px-5 py-2.5 rounded-full border border-[#D5D4D3] text-[#BFBCB4] text-[10px] uppercase tracking-[0.14em] cursor-not-allowed"
                    >
                      Disabled
                    </button>
                  </div>
                </div>

                {/* Row 3: Form Text Input */}
                <div className="grid grid-cols-12 items-center gap-4 px-5 py-5 border-b border-[#F0EFED]">
                  <div className="col-span-2">
                    <div className="text-[12px] font-medium text-[#1C1C1C]">Text Input Field</div>
                    <div className="text-[10px] text-[#82674F]">h-11 Sharp Field</div>
                  </div>
                  <div className="col-span-2">
                    <input
                      readOnly
                      value="Placeholder..."
                      aria-label="Default input preview"
                      className="w-full h-10 px-3 bg-[#F6F5F3] border border-[#D5D4D3] text-[12px] text-[#82674F]"
                    />
                  </div>
                  <div className="col-span-3">
                    <input
                      readOnly
                      value="Hover state"
                      aria-label="Hover input preview"
                      className="w-full h-10 px-3 bg-[#F6F5F3] border border-[#B9A78B] text-[12px] text-[#1C1C1C]"
                    />
                  </div>
                  <div className="col-span-3">
                    <input
                      readOnly
                      value="Adebayo Ogunleye|"
                      aria-label="Focus input preview"
                      className="w-full h-10 px-3 bg-white border-2 border-[#82674F] text-[12px] text-[#1C1C1C]"
                    />
                    <span className="block text-[10px] text-[#82674F] mt-1">focus:border-[#82674F]</span>
                  </div>
                  <div className="col-span-2">
                    <input
                      readOnly
                      value="invalid@"
                      aria-label="Error input preview"
                      className="w-full h-10 px-3 bg-[#8E5235]/5 border border-[#8E5235] text-[12px] text-[#8E5235]"
                    />
                    <span className="block text-[10px] text-[#8E5235] mt-1">Valid email required</span>
                  </div>
                </div>

                {/* Row 4: Select Dropdown */}
                <div className="grid grid-cols-12 items-center gap-4 px-5 py-5 border-b border-[#F0EFED]">
                  <div className="col-span-2">
                    <div className="text-[12px] font-medium text-[#1C1C1C]">Select Dropdown</div>
                    <div className="text-[10px] text-[#82674F]">Profile / Sort</div>
                  </div>
                  <div className="col-span-2">
                    <div className="h-10 px-3 bg-[#F6F5F3] border border-[#D5D4D3] flex items-center justify-between text-[12px] text-[#1C1C1C]">
                      <span>Featured</span>
                      <ChevronDown className="w-3.5 h-3.5 text-[#82674F]" />
                    </div>
                  </div>
                  <div className="col-span-3">
                    <div className="h-10 px-3 bg-white border border-[#B9A78B] flex items-center justify-between text-[12px] text-[#1C1C1C]">
                      <span>Alphabetical: A–Z</span>
                      <ChevronDown className="w-3.5 h-3.5 text-[#2B1E12]" />
                    </div>
                  </div>
                  <div className="col-span-3">
                    <div className="h-10 px-3 bg-white border border-[#82674F] ring-1 ring-[#82674F]/40 flex items-center justify-between text-[12px] text-[#2B1E12]">
                      <span>Architect Profile</span>
                      <ChevronDown className="w-3.5 h-3.5 rotate-180 text-[#82674F]" />
                    </div>
                  </div>
                  <div className="col-span-2">
                    <div className="h-10 px-3 bg-[#8E5235]/5 border border-[#8E5235] flex items-center justify-between text-[12px] text-[#8E5235]">
                      <span>Select option</span>
                      <AlertCircle className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>

                {/* Row 5: Category Filter Sub-Tile */}
                <div className="grid grid-cols-12 items-center gap-4 px-5 py-5 border-b border-[#F0EFED]">
                  <div className="col-span-2">
                    <div className="text-[12px] font-medium text-[#1C1C1C]">Category Filter Tile</div>
                    <div className="text-[10px] text-[#82674F]">CollectionPage</div>
                  </div>
                  <div className="col-span-2">
                    <div className="p-2.5 bg-white border border-[#D5D4D3] text-[10px] uppercase tracking-[0.08em] text-[#1C1C1C]">
                      Dining Furniture
                    </div>
                  </div>
                  <div className="col-span-3">
                    <div className="p-2.5 bg-white border border-[#82674F] text-[10px] uppercase tracking-[0.08em] text-[#1C1C1C]">
                      Dining Furniture (Hover)
                    </div>
                  </div>
                  <div className="col-span-3">
                    <div className="p-2.5 bg-[#EDE5D5] border border-[#82674F] ring-1 ring-[#82674F] text-[10px] uppercase tracking-[0.08em] text-[#2B1E12]">
                      Dining Furniture (Active)
                    </div>
                  </div>
                  <div className="col-span-2">
                    <div className="p-2.5 bg-[#F6F5F3] border border-[#E1E0DD] text-[10px] uppercase tracking-[0.08em] text-[#BFBCB4]">
                      Empty Category
                    </div>
                  </div>
                </div>

                {/* Row 6: Header Navigation Link & Fabric Swatch */}
                <div className="grid grid-cols-12 items-center gap-4 px-5 py-5">
                  <div className="col-span-2">
                    <div className="text-[12px] font-medium text-[#1C1C1C]">Nav Link &amp; Swatch</div>
                    <div className="text-[10px] text-[#82674F]">Typography + Dot</div>
                  </div>
                  <div className="col-span-2 flex items-center gap-3">
                    <span className="text-[11px] uppercase tracking-[0.13em] text-[#1C1C1C]">
                      Products
                    </span>
                    <span className="w-5 h-5 rounded-full border border-[#D5D4D3] bg-[#C9B398]" />
                  </div>
                  <div className="col-span-3 flex items-center gap-3">
                    <span className="text-[11px] uppercase tracking-[0.13em] text-[#82674F]">
                      Products
                    </span>
                    <span className="w-5 h-5 rounded-full border border-[#82674F] scale-105 bg-[#C9B398]" />
                  </div>
                  <div className="col-span-3 flex items-center gap-3">
                    <span className="text-[11px] uppercase tracking-[0.13em] text-[#82674F] underline underline-offset-8">
                      Products
                    </span>
                    <span className="w-5 h-5 rounded-full border border-[#1C1C1C] ring-2 ring-[#1C1C1C]/25 ring-offset-2 bg-[#7A4423]" />
                  </div>
                  <div className="col-span-2 flex items-center gap-3">
                    <span className="text-[11px] uppercase tracking-[0.13em] text-[#BFBCB4]">
                      Archived
                    </span>
                    <span className="relative w-5 h-5 rounded-full border border-[#D5D4D3] bg-[#EDE5D5] opacity-50 overflow-hidden">
                      <span className="absolute inset-0 border-t border-[#8E5235] rotate-45 translate-y-2" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Quick Footer Jump to Storefront Routes */}
        <div className="bg-[#EEE8DE] border border-[#E1E0DD] p-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.16em] text-[#82674F]">
              LIVE ROUTE INSPECTOR
            </p>
            <p className="text-[13px] text-[#2B1E12] mt-0.5">
              Jump directly to any OKART Interiors storefront route to inspect full page compositions.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { label: 'Home', path: '/' },
              { label: 'Our Products', path: '/products' },
              { label: 'Heritage Chair PDP', path: '/products/the-heritage-dining-chair' },
              { label: 'Video Showcase', path: '/pages/video' },
              { label: 'Sign Up', path: '/signup' },
              { label: 'Contact', path: '/pages/contact' },
            ].map((route) => (
              <button
                key={route.path}
                type="button"
                onClick={() => {
                  navigate(route.path);
                  onExitShowcase();
                }}
                className="px-4 py-2 rounded-full bg-white hover:bg-[#EDE5D5] border border-[#D5D4D3] text-[10px] uppercase tracking-[0.14em] text-[#2B1E12] transition-colors cursor-pointer"
              >
                {route.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Live Demo Real Spaces Modal */}
      <RealHomesModal
        post={demoRealHomeOpen ? REAL_HOMES_GALLERY[0] : null}
        onClose={() => setDemoRealHomeOpen(false)}
      />

      {/* Live Demo Custom Quote Modal */}
      {demoQuoteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-[#2B1E12]/45"
            onClick={() => setDemoQuoteModalOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Custom Bespoke Quote Modal Preview"
            className="relative z-10 bg-white max-w-md w-full p-6 md:p-8 border border-[#E1E0DD] shadow-2xl space-y-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.16em] text-[#82674F]">
                  MODAL DIALOG PREVIEW
                </p>
                <h3 className="font-serif-display text-[26px] text-[#2B1E12] leading-tight mt-0.5">
                  Request Custom Quote
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setDemoQuoteModalOpen(false)}
                aria-label="Close quote modal preview"
                className="p-1.5 text-[#1C1C1C] hover:text-[#82674F] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {demoQuoteSubmitted ? (
              <div className="p-4 bg-[#EEE8DE] border border-[#D5D4D3] text-[13px] text-[#2B1E12] space-y-2">
                <p className="font-medium">Quotation request preview submitted.</p>
                <p className="text-[12px] text-[#4F3926]">
                  Contact: {OKART_CONTACT.phone} · {OKART_CONTACT.email}
                </p>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setDemoQuoteSubmitted(true);
                }}
                className="space-y-3"
              >
                <div>
                  <label className="block text-[11px] uppercase tracking-[0.1em] text-[#4F3926] mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    defaultValue="Folake Adeyemi"
                    className="w-full h-10 px-3 bg-[#F6F5F3] border border-[#D5D4D3] text-[13px] focus:outline-none focus:border-[#82674F]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-[0.1em] text-[#4F3926] mb-1">
                    Phone / WhatsApp
                  </label>
                  <input
                    type="tel"
                    required
                    defaultValue="09090643748"
                    className="w-full h-10 px-3 bg-[#F6F5F3] border border-[#D5D4D3] text-[13px] focus:outline-none focus:border-[#82674F]"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 rounded-full bg-[#EDE5D5] hover:bg-[#DFD2BC] border border-[#B9A78B] text-[#2B1E12] text-[11px] uppercase tracking-[0.16em] cursor-pointer"
                >
                  Submit Quotation Request
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
