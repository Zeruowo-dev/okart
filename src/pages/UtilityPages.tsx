import React, { useMemo, useState } from 'react';
import { Minus, Plus, Search, Trash2, UserCheck } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { OKART_CONTACT } from '../data/siteContent';
import { ProductCard } from '../components/ProductCard';
import { filterAndSortProducts } from '../utils/storeLogic';

export function SearchPage({ initialQuery }: { initialQuery: string }) {
  const { products } = useStore();
  const [query, setQuery] = useState(initialQuery);

  const results = useMemo(
    () => (query.trim() ? filterAndSortProducts(products, { query }) : products.slice(0, 16)),
    [products, query]
  );

  return (
    <div className="bg-[#F6F5F3] min-h-screen py-12">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-10">
        <h1 className="font-serif-display text-[38px] text-[#2B1E12]">Search OKART Catalog</h1>
        <div className="mt-4 max-w-xl relative">
          <Search className="w-4 h-4 text-[#82674F] absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Heritage Chair, Savannah Sofa, Dining, Cabinetry..."
            aria-label="Search products"
            className="w-full h-12 pl-11 pr-4 bg-white border border-[#D5D4D3] text-[14px] focus:outline-none focus:border-[#82674F]"
          />
        </div>

        <p className="text-[11px] uppercase tracking-[0.16em] text-[#82674F] mt-6 mb-6 tabular-nums">
          {results.length} {results.length === 1 ? 'result' : 'results'}
          {query.trim() ? ` for “${query.trim()}”` : ''}
        </p>

        {results.length === 0 ? (
          <div className="bg-white border border-[#E1E0DD] p-12 text-center">
            <p className="font-serif-display text-[26px] text-[#2B1E12]">
              No matching designs found
            </p>
            <p className="text-[13px] text-[#82674F] mt-2">
              Try searching for &ldquo;Heritage&rdquo;, &ldquo;Savannah&rdquo;, &ldquo;Dining&rdquo;, or &ldquo;Bookcase&rdquo;.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-10">
            {results.slice(0, 32).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function CartPage() {
  const {
    cart,
    cartTotals,
    updateQuantity,
    removeFromCart,
    navigate,
    placeDemoOrder,
    userAccount,
  } = useStore();
  const [customerName, setCustomerName] = useState(userAccount?.fullName || '');
  const [email, setEmail] = useState(userAccount?.email || '');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [confirmedOrderId, setConfirmedOrderId] = useState<string | null>(null);

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !email.trim() || !address.trim() || !city.trim()) return;
    const order = placeDemoOrder(customerName, email, address, city);
    setConfirmedOrderId(order.id);
  };

  if (confirmedOrderId) {
    return (
      <div className="bg-[#F6F5F3] min-h-screen py-20 px-4">
        <div className="max-w-lg mx-auto bg-white border border-[#E1E0DD] p-10 text-center space-y-4">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#777859]">
            Request Confirmed
          </p>
          <h1 className="font-serif-display text-[36px] text-[#2B1E12]">
            Thank you for choosing OKART Interiors
          </h1>
          <p className="text-[13px] text-[#4F3926]">
            Reference <strong className="tabular-nums">{confirmedOrderId}</strong> is now registered with our Ibadan team. We will send your written quotation &amp; production schedule shortly.
          </p>
          <div className="pt-4 flex justify-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/account')}
              className="px-6 py-2.5 rounded-full bg-[#EDE5D5] hover:bg-[#DFD2BC] border border-[#B9A78B] text-[#2B1E12] text-[11px] uppercase tracking-[0.14em] cursor-pointer"
            >
              View in My Account
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-6 py-2.5 rounded-full border border-[#D5D4D3] text-[#1C1C1C] text-[11px] uppercase tracking-[0.14em] cursor-pointer"
            >
              Return Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F6F5F3] min-h-screen py-12">
      <div className="max-w-[1320px] mx-auto px-4 lg:px-10">
        <h1 className="font-serif-display text-[40px] text-[#2B1E12] mb-8">
          Selection Bag &amp; Quotation Checkout
        </h1>

        {cart.length === 0 ? (
          <div className="bg-white border border-[#E1E0DD] p-14 text-center space-y-4">
            <p className="font-serif-display text-[26px] text-[#2B1E12]">
              Your selection bag is empty
            </p>
            <button
              type="button"
              onClick={() => navigate('/products')}
              className="px-8 py-3 rounded-full bg-[#EDE5D5] hover:bg-[#DFD2BC] border border-[#B9A78B] text-[#2B1E12] text-[11px] uppercase tracking-[0.16em] cursor-pointer"
            >
              Explore Our Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 space-y-4">
              {cart.map((item) => (
                <div
                  key={item.key}
                  className="bg-white border border-[#E1E0DD] p-5 flex items-center gap-5"
                >
                  <img
                    src={item.image}
                    alt={item.model}
                    referrerPolicy="no-referrer"
                    className="w-24 h-24 object-contain bg-[#F0EFED] p-2 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <button
                      type="button"
                      onClick={() => navigate(`/products/${item.handle}`)}
                      className="text-[13px] uppercase tracking-[0.08em] text-[#1C1C1C] hover:underline text-left cursor-pointer"
                    >
                      {item.model}
                    </button>
                    {item.subtitle && (
                      <p className="text-[12px] text-[#82674F]">{item.subtitle}</p>
                    )}
                    <p className="text-[12px] text-[#4F3926] mt-0.5">{item.variantTitle}</p>

                    <div className="mt-3 flex items-center gap-4">
                      <div className="inline-flex items-center border border-[#D5D4D3]">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.key, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center text-[12px] tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.key, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.key)}
                        className="text-[11px] text-[#8E5235] inline-flex items-center gap-1 hover:underline cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Remove
                      </button>
                    </div>
                  </div>
                  <div className="text-[11px] uppercase tracking-[0.1em] text-[#82674F]">
                    Quote Request
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-5">
              <form
                onSubmit={handleCheckout}
                className="bg-white border border-[#E1E0DD] p-6 md:p-8 space-y-5"
              >
                <h2 className="font-serif-display text-[28px] text-[#2B1E12]">
                  Delivery &amp; Quotation Summary
                </h2>

                <div className="space-y-3">
                  <input
                    required
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Full name"
                    className="w-full h-10 px-3.5 border border-[#D5D4D3] text-[13px]"
                  />
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
                    className="w-full h-10 px-3.5 border border-[#D5D4D3] text-[13px]"
                  />
                  <input
                    required
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Delivery / Installation address"
                    className="w-full h-10 px-3.5 border border-[#D5D4D3] text-[13px]"
                  />
                  <input
                    required
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="City / State (e.g. Ibadan, Oyo State)"
                    className="w-full h-10 px-3.5 border border-[#D5D4D3] text-[13px]"
                  />
                </div>

                <div className="pt-4 border-t border-[#E1E0DD] space-y-2 text-[13px]">
                  <div className="flex justify-between text-[#82674F]">
                    <span>Selected Pieces</span>
                    <span className="tabular-nums">
                      {cartTotals.itemCount} {cartTotals.itemCount === 1 ? 'item' : 'items'}
                    </span>
                  </div>
                  <div className="flex justify-between text-[#82674F]">
                    <span>Delivery &amp; Installation</span>
                    <span>Confirmed on Brief</span>
                  </div>
                  <div className="flex justify-between text-[16px] text-[#1C1C1C] pt-2 border-t border-[#F0EFED]">
                    <span>Quotation</span>
                    <span className="font-medium">Custom Quotation</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-full bg-[#EDE5D5] hover:bg-[#DFD2BC] border border-[#B9A78B] text-[#2B1E12] text-[11px] uppercase tracking-[0.18em] cursor-pointer"
                >
                  Confirm Selection &amp; Request Invoice
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function AccountPage() {
  const {
    wishlist,
    orders,
    quoteRequests,
    userAccount,
    signOutAccount,
    getProductByHandle,
    navigate,
  } = useStore();

  const savedProducts = wishlist
    .map((h) => getProductByHandle(h))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <div className="bg-[#F6F5F3] min-h-screen py-12">
      <div className="max-w-[1320px] mx-auto px-4 lg:px-10 space-y-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#82674F]">
              OKART INTERIORS CLIENT UNIVERSE
            </p>
            <h1 className="font-serif-display text-[40px] text-[#2B1E12] mt-1">
              {userAccount ? `Welcome, ${userAccount.fullName}` : 'Client Account'}
            </h1>
          </div>

          {userAccount ? (
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-[#D5D4D3] text-[12px] text-[#2B1E12]">
                <UserCheck className="w-4 h-4 text-[#777859]" />
                {userAccount.clientType}
              </span>
              <button
                type="button"
                onClick={signOutAccount}
                className="px-5 py-2 rounded-full border border-[#D5D4D3] text-[11px] uppercase tracking-[0.14em] text-[#4F3926] hover:bg-white cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => navigate('/signup')}
              className="px-7 py-3 rounded-full bg-[#EDE5D5] hover:bg-[#DFD2BC] border border-[#B9A78B] text-[#2B1E12] text-[11px] uppercase tracking-[0.16em] cursor-pointer"
            >
              Sign Up for an Account
            </button>
          )}
        </div>

        {/* Custom Quote Requests */}
        <section className="space-y-4">
          <h2 className="font-serif-display text-[28px] text-[#2B1E12]">
            Bespoke Quote Requests ({quoteRequests.length})
          </h2>
          {quoteRequests.length === 0 ? (
            <div className="bg-white border border-[#E1E0DD] p-8 text-[13px] text-[#82674F]">
              No bespoke quotation briefs submitted yet. Need custom furniture?{' '}
              <button
                type="button"
                onClick={() => navigate('/pages/bespoke')}
                className="underline text-[#82674F] hover:text-[#2B1E12] ml-1 cursor-pointer"
              >
                Visit Bespoke Studio
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {quoteRequests.map((q) => (
                <div
                  key={q.id}
                  className="bg-white border border-[#E1E0DD] p-6 flex flex-wrap items-center justify-between gap-4"
                >
                  <div>
                    <div className="text-[13px] font-medium text-[#1C1C1C]">
                      {q.productTitle} <span className="text-[#82674F] font-normal">({q.id})</span>
                    </div>
                    <div className="text-[12px] text-[#82674F] mt-0.5">
                      {q.createdAt} · {q.variantTitle} · Contact: {q.phone}
                    </div>
                  </div>
                  <div className="text-[12px] text-[#4F3926]">{q.status}</div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Orders */}
        <section className="space-y-4">
          <h2 className="font-serif-display text-[28px] text-[#2B1E12]">
            Order &amp; Selection History ({orders.length})
          </h2>
          {orders.length === 0 ? (
            <div className="bg-white border border-[#E1E0DD] p-8 text-[13px] text-[#82674F]">
              You have not confirmed any selection orders yet. For direct assistance call {OKART_CONTACT.phone}.
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((o) => (
                <div
                  key={o.id}
                  className="bg-white border border-[#E1E0DD] p-6 flex flex-wrap items-center justify-between gap-4"
                >
                  <div>
                    <div className="text-[13px] font-medium text-[#1C1C1C] tabular-nums">
                      {o.id}
                    </div>
                    <div className="text-[12px] text-[#82674F]">
                      {o.createdAt} · {o.customerName} ({o.city})
                    </div>
                  </div>
                  <div className="text-[12px] text-[#4F3926]">{o.status}</div>
                  <div className="text-[12px] uppercase tracking-[0.08em] text-[#82674F]">
                    Custom Quotation
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Saved Wishlist */}
        <section className="space-y-4">
          <h2 className="font-serif-display text-[28px] text-[#2B1E12]">
            Saved Pieces ({savedProducts.length})
          </h2>
          {savedProducts.length === 0 ? (
            <div className="bg-white border border-[#E1E0DD] p-8 text-[13px] text-[#82674F]">
              Tap the heart icon on any piece of furniture to save it here.{' '}
              <button
                type="button"
                onClick={() => navigate('/products')}
                className="underline text-[#1C1C1C] ml-1 cursor-pointer"
              >
                Browse Our Products
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {savedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
