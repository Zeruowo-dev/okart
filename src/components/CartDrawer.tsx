import React from 'react';
import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export function CartDrawer() {
  const {
    cart,
    cartOpen,
    setCartOpen,
    updateQuantity,
    removeFromCart,
    cartTotals,
    navigate,
  } = useStore();

  if (!cartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="fixed inset-0 bg-[#2B1E12]/35 transition-opacity"
        onClick={() => setCartOpen(false)}
      />

      <aside
        aria-label="Shopping cart & quotation bag"
        className="relative z-10 w-full max-w-md bg-[#F6F5F3] h-full flex flex-col shadow-2xl border-l border-[#E1E0DD]"
      >
        {/* Header */}
        <div className="px-6 py-5 bg-white border-b border-[#E1E0DD] flex items-center justify-between">
          <div>
            <h2 className="font-serif-display text-[26px] text-[#1C1C1C] leading-none">
              Your Selection
            </h2>
            <p className="text-[11px] uppercase tracking-[0.14em] text-[#82674F] mt-1 tabular-nums">
              {cartTotals.itemCount} {cartTotals.itemCount === 1 ? 'item' : 'items'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setCartOpen(false)}
            aria-label="Close bag"
            className="p-2 text-[#1C1C1C] hover:text-[#82674F] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Brand promise banner */}
        <div className="px-6 py-2.5 bg-[#EEE8DE] text-[#2B1E12] text-[11px] tracking-[0.06em]">
          OKART Interiors · Craftsmanship, Quotation & Seamless Installation
        </div>

        {/* Cart items */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {cart.length === 0 ? (
            <div className="py-16 text-center space-y-4">
              <ShoppingBag className="w-10 h-10 text-[#BFBCB4] mx-auto stroke-[1.2]" />
              <p className="font-serif-display text-[22px] text-[#2B1E12]">
                Your selection bag is empty
              </p>
              <p className="text-[13px] text-[#82674F] max-w-xs mx-auto">
                Explore bespoke sofas, dining seating, kitchen cabinetry, and turnkey interior furniture from OKART Interiors.
              </p>
              <button
                type="button"
                onClick={() => {
                  setCartOpen(false);
                  navigate('/products');
                }}
                className="inline-block px-7 py-3 rounded-full bg-[#EDE5D5] border border-[#B9A78B] text-[#2B1E12] text-[11px] uppercase tracking-[0.16em] hover:bg-[#DFD2BC] transition-colors cursor-pointer"
              >
                Explore furniture
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.key}
                className="bg-white p-4 border border-[#E1E0DD] flex gap-4 items-start"
              >
                <a
                  href={`/products/${item.handle}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setCartOpen(false);
                    navigate(`/products/${item.handle}`);
                  }}
                  className="w-20 h-20 bg-[#F0EFED] shrink-0 flex items-center justify-center p-1.5"
                >
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.model}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <span className="text-[10px] text-[#82674F]">{item.model}</span>
                  )}
                </a>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <a
                      href={`/products/${item.handle}`}
                      onClick={(e) => {
                        e.preventDefault();
                        setCartOpen(false);
                        navigate(`/products/${item.handle}`);
                      }}
                      className="text-[12px] uppercase tracking-[0.08em] text-[#1C1C1C] hover:underline truncate"
                    >
                      {item.model}
                    </a>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.key)}
                      aria-label={`Remove ${item.model}`}
                      className="text-[#82674F] hover:text-[#2B1E12] cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {item.subtitle && (
                    <p className="text-[11px] text-[#82674F] truncate">{item.subtitle}</p>
                  )}
                  <p className="text-[11px] text-[#4F3926] mt-0.5 truncate">
                    {item.variantTitle}
                  </p>

                  <div className="mt-3 flex items-center justify-between">
                    <div className="inline-flex items-center border border-[#D5D4D3] bg-[#F6F5F3]">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.key, item.quantity - 1)}
                        aria-label={`Decrease quantity of ${item.model}`}
                        className="w-7 h-7 flex items-center justify-center text-[#1C1C1C] hover:bg-[#E1E0DD] cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center text-[12px] tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.key, item.quantity + 1)}
                        aria-label={`Increase quantity of ${item.model}`}
                        className="w-7 h-7 flex items-center justify-center text-[#1C1C1C] hover:bg-[#E1E0DD] cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="text-[11px] uppercase tracking-[0.08em] text-[#82674F]">
                      Quote Request
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="p-6 bg-white border-t border-[#E1E0DD] space-y-4">
            <div className="space-y-1.5 text-[13px]">
              <div className="flex justify-between text-[#82674F]">
                <span>Logistics & Installation</span>
                <span>Confirmed on Brief</span>
              </div>
              <div className="flex justify-between text-[15px] text-[#1C1C1C] pt-1 border-t border-[#F0EFED]">
                <span>Quotation Status</span>
                <span className="font-medium">Prepared by OKART Atelier</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setCartOpen(false);
                  navigate('/cart');
                }}
                className="py-3 rounded-full border border-[#1C1C1C] text-[#1C1C1C] text-[11px] uppercase tracking-[0.14em] hover:bg-[#F6F5F3] transition-colors cursor-pointer"
              >
                View Bag
              </button>
              <button
                type="button"
                onClick={() => {
                  setCartOpen(false);
                  navigate('/cart?checkout=1');
                }}
                className="py-3 rounded-full bg-[#EDE5D5] border border-[#B9A78B] text-[#2B1E12] text-[11px] uppercase tracking-[0.14em] hover:bg-[#DFD2BC] transition-colors cursor-pointer"
              >
                Confirm Quote
              </button>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
