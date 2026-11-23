export interface ProductVariant {
  id: number;
  title: string;
  option1: string | null;
  option2: string | null;
  sku: string | null;
  price: number;
  available: boolean;
  image: string;
}

export interface ProductOption {
  name: string;
  values: string[];
}

export interface ProductItem {
  id: number;
  handle: string;
  title: string;
  model: string;
  subtitle: string;
  designer: string;
  productType: string;
  tags: string[];
  badges: string[];
  minPrice: number;
  hasPriceRange: boolean;
  priceOnRequest?: boolean;
  images: string[];
  options: ProductOption[];
  variants: ProductVariant[];
  description: string;
}

export interface CollectionInfo {
  handle: string;
  title: string;
  description: string;
  image: string;
  productHandles: string[];
}

export interface CartLine {
  key: string;
  productId: number;
  handle: string;
  model: string;
  subtitle: string;
  variantId: number;
  variantTitle: string;
  unitPrice: number;
  quantity: number;
  image: string;
  isQuoteItem?: boolean;
}

export interface SwatchVisual {
  hex: string;
  label: string;
  materialFamily: string;
}

export type SortOption =
  | 'featured'
  | 'price-asc'
  | 'price-desc'
  | 'title-asc'
  | 'title-desc';

export interface FilterCriteria {
  query?: string;
  designer?: string;
  material?: string;
  subCategory?: string;
  sortBy?: SortOption;
}

export const EUR_TO_NGN_RATE = 1850;

export function convertEurToNgn(eurAmount: number, rate = EUR_TO_NGN_RATE): number {
  if (eurAmount <= 0) return 0;
  const raw = eurAmount * rate;
  if (raw < 20000) {
    return Math.round(raw / 500) * 500;
  }
  if (raw < 1000000) {
    return Math.round(raw / 5000) * 5000;
  }
  return Math.round(raw / 10000) * 10000;
}

export function formatNaira(amount: number, showFrom = false): string {
  const rounded = Math.round(amount);
  const formatted = rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return showFrom ? `From ₦${formatted}` : `₦${formatted}`;
}

export function formatProductPrice(
  product: Pick<ProductItem, 'minPrice' | 'hasPriceRange' | 'priceOnRequest'>,
  overridePrice?: number
): string {
  if (product.priceOnRequest) {
    return 'Price on Request';
  }
  const price = overridePrice ?? product.minPrice;
  return formatNaira(price, overridePrice === undefined && product.hasPriceRange);
}

export function getSwatchVisual(value: string): SwatchVisual {
  const v = value.toLowerCase();

  let materialFamily = 'Textile';
  if (v.includes('hallingdal')) materialFamily = 'Hallingdal 65 Wool';
  else if (v.includes('bouclé') || v.includes('boucle')) materialFamily = 'Nature Bouclé';
  else if (v.includes('dunes') || v.includes('leather') || v.includes('læder')) materialFamily = 'Full-Grain Leather';
  else if (v.includes('nuance')) materialFamily = 'NUANCE Leather';
  else if (v.includes('re-wool') || v.includes('rewool')) materialFamily = 'Re-Wool';
  else if (v.includes('cosmo')) materialFamily = 'Cosmo Weave';
  else if (v.includes('velvet')) materialFamily = 'Luxury Velvet';
  else if (v.includes('striped') || v.includes('linen')) materialFamily = 'Bespoke Woven Linen';
  else if (v.includes('oak') || v.includes('eg') || v.includes('mahogany') || v.includes('walnut')) {
    materialFamily = 'Solid Hardwood';
  }

  if (v.includes('black') || v.includes('sort') || v.includes('anthrazite') || v.includes('antracit')) {
    return { hex: '#282625', label: value, materialFamily };
  }
  if (v.includes('smoked') || v.includes('røget') || v.includes('walnut') || v.includes('dark brown') || v.includes('espresso') || v.includes('mahogany')) {
    return { hex: '#5A4433', label: value, materialFamily };
  }
  if (v.includes('cognac') || v.includes('rust') || v.includes('terracotta') || v.includes('burnt') || v.includes('rich brown') || v.includes('chestnut')) {
    return { hex: '#8B4A2B', label: value, materialFamily };
  }
  if (v.includes('camel') || v.includes('amber')) {
    return { hex: '#B58454', label: value, materialFamily };
  }
  if (v.includes('yellow') || v.includes('gul') || v.includes('407')) {
    return { hex: '#C69D48', label: value, materialFamily };
  }
  if (v.includes('blue') || v.includes('blå') || v.includes('750') || v.includes('petrol')) {
    return { hex: '#395B7A', label: value, materialFamily };
  }
  if (v.includes('green') || v.includes('grøn') || v.includes('olive') || v.includes('moss') || v.includes('sage')) {
    return { hex: '#63684F', label: value, materialFamily };
  }
  if (v.includes('creme') || v.includes('cream') || v.includes('ivory') || v.includes('white') || v.includes('hvid') || v.includes('200') || v.includes('nr. 24')) {
    return { hex: '#EAE5DA', label: value, materialFamily };
  }
  if (v.includes('sand') || v.includes('oat') || v.includes('beige') || v.includes('hemp') || v.includes('linen') || v.includes('striped') || v.includes('220') || v.includes('nr. 02') || v.includes('nr. 03') || v.includes('nr. 40')) {
    return { hex: '#CFC5B4', label: value, materialFamily };
  }
  if (v.includes('juta') || v.includes('taupe') || v.includes('brun') || v.includes('brown') || v.includes('nr. 04') || v.includes('nr. 10')) {
    return { hex: '#8E8070', label: value, materialFamily };
  }
  if (v.includes('light grey') || v.includes('116')) {
    return { hex: '#B7B5AE', label: value, materialFamily };
  }
  if (v.includes('grey') || v.includes('gray') || v.includes('grå') || v.includes('130')) {
    return { hex: '#7D7B76', label: value, materialFamily };
  }
  if (v.includes('soap') || v.includes('sæbe')) {
    return { hex: '#DFCFAF', label: value, materialFamily };
  }
  if (v.includes('natural oil') || v.includes('natur') || v.includes('oak') || v.includes('eg')) {
    return { hex: '#C8A97E', label: value, materialFamily };
  }
  return { hex: '#BEB8AC', label: value, materialFamily };
}

export function filterAndSortProducts(
  products: ProductItem[],
  criteria: FilterCriteria
): ProductItem[] {
  let result = [...products];

  if (criteria.query && criteria.query.trim().length > 0) {
    const q = criteria.query.trim().toLowerCase();
    result = result.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.model.toLowerCase().includes(q) ||
        p.subtitle.toLowerCase().includes(q) ||
        p.designer.toLowerCase().includes(q) ||
        p.productType.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)) ||
        p.description.toLowerCase().includes(q)
    );
  }

  if (criteria.designer && criteria.designer !== 'All') {
    const d = criteria.designer.toLowerCase();
    result = result.filter((p) => p.designer.toLowerCase().includes(d));
  }

  if (criteria.material && criteria.material !== 'All') {
    const m = criteria.material.toLowerCase();
    result = result.filter((p) =>
      p.variants.some((v) => v.title.toLowerCase().includes(m)) ||
      p.title.toLowerCase().includes(m) ||
      p.description.toLowerCase().includes(m)
    );
  }

  if (criteria.subCategory && criteria.subCategory !== 'all') {
    const sub = criteria.subCategory.toLowerCase();
    result = result.filter((p) => {
      if (sub === 'basecamp') return p.handle.includes('basecamp') || p.title.toLowerCase().includes('basecamp');
      if (sub === 'memo') return p.handle.includes('memo') || p.title.toLowerCase().includes('memo');
      if (sub === 'heartland') return p.handle.includes('heartland') || p.title.toLowerCase().includes('heartland');
      if (sub === 'modular') return p.handle.includes('module') || p.handle.includes('corner') || p.handle.includes('center') || p.handle.includes('open-end') || p.handle.includes('pouf');
      if (sub === 'sofa-beds') return p.handle.includes('sofa-bed') || p.title.toLowerCase().includes('sofa bed');
      if (sub === 'bespoke') return p.priceOnRequest || p.tags.some((t) => t.toLowerCase().includes('bespoke'));
      if (sub === 'round') return p.title.toLowerCase().includes('round');
      if (sub === 'oak') return p.title.toLowerCase().includes('oak');
      return p.handle.includes(sub) || p.title.toLowerCase().includes(sub) || p.productType.toLowerCase().includes(sub);
    });
  }

  switch (criteria.sortBy) {
    case 'price-asc':
      result.sort((a, b) => a.minPrice - b.minPrice);
      break;
    case 'price-desc':
      result.sort((a, b) => b.minPrice - a.minPrice);
      break;
    case 'title-asc':
      result.sort((a, b) => a.model.localeCompare(b.model));
      break;
    case 'title-desc':
      result.sort((a, b) => b.model.localeCompare(a.model));
      break;
    default:
      break;
  }

  return result;
}

export const FREE_DELIVERY_THRESHOLD_NGN = 5000000;
export const STANDARD_DELIVERY_FEE_NGN = 85000;

export function calculateCartTotals(items: CartLine[]): {
  itemCount: number;
  subtotal: number;
  shippingCost: number;
  total: number;
  qualifiesForFreeSmallParcel: boolean;
} {
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const hasOnlyQuotes = items.length > 0 && items.every((i) => i.isQuoteItem || i.unitPrice === 0);
  const qualifiesForFreeSmallParcel =
    hasOnlyQuotes ||
    subtotal >= FREE_DELIVERY_THRESHOLD_NGN ||
    items.every((i) => i.handle.includes('tray') || i.handle.includes('sample'));
  const shippingCost = items.length === 0 ? 0 : qualifiesForFreeSmallParcel ? 0 : STANDARD_DELIVERY_FEE_NGN;
  return {
    itemCount,
    subtotal,
    shippingCost,
    total: subtotal + shippingCost,
    qualifiesForFreeSmallParcel,
  };
}

export interface PlannerModuleSpec {
  id: string;
  type: 'open-end-left' | 'open-end-right' | 'center' | 'corner' | 'chaiselongue-left' | 'chaiselongue-right' | 'pouf';
  label: string;
  widthCm: number;
  depthCm: number;
  basePriceNgn: number;
  image: string;
}

export function calculatePlannerSummary(
  modules: PlannerModuleSpec[],
  fabricTierMultiplier: number
): {
  totalWidthCm: number;
  maxDepthCm: number;
  totalPriceNgn: number;
  moduleCount: number;
} {
  const totalWidthCm = modules.reduce((sum, m) => sum + m.widthCm, 0);
  const maxDepthCm = modules.reduce((max, m) => Math.max(max, m.depthCm), 0);
  const rawPrice = modules.reduce((sum, m) => sum + m.basePriceNgn, 0);
  return {
    totalWidthCm,
    maxDepthCm,
    totalPriceNgn: Math.round((rawPrice * fabricTierMultiplier) / 5000) * 5000,
    moduleCount: modules.length,
  };
}

export function getDeliveryEstimate(product: Pick<ProductItem, 'handle' | 'badges' | 'priceOnRequest'>): string {
  if (product.priceOnRequest) {
    return 'Bespoke Workshop Production · Quotation & Timeline Confirmed on Brief';
  }
  if (product.badges.includes('FREE DELIVERY') || product.handle.includes('tray') || product.handle.includes('pillow') || product.handle.includes('sample')) {
    return 'Delivery: 2 – 5 business days';
  }
  if (product.handle.includes('eik') || product.handle.includes('umi') || product.handle.includes('bench')) {
    return 'Delivery: 1 – 2 weeks (Ready for dispatch)';
  }
  return 'Production & Delivery: 3 – 6 weeks (Crafted to specification)';
}

export function generateChatReply(userMessage: string): string {
  const msg = userMessage.toLowerCase();
  if (msg.includes('heritage') || msg.includes('dining chair') || msg.includes('price') || msg.includes('quote')) {
    return 'All OKART Interiors pieces are priced in Nigerian Naira (₦). Bespoke sofas typically range from ₦3,800,000 – ₦16,500,000+, luxury kitchen cabinetry starts from ₦4,800,000, and custom dining pieces like The Heritage Dining Chair are quoted to your leather, timber stain, and quantity. Call or WhatsApp 09090643748 for an immediate quotation.';
  }
  if (msg.includes('kitchen') || msg.includes('cabinet') || msg.includes('bespoke') || msg.includes('custom')) {
    return 'Our in-house Ibadan workshop builds custom Kitchen Cabinetry (typically ₦4,800,000 – ₦24,000,000+ depending on scope and stone/hardware finishes) and Bespoke Furniture following Brief, Design, Production, and Installation. Share your room dimensions at contact@okartinteriors.ng.';
  }
  if (msg.includes('address') || msg.includes('location') || msg.includes('ibadan') || msg.includes('visit') || msg.includes('showroom')) {
    return 'You can visit OKART Interiors at 52 Liberty Stadium Road, Oke-Ado, Ibadan, Oyo State, or call/WhatsApp us directly on 09090643748 to schedule a private consultation.';
  }
  if (msg.includes('event') || msg.includes('office') || msg.includes('commercial') || msg.includes('project')) {
    return 'We furnish luxury residences, corporate offices (from ₦7,500,000), hospitality venues, and high-impact events (from ₦3,500,000). Explore Our Services or send your project brief for a bespoke Naira schedule.';
  }
  if (msg.includes('refund') || msg.includes('terms') || msg.includes('delivery') || msg.includes('timeline')) {
    return 'Production timelines and deposit schedules are clearly outlined in your project quotation. We uphold strict quality standards—no shortcuts, no excuses. View our full Terms & Conditions and Refund Policy via the footer.';
  }
  return 'Welcome to OKART Interiors Nigeria! Our team assists with bespoke sofas, dining furniture, kitchen cabinetry, office/commercial interiors, and event seating. Reach us directly on WhatsApp/Phone at 09090643748 or email contact@okartinteriors.ng.';
}
