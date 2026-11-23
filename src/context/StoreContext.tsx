import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { CATALOG_COLLECTIONS, CATALOG_PRODUCTS, DESIGNERS, type DesignerProfile } from '../data/siteContent';
import {
  calculateCartTotals,
  type CartLine,
  type CollectionInfo,
  type ProductItem,
  type ProductVariant,
} from '../utils/storeLogic';

export interface OrderRecord {
  id: string;
  createdAt: string;
  items: CartLine[];
  total: number;
  customerName: string;
  city: string;
  status: string;
}

export interface QuoteRequestRecord {
  id: string;
  createdAt: string;
  productTitle: string;
  variantTitle: string;
  customerName: string;
  phone: string;
  email: string;
  notes: string;
  status: string;
}

export interface UserAccount {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  clientType: string;
  joinedAt: string;
}

interface StoreContextValue {
  currentPath: string;
  navigate: (to: string) => void;
  products: ProductItem[];
  collections: Record<string, CollectionInfo>;
  designers: DesignerProfile[];
  getProductByHandle: (handle: string) => ProductItem | undefined;
  getCollectionProducts: (handle: string) => ProductItem[];
  cart: CartLine[];
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  addToCart: (product: ProductItem, variant?: ProductVariant, qty?: number) => void;
  addCustomCartLine: (line: Omit<CartLine, 'quantity'>, qty?: number) => void;
  updateQuantity: (key: string, quantity: number) => void;
  removeFromCart: (key: string) => void;
  clearCart: () => void;
  cartTotals: ReturnType<typeof calculateCartTotals>;
  wishlist: string[];
  toggleWishlist: (handle: string) => void;
  orders: OrderRecord[];
  placeDemoOrder: (customerName: string, email: string, address: string, city: string) => OrderRecord;
  quoteRequests: QuoteRequestRecord[];
  submitQuoteRequest: (input: Omit<QuoteRequestRecord, 'id' | 'createdAt' | 'status'>) => QuoteRequestRecord;
  userAccount: UserAccount | null;
  signUpAccount: (input: Omit<UserAccount, 'id' | 'joinedAt'>) => UserAccount;
  signOutAccount: () => void;
  newsletterSubscribed: boolean;
  subscribeNewsletter: (name: string, email: string) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const StoreContext = createContext<StoreContextValue | null>(null);

const CART_STORAGE_KEY = 'okart_cart_v2';
const WISHLIST_STORAGE_KEY = 'okart_wishlist_v1';
const ORDERS_STORAGE_KEY = 'okart_orders_v1';
const QUOTES_STORAGE_KEY = 'okart_quotes_v1';
const ACCOUNT_STORAGE_KEY = 'okart_account_v1';

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname + window.location.search;
  });

  const [cart, setCart] = useState<CartLine[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? (JSON.parse(saved) as CartLine[]) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_STORAGE_KEY);
      return saved ? (JSON.parse(saved) as string[]) : [];
    } catch {
      return [];
    }
  });

  const [orders, setOrders] = useState<OrderRecord[]>(() => {
    try {
      const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
      return saved ? (JSON.parse(saved) as OrderRecord[]) : [];
    } catch {
      return [];
    }
  });

  const [quoteRequests, setQuoteRequests] = useState<QuoteRequestRecord[]>(() => {
    try {
      const saved = localStorage.getItem(QUOTES_STORAGE_KEY);
      return saved ? (JSON.parse(saved) as QuoteRequestRecord[]) : [];
    } catch {
      return [];
    }
  });

  const [userAccount, setUserAccount] = useState<UserAccount | null>(() => {
    try {
      const saved = localStorage.getItem(ACCOUNT_STORAGE_KEY);
      return saved ? (JSON.parse(saved) as UserAccount) : null;
    } catch {
      return null;
    }
  });

  const [cartOpen, setCartOpen] = useState(false);
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // ignore quota errors
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
    } catch {
      // ignore
    }
  }, [wishlist]);

  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch {
      // ignore
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem(QUOTES_STORAGE_KEY, JSON.stringify(quoteRequests));
    } catch {
      // ignore
    }
  }, [quoteRequests]);

  useEffect(() => {
    try {
      if (userAccount) {
        localStorage.setItem(ACCOUNT_STORAGE_KEY, JSON.stringify(userAccount));
      } else {
        localStorage.removeItem(ACCOUNT_STORAGE_KEY);
      }
    } catch {
      // ignore
    }
  }, [userAccount]);

  useEffect(() => {
    const onPopState = () => {
      setCurrentPath(window.location.pathname + window.location.search);
      window.scrollTo({ top: 0, behavior: 'auto' });
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    window.setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  }, []);

  const navigate = useCallback((to: string) => {
    if (to.startsWith('http://') || to.startsWith('https://')) {
      try {
        const parsed = new URL(to);
        if (parsed.hostname.includes('makenordic.com')) {
          const internal = parsed.pathname + parsed.search;
          window.history.pushState({}, '', internal);
          setCurrentPath(internal);
          window.scrollTo({ top: 0, behavior: 'auto' });
          return;
        }
      } catch {
        // fall through
      }
      window.open(to, '_blank', 'noopener,noreferrer');
      return;
    }
    const target = to.startsWith('/') ? to : `/${to}`;
    if (target !== currentPath) {
      window.history.pushState({}, '', target);
      setCurrentPath(target);
      window.scrollTo({ top: 0, behavior: 'auto' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentPath]);

  const productByHandle = useMemo(() => {
    const map = new Map<string, ProductItem>();
    for (const p of CATALOG_PRODUCTS) {
      map.set(p.handle, p);
    }
    return map;
  }, []);

  const getProductByHandle = useCallback(
    (handle: string) => productByHandle.get(handle),
    [productByHandle]
  );

  const getCollectionProducts = useCallback(
    (handle: string): ProductItem[] => {
      const col = CATALOG_COLLECTIONS[handle];
      if (col && col.productHandles.length > 0) {
        const seen = new Set<string>();
        const list = col.productHandles
          .filter((h) => {
            if (seen.has(h)) return false;
            seen.add(h);
            return true;
          })
          .map((h) => productByHandle.get(h))
          .filter((p): p is ProductItem => Boolean(p));
        if (list.length > 0) return list;
      }
      if (handle === 'all' || handle === 'all-furniture') {
        return CATALOG_PRODUCTS;
      }
      const kw = handle.replace(/-/g, ' ').replace(/s$/, '');
      const matched = CATALOG_PRODUCTS.filter(
        (p) =>
          p.title.toLowerCase().includes(kw) ||
          p.handle.toLowerCase().includes(kw) ||
          p.tags.some((t) => t.toLowerCase().includes(kw))
      );
      return matched.length > 0 ? matched : CATALOG_PRODUCTS.slice(0, 24);
    },
    [productByHandle]
  );

  const addCustomCartLine = useCallback(
    (line: Omit<CartLine, 'quantity'>, qty = 1) => {
      setCart((prev) => {
        const existing = prev.find((item) => item.key === line.key);
        if (existing) {
          return prev.map((item) =>
            item.key === line.key ? { ...item, quantity: item.quantity + qty } : item
          );
        }
        return [...prev, { ...line, quantity: qty }];
      });
      setCartOpen(true);
    },
    []
  );

  const addToCart = useCallback(
    (product: ProductItem, variant?: ProductVariant, qty = 1) => {
      const chosen = variant || product.variants[0];
      const variantId = chosen ? chosen.id : product.id;
      const key = `${product.id}-${variantId}`;
      addCustomCartLine(
        {
          key,
          productId: product.id,
          handle: product.handle,
          model: product.model,
          subtitle: product.subtitle,
          variantId,
          variantTitle: chosen ? chosen.title : 'Standard Specification',
          unitPrice: 0,
          image: (chosen && chosen.image) || product.images[0] || '',
          isQuoteItem: true,
        },
        qty
      );
    },
    [addCustomCartLine]
  );

  const updateQuantity = useCallback((key: string, quantity: number) => {
    setCart((prev) => {
      if (quantity <= 0) {
        return prev.filter((i) => i.key !== key);
      }
      return prev.map((i) => (i.key === key ? { ...i, quantity } : i));
    });
  }, []);

  const removeFromCart = useCallback((key: string) => {
    setCart((prev) => prev.filter((i) => i.key !== key));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const toggleWishlist = useCallback(
    (handle: string) => {
      setWishlist((prev) => {
        const exists = prev.includes(handle);
        const next = exists ? prev.filter((h) => h !== handle) : [...prev, handle];
        showToast(exists ? 'Removed from saved pieces' : 'Saved to your OKART Interiors wishlist');
        return next;
      });
    },
    [showToast]
  );

  const placeDemoOrder = useCallback(
    (customerName: string, _email: string, _address: string, city: string): OrderRecord => {
      const totals = calculateCartTotals(cart);
      const record: OrderRecord = {
        id: `OK-${Math.floor(100000 + Math.random() * 900000)}`,
        createdAt: new Date().toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
        items: [...cart],
        total: totals.total,
        customerName,
        city,
        status: 'Quotation & Order Received — OKART Atelier',
      };
      setOrders((prev) => [record, ...prev]);
      setCart([]);
      return record;
    },
    [cart]
  );

  const submitQuoteRequest = useCallback(
    (input: Omit<QuoteRequestRecord, 'id' | 'createdAt' | 'status'>): QuoteRequestRecord => {
      const record: QuoteRequestRecord = {
        ...input,
        id: `OKQ-${Math.floor(10000 + Math.random() * 90000)}`,
        createdAt: new Date().toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
        status: 'Brief Received — Quotation Preparing',
      };
      setQuoteRequests((prev) => [record, ...prev]);
      showToast(`Quotation request ${record.id} submitted to OKART Interiors`);
      return record;
    },
    [showToast]
  );

  const signUpAccount = useCallback(
    (input: Omit<UserAccount, 'id' | 'joinedAt'>): UserAccount => {
      const account: UserAccount = {
        ...input,
        id: `OKC-${Math.floor(1000 + Math.random() * 9000)}`,
        joinedAt: new Date().toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
      };
      setUserAccount(account);
      showToast(`Welcome to OKART Interiors, ${account.fullName}`);
      return account;
    },
    [showToast]
  );

  const signOutAccount = useCallback(() => {
    setUserAccount(null);
    showToast('Signed out of your OKART Interiors account');
  }, [showToast]);

  const subscribeNewsletter = useCallback(
    (name: string, _email: string) => {
      setNewsletterSubscribed(true);
      showToast(`Thank you${name ? `, ${name}` : ''}! You are subscribed to OKART Interiors updates.`);
    },
    [showToast]
  );

  const cartTotals = useMemo(() => calculateCartTotals(cart), [cart]);

  return (
    <StoreContext.Provider
      value={{
        currentPath,
        navigate,
        products: CATALOG_PRODUCTS,
        collections: CATALOG_COLLECTIONS,
        designers: DESIGNERS,
        getProductByHandle,
        getCollectionProducts,
        cart,
        cartOpen,
        setCartOpen,
        addToCart,
        addCustomCartLine,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartTotals,
        wishlist,
        toggleWishlist,
        orders,
        placeDemoOrder,
        quoteRequests,
        submitQuoteRequest,
        userAccount,
        signUpAccount,
        signOutAccount,
        newsletterSubscribed,
        subscribeNewsletter,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside StoreProvider');
  return ctx;
}
