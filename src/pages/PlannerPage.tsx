import React, { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Plus, Trash2 } from 'lucide-react';
import { FABRIC_COLLECTIONS, PLANNER_MODULES } from '../data/siteContent';
import { useStore } from '../context/StoreContext';
import { calculatePlannerSummary, type PlannerModuleSpec } from '../utils/storeLogic';

export function PlannerPage() {
  const { addCustomCartLine, navigate } = useStore();
  const [selectedModules, setSelectedModules] = useState<PlannerModuleSpec[]>([
    PLANNER_MODULES[0],
    PLANNER_MODULES[1],
    PLANNER_MODULES[3],
  ]);
  const [depthMode, setDepthMode] = useState<'standard' | 'xl'>('standard');
  const [selectedFabricIdx, setSelectedFabricIdx] = useState(0);
  const [selectedSwatchIdx, setSelectedSwatchIdx] = useState(0);

  const fabricCollection = FABRIC_COLLECTIONS[selectedFabricIdx] || FABRIC_COLLECTIONS[0];
  const swatch = fabricCollection.swatches[selectedSwatchIdx] || fabricCollection.swatches[0];

  const depthMultiplier = depthMode === 'xl' ? 1.12 : 1.0;
  const summary = useMemo(
    () =>
      calculatePlannerSummary(
        selectedModules,
        fabricCollection.multiplier * depthMultiplier
      ),
    [selectedModules, fabricCollection.multiplier, depthMultiplier]
  );

  const addModule = (mod: PlannerModuleSpec) => {
    setSelectedModules((prev) => [...prev, { ...mod, id: `${mod.id}-${Date.now()}` }]);
  };

  const removeModule = (idx: number) => {
    setSelectedModules((prev) => prev.filter((_, i) => i !== idx));
  };

  const moveModule = (idx: number, dir: -1 | 1) => {
    const target = idx + dir;
    if (target < 0 || target >= selectedModules.length) return;
    setSelectedModules((prev) => {
      const next = [...prev];
      const [item] = next.splice(idx, 1);
      next.splice(target, 0, item);
      return next;
    });
  };

  const handleAddConfiguredSofa = () => {
    if (selectedModules.length === 0) return;
    const configDesc = selectedModules.map((m) => m.label).join(' + ');
    addCustomCartLine(
      {
        key: `planner-${selectedModules.map((m) => m.type).join('-')}-${swatch.name}-${depthMode}`,
        productId: 999001,
        handle: 'basecamp-small-open-end-right-2-modules-140x210cm',
        model: `OKART Bespoke Modular (${selectedModules.length} modules · ${depthMode === 'xl' ? 'XL' : 'Standard'})`,
        subtitle: configDesc,
        variantId: 999001 + selectedFabricIdx * 10 + selectedSwatchIdx,
        variantTitle: swatch.name,
        unitPrice: 0,
        image: selectedModules[0].image,
        isQuoteItem: true,
      },
      1
    );
  };

  return (
    <div className="bg-[#F6F5F3] min-h-screen pb-20">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-10 pt-8">
        <div className="flex flex-wrap items-end justify-between gap-4 pb-6 border-b border-[#E1E0DD]">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#82674F]">
              OKART BESPOKE STUDIO · MODULAR SEATING SYSTEM
            </p>
            <h1 className="font-serif-display text-[38px] md:text-[46px] text-[#2B1E12] mt-1">
              Design your own sofa
            </h1>
          </div>
          <button
            type="button"
            onClick={() => navigate('/pages/bespoke')}
            className="text-[11px] uppercase tracking-[0.14em] text-[#4F3926] underline underline-offset-4 hover:text-[#1C1C1C] cursor-pointer"
          >
            Explore Bespoke Production
          </button>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Interactive Architectural Floorplan & Module Canvas */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white border border-[#E1E0DD] p-6 md:p-8">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setDepthMode('standard')}
                    className={`px-4 py-2 rounded-full text-[11px] uppercase tracking-[0.14em] border cursor-pointer ${
                      depthMode === 'standard'
                        ? 'bg-[#2B1E12] text-white border-[#2B1E12]'
                        : 'bg-[#F6F5F3] text-[#1C1C1C] border-[#D5D4D3]'
                    }`}
                  >
                    Standard Depth (105 cm)
                  </button>
                  <button
                    type="button"
                    onClick={() => setDepthMode('xl')}
                    className={`px-4 py-2 rounded-full text-[11px] uppercase tracking-[0.14em] border cursor-pointer ${
                      depthMode === 'xl'
                        ? 'bg-[#2B1E12] text-white border-[#2B1E12]'
                        : 'bg-[#F6F5F3] text-[#1C1C1C] border-[#D5D4D3]'
                    }`}
                  >
                    XL Deep (120 cm)
                  </button>
                </div>

                <div className="text-[12px] text-[#4F3926] tabular-nums">
                  Total dimensions:{' '}
                  <strong className="text-[#1C1C1C]">
                    {summary.totalWidthCm} cm × {summary.maxDepthCm + (depthMode === 'xl' ? 15 : 0)} cm
                  </strong>
                </div>
              </div>

              {/* Visual Module Composition Stage */}
              <div className="bg-[#ECEBE8] p-6 min-h-[280px] flex flex-wrap items-end justify-center gap-3 border border-[#E1E0DD]">
                {selectedModules.length === 0 ? (
                  <div className="text-center py-12 text-[#82674F] text-[13px]">
                    Click any module below to begin composing your bespoke OKART sofa.
                  </div>
                ) : (
                  selectedModules.map((mod, idx) => (
                    <div
                      key={mod.id}
                      className="bg-white border border-[#D5D4D3] p-3 w-36 flex flex-col items-center relative group"
                    >
                      <div
                        className="w-full h-2 rounded-full mb-2"
                        style={{ backgroundColor: swatch.hex }}
                      />
                      <img
                        src={mod.image}
                        alt={mod.label}
                        referrerPolicy="no-referrer"
                        className="w-24 h-20 object-contain"
                      />
                      <span className="text-[10px] uppercase tracking-[0.08em] text-[#1C1C1C] mt-2 text-center">
                        {mod.label}
                      </span>
                      <span className="text-[10px] text-[#82674F] tabular-nums">
                        {mod.widthCm}×{mod.depthCm + (depthMode === 'xl' ? 15 : 0)}cm
                      </span>

                      <div className="mt-2 flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => moveModule(idx, -1)}
                          disabled={idx === 0}
                          aria-label={`Move ${mod.label} left`}
                          className="p-1 text-[#4F3926] disabled:opacity-30 hover:text-[#1C1C1C] cursor-pointer"
                        >
                          <ArrowLeft className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeModule(idx)}
                          aria-label={`Remove ${mod.label}`}
                          className="p-1 text-[#8E5235] hover:text-[#2B1E12] cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveModule(idx, 1)}
                          disabled={idx === selectedModules.length - 1}
                          aria-label={`Move ${mod.label} right`}
                          className="p-1 text-[#4F3926] disabled:opacity-30 hover:text-[#1C1C1C] cursor-pointer"
                        >
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Add Modules Palette */}
              <div className="mt-6">
                <p className="text-[10px] uppercase tracking-[0.18em] text-[#82674F] mb-3">
                  Add modules to your configuration
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                  {PLANNER_MODULES.map((mod) => (
                    <button
                      key={mod.id}
                      type="button"
                      onClick={() => addModule(mod)}
                      className="bg-[#F6F5F3] hover:bg-[#EEE8DE] border border-[#D5D4D3] p-3 flex flex-col items-center text-center transition-colors cursor-pointer"
                    >
                      <img
                        src={mod.image}
                        alt={mod.label}
                        referrerPolicy="no-referrer"
                        className="w-16 h-14 object-contain"
                      />
                      <span className="text-[10px] uppercase tracking-[0.06em] text-[#1C1C1C] mt-2 leading-tight">
                        {mod.label}
                      </span>
                      <span className="mt-1.5 inline-flex items-center gap-1 text-[9px] uppercase tracking-[0.12em] text-[#4F3926]">
                        <Plus className="w-3 h-3" /> Add
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Upholstery & Summary */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-[#E1E0DD] p-6 space-y-5 sticky top-24">
              <div>
                <p className="text-[10px] uppercase tracking-[0.16em] text-[#82674F]">
                  1. Select textile quality
                </p>
                <div className="mt-2.5 grid grid-cols-2 gap-2">
                  {FABRIC_COLLECTIONS.map((fc, idx) => (
                    <button
                      key={fc.id}
                      type="button"
                      onClick={() => {
                        setSelectedFabricIdx(idx);
                        setSelectedSwatchIdx(0);
                      }}
                      className={`px-3 py-2 text-left border text-[11px] transition-colors cursor-pointer ${
                        idx === selectedFabricIdx
                          ? 'border-[#82674F] bg-[#EDE5D5]/60 text-[#1C1C1C]'
                          : 'border-[#E1E0DD] text-[#4F3926] hover:border-[#82674F]'
                      }`}
                    >
                      <div className="font-medium truncate">{fc.name}</div>
                      <div className="text-[10px] text-[#82674F]">{fc.priceTier}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-[0.16em] text-[#82674F]">
                  2. Select colour ({swatch.name})
                </p>
                <div className="mt-2.5 flex flex-wrap gap-2.5">
                  {fabricCollection.swatches.map((sw, idx) => (
                    <button
                      key={sw.name}
                      type="button"
                      title={sw.name}
                      aria-label={sw.name}
                      onClick={() => setSelectedSwatchIdx(idx)}
                      className={`w-8 h-8 rounded-full border cursor-pointer ${
                        idx === selectedSwatchIdx
                          ? 'border-[#1C1C1C] ring-2 ring-[#1C1C1C]/25 ring-offset-2'
                          : 'border-[#D5D4D3]'
                      }`}
                      style={{ backgroundColor: sw.hex }}
                    />
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[#E1E0DD] space-y-2 text-[13px]">
                <div className="flex justify-between text-[#4F3926]">
                  <span>Modules</span>
                  <span className="tabular-nums">{summary.moduleCount} pcs</span>
                </div>
                <div className="flex justify-between text-[#4F3926]">
                  <span>Width × Depth</span>
                  <span className="tabular-nums">
                    {summary.totalWidthCm} × {summary.maxDepthCm + (depthMode === 'xl' ? 15 : 0)} cm
                  </span>
                </div>
                <div className="flex justify-between text-[#4F3926]">
                  <span>Warranty</span>
                  <span>10-year structural</span>
                </div>
              </div>

              <button
                type="button"
                disabled={selectedModules.length === 0}
                onClick={handleAddConfiguredSofa}
                className="w-full py-3.5 rounded-full bg-[#EDE5D5] hover:bg-[#DFD2BC] border border-[#B9A78B] disabled:opacity-40 text-[#2B1E12] text-[11px] uppercase tracking-[0.18em] transition-colors cursor-pointer"
              >
                Add configured sofa to bag
              </button>

              <button
                type="button"
                onClick={() => navigate('/pages/fabric-types-and-colors')}
                className="w-full py-2.5 rounded-full border border-[#D5D4D3] text-[#4F3926] text-[11px] uppercase tracking-[0.14em] hover:border-[#1C1C1C] cursor-pointer"
              >
                Order free fabric samples first
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
