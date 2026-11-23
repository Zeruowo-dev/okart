import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronRight, Menu, Search, ShoppingBag, User, X } from 'lucide-react';
import {
  BRAND_ASSETS,
  MEGA_MENUS,
  OKART_TOP_NAV,
  type MegaMenuGroup,
} from '../data/siteContent';
import { useStore } from '../context/StoreContext';
import { filterAndSortProducts } from '../utils/storeLogic';

export function Header() {
  const { currentPath, navigate, products, cartTotals, setCartOpen, userAccount } = useStore();
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const closeTimeoutRef = useRef<number | null>(null);
  const searchBoxRef = useRef<HTMLDivElement>(null);

  const isHome = currentPath === '/' || currentPath === '';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 36);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setActiveMenuId(null);
    setMobileMenuOpen(false);
    setSearchFocused(false);
  }, [currentPath]);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [mobileMenuOpen]);

  const activeMenu: MegaMenuGroup | undefined = useMemo(
    () => MEGA_MENUS.find((m) => m.id === activeMenuId),
    [activeMenuId]
  );

  const searchMatches = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return filterAndSortProducts(products, { query: searchQuery }).slice(0, 6);
  }, [products, searchQuery]);

  const handleOpenMenu = (id?: string) => {
    if (closeTimeoutRef.current) window.clearTimeout(closeTimeoutRef.current);
    setActiveMenuId(id || null);
  };

  const handleScheduleClose = () => {
    if (closeTimeoutRef.current) window.clearTimeout(closeTimeoutRef.current);
    closeTimeoutRef.current = window.setTimeout(() => setActiveMenuId(null), 160);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearchFocused(false);
    navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <>
    <header
      onMouseLeave={handleScheduleClose}
      className={`sticky top-9 z-40 w-full transition-colors duration-200 ${
        scrolled || activeMenuId || !isHome
          ? 'bg-white/95 backdrop-blur-md border-b border-[#E1E0DD]'
          : 'bg-white border-b border-[#E1E0DD]'
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Mobile menu trigger */}
        <div className="flex items-center lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open navigation menu"
            aria-expanded={mobileMenuOpen}
            className="p-2 -ml-2 text-[#1C1C1C] hover:opacity-70 cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* Left Zone: OKART Interiors Brand Logo */}
        <div className="flex items-center shrink-0">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              navigate('/');
            }}
            aria-label="OKART Interiors Home"
            className="flex items-center gap-2.5 py-1"
          >
            <img
              src={BRAND_ASSETS.logoPrimary}
              alt="OKART Interiors"
              className="h-12 w-auto object-contain mix-blend-multiply"
            />
          </a>
        </div>

        {/* Center Zone: Primary Navigation Links (Home, About Us, Our Products, Our Services, Our Projects, Contact Us) */}
        <nav aria-label="Primary navigation" className="hidden lg:flex items-center gap-5 xl:gap-7">
          {OKART_TOP_NAV.map((item) => {
            const isCurrent =
              currentPath === item.href ||
              (item.href === '/products' && currentPath.startsWith('/collections/'));
            const isMenuOpen = item.megaMenuId && activeMenuId === item.megaMenuId;
            return (
              <div
                key={item.id}
                onMouseEnter={() => handleOpenMenu(item.megaMenuId)}
                className="relative py-5"
              >
                <a
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveMenuId(null);
                    navigate(item.href);
                  }}
                  aria-expanded={item.megaMenuId ? Boolean(isMenuOpen) : undefined}
                  className={`text-[11px] uppercase tracking-[0.13em] whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                    isCurrent || isMenuOpen
                      ? 'text-[#82674F] underline underline-offset-8'
                      : 'text-[#1C1C1C] hover:text-[#82674F]'
                  }`}
                >
                  {item.label}
                </a>
              </div>
            );
          })}
        </nav>

        {/* Right Zone: Search + Sign Up / Account + Cart */}
        <nav aria-label="Secondary navigation" className="flex items-center justify-end gap-2 lg:gap-3 shrink-0">
          <div ref={searchBoxRef} className="relative hidden xl:block">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <Search className="w-3.5 h-3.5 text-[#777859] absolute left-3 pointer-events-none" />
              <input
                type="search"
                value={searchQuery}
                onFocus={() => setSearchFocused(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSearchFocused(true);
                }}
                placeholder="Search furniture..."
                aria-label="Search catalog"
                className="w-44 h-9 pl-8 pr-3 text-[12px] bg-[#F6F5F3] border border-[#E1E0DD] rounded-sm text-[#1C1C1C] placeholder:text-[#82674F]/70 focus:outline-none focus:border-[#82674F]"
              />
            </form>

            {searchFocused && searchQuery.trim().length > 0 && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-[#E1E0DD] shadow-lg z-50 p-3">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#E1E0DD]">
                  <span className="text-[10px] uppercase tracking-[0.14em] text-[#82674F]">
                    Designs ({searchMatches.length})
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchFocused(false);
                      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
                    }}
                    className="text-[11px] underline text-[#1C1C1C] cursor-pointer"
                  >
                    See all results
                  </button>
                </div>
                {searchMatches.length === 0 ? (
                  <p className="text-[12px] text-[#82674F] py-3">
                    No designs found matching &ldquo;{searchQuery}&rdquo;.
                  </p>
                ) : (
                  <ul className="divide-y divide-[#F0EFED]">
                    {searchMatches.map((p) => (
                      <li key={p.id}>
                        <button
                          type="button"
                          onClick={() => {
                            setSearchFocused(false);
                            navigate(`/products/${p.handle}`);
                          }}
                          className="w-full py-2 flex items-center gap-3 text-left hover:bg-[#F6F5F3] px-1 transition-colors cursor-pointer"
                        >
                          <img
                            src={p.images[0]}
                            alt={p.title}
                            referrerPolicy="no-referrer"
                            className="w-11 h-11 object-contain bg-[#F0EFED] shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="text-[11px] uppercase tracking-[0.08em] text-[#1C1C1C] truncate">
                              {p.model}
                            </div>
                            <div className="text-[11px] text-[#82674F] truncate">
                              {p.subtitle || p.productType}
                            </div>
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => navigate('/search')}
            aria-label="Search catalog"
            className="xl:hidden p-2 text-[#1C1C1C] hover:opacity-70 cursor-pointer"
          >
            <Search className="w-[18px] h-[18px]" />
          </button>

          <a
            href={userAccount ? '/account' : '/signup'}
            onClick={(e) => {
              e.preventDefault();
              navigate(userAccount ? '/account' : '/signup');
            }}
            aria-label={userAccount ? 'Client account' : 'Sign Up'}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] uppercase tracking-[0.12em] text-[#1C1C1C] hover:text-[#82674F] whitespace-nowrap shrink-0 transition-colors"
          >
            <User className="w-4 h-4 stroke-[1.5]" />
            <span>{userAccount ? 'Account' : 'Sign Up'}</span>
          </a>

          <a
            href={userAccount ? '/account' : '/signup'}
            onClick={(e) => {
              e.preventDefault();
              navigate(userAccount ? '/account' : '/signup');
            }}
            aria-label="Sign up or view account"
            className="sm:hidden p-2 text-[#1C1C1C]"
          >
            <User className="w-[18px] h-[18px] stroke-[1.5]" />
          </a>

          <button
            type="button"
            onClick={() => setCartOpen(true)}
            aria-label={`Shopping bag (${cartTotals.itemCount} items)`}
            className="relative p-2 text-[#1C1C1C] hover:text-[#82674F] transition-colors cursor-pointer"
          >
            <ShoppingBag className="w-[18px] h-[18px] stroke-[1.5]" />
            {cartTotals.itemCount > 0 && (
              <span className="absolute top-0.5 right-0.5 min-w-[16px] h-[16px] px-1 rounded-full bg-[#EDE5D5] border border-[#82674F] text-[#2B1E12] text-[10px] flex items-center justify-center tabular-nums">
                {cartTotals.itemCount}
              </span>
            )}
          </button>
        </nav>
      </div>

      {/* Desktop Mega-Menu Dropdown */}
      {activeMenu && (
        <div
          onMouseEnter={() => {
            if (closeTimeoutRef.current) window.clearTimeout(closeTimeoutRef.current);
          }}
          onMouseLeave={handleScheduleClose}
          className="hidden lg:block absolute left-0 right-0 top-full bg-white border-b border-[#E1E0DD] shadow-sm z-40"
        >
          <div className="max-w-[1440px] mx-auto px-8 py-8 grid grid-cols-12 gap-8">
            <div className="col-span-6 grid grid-cols-2 gap-8">
              {activeMenu.columns.map((col) => (
                <div key={col.heading}>
                  <p className="text-[10px] uppercase tracking-[0.16em] text-[#82674F] mb-3">
                    {col.heading}
                  </p>
                  <ul className="space-y-2.5">
                    {col.links.map((link) => (
                      <li key={link.href + link.label}>
                        <a
                          href={link.href}
                          onClick={(e) => {
                            e.preventDefault();
                            setActiveMenuId(null);
                            navigate(link.href);
                          }}
                          className="text-[13px] text-[#1C1C1C] hover:text-[#82674F] hover:underline underline-offset-4 transition-colors"
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="col-span-6 grid grid-cols-2 gap-6">
              {activeMenu.featured.map((card) => (
                <a
                  key={card.title}
                  href={card.href}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveMenuId(null);
                    navigate(card.href);
                  }}
                  className="group block bg-[#F6F5F3] overflow-hidden"
                >
                  <div className="aspect-[16/10] overflow-hidden bg-[#ECEBE8]">
                    <img
                      src={card.image}
                      alt={card.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain group-hover:scale-[1.03] transition-transform duration-300"
                    />
                  </div>
                  <div className="p-3.5">
                    <div className="text-[12px] uppercase tracking-[0.12em] text-[#1C1C1C]">
                      {card.title}
                    </div>
                    <div className="text-[12px] text-[#82674F] mt-0.5">{card.subtitle}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>

    {/* Mobile & Tablet Drawer Navigation (rendered outside header so backdrop-blur never clips fixed overlay) */}
    {mobileMenuOpen && (
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
        className="fixed inset-0 z-[70] lg:hidden flex"
      >
        <div
          className="fixed inset-0 bg-[#2B1E12]/45"
          onClick={() => setMobileMenuOpen(false)}
        />
        <div className="relative w-full max-w-sm bg-white h-dvh overflow-y-auto p-6 flex flex-col justify-between z-10 shadow-2xl">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-[#E1E0DD]">
              <img
                src={BRAND_ASSETS.logoPrimary}
                alt="OKART Interiors"
                className="h-11 w-auto object-contain mix-blend-multiply"
              />
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close navigation menu"
                className="p-2 text-[#1C1C1C] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <ul className="mt-4 space-y-0.5 border-b border-[#E1E0DD] pb-4">
              {OKART_TOP_NAV.map((item) => {
                const active =
                  currentPath === item.href ||
                  (item.href === '/products' && currentPath.startsWith('/collections/'));
                return (
                  <li key={item.id}>
                    <a
                      href={item.href}
                      onClick={(e) => {
                        e.preventDefault();
                        setMobileMenuOpen(false);
                        navigate(item.href);
                      }}
                      className={`flex items-center justify-between py-2.5 text-[13px] uppercase tracking-[0.14em] ${
                        active ? 'text-[#82674F] font-medium' : 'text-[#2B1E12]'
                      }`}
                    >
                      <span>{item.label}</span>
                      <ChevronRight className="w-4 h-4 text-[#BFBCB4]" />
                    </a>
                  </li>
                );
              })}
            </ul>

            <div className="mt-5 space-y-5">
              {MEGA_MENUS.map((group) => (
                <div key={group.id} className="border-b border-[#F0EFED] pb-4 space-y-4">
                  <div className="text-[11px] uppercase tracking-[0.16em] text-[#82674F] font-medium">
                    {group.label}
                  </div>
                  {group.columns.map((col) => (
                    <div key={col.heading}>
                      <div className="text-[10px] uppercase tracking-[0.14em] text-[#82674F] mb-1.5">
                        {col.heading}
                      </div>
                      <ul className="space-y-1">
                        {col.links.map((link) => (
                          <li key={link.href + link.label}>
                            <a
                              href={link.href}
                              onClick={(e) => {
                                e.preventDefault();
                                setMobileMenuOpen(false);
                                navigate(link.href);
                              }}
                              className="block text-[13px] text-[#4F3926] hover:text-[#1C1C1C] py-1"
                            >
                              {link.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ))}

              <div className="border-b border-[#F0EFED] pb-4">
                <div className="text-[11px] uppercase tracking-[0.16em] text-[#82674F] font-medium mb-2">
                  Explore &amp; Policies
                </div>
                <ul className="space-y-1">
                  {[
                    { label: 'The Video Showcase', href: '/pages/video' },
                    { label: 'Designers & Craft Studios', href: '/pages/designers' },
                    { label: 'Frequently Asked Questions', href: '/pages/customer-service' },
                    { label: 'Terms & Conditions', href: '/pages/terms-and-conditions' },
                    { label: 'Refund & Returns Policy', href: '/pages/refund-policy' },
                  ].map((item) => (
                    <li key={item.href}>
                      <a
                        href={item.href}
                        onClick={(e) => {
                          e.preventDefault();
                          setMobileMenuOpen(false);
                          navigate(item.href);
                        }}
                        className="block text-[13px] text-[#4F3926] hover:text-[#1C1C1C] py-1"
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="pt-6 space-y-3">
            <a
              href="/pages/bespoke"
              onClick={(e) => {
                e.preventDefault();
                setMobileMenuOpen(false);
                navigate('/pages/bespoke');
              }}
              className="block w-full text-center py-3 rounded-full bg-[#EDE5D5] border border-[#B9A78B] text-[#2B1E12] text-[11px] uppercase tracking-[0.16em]"
            >
              Commission Bespoke Piece
            </a>
            <a
              href={userAccount ? '/account' : '/signup'}
              onClick={(e) => {
                e.preventDefault();
                setMobileMenuOpen(false);
                navigate(userAccount ? '/account' : '/signup');
              }}
              className="block w-full text-center py-3 rounded-full bg-[#777859] text-white text-[11px] uppercase tracking-[0.16em]"
            >
              {userAccount ? 'My OKART Account' : 'Client Sign Up'}
            </a>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
