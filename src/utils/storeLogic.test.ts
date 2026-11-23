import test from 'node:test';
import assert from 'node:assert/strict';
import {
  convertEurToNgn,
  formatNaira,
  formatProductPrice,
  getSwatchVisual,
  filterAndSortProducts,
  calculateCartTotals,
  calculatePlannerSummary,
  getDeliveryEstimate,
  generateChatReply,
  STANDARD_DELIVERY_FEE_NGN,
  type ProductItem,
  type CartLine,
  type PlannerModuleSpec,
} from './storeLogic';

test('formatNaira formats Nigerian Naira with comma separators and optional From prefix', () => {
  assert.equal(formatNaira(780000), '₦780,000');
  assert.equal(formatNaira(4790000), '₦4,790,000');
  assert.equal(formatNaira(4790000, true), 'From ₦4,790,000');
  assert.equal(formatNaira(16080000, true), 'From ₦16,080,000');
});

test('convertEurToNgn scales catalog prices cleanly to Nigerian luxury pricing', () => {
  assert.equal(convertEurToNgn(0), 0);
  assert.equal(convertEurToNgn(4), 7500);
  assert.equal(convertEurToNgn(420), 775000);
  assert.equal(convertEurToNgn(2590), 4790000);
  assert.equal(convertEurToNgn(8690), 16080000);
});

test('formatProductPrice returns Price on Request for bespoke/no-price pieces and Naira otherwise', () => {
  assert.equal(
    formatProductPrice({ minPrice: 0, hasPriceRange: false, priceOnRequest: true }),
    'Price on Request'
  );
  assert.equal(
    formatProductPrice({ minPrice: 2220000, hasPriceRange: true, priceOnRequest: false }),
    'From ₦2,220,000'
  );
});

test('getSwatchVisual identifies material family and hex tone accurately', () => {
  const h = getSwatchVisual('Hallingdal Beige nr. 220');
  assert.equal(h.materialFamily, 'Hallingdal 65 Wool');
  assert.equal(h.hex, '#CFC5B4');

  const d = getSwatchVisual('Dunes Leather Cognac nr. 21000');
  assert.equal(d.materialFamily, 'Full-Grain Leather');
  assert.equal(d.hex, '#8B4A2B');

  const b = getSwatchVisual('Nature Bouclé Creme nr. 24');
  assert.equal(b.materialFamily, 'Nature Bouclé');
  assert.equal(b.hex, '#EAE5DA');
});

test('filterAndSortProducts filters by query, designer, and sorts by price', () => {
  const sample: ProductItem[] = [
    {
      id: 1,
      handle: 'the-heritage-dining-chair',
      title: 'The Heritage Dining Chair',
      model: 'The Heritage Dining Chair',
      subtitle: 'Button-tufted Dining Chair',
      designer: 'OKART Atelier',
      productType: 'Dining Furniture',
      tags: ['dining-furniture', 'bespoke'],
      badges: ['SIGNATURE PIECE'],
      minPrice: 0,
      hasPriceRange: false,
      priceOnRequest: true,
      images: [],
      options: [],
      variants: [{ id: 11, title: 'Rich Brown Tufted Leather', option1: 'Rich Brown', option2: null, sku: 'OK-HDC', price: 0, available: true, image: '' }],
      description: 'A timeless dining chair featuring rich brown upholstery, deep button tufting, elegant curved legs and refined nail head detailing',
    },
    {
      id: 2,
      handle: 'umi-oak-bench-small',
      title: 'UMI - Oak bench, small',
      model: 'UMI',
      subtitle: 'Oak bench, small',
      designer: 'Jennifer Cena',
      productType: 'Bench',
      tags: ['bench'],
      badges: [],
      minPrice: 775000,
      hasPriceRange: false,
      images: [],
      options: [],
      variants: [{ id: 22, title: 'Natural Oil Oak', option1: 'Natural Oil Oak', option2: null, sku: 'U1', price: 775000, available: true, image: '' }],
      description: 'Solid oak bench',
    },
  ];

  const byQuery = filterAndSortProducts(sample, { query: 'Heritage' });
  assert.equal(byQuery.length, 1);
  assert.equal(byQuery[0].handle, 'the-heritage-dining-chair');

  const sortedAsc = filterAndSortProducts(sample, { sortBy: 'price-asc' });
  assert.equal(sortedAsc[0].handle, 'the-heritage-dining-chair');

  const sortedDesc = filterAndSortProducts(sample, { sortBy: 'price-desc' });
  assert.equal(sortedDesc[0].handle, 'umi-oak-bench-small');
});

test('calculateCartTotals computes item counts, Naira delivery thresholds, and quote items', () => {
  const trayLines: CartLine[] = [
    {
      key: '1-11',
      productId: 1,
      handle: 'base-tray-xl-oaktray',
      model: 'BASETRAY XL',
      subtitle: 'Oak Tray',
      variantId: 11,
      variantTitle: 'Natural Oak',
      unitPrice: 215000,
      quantity: 2,
      image: '',
    },
  ];
  const trayTotals = calculateCartTotals(trayLines);
  assert.equal(trayTotals.itemCount, 2);
  assert.equal(trayTotals.subtotal, 430000);
  assert.equal(trayTotals.shippingCost, 0);
  assert.equal(trayTotals.total, 430000);

  const benchTotals = calculateCartTotals([
    { ...trayLines[0], handle: 'umi-oak-bench-small', unitPrice: 775000, quantity: 1 },
  ]);
  assert.equal(benchTotals.shippingCost, STANDARD_DELIVERY_FEE_NGN);
  assert.equal(benchTotals.total, 775000 + STANDARD_DELIVERY_FEE_NGN);

  const luxuryOrderTotals = calculateCartTotals([
    { ...trayLines[0], handle: 'basecamp-sofa', unitPrice: 5200000, quantity: 1 },
  ]);
  assert.equal(luxuryOrderTotals.shippingCost, 0);

  const quoteTotals = calculateCartTotals([
    { ...trayLines[0], handle: 'the-heritage-dining-chair', unitPrice: 0, quantity: 4, isQuoteItem: true },
  ]);
  assert.equal(quoteTotals.shippingCost, 0);
  assert.equal(quoteTotals.total, 0);
  assert.equal(quoteTotals.itemCount, 4);
});

test('calculatePlannerSummary computes modular sofa dimensions and Nigerian Naira pricing', () => {
  const modules: PlannerModuleSpec[] = [
    { id: 'm1', type: 'open-end-left', label: 'Open End Left', widthCm: 105, depthCm: 105, basePriceNgn: 2380000, image: '' },
    { id: 'm2', type: 'center', label: 'Center', widthCm: 105, depthCm: 105, basePriceNgn: 1830000, image: '' },
    { id: 'm3', type: 'chaiselongue-right', label: 'Chaiselongue Right', widthCm: 105, depthCm: 140, basePriceNgn: 2680000, image: '' },
  ];
  const summary = calculatePlannerSummary(modules, 1.15);
  assert.equal(summary.moduleCount, 3);
  assert.equal(summary.totalWidthCm, 315);
  assert.equal(summary.maxDepthCm, 140);
  assert.equal(summary.totalPriceNgn, 7925000);
});

test('getDeliveryEstimate and generateChatReply handle bespoke & Nigerian OKART inquiries', () => {
  assert.match(getDeliveryEstimate({ handle: 'the-heritage-dining-chair', badges: [], priceOnRequest: true }), /Bespoke Workshop Production/);
  assert.match(getDeliveryEstimate({ handle: 'base-tray-xl-oaktray', badges: ['FREE DELIVERY'] }), /2 – 5 business days/);
  assert.match(generateChatReply('Where is your showroom in Ibadan?'), /52 Liberty Stadium Road/);
  assert.match(generateChatReply('Tell me the price of sofas in Naira'), /₦/);
});
