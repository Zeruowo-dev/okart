import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ANNOUNCEMENTS } from '../data/siteContent';
import { useStore } from '../context/StoreContext';

export function AnnouncementBar() {
  const { navigate } = useStore();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
    }, 5500);
    return () => window.clearInterval(timer);
  }, []);

  const current = ANNOUNCEMENTS[index];

  return (
    <aside
      aria-label="Store announcements"
      className="sticky top-0 z-[55] w-full bg-[#EDE5D5] text-[#2B1E12] border-b border-[#D5C9B4]"
    >
      <div className="max-w-[1440px] mx-auto pl-3 pr-24 sm:px-4 h-9 flex items-center justify-center gap-3 sm:gap-6">
        <button
          type="button"
          onClick={() =>
            setIndex((prev) => (prev - 1 + ANNOUNCEMENTS.length) % ANNOUNCEMENTS.length)
          }
          aria-label="Previous announcement"
          className="p-1 text-[#4F3926] hover:text-[#2B1E12] transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        <a
          href={current.href}
          onClick={(e) => {
            e.preventDefault();
            navigate(current.href);
          }}
          className="text-[11px] tracking-[0.14em] uppercase font-normal underline underline-offset-4 decoration-[#82674F]/60 hover:decoration-[#2B1E12] truncate max-w-[75vw] text-center"
        >
          {current.text}
        </a>

        <button
          type="button"
          onClick={() => setIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length)}
          aria-label="Next announcement"
          className="p-1 text-[#4F3926] hover:text-[#2B1E12] transition-colors cursor-pointer"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
}
