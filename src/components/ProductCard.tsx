import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { getSwatchVisual, type ProductItem } from '../utils/storeLogic';

interface ProductCardProps {
  product: ProductItem;
}

export function ProductCard({ product }: ProductCardProps) {
  const { navigate } = useStore();
  const [selectedVariantIdx, setSelectedVariantIdx] = useState<number>(0);
  const [imageIdx, setImageIdx] = useState<number>(0);
  const [failedSrcs, setFailedSrcs] = useState<Record<string, boolean>>({});

  const visibleVariants = product.variants.slice(0, 4);
  const extraVariantCount = Math.max(0, product.variants.length - 4);
  const activeVariant = product.variants[selectedVariantIdx] || product.variants[0];

  const galleryRaw =
    activeVariant?.image && !product.images.includes(activeVariant.image)
      ? [activeVariant.image, ...product.images]
      : product.images.length > 0
      ? product.images
      : activeVariant?.image
      ? [activeVariant.image]
      : [];

  const gallery = galleryRaw.filter((u) => Boolean(u) && !failedSrcs[u]);

  const displayedImage =
    selectedVariantIdx > 0 && activeVariant?.image && !failedSrcs[activeVariant.image]
      ? activeVariant.image
      : gallery[imageIdx % Math.max(1, gallery.length)] || '';

  const handleOpenProduct = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(`/products/${product.handle}`);
  };

  return (
    <article className="group flex flex-col">
      {/* Image Plate */}
      <div className="relative bg-[#ECEBE8] aspect-[4/4.2] overflow-hidden">
        {product.badges.length > 0 && (
          <div className="absolute top-3 right-3 z-10 flex flex-col items-end gap-1.5 pointer-events-none">
            {product.badges.map((badge) => (
              <span
                key={badge}
                className="px-3 py-1 rounded-full bg-[#EDE5D5] text-[#2B1E12] border border-[#C8B89F] text-[9px] uppercase tracking-[0.14em] leading-none"
              >
                {badge}
              </span>
            ))}
          </div>
        )}

        <a
          href={`/products/${product.handle}`}
          onClick={handleOpenProduct}
          className="block w-full h-full"
        >
          {displayedImage ? (
            <img
              src={displayedImage}
              alt={product.title}
              referrerPolicy="no-referrer"
              onError={() =>
                setFailedSrcs((prev) => ({ ...prev, [displayedImage]: true }))
              }
              className="w-full h-full object-contain p-4 transition-transform duration-300 group-hover:scale-[1.03] mix-blend-multiply"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center text-[#82674F]">
              <span className="font-serif-display text-[20px] text-[#2B1E12]">
                {product.model}
              </span>
              {product.subtitle && (
                <span className="text-[11px] mt-1">{product.subtitle}</span>
              )}
            </div>
          )}
        </a>

        {gallery.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedVariantIdx(0);
                setImageIdx((prev) => (prev - 1 + gallery.length) % gallery.length);
              }}
              aria-label={`Previous image of ${product.model}`}
              className="opacity-0 group-hover:opacity-100 transition-opacity absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/85 flex items-center justify-center text-[#1C1C1C] shadow-sm cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedVariantIdx(0);
                setImageIdx((prev) => (prev + 1) % gallery.length);
              }}
              aria-label={`Next image of ${product.model}`}
              className="opacity-0 group-hover:opacity-100 transition-opacity absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/85 flex items-center justify-center text-[#1C1C1C] shadow-sm cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </>
        )}
      </div>

      {/* Product Info below plate */}
      <div className="pt-3 flex-1 flex flex-col justify-between gap-2">
        <a
          href={`/products/${product.handle}`}
          onClick={handleOpenProduct}
          className="block space-y-0.5"
        >
          <div className="text-[12px] uppercase tracking-[0.06em] text-[#1C1C1C] font-normal leading-snug">
            {product.model}
          </div>
          {product.subtitle && (
            <div className="text-[11px] text-[#82674F] leading-snug line-clamp-1">
              {product.subtitle}
            </div>
          )}
          <div className="text-[11px] text-[#A29E95] leading-snug">
            {product.designer || 'OKART Interiors'}
          </div>
        </a>

        {product.variants.length > 1 && (
          <div className="flex items-center gap-1 pt-1">
            {visibleVariants.map((variant, idx) => {
              const swatch = getSwatchVisual(variant.title);
              const isSelected = idx === selectedVariantIdx;
              return (
                <button
                  key={variant.id}
                  type="button"
                  title={variant.title}
                  aria-label={`Select ${variant.title} for ${product.model}`}
                  onClick={() => setSelectedVariantIdx(idx)}
                  className={`w-3.5 h-3.5 rounded-full border transition-transform cursor-pointer ${
                    isSelected
                      ? 'border-[#1C1C1C] scale-110 ring-1 ring-[#1C1C1C]/30 ring-offset-1'
                      : 'border-[#D5D4D3] hover:scale-105'
                  }`}
                  style={{ backgroundColor: swatch.hex }}
                />
              );
            })}
            {extraVariantCount > 0 && (
              <button
                type="button"
                onClick={handleOpenProduct}
                className="text-[10px] text-[#82674F] pl-0.5 hover:text-[#1C1C1C] tabular-nums cursor-pointer"
              >
                + {extraVariantCount}
              </button>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
