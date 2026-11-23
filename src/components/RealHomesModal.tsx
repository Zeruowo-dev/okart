import React from 'react';
import { MapPin, X } from 'lucide-react';
import type { RealHomePost } from '../data/siteContent';
import { useStore } from '../context/StoreContext';

interface RealHomesModalProps {
  post: RealHomePost | null;
  onClose: () => void;
}

export function RealHomesModal({ post, onClose }: RealHomesModalProps) {
  const { getProductByHandle, navigate, addToCart } = useStore();

  if (!post) return null;

  const taggedProducts = post.featuredHandles
    .map((h) => getProductByHandle(h))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-[#2B1E12]/50" onClick={onClose} />
      <div className="relative z-10 bg-white max-w-4xl w-full grid grid-cols-1 md:grid-cols-12 overflow-hidden shadow-2xl border border-[#E1E0DD]">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close installation preview"
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center text-[#1C1C1C] hover:bg-[#F6F5F3] cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="md:col-span-7 bg-[#F0EFED] aspect-square md:aspect-auto">
          <img
            src={post.image}
            alt={`Installation by ${post.handle}`}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="md:col-span-5 p-6 md:p-8 flex flex-col justify-between bg-[#F6F5F3]">
          <div>
            <div className="text-[11px] uppercase tracking-[0.16em] text-[#82674F]">
              OKART Interiors Installation
            </div>
            <h3 className="font-serif-display text-[26px] text-[#2B1E12] mt-1">
              {post.handle}
            </h3>
            <div className="flex items-center gap-1.5 text-[12px] text-[#82674F] mt-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>{post.location}</span>
            </div>
            <p className="text-[13px] text-[#4F3926] leading-relaxed mt-4">
              {post.caption}
            </p>

            <div className="mt-6 pt-5 border-t border-[#E1E0DD]">
              <p className="text-[10px] uppercase tracking-[0.16em] text-[#82674F] mb-3">
                Featured in this space
              </p>
              <div className="space-y-3">
                {taggedProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white p-3 border border-[#E1E0DD] flex items-center gap-3"
                  >
                    <img
                      src={product.images[0]}
                      alt={product.model}
                      referrerPolicy="no-referrer"
                      className="w-14 h-14 object-contain bg-[#F0EFED] p-1 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          navigate(`/products/${product.handle}`);
                        }}
                        className="text-[11px] uppercase tracking-[0.08em] text-[#1C1C1C] hover:underline truncate block text-left cursor-pointer"
                      >
                        {product.model}
                      </button>
                      <div className="text-[11px] text-[#82674F] truncate">
                        {product.subtitle}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        addToCart(product);
                        onClose();
                      }}
                      className="px-3 py-1.5 rounded-full bg-[#EDE5D5] text-[#2B1E12] border border-[#B9A78B] text-[10px] uppercase tracking-[0.12em] shrink-0 hover:bg-[#DFD2BC] cursor-pointer"
                    >
                      Select
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              onClose();
              navigate('/pages/projects');
            }}
            className="mt-6 w-full py-2.5 rounded-full border border-[#2B1E12] text-[#2B1E12] text-[11px] uppercase tracking-[0.14em] hover:bg-white transition-colors cursor-pointer"
          >
            View all interior projects
          </button>
        </div>
      </div>
    </div>
  );
}
