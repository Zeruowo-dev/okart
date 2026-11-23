import React, { useMemo, useState } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { BRAND_ASSETS, CATEGORY_CARDS } from '../data/siteContent';
import { ProductCard } from '../components/ProductCard';
import { NewsletterSection } from '../components/NewsletterSection';
import { filterAndSortProducts, type SortOption } from '../utils/storeLogic';

interface CollectionPageProps {
  handle: string;
}

export function CollectionPage({ handle }: CollectionPageProps) {
  const { collections, getCollectionProducts, navigate } = useStore();
  const [subCategory, setSubCategory] = useState<string>('all');
  const [designerFilter, setDesignerFilter] = useState<string>('All');
  const [materialFilter, setMaterialFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [page, setPage] = useState(1);

  const pageSize = 24;
  const colMeta = collections[handle];
  const baseProducts = useMemo(() => getCollectionProducts(handle), [getCollectionProducts, handle]);

  const availableDesigners = useMemo(() => {
    const set = new Set(baseProducts.map((p) => p.designer).filter(Boolean));
    return ['All', ...Array.from(set)];
  }, [baseProducts]);

  const filteredProducts = useMemo(() => {
    return filterAndSortProducts(baseProducts, {
      subCategory,
      designer: designerFilter,
      material: materialFilter,
      sortBy,
    });
  }, [baseProducts, subCategory, designerFilter, materialFilter, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const pageProducts = filteredProducts.slice((safePage - 1) * pageSize, safePage * pageSize);

  const isAllProductsPage = handle === 'all-furniture' || handle === 'all';
  const displayTitle = isAllProductsPage
    ? 'Our Products'
    : colMeta?.title ||
      handle
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (l) => l.toUpperCase());

  const displayDescription = isAllProductsPage
    ? 'Explore handcrafted residential, commercial, kitchen cabinetry, hospitality, and event furniture from OKART Interiors.'
    : colMeta?.description;

  return (
    <div className="bg-[#F6F5F3]">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8 pt-8 pb-16">
        {/* Collection Title */}
        <div className="mb-6">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#82674F] mb-1">
            OKART INTERIORS CATALOG
          </p>
          <h1 className="font-serif-display text-[38px] md:text-[46px] text-[#2B1E12] leading-tight">
            {displayTitle}
          </h1>
          {displayDescription && (
            <p className="text-[13px] text-[#4F3926] max-w-2xl mt-2 leading-relaxed">
              {displayDescription}
            </p>
          )}
        </div>

        {/* 7 Product Category Sub-Buttons with Images */}
        <div
          aria-label="Product categories"
          className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 pb-6 mb-6 border-b border-[#E1E0DD]"
        >
          <button
            type="button"
            onClick={() => {
              navigate('/products');
              setPage(1);
            }}
            className={`text-left p-2 border transition-colors flex flex-col justify-between cursor-pointer ${
              isAllProductsPage
                ? 'bg-[#EDE5D5] text-[#2B1E12] border-[#82674F] ring-1 ring-[#82674F]'
                : 'bg-white text-[#1C1C1C] border-[#D5D4D3] hover:border-[#82674F]'
            }`}
          >
            <div className="aspect-[16/10] w-full overflow-hidden bg-[#ECEBE8] mb-2">
              <img
                src={BRAND_ASSETS.savannahSofa}
                alt="All Products"
                className="w-full h-full object-contain p-1"
              />
            </div>
            <span className="text-[11px] uppercase tracking-[0.08em] leading-tight">
              All Furniture
            </span>
          </button>

          {CATEGORY_CARDS.map((cat) => {
            const active = handle === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setSubCategory('all');
                  setDesignerFilter('All');
                  setMaterialFilter('All');
                  setPage(1);
                  navigate(cat.href);
                }}
                className={`text-left p-2 border transition-colors flex flex-col justify-between cursor-pointer ${
                  active
                    ? 'bg-[#EDE5D5] text-[#2B1E12] border-[#82674F] ring-1 ring-[#82674F]'
                    : 'bg-white text-[#1C1C1C] border-[#D5D4D3] hover:border-[#82674F]'
                }`}
              >
                <div className="aspect-[16/10] w-full overflow-hidden bg-[#ECEBE8] mb-2">
                  <img
                    src={cat.image}
                    alt={cat.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-[11px] uppercase tracking-[0.08em] leading-tight">
                  {cat.shortLabel}
                </span>
              </button>
            );
          })}
        </div>

        {/* Toolbar: Product Count + Filter Drawer Toggle + Sort */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-3 mb-6 border-b border-[#E1E0DD]">
          <span className="text-[11px] uppercase tracking-[0.16em] text-[#82674F] tabular-nums">
            {filteredProducts.length} PIECES
          </span>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setFiltersOpen((prev) => !prev)}
              className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-[#1C1C1C] hover:text-[#82674F] cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
            </button>

            <div className="flex items-center gap-2">
              <label htmlFor="sort-select" className="text-[11px] uppercase tracking-[0.12em] text-[#82674F]">
                Sort:
              </label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="bg-transparent text-[11px] uppercase tracking-[0.12em] text-[#1C1C1C] border border-[#D5D4D3] px-2.5 py-1.5 focus:outline-none focus:border-[#82674F]"
              >
                <option value="featured">Featured</option>
                <option value="title-asc">Alphabetical: A–Z</option>
                <option value="title-desc">Alphabetical: Z–A</option>
              </select>
            </div>
          </div>
        </div>

        {/* Expandable Filter Panel */}
        {filtersOpen && (
          <div className="bg-white border border-[#E1E0DD] p-6 mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-[10px] uppercase tracking-[0.16em] text-[#82674F] mb-2.5">
                Collection / Atelier
              </p>
              <div className="flex flex-wrap gap-2">
                {availableDesigners.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => {
                      setDesignerFilter(d);
                      setPage(1);
                    }}
                    className={`px-3.5 py-1.5 rounded-full text-[11px] border cursor-pointer ${
                      designerFilter === d
                        ? 'bg-[#2B1E12] text-white border-[#2B1E12]'
                        : 'bg-[#F6F5F3] text-[#1C1C1C] border-[#D5D4D3]'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-[0.16em] text-[#82674F] mb-2.5">
                Material / Textile
              </p>
              <div className="flex flex-wrap gap-2">
                {['All', 'Leather', 'Bouclé', 'Hallingdal', 'Linen', 'Oak'].map((mat) => (
                  <button
                    key={mat}
                    type="button"
                    onClick={() => {
                      setMaterialFilter(mat);
                      setPage(1);
                    }}
                    className={`px-3.5 py-1.5 rounded-full text-[11px] border cursor-pointer ${
                      materialFilter === mat
                        ? 'bg-[#2B1E12] text-white border-[#2B1E12]'
                        : 'bg-[#F6F5F3] text-[#1C1C1C] border-[#D5D4D3]'
                    }`}
                  >
                    {mat}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-end justify-end">
              <button
                type="button"
                onClick={() => {
                  setSubCategory('all');
                  setDesignerFilter('All');
                  setMaterialFilter('All');
                  setSortBy('featured');
                }}
                className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.14em] text-[#82674F] hover:text-[#2B1E12] underline cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                Clear all filters
              </button>
            </div>
          </div>
        )}

        {/* 4-column Product Grid with Lifestyle Insert */}
        {pageProducts.length === 0 ? (
          <div className="py-20 text-center bg-white border border-[#E1E0DD]">
            <p className="font-serif-display text-[26px] text-[#2B1E12]">
              No matching pieces found
            </p>
            <p className="text-[13px] text-[#82674F] mt-2">
              Try resetting your filters or commissioning a bespoke piece in our studio.
            </p>
            <button
              type="button"
              onClick={() => {
                setSubCategory('all');
                setDesignerFilter('All');
                setMaterialFilter('All');
              }}
              className="mt-5 px-6 py-2.5 rounded-full bg-[#EDE5D5] border border-[#B9A78B] text-[#2B1E12] text-[11px] uppercase tracking-[0.14em] cursor-pointer"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-10">
            {pageProducts.map((product, idx) => (
              <React.Fragment key={product.id}>
                <ProductCard product={product} />
                {safePage === 1 && idx === 7 && pageProducts.length >= 8 && (
                  <div className="col-span-2 row-span-2 relative overflow-hidden bg-[#2B1E12] min-h-[380px]">
                    <img
                      src={BRAND_ASSETS.designOwnSofaInsert}
                      alt="Commission bespoke furniture at OKART Interiors"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#2B1E12]/60 via-transparent to-transparent" />
                    <a
                      href="/pages/bespoke"
                      onClick={(e) => {
                        e.preventDefault();
                        navigate('/pages/bespoke');
                      }}
                      className="absolute left-6 bottom-6 px-6 py-2.5 rounded-full bg-[#EDE5D5] hover:bg-[#DFD2BC] border border-[#B9A78B] text-[#2B1E12] text-[11px] uppercase tracking-[0.16em] transition-colors"
                    >
                      Commission Bespoke Furniture
                    </a>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-14 flex items-center justify-center gap-3">
            {Array.from({ length: totalPages }).map((_, i) => {
              const pNum = i + 1;
              return (
                <button
                  key={pNum}
                  type="button"
                  onClick={() => {
                    setPage(pNum);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`w-8 h-8 text-[12px] tabular-nums transition-colors cursor-pointer ${
                    safePage === pNum
                      ? 'border-b-2 border-[#1C1C1C] text-[#1C1C1C] font-medium'
                      : 'text-[#82674F] hover:text-[#1C1C1C]'
                  }`}
                >
                  {pNum}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom Split Banner: BESPOKE & MODULAR STUDIO */}
      <section className="w-full bg-[#EAE6DE] border-y border-[#E1E0DD]">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 items-center">
          <div className="lg:col-span-5 px-8 lg:px-14 py-14 space-y-4">
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#82674F]">
              IN-HOUSE PRODUCTION WORKSHOP
            </p>
            <h2 className="font-serif-display text-[36px] text-[#2B1E12] leading-tight">
              Custom-Built for Your Space
            </h2>
            <p className="text-[13px] text-[#4F3926] leading-relaxed">
              Need custom dimensions, bespoke kitchen cabinetry, or tailored event seating? Submit your specifications through our Bespoke Studio or launch our interactive modular sofa configurator.
            </p>
            <div className="flex flex-wrap gap-3 pt-1">
              <button
                type="button"
                onClick={() => navigate('/pages/bespoke')}
                className="px-7 py-2.5 rounded-full bg-[#EDE5D5] hover:bg-[#DFD2BC] border border-[#B9A78B] text-[#2B1E12] text-[11px] uppercase tracking-[0.16em] transition-colors cursor-pointer"
              >
                Bespoke Studio
              </button>
              <button
                type="button"
                onClick={() => navigate('/pages/planner')}
                className="px-7 py-2.5 rounded-full bg-[#777859] hover:bg-[#676A52] text-white text-[11px] uppercase tracking-[0.16em] transition-colors cursor-pointer"
              >
                Sofa Configurator
              </button>
            </div>
          </div>
          <div className="lg:col-span-7 h-[320px] lg:h-[440px] overflow-hidden">
            <img
              src={BRAND_ASSETS.designOwnSofaInsert}
              alt="Custom lounge interior by OKART Interiors"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      <NewsletterSection />
    </div>
  );
}
