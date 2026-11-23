import React from 'react';
import { Star } from 'lucide-react';
import { GOOGLE_REVIEWS, OKART_CONTACT } from '../data/siteContent';
import { useStore } from '../context/StoreContext';

export function GoogleReviewsSection() {
  const { navigate } = useStore();

  return (
    <section
      aria-label="Verified Google Reviews"
      className="w-full bg-[#EEE8DE] border-y border-[#E1E0DD] py-16 md:py-20"
    >
      <div className="max-w-[1440px] mx-auto px-4 lg:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#82674F]">
              VERIFIED CLIENT FEEDBACK · GOOGLE REVIEWS
            </p>
            <h2 className="font-serif-display text-[34px] md:text-[40px] text-[#2B1E12] mt-1">
              Trusted in homes &amp; spaces across Nigeria
            </h2>
          </div>

          <div className="bg-white border border-[#D5D4D3] px-5 py-3 flex items-center gap-4">
            <div>
              <div className="text-[24px] leading-none text-[#1C1C1C] tabular-nums">4.9</div>
              <div className="text-[10px] uppercase tracking-[0.12em] text-[#82674F] mt-1">
                Google Rating
              </div>
            </div>
            <div className="h-8 w-px bg-[#E1E0DD]" />
            <div>
              <div className="flex items-center gap-0.5 text-[#A67C46]" aria-label="5 out of 5 stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-[#A67C46]" />
                ))}
              </div>
              <p className="text-[11px] text-[#4F3926] mt-1">Based on verified client projects</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {GOOGLE_REVIEWS.map((review) => (
            <article
              key={review.id}
              className="bg-white border border-[#E1E0DD] p-6 flex flex-col justify-between space-y-5"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-0.5 text-[#A67C46]">
                    {Array.from({ length: review.rating }).map((_, idx) => (
                      <Star key={idx} className="w-3.5 h-3.5 fill-[#A67C46]" />
                    ))}
                  </div>
                  <span className="text-[10px] uppercase tracking-[0.12em] text-[#82674F]">
                    Google
                  </span>
                </div>
                <p className="text-[13px] text-[#4F3926] leading-[1.65]">
                  &ldquo;{review.comment}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-[#F0EFED]">
                <div className="text-[12px] uppercase tracking-[0.08em] text-[#1C1C1C]">
                  {review.author}
                </div>
                <div className="text-[11px] text-[#82674F] mt-0.5">
                  {review.role} · {review.projectType}
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 text-[12px] text-[#4F3926]">
          <span>
            Visit our Ibadan workshop &amp; showroom at {OKART_CONTACT.address}
          </span>
          <button
            type="button"
            onClick={() => navigate('/pages/contact')}
            className="px-6 py-2.5 rounded-full bg-[#F6F5F3] hover:bg-[#DFD2BC] border border-[#B9A78B] text-[#2B1E12] text-[10px] uppercase tracking-[0.16em] transition-colors cursor-pointer"
          >
            Start your project brief
          </button>
        </div>
      </div>
    </section>
  );
}
