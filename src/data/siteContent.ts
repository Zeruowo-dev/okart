import catalogRaw from './catalog.json';
import designersRaw from './designers.json';
import {
  convertEurToNgn,
  type CollectionInfo,
  type PlannerModuleSpec,
  type ProductItem,
} from '../utils/storeLogic';

export const OKART_CUSTOM_PRODUCTS: ProductItem[] = [
  {
    id: 900101,
    handle: 'the-heritage-dining-chair',
    title: 'The Heritage Dining Chair',
    model: 'The Heritage Dining Chair',
    subtitle: 'Dining Furniture · Deep Button-Tufted Seating',
    designer: 'OKART Atelier',
    productType: 'Dining Furniture',
    tags: ['dining-furniture', 'bespoke', 'signature', 'chair', 'leather'],
    badges: ['SIGNATURE PIECE'],
    minPrice: 0,
    hasPriceRange: false,
    priceOnRequest: true,
    images: ['/assets/aistudio/file_000000009fd08210810b724357c33c10_e55168ad.png'],
    options: [
      {
        name: 'Select finish & upholstery',
        values: [
          'Rich Brown Leather / Solid Walnut Frame',
          'Espresso Leather / Brass Nailhead',
          'Camel Saddle Leather / Smoked Oak',
        ],
      },
    ],
    variants: [
      {
        id: 9001011,
        title: 'Rich Brown Leather / Solid Walnut Frame',
        option1: 'Rich Brown Leather / Solid Walnut Frame',
        option2: null,
        sku: 'OKART-HDC-01',
        price: 0,
        available: true,
        image: '/assets/aistudio/file_000000009fd08210810b724357c33c10_e55168ad.png',
      },
      {
        id: 9001012,
        title: 'Espresso Leather / Brass Nailhead',
        option1: 'Espresso Leather / Brass Nailhead',
        option2: null,
        sku: 'OKART-HDC-02',
        price: 0,
        available: true,
        image: '/assets/aistudio/file_000000009fd08210810b724357c33c10_e55168ad.png',
      },
      {
        id: 9001013,
        title: 'Camel Saddle Leather / Smoked Oak',
        option1: 'Camel Saddle Leather / Smoked Oak',
        option2: null,
        sku: 'OKART-HDC-03',
        price: 0,
        available: true,
        image: '/assets/aistudio/file_000000009fd08210810b724357c33c10_e55168ad.png',
      },
    ],
    description:
      'A timeless dining chair featuring rich brown upholstery, deep button tufting, elegant curved legs and refined nail head detailing.',
  },
  {
    id: 900102,
    handle: 'the-savannah-curved-sofa',
    title: 'The Savannah Curved Sofa',
    model: 'The Savannah Curved Sofa',
    subtitle: 'Sofas & Lounge Seating · Bespoke Upholstered Suite',
    designer: 'OKART Atelier',
    productType: 'Sofas & Lounge Seating',
    tags: ['sofas-lounge', 'bespoke', 'events-furniture', 'curved-sofa', 'signature'],
    badges: ['BESPOKE EDITION'],
    minPrice: 0,
    hasPriceRange: false,
    priceOnRequest: true,
    images: ['/assets/aistudio/file_0000000017d08243b8944982d049802a_85f1893b.png'],
    options: [
      {
        name: 'Select textile & dimension',
        values: [
          'Sand Striped Linen Blend (360 cm)',
          'Warm Ivory Woven Stripe (320 cm)',
          'Nature Bouclé Creme (Custom Length)',
        ],
      },
    ],
    variants: [
      {
        id: 9001021,
        title: 'Sand Striped Linen Blend (360 cm)',
        option1: 'Sand Striped Linen Blend (360 cm)',
        option2: null,
        sku: 'OKART-SCS-01',
        price: 0,
        available: true,
        image: '/assets/aistudio/file_0000000017d08243b8944982d049802a_85f1893b.png',
      },
      {
        id: 9001022,
        title: 'Warm Ivory Woven Stripe (320 cm)',
        option1: 'Warm Ivory Woven Stripe (320 cm)',
        option2: null,
        sku: 'OKART-SCS-02',
        price: 0,
        available: true,
        image: '/assets/aistudio/file_0000000017d08243b8944982d049802a_85f1893b.png',
      },
      {
        id: 9001023,
        title: 'Nature Bouclé Creme (Custom Length)',
        option1: 'Nature Bouclé Creme (Custom Length)',
        option2: null,
        sku: 'OKART-SCS-03',
        price: 0,
        available: true,
        image: '/assets/aistudio/file_0000000017d08243b8944982d049802a_85f1893b.png',
      },
    ],
    description:
      'An expansive sculpted curved sofa tailored in yarn-dyed striped upholstery with plush matching throw cushions. Built to order in OKART Interiors’ in-house production workshop for luxury residences, hospitality lobbies, and VIP event lounges.',
  },
];

const RAW_CATALOG_PRODUCTS: ProductItem[] = (
  catalogRaw as unknown as { products: ProductItem[] }
).products.map((p) => {
  const variants = p.variants.map((v) => ({
    ...v,
    price: convertEurToNgn(v.price),
  }));
  const prices = variants.map((v) => v.price).filter((pr) => pr > 0);
  const minPrice = prices.length > 0 ? Math.min(...prices) : convertEurToNgn(p.minPrice);
  const maxPrice = prices.length > 0 ? Math.max(...prices) : minPrice;
  return {
    ...p,
    minPrice,
    hasPriceRange: maxPrice > minPrice || p.hasPriceRange,
    variants,
  };
});

export const CATALOG_PRODUCTS: ProductItem[] = [
  ...OKART_CUSTOM_PRODUCTS,
  ...RAW_CATALOG_PRODUCTS,
];

const RAW_COLLECTIONS: Record<string, CollectionInfo> = (
  catalogRaw as unknown as { collections: Record<string, CollectionInfo> }
).collections;

export const OKART_COLLECTIONS: Record<string, CollectionInfo> = {
  ...RAW_COLLECTIONS,
  'all-furniture': {
    ...(RAW_COLLECTIONS['all-furniture'] || {
      handle: 'all-furniture',
      title: 'All Furniture',
      description: 'Complete OKART Interiors collection.',
      image: '/assets/aistudio/file_0000000017d08243b8944982d049802a_85f1893b.png',
      productHandles: [],
    }),
    productHandles: [
      'the-heritage-dining-chair',
      'the-savannah-curved-sofa',
      ...(RAW_COLLECTIONS['all-furniture']?.productHandles || []),
    ],
  },
  all: {
    handle: 'all',
    title: 'All Products',
    description: 'Complete OKART Interiors collection.',
    image: '/assets/aistudio/file_0000000017d08243b8944982d049802a_85f1893b.png',
    productHandles: CATALOG_PRODUCTS.map((p) => p.handle),
  },
  'sofas-lounge': {
    handle: 'sofas-lounge',
    title: 'Sofas & Lounge Seating',
    description:
      'Custom-upholstered curved sofas, modular lounge suites, and statement armchairs crafted for living spaces and hospitality lounges.',
    image: 'https://makenordic.com/cdn/shop/files/sofaer_900x.png?v=1788272164',
    productHandles: [
      'the-savannah-curved-sofa',
      ...(RAW_COLLECTIONS['sofas']?.productHandles || []).slice(0, 20),
      ...(RAW_COLLECTIONS['armchairs']?.productHandles || []).slice(0, 6),
    ],
  },
  'bed-bedroom': {
    handle: 'bed-bedroom',
    title: 'Bed & Bedroom Furniture',
    description:
      'Serene bedroom benches, upholstered daybeds, bedside tables, and calming textiles tailored to restorative residential and suite interiors.',
    image: 'https://makenordic.com/cdn/shop/files/Baenke_og_skamler_900x.png?v=1788272640',
    productHandles: [
      ...(RAW_COLLECTIONS['sofa-beds']?.productHandles || []),
      ...(RAW_COLLECTIONS['benches']?.productHandles || []),
      ...(RAW_COLLECTIONS['armchairs']?.productHandles || []).slice(0, 4),
      'contour-pillow-50x50-cm',
      'contour-pillow-50x70-cm',
      'pure-pillow-50x50-cm',
    ],
  },
  'dining-furniture': {
    handle: 'dining-furniture',
    title: 'Dining Furniture',
    description:
      'Solid hardwood dining tables, tufted dining chairs, and handcrafted banquettes built to bring families and guests together.',
    image: 'https://makenordic.com/cdn/shop/files/spiseborde_900x.png?v=1788272366',
    productHandles: [
      'the-heritage-dining-chair',
      ...(RAW_COLLECTIONS['dining-tables']?.productHandles || []),
      ...(RAW_COLLECTIONS['dining-table-chairs']?.productHandles || []),
    ],
  },
  'kitchen-cabinetry-bespoke': {
    handle: 'kitchen-cabinetry-bespoke',
    title: 'Kitchen Cabinetry & Bespoke Furniture',
    description:
      'Made-to-measure kitchen cabinetry, architectural millwork, custom shelving, and bespoke signature pieces fabricated in our workshop.',
    image: 'https://makenordic.com/cdn/shop/files/reoler_900x.png?v=1788272199',
    productHandles: [
      'the-savannah-curved-sofa',
      'the-heritage-dining-chair',
      ...(RAW_COLLECTIONS['storage']?.productHandles || []),
      ...(RAW_COLLECTIONS['trays']?.productHandles || []),
    ],
  },
  'office-commercial': {
    handle: 'office-commercial',
    title: 'Office and Commercial Furniture',
    description:
      'Executive conference tables, reception seating, acoustic lounge systems, and durable hospitality furniture designed for modern workplaces.',
    image:
      'https://makenordic.com/cdn/shop/files/2_2ad31952-dbcc-43a7-8fcb-aba73589fd86.png?v=1695205161&width=1200',
    productHandles: [
      'the-heritage-dining-chair',
      ...(RAW_COLLECTIONS['tables']?.productHandles || []),
      ...(RAW_COLLECTIONS['chairs']?.productHandles || []),
      ...(RAW_COLLECTIONS['storage']?.productHandles || []).slice(0, 4),
    ],
  },
  'events-furniture': {
    handle: 'events-furniture',
    title: 'Events Furniture',
    description:
      'Statement curved VIP lounges, tufted banquet chairs, bar stools, and modular event seating engineered for high-impact gatherings.',
    image: 'https://makenordic.com/cdn/shop/files/4_kvadrat1670.png?v=1789560211&width=800',
    productHandles: [
      'the-savannah-curved-sofa',
      'the-heritage-dining-chair',
      ...(RAW_COLLECTIONS['bar-stools']?.productHandles || []),
      ...(RAW_COLLECTIONS['coffee-tables']?.productHandles || []),
      ...(RAW_COLLECTIONS['benches']?.productHandles || []).slice(0, 4),
    ],
  },
  'interior-projects': {
    handle: 'interior-projects',
    title: 'Interior Projects',
    description:
      'Complete room packages and curated furnishings from OKART Interiors’ turnkey residential, hospitality, and corporate commissions.',
    image:
      'https://makenordic.com/cdn/shop/files/spisestue_holmen_cordyard_banner.png?v=1695206185&width=1200',
    productHandles: [
      'the-heritage-dining-chair',
      'the-savannah-curved-sofa',
      'basecamp-small-open-end-right-2-modules-140x210cm',
      'holmen-round-dining-table-oak',
      'eik-oak-bookcase-large-150x60cm',
      'memo-armchair',
      'umi-oak-bench-small',
      'vilhelm-bar-stool',
    ],
  },
};

export const CATALOG_COLLECTIONS: Record<string, CollectionInfo> = OKART_COLLECTIONS;

export interface DesignerProfile {
  slug: string;
  name: string;
  image: string;
  paragraphs: string[];
}

export const DESIGNERS: DesignerProfile[] = designersRaw as DesignerProfile[];

export const BRAND_ASSETS = {
  logoPrimary: '/assets/aistudio/OKART_Interiors_Luxury_Furniture_Logo__1__c7159dd3.png',
  heritageChair: '/assets/aistudio/file_000000009fd08210810b724357c33c10_e55168ad.png',
  savannahSofa: '/assets/aistudio/file_0000000017d08243b8944982d049802a_85f1893b.png',
  heroDesktop: '/assets/aistudio/pexels-kirti-phadke-316475723-17947890_d587eb9a.jpg',
  heroMobile: '/assets/aistudio/pexels-kirti-phadke-316475723-17947890_d587eb9a.jpg',
  forestVideo: '/assets/aistudio/17261495_1080_1920_60fps_7ba6cbf9.mp4',
  forestPoster: '/assets/aistudio/pexels-kirti-phadke-316475723-17947890_d587eb9a.jpg',
  paymentIcons:
    'https://makenordic.com/cdn/shop/files/Betalingsikoner_EU_-_5_kopi.png?v=1770908073&width=936',
  fabricMacro: 'https://makenordic.com/cdn/shop/files/Design_uden_navn-9.png?v=1695205901&width=1500',
  designOwnSofaInsert:
    'https://makenordic.com/cdn/shop/files/stue_basecamp_goliat_umi_banner.png?v=1695206192&width=1200',
  shopLookRoom:
    'https://makenordic.com/cdn/shop/files/spisestue_holmen_cordyard_banner.png?v=1695206185&width=1200',
  conceptBanner: 'https://makenordic.com/cdn/shop/files/banner6.png?v=1695205772&width=3600',
  designersBanner: 'https://makenordic.com/cdn/shop/files/TOPBANNER_-_3000x1000_-7.png?v=1695206214&width=3000',
  showroomsBanner:
    'https://makenordic.com/cdn/shop/files/Untitled_design_1_6ec5d5f3-6b56-4ff4-b3e1-9632b8c4d163.png?v=1769774203&width=2500',
};

export const OKART_CONTACT = {
  brandName: 'OKART Interiors',
  phone: '09090643748',
  phoneIntl: '+234 909 064 3748',
  whatsapp: '09090643748',
  whatsappUrl: 'https://wa.me/2349090643748',
  email: 'contact@okartinteriors.ng',
  instagramHandle: 'okart.interiors',
  instagramUrl: 'https://www.instagram.com/okart.interiors/',
  address: '52 Liberty Stadium Road, Oke-Ado, Ibadan, Oyo State.',
  hours: [
    { day: 'Monday – Friday', time: '09.00 – 18.00' },
    { day: 'Saturday', time: '10.00 – 16.00' },
  ],
};

export const ANNOUNCEMENTS = [
  {
    text: 'THOUGHTFULLY DESIGNED. BEAUTIFULLY CRAFTED. EXPERTLY DELIVERED.',
    href: '/pages/about-us',
  },
  {
    text: 'EXPLORE BESPOKE KITCHEN CABINETRY & CUSTOM UPHOLSTERY — IBADAN WORKSHOP',
    href: '/pages/bespoke',
  },
  {
    text: 'CALL OR WHATSAPP 09090643748 FOR A PROJECT QUOTATION',
    href: '/pages/contact',
  },
  {
    text: '4.9 ★ GOOGLE REVIEWS — TRUSTED ACROSS RESIDENTIAL & COMMERCIAL SPACES',
    href: '/pages/projects',
  },
];

export interface TopNavItem {
  id: string;
  label: string;
  href: string;
  megaMenuId?: string;
}

export const OKART_TOP_NAV: TopNavItem[] = [
  { id: 'home', label: 'Home', href: '/' },
  { id: 'about', label: 'About Us', href: '/pages/about-us' },
  { id: 'products', label: 'Our Products', href: '/products', megaMenuId: 'products' },
  { id: 'services', label: 'Our Services', href: '/pages/services', megaMenuId: 'services' },
  { id: 'projects', label: 'Our Projects', href: '/pages/projects' },
  { id: 'contact', label: 'Contact Us', href: '/pages/contact' },
];

export interface MegaMenuGroup {
  id: string;
  label: string;
  columns: {
    heading: string;
    links: { label: string; href: string }[];
  }[];
  featured: {
    title: string;
    subtitle: string;
    image: string;
    href: string;
  }[];
}

export const MEGA_MENUS: MegaMenuGroup[] = [
  {
    id: 'products',
    label: 'Our Products',
    columns: [
      {
        heading: '7 Product Categories',
        links: [
          { label: 'All Products & Categories', href: '/products' },
          { label: 'Sofas & Lounge Seating', href: '/collections/sofas-lounge' },
          { label: 'Bed & Bedroom Furniture', href: '/collections/bed-bedroom' },
          { label: 'Dining Furniture', href: '/collections/dining-furniture' },
          { label: 'Kitchen Cabinetry & Bespoke Furniture', href: '/collections/kitchen-cabinetry-bespoke' },
          { label: 'Office and Commercial Furniture', href: '/collections/office-commercial' },
          { label: 'Events Furniture', href: '/collections/events-furniture' },
          { label: 'Interior Projects', href: '/collections/interior-projects' },
        ],
      },
      {
        heading: 'Featured & Customisation',
        links: [
          { label: 'The Heritage Dining Chair', href: '/products/the-heritage-dining-chair' },
          { label: 'The Savannah Curved Sofa', href: '/products/the-savannah-curved-sofa' },
          { label: 'Bespoke Product Studio', href: '/pages/bespoke' },
          { label: 'Modular Sofa Planner', href: '/pages/planner' },
          { label: 'Fabric & Leather Swatches', href: '/pages/fabric-types-and-colors' },
        ],
      },
    ],
    featured: [
      {
        title: 'The Heritage Dining Chair',
        subtitle: 'Deep button tufting & brass nailhead detail',
        image: '/assets/aistudio/file_000000009fd08210810b724357c33c10_e55168ad.png',
        href: '/products/the-heritage-dining-chair',
      },
      {
        title: 'The Savannah Curved Sofa',
        subtitle: 'Bespoke woven stripe upholstery suite',
        image: '/assets/aistudio/file_0000000017d08243b8944982d049802a_85f1893b.png',
        href: '/products/the-savannah-curved-sofa',
      },
    ],
  },
  {
    id: 'services',
    label: 'Our Services',
    columns: [
      {
        heading: 'Our 4 Pillars',
        links: [
          { label: 'All Services Overview', href: '/pages/services' },
          { label: 'Bespoke Furniture Commissions', href: '/pages/bespoke' },
          { label: 'Workshop & Craft Video Showcase', href: '/pages/video' },
          { label: 'Modular Sofa Configurator', href: '/pages/planner' },
        ],
      },
      {
        heading: 'Client Support',
        links: [
          { label: 'Ibadan Showroom & Consultations', href: '/pages/showrooms' },
          { label: 'Material & Textile Library', href: '/pages/fabric-types-and-colors' },
          { label: 'Request a Quotation', href: '/pages/contact' },
          { label: 'Create Client Account', href: '/signup' },
        ],
      },
    ],
    featured: [
      {
        title: 'Brief · Design · Production · Installation',
        subtitle: 'In-house manufacturing & seamless site installation',
        image: 'https://makenordic.com/cdn/shop/files/stue_basecamp_goliat_umi_banner.png?v=1695206192&width=1200',
        href: '/pages/services',
      },
      {
        title: 'The Video Showcase',
        subtitle: 'Inside the OKART Interiors workshop',
        image: 'https://makenordic.com/cdn/shop/files/spisestue_holmen_cordyard_banner.png?v=1695206185&width=1200',
        href: '/pages/video',
      },
    ],
  },
];

export interface CategoryCardItem {
  id: string;
  title: string;
  shortLabel: string;
  href: string;
  image: string;
  subtitle: string;
}

export const CATEGORY_CARDS: CategoryCardItem[] = [
  {
    id: 'sofas-lounge',
    title: 'Sofas & Lounge Seating',
    shortLabel: 'Sofas & Lounge',
    href: '/collections/sofas-lounge',
    image: 'https://makenordic.com/cdn/shop/files/sofaer_900x.png?v=1788272164',
    subtitle: 'Custom curved sofas, modular suites & sculptural armchairs',
  },
  {
    id: 'bed-bedroom',
    title: 'Bed & Bedroom Furniture',
    shortLabel: 'Bed & Bedroom',
    href: '/collections/bed-bedroom',
    image: 'https://makenordic.com/cdn/shop/files/Baenke_og_skamler_900x.png?v=1788272640',
    subtitle: 'Upholstered benches, daybeds, frames & calm bedroom accents',
  },
  {
    id: 'dining-furniture',
    title: 'Dining Furniture',
    shortLabel: 'Dining Furniture',
    href: '/collections/dining-furniture',
    image: 'https://makenordic.com/cdn/shop/files/spiseborde_900x.png?v=1788272366',
    subtitle: 'Solid hardwood tables & The Heritage Dining Chair',
  },
  {
    id: 'kitchen-cabinetry-bespoke',
    title: 'Kitchen Cabinetry & Bespoke',
    shortLabel: 'Kitchen Cabinetry & Bespoke',
    href: '/collections/kitchen-cabinetry-bespoke',
    image: 'https://makenordic.com/cdn/shop/files/reoler_900x.png?v=1788272199',
    subtitle: 'Precision millwork, pantry systems & custom-built pieces',
  },
  {
    id: 'office-commercial',
    title: 'Office & Commercial',
    shortLabel: 'Office & Commercial',
    href: '/collections/office-commercial',
    image: 'https://makenordic.com/cdn/shop/files/2_2ad31952-dbcc-43a7-8fcb-aba73589fd86.png?v=1695205161&width=1200',
    subtitle: 'Boardroom tables, reception lounges & commercial seating',
  },
  {
    id: 'events-furniture',
    title: 'Events Furniture',
    shortLabel: 'Events Furniture',
    href: '/collections/events-furniture',
    image: 'https://makenordic.com/cdn/shop/files/4_kvadrat1670.png?v=1789560211&width=800',
    subtitle: 'Curved VIP lounges, banquet chairs & statement event seating',
  },
  {
    id: 'interior-projects',
    title: 'Interior Projects',
    shortLabel: 'Interior Projects',
    href: '/collections/interior-projects',
    image: 'https://makenordic.com/cdn/shop/files/spisestue_holmen_cordyard_banner.png?v=1695206185&width=1200',
    subtitle: 'End-to-end residential, corporate & hospitality spaces',
  },
];

export const PRESS_LOGOS = [
  { name: 'RESIDENTIAL DESIGN', label: 'RESIDENTIAL' },
  { name: 'HOSPITALITY SUITES', label: 'HOSPITALITY' },
  { name: 'BESPOKE JOINERY', label: 'BESPOKE JOINERY' },
  { name: 'COMMERCIAL SPACES', label: 'COMMERCIAL' },
  { name: 'TURNKEY INTERIORS', label: 'TURNKEY PROJECTS' },
];

export const HOMEPAGE_BESTSELLER_HANDLES = [
  'the-heritage-dining-chair',
  'the-savannah-curved-sofa',
  'basecamp-small-open-end-right-2-modules-140x210cm',
  'eik-oak-bookcase-large-150x60cm',
  'holmen-round-dining-table-oak',
  'memo-armchair',
  'umi-oak-bench-small',
];

export const HOMEPAGE_NEWS_HANDLES = [
  'the-savannah-curved-sofa',
  'the-heritage-dining-chair',
  'base-tray-xl-oaktray',
  'memo-armchair',
  'primetime-armchair-with-stool-black-frame',
  'vilhelm-bar-stool',
];

export interface RealHomePost {
  id: string;
  handle: string;
  image: string;
  caption: string;
  location: string;
  featuredHandles: string[];
}

export const REAL_HOMES_GALLERY: RealHomePost[] = [
  {
    id: 'rh-1',
    handle: '@okart.interiors · Bodija Residence',
    image: 'https://makenordic.com/cdn/shop/files/1_sabinaavital.png?v=1789560103&width=800',
    caption: 'Bespoke living room suite featuring curved boucle upholstery, solid hardwood tables, and warm daylight.',
    location: 'Bodija, Ibadan',
    featuredHandles: ['the-savannah-curved-sofa', 'basecamp-small-open-end-right-2-modules-140x210cm'],
  },
  {
    id: 'rh-2',
    handle: '@okart.interiors · Victoria Island Dining',
    image: 'https://makenordic.com/cdn/shop/files/2_76497c1d-c732-4946-ae8d-795a36b898bb.png?v=1789560162&width=800',
    caption: 'Private residence dining installation pairing solid timber joinery with tailored upholstered seating.',
    location: 'Victoria Island, Lagos',
    featuredHandles: ['the-heritage-dining-chair', 'holmen-round-dining-table-oak'],
  },
  {
    id: 'rh-3',
    handle: '@okart.interiors · Custom Cabinetry',
    image: 'https://makenordic.com/cdn/shop/files/3_line_olesen.png?v=1789560183&width=800',
    caption: 'Precision-milled storage and wall-mounted cabinetry fabricated in our Oke-Ado workshop.',
    location: 'Oke-Ado, Ibadan',
    featuredHandles: ['eik-oak-bookcase-large-150x60cm'],
  },
  {
    id: 'rh-4',
    handle: '@okart.interiors · Executive Lounge',
    image: 'https://makenordic.com/cdn/shop/files/4_kvadrat1670.png?v=1789560211&width=800',
    caption: 'Warm timber panelling and tailored wool armchairs installed for a private client lounge.',
    location: 'Ikoyi, Lagos',
    featuredHandles: ['memo-armchair', 'the-savannah-curved-sofa'],
  },
  {
    id: 'rh-5',
    handle: '@okart.interiors · Hospitality Suite',
    image: 'https://makenordic.com/cdn/shop/files/5_matlanthihlum.png?v=1789560242&width=800',
    caption: 'Sunlit dining and meeting pavilion crafted for long-lasting daily gatherings.',
    location: 'Ibadan, Oyo State',
    featuredHandles: ['the-heritage-dining-chair', 'holmen-round-dining-table-oak'],
  },
  {
    id: 'rh-6',
    handle: '@okart.interiors · Family Living',
    image: 'https://makenordic.com/cdn/shop/files/6_ee743824-a185-4600-9480-380f7eae825b.png?v=1789560290&width=800',
    caption: 'Deep modular seating upholstered for comfort, resilience, and everyday residential warmth.',
    location: 'Abuja, FCT',
    featuredHandles: ['basecamp-small-open-end-right-2-modules-140x210cm'],
  },
  {
    id: 'rh-7',
    handle: '@okart.interiors · Entry Gallery',
    image: 'https://makenordic.com/cdn/shop/files/7_hellelomtjernbakken.png?v=1789560328&width=800',
    caption: 'Custom solid wood bench grounding an airy residence foyer.',
    location: 'Jericho, Ibadan',
    featuredHandles: ['umi-oak-bench-small'],
  },
  {
    id: 'rh-8',
    handle: '@okart.interiors · Study Corner',
    image: 'https://makenordic.com/cdn/shop/files/8_huset_ved_faelleden.png?v=1789560461&width=800',
    caption: 'Sculptural reading chair crafted with timeless proportions and clean upholstery seams.',
    location: 'Lekki, Lagos',
    featuredHandles: ['memo-armchair'],
  },
];

export const TRUE_COST_PILLARS = [
  {
    title: 'Brief & Thoughtful Design',
    body: 'We start by listening carefully to your spatial goals, lifestyle, and aesthetic—translating your brief into functional, timeless designs.',
    image: 'https://makenordic.com/cdn/shop/files/b1.png?v=1788272753&width=1080',
  },
  {
    title: 'In-House Production',
    body: 'Every furniture piece, cabinet, and tufted frame is crafted in our own workshop combining time-honoured artisanal techniques with modern precision.',
    image: 'https://makenordic.com/cdn/shop/files/b2.png?v=1788272774&width=2000',
  },
  {
    title: 'Expert Delivery & Installation',
    body: 'Right furniture, right price, right time. Our installation team delivers and finishes every project seamlessly—no shortcuts, no excuses.',
    image: 'https://makenordic.com/cdn/shop/files/b3.png?v=1788272794&width=2000',
  },
];

export const OKART_PILLARS = [
  {
    step: '01',
    title: 'Brief',
    description:
      'We take time to understand your space, functional needs, aesthetic direction, and budget—whether commissioning a single dining chair or furnishing an entire building.',
  },
  {
    step: '02',
    title: 'Design',
    description:
      'Our designers translate your vision into proportioned technical drawings, curated timber finishes, and tactile upholstery specifications built to endure.',
  },
  {
    step: '03',
    title: 'Production',
    description:
      'In our in-house production workshop, skilled artisans combine time-honoured joinery and button-tufting craft with modern production accuracy.',
  },
  {
    step: '04',
    title: 'Installation',
    description:
      'Our dedicated team handles logistics, site preparation, and final installation so every piece sits securely and elevates your environment on day one.',
  },
];

export interface OkartServiceItem {
  id: string;
  title: string;
  summary: string;
  priceRange: string;
  pricingTiers: { scope: string; price: string }[];
  deliverables: string[];
  image: string;
  href: string;
}

export const OKART_SERVICES: OkartServiceItem[] = [
  {
    id: 'bespoke-furniture',
    title: 'Bespoke Furniture Manufacturing',
    summary:
      'Custom-built sofas, tufted dining chairs, bedroom suites, and statement lounge seating tailored to your dimensions and fabric palette.',
    priceRange: '₦850,000 – ₦16,500,000+',
    pricingTiers: [
      { scope: 'Accent & Tufted Dining Chairs', price: '₦850,000 – ₦2,400,000' },
      { scope: 'Bespoke Modular & Curved Sofas', price: '₦3,800,000 – ₦16,500,000' },
      { scope: 'Solid Hardwood Dining Tables', price: '₦1,850,000 – ₦5,200,000' },
    ],
    deliverables: ['Custom dimensions & upholstery', 'Hardwood frame joinery', 'Direct workshop fabrication'],
    image: '/assets/aistudio/file_000000009fd08210810b724357c33c10_e55168ad.png',
    href: '/pages/bespoke',
  },
  {
    id: 'kitchen-cabinetry',
    title: 'Kitchen Cabinetry & Architectural Millwork',
    summary:
      'Made-to-measure kitchen cabinets, island units, wardrobes, and architectural wall shelving engineered for daily durability and clean lines.',
    priceRange: '₦4,800,000 – ₦24,000,000+',
    pricingTiers: [
      { scope: 'Luxury Apartment Kitchen Fit-Out', price: '₦4,800,000 – ₦8,500,000' },
      { scope: 'Full Villa Kitchen + Center Island', price: '₦9,500,000 – ₦24,000,000+' },
      { scope: 'Walk-In Wardrobes & Wall Panelling', price: 'From ₦2,800,000' },
    ],
    deliverables: ['Site measurement & 3D layout', 'Soft-close hardware & moisture-sealed finishes', 'Full on-site fitting'],
    image: 'https://makenordic.com/cdn/shop/files/reoler_900x.png?v=1788272199',
    href: '/collections/kitchen-cabinetry-bespoke',
  },
  {
    id: 'commercial-hospitality',
    title: 'Commercial, Office & Hospitality Interiors',
    summary:
      'Turnkey refurbishment, renovation, furnishing, and installation for executive offices, hotels, lounges, and modern restaurants.',
    priceRange: '₦7,500,000 – ₦65,000,000+',
    pricingTiers: [
      { scope: 'Executive Office & Boardroom Suite', price: '₦7,500,000 – ₦18,000,000' },
      { scope: 'Hospitality Lounge & Banquette Fit-Out', price: '₦12,000,000 – ₦35,000,000' },
      { scope: 'Full Turnkey Commercial Refurbishment', price: 'From ₦25,000,000' },
    ],
    deliverables: ['Space planning & workstation systems', 'Hospitality booth & lounge upholstery', 'Scheduled multi-room installation'],
    image:
      'https://makenordic.com/cdn/shop/files/2_2ad31952-dbcc-43a7-8fcb-aba73589fd86.png?v=1695205161&width=1200',
    href: '/collections/office-commercial',
  },
  {
    id: 'events-furniture',
    title: 'Events Furniture & Custom Staging',
    summary:
      'High-impact curved lounge suites, VIP banquet seating, and modular installations designed specifically for weddings, galas, and brand launches.',
    priceRange: '₦3,500,000 – ₦22,000,000+',
    pricingTiers: [
      { scope: 'VIP Curved Lounge Seating Clusters', price: 'From ₦3,500,000' },
      { scope: 'Custom Tufted Banquet Seating Package', price: '₦4,500,000 – ₦14,500,000' },
      { scope: 'Architectural Gala & Brand Staging', price: 'From ₦9,500,000' },
    ],
    deliverables: ['Curved VIP lounge clusters', 'Tufted banquet chairs', 'Timed event delivery & setup'],
    image: '/assets/aistudio/file_0000000017d08243b8944982d049802a_85f1893b.png',
    href: '/collections/events-furniture',
  },
];

export interface OkartProjectItem {
  id: string;
  title: string;
  category: 'Residential' | 'Commercial' | 'Hospitality' | 'Events';
  location: string;
  scope: string;
  summary: string;
  image: string;
  featuredHandles: string[];
}

export const OKART_PROJECTS: OkartProjectItem[] = [
  {
    id: 'proj-bodija',
    title: 'The Bodija Private Residence',
    category: 'Residential',
    location: 'Bodija, Ibadan',
    scope: 'Full Residence · Sofas, Dining & Kitchen Cabinetry',
    summary:
      'A serene six-bedroom family residence featuring bespoke striped curved seating, custom oak kitchen cabinetry, and deep tufted Heritage Dining Chairs.',
    image: 'https://makenordic.com/cdn/shop/files/1_sabinaavital.png?v=1789560103&width=800',
    featuredHandles: ['the-savannah-curved-sofa', 'the-heritage-dining-chair'],
  },
  {
    id: 'proj-vi-executive',
    title: 'Liberty Corporate & Executive Suite',
    category: 'Commercial',
    location: 'Oke-Ado, Ibadan',
    scope: 'Commercial Refurbishment & Boardroom Joinery',
    summary:
      'Tailored executive conference seating, custom timber storage walls, and reception lounges built and installed on schedule without interrupting operations.',
    image:
      'https://makenordic.com/cdn/shop/files/2_2ad31952-dbcc-43a7-8fcb-aba73589fd86.png?v=1695205161&width=1200',
    featuredHandles: ['eik-oak-bookcase-large-150x60cm', 'memo-armchair'],
  },
  {
    id: 'proj-hospitality',
    title: 'Heritage Boutique Dining & Lounge',
    category: 'Hospitality',
    location: 'Victoria Island, Lagos',
    scope: 'Hospitality Furnishing & Upholstery',
    summary:
      'Rich chestnut leather dining seating with antique brass nailhead trim paired with bespoke solid hardwood dining tables for an intimate fine-dining venue.',
    image:
      'https://makenordic.com/cdn/shop/files/spisestue_holmen_cordyard_banner.png?v=1695206185&width=1200',
    featuredHandles: ['the-heritage-dining-chair', 'holmen-round-dining-table-oak'],
  },
  {
    id: 'proj-grand-gala',
    title: 'Savannah Architectural VIP Gala Lounge',
    category: 'Events',
    location: 'Abuja, FCT',
    scope: 'Events Furniture · Custom Curved Seating',
    summary:
      'Multi-piece curved linen-striped lounge installations engineered for conversational flow at an annual cultural & corporate gala.',
    image: 'https://makenordic.com/cdn/shop/files/4_kvadrat1670.png?v=1789560211&width=800',
    featuredHandles: ['the-savannah-curved-sofa', 'vilhelm-bar-stool'],
  },
];

export interface GoogleReviewItem {
  id: string;
  author: string;
  role: string;
  rating: number;
  date: string;
  projectType: string;
  comment: string;
}

export const GOOGLE_REVIEWS: GoogleReviewItem[] = [
  {
    id: 'gr-1',
    author: 'Adebayo Ogunleye',
    role: 'Homeowner · Bodija',
    rating: 5,
    date: '2 weeks ago',
    projectType: 'Dining & Living Suite',
    comment:
      'Ordered 8 Heritage Dining Chairs and a custom curved sofa for our new home. The leather tufting, brass detailing, and installation right on schedule were exceptional.',
  },
  {
    id: 'gr-2',
    author: 'Folake Adeyemi',
    role: 'Interior Architect · Lagos',
    rating: 5,
    date: '1 month ago',
    projectType: 'Kitchen Cabinetry & Bespoke',
    comment:
      'OKART Interiors executed our client’s entire kitchen cabinetry and bespoke lounge brief cleanly. True to their word—no shortcuts, honest pricing, and spotless finishing.',
  },
  {
    id: 'gr-3',
    author: 'Chinedu Okafor',
    role: 'Hospitality Director',
    rating: 5,
    date: '2 months ago',
    projectType: 'Commercial & Events Seating',
    comment:
      'From initial brief to final site installation in Ibadan, their workshop craftsmanship matched international luxury standards while keeping timelines predictable.',
  },
  {
    id: 'gr-4',
    author: 'Toluwalope Bamidele',
    role: 'Verified Google Review',
    rating: 5,
    date: '3 months ago',
    projectType: 'Bedroom & Storage Millwork',
    comment:
      'Visited the Liberty Stadium Road workshop to pick fabrics in person. They guided our upholstery choices and delivered our bed frame and wardrobes two days ahead of schedule.',
  },
];

export interface ShowroomInfo {
  id: string;
  city: string;
  country: string;
  address: string;
  postalCity: string;
  phone: string;
  email: string;
  image: string;
  hours: { day: string; time: string }[];
  note: string;
}

export const SHOWROOMS: ShowroomInfo[] = [
  {
    id: 'ibadan',
    city: 'Ibadan',
    country: 'Nigeria',
    address: '52 Liberty Stadium Road, Oke-Ado',
    postalCity: 'Ibadan, Oyo State',
    phone: '09090643748',
    email: 'contact@okartinteriors.ng',
    image:
      'https://makenordic.com/cdn/shop/files/2_2ad31952-dbcc-43a7-8fcb-aba73589fd86.png?v=1695205161&width=1200',
    hours: [
      { day: 'Monday – Friday', time: '09.00 – 18.00' },
      { day: 'Saturday', time: '10.00 – 16.00' },
    ],
    note: 'Our OKART Interiors showroom, design studio, and in-house production workshop in Oke-Ado, Ibadan. Inspect leather hides, bouclé swatches, wood stains, and active bespoke pieces in person.',
  },
  {
    id: 'online',
    city: 'Virtual & On-Site Consultations',
    country: 'Nationwide Delivery',
    address: 'WhatsApp Video & Site Measurement Team',
    postalCity: 'Ibadan · Lagos · Abuja · Nationwide',
    phone: '09090643748',
    email: 'contact@okartinteriors.ng',
    image:
      'https://makenordic.com/cdn/shop/files/3_3808df20-590d-4775-b126-f51d1efce66b.png?v=1695205288&width=1200',
    hours: [
      { day: 'Monday – Saturday', time: '09.00 – 18.00' },
    ],
    note: 'Book a WhatsApp video walkthrough or request our site measurement team for bespoke kitchen cabinetry, residential rooms, commercial offices, and event setups.',
  },
];

export const FABRIC_COLLECTIONS = [
  {
    id: 'hallingdal',
    name: 'Architectural Wool & Weave',
    designer: 'Tactile Contract Grade',
    composition: 'Wool & Heavy-Duty Woven Fiber Blend',
    martindale: '100,000 Martindale',
    certification: 'Stain-Resistant · Commercial Grade',
    priceTier: 'Signature Weave',
    multiplier: 1.0,
    description:
      'Tightly woven natural wool and architectural upholstery fabrics selected for breathability, rich colour depth, and enduring daily resilience.',
    swatches: [
      { name: 'Sand Woven Stripe', hex: '#CFC5B4' },
      { name: 'Warm Ivory Linen', hex: '#EAE5DA' },
      { name: 'Stone Light Grey', hex: '#B7B5AE' },
      { name: 'Slate Charcoal', hex: '#7D7B76' },
      { name: 'Ochre Brass', hex: '#C69D48' },
      { name: 'Heritage Navy', hex: '#395B7A' },
    ],
  },
  {
    id: 'boucle',
    name: 'Nature Bouclé',
    designer: 'Tactile Soft Weave',
    composition: 'Looped Textured Upholstery',
    martindale: '80,000 Martindale',
    certification: 'OEKO-TEX® Standard 100',
    priceTier: 'Bouclé Collection',
    multiplier: 1.08,
    description:
      'Rich, sculpted bouclé texture woven with dimensional yarns for architectural softness on curved sofas and bedroom seating.',
    swatches: [
      { name: 'Nature Bouclé Creme nr. 24', hex: '#EAE5DA' },
      { name: 'Nature Bouclé Sand nr. 02', hex: '#D6CCBC' },
      { name: 'Nature Bouclé Hemp nr. 03', hex: '#C6B9A4' },
      { name: 'Nature Bouclé Juta nr. 04', hex: '#9D8E7C' },
      { name: 'Nature Bouclé Dark Taupe nr. 10', hex: '#786B5E' },
    ],
  },
  {
    id: 'leather-heritage',
    name: 'Heritage Full-Grain Leather',
    designer: 'Deep-Tufted Upholstery Hide',
    composition: 'Selected Full-Grain Top-Coat Leather',
    martindale: 'Rich Natural Patina',
    certification: 'Artisanal Drum-Dyed',
    priceTier: 'Heritage Leather',
    multiplier: 1.32,
    description:
      'Velvety rich brown and cognac hides ideal for deep diamond button tufting, nailhead trim chairs, and executive lounge suites.',
    swatches: [
      { name: 'Rich Brown Heritage Leather', hex: '#8B4A2B' },
      { name: 'Dunes Leather Camel', hex: '#B58454' },
      { name: 'Espresso Dark Walnut Hide', hex: '#5A4433' },
    ],
  },
  {
    id: 'velvet-matte',
    name: 'Velvet & Matte Hide',
    designer: 'Hospitality & Event Grade',
    composition: 'Plush Pile & Supple Matte Grain',
    martindale: 'High Wear Resistance',
    certification: 'Event & Contract Certified',
    priceTier: 'Bespoke Edition',
    multiplier: 1.25,
    description:
      'Supple, easy-care finishes curated for luxury dining rooms, hotel suites, and statement event installations.',
    swatches: [
      { name: 'Burned Grey', hex: '#696662' },
      { name: 'Olive Moss', hex: '#63684F' },
      { name: 'Champagne Cream Velvet', hex: '#EDE5D5' },
    ],
  },
];

export const PLANNER_MODULES: PlannerModuleSpec[] = [
  {
    id: 'mod-open-end-l',
    type: 'open-end-left',
    label: 'Open End Left',
    widthCm: 105,
    depthCm: 105,
    basePriceNgn: 2380000,
    image:
      'https://cdn.shopify.com/s/files/1/0761/4172/3961/files/1_Singleshot_RWL-218_8eefe602-9cee-41fe-bcec-9362fdfbed7b.png?v=1695215223',
  },
  {
    id: 'mod-center',
    type: 'center',
    label: 'Center Module',
    widthCm: 105,
    depthCm: 105,
    basePriceNgn: 1830000,
    image: 'https://cdn.shopify.com/s/files/1/0761/4172/3961/files/AA01-3B.png?v=1773402529',
  },
  {
    id: 'mod-corner',
    type: 'corner',
    label: 'Corner Module',
    widthCm: 105,
    depthCm: 105,
    basePriceNgn: 2380000,
    image: 'https://cdn.shopify.com/s/files/1/0761/4172/3961/files/AA01-8E.png?v=1773402364',
  },
  {
    id: 'mod-chaiselongue-r',
    type: 'chaiselongue-right',
    label: 'Chaiselongue Right',
    widthCm: 105,
    depthCm: 140,
    basePriceNgn: 2680000,
    image: 'https://cdn.shopify.com/s/files/1/0761/4172/3961/files/AA01-9D.png?v=1773402676',
  },
  {
    id: 'mod-open-end-r',
    type: 'open-end-right',
    label: 'Open End Right',
    widthCm: 105,
    depthCm: 105,
    basePriceNgn: 2380000,
    image: 'https://cdn.shopify.com/s/files/1/0761/4172/3961/files/AA01-8D.png?v=1773402470',
  },
  {
    id: 'mod-pouf',
    type: 'pouf',
    label: 'Lounge Ottoman',
    widthCm: 105,
    depthCm: 70,
    basePriceNgn: 1280000,
    image:
      'https://cdn.shopify.com/s/files/1/0761/4172/3961/files/1_Singleshot_RWL-218_6b4b88c3-3f28-4ba5-9a48-cecd491c3865.png?v=1695215793',
  },
];

export const OKART_TERMS_SECTIONS = [
  {
    heading: '1. Introduction',
    body: 'Welcome to Okart Interiors. These Terms & Conditions govern the use of our website and provide general information about our products and services. By accessing our website, you agree to use it responsibly and in accordance with these terms. Please note that browsing our website or submitting an enquiry does not, by itself, constitute a confirmed order or project agreement.',
  },
  {
    heading: '2. Our Products and Services',
    body: 'Okart Interiors specialises in the design and production of custom-made furniture, cabinetry, upholstery, and related interior solutions. Our services may include residential and commercial furniture, event furniture, interior refurbishment, renovation, furnishing, and installation. The products and services available for individual projects will be confirmed through a quotation or written agreement.',
  },
  {
    heading: '3. Product Images and Descriptions',
    body: 'Images displayed on our website are intended to illustrate our products, designs, and capabilities. Actual products may vary slightly in appearance due to lighting, photography, material characteristics, natural variations, and manufacturing processes. Any material differences from agreed specifications will be addressed in accordance with the relevant order agreement and applicable law.',
  },
  {
    heading: '4. Quotations and Pricing',
    body: 'Prices, specifications, and project estimates will be communicated through individual quotations. Unless otherwise stated, quotations are valid for the period specified in the quotation document. Changes to the project scope, specifications, materials, or quantities may affect the final price and delivery timeline. Any agreed changes will be communicated to the client before implementation.',
  },
  {
    heading: '5. Orders and Project Confirmation',
    body: 'An order or project will be considered confirmed when the client has accepted the applicable quotation or written agreement and satisfied the agreed initial payment requirements. The quotation or project agreement will set out the relevant specifications, price, payment schedule, estimated completion date, and other applicable terms.',
  },
  {
    heading: '6. Payments',
    body: 'Payment amounts, deposits, instalments, and payment deadlines will be stated in the relevant quotation or project agreement. Clients are responsible for making payments according to the agreed schedule. Any outstanding balance must be settled in accordance with the agreed payment terms.',
  },
  {
    heading: '7. Production and Delivery Timelines',
    body: 'Estimated production, delivery, and installation dates will be communicated when an order or project is confirmed. We will make reasonable efforts to meet agreed timelines. Where circumstances arise that may affect delivery, we will communicate the situation to the client and discuss appropriate next steps.',
  },
  {
    heading: '8. Changes and Cancellations',
    body: 'Requests to change an approved order or project must be communicated in writing. Changes may affect pricing, production schedules, material requirements, and completion dates. Cancellations, refunds, and returns will be handled in accordance with the applicable order agreement, our Refund, Cancellation & Returns Policy, and relevant law.',
  },
  {
    heading: '9. Installation and Site Access',
    body: 'Where installation is included in the agreed scope, clients are responsible for providing reasonable access to the installation site and communicating relevant site conditions in advance. Any additional work arising from undisclosed site conditions or changes to the agreed scope will be discussed with the client before proceeding, where reasonably practicable.',
  },
];

export const FAQ_ITEMS = [
  {
    q: 'How do I request pricing or a quotation for bespoke furniture like The Heritage Dining Chair?',
    a: 'Click "Request Custom Quote" on any bespoke product page, message us via the live chat on our website, or call/WhatsApp us on 09090643748. Our team will confirm pricing, material choices, and delivery dates through a clear written quotation.',
  },
  {
    q: 'Where is OKART Interiors located and can I visit in person?',
    a: 'Our office and production showroom are located at 52 Liberty Stadium Road, Oke-Ado, Ibadan, Oyo State. You can also reach us anytime on 09090643748 or email contact@okartinteriors.ng.',
  },
  {
    q: 'What does OKART Interiors’ four-pillar process include?',
    a: 'Every project follows Brief, Design, Production, and Installation—taking your concept from initial consultation and spatial planning through in-house workshop craftsmanship to seamless on-site delivery and installation.',
  },
  {
    q: 'Do you handle both residential and commercial/events furniture?',
    a: 'Yes. We design and manufacture furniture across 7 core categories: Sofas & Lounge Seating, Bed & Bedroom Furniture, Dining Furniture, Kitchen Cabinetry & Bespoke Furniture, Office and Commercial Furniture, Events Furniture, and Full Interior Projects.',
  },
  {
    q: 'How do changes, cancellations, and refunds work?',
    a: 'All approved changes must be communicated in writing and may affect material requirements or timelines. Cancellations, refunds, and returns are governed fairly by our written order agreement and Refund, Cancellation & Returns Policy.',
  },
];
