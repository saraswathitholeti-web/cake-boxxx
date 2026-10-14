'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Coupon } from '@/types';
import { Tag, Sparkles, Copy, Check, ArrowRight, Gift, Percent } from 'lucide-react';

export default function OffersPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    async function loadCoupons() {
      try {
        const res = await fetch('/api/coupons');
        const data = await res.json();
        setCoupons(data);
      } catch (err) {
        console.error(err);
      }
    }
    loadCoupons();
  }, []);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
        <span className="text-xs font-bold text-[#E85A71] uppercase tracking-widest flex items-center justify-center gap-1">
          <Sparkles className="w-3.5 h-3.5" /> Bakery Savings
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-[#4A2E18] tracking-tight">
          Offers, Deals & Promo Codes
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
          Enjoy special discounts on celebration cakes, weekend combos, and first-time bakery orders across Guntur.
        </p>
      </div>

      {/* Coupons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coupons.map((coupon) => (
          <div
            key={coupon.id}
            className="bg-white rounded-3xl border border-amber-100 shadow-xs hover:shadow-lg transition-all p-6 flex flex-col justify-between space-y-5 relative overflow-hidden"
          >
            {/* Top decorative stripe */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#4A2E18] via-[#E85A71] to-[#C68B59]"></div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black px-3 py-1 rounded-full bg-amber-100 text-[#4A2E18] flex items-center gap-1">
                  <Tag className="w-3 h-3 text-[#E85A71]" />
                  {coupon.code}
                </span>
                <span className="text-[10px] text-gray-400 font-semibold">
                  Valid till {new Date(coupon.validUntil).toLocaleDateString()}
                </span>
              </div>

              <h3 className="text-lg font-black text-[#4A2E18]">
                {coupon.description}
              </h3>

              <div className="text-xs text-gray-500 space-y-1">
                <div>• Minimum Order: <strong className="text-gray-800">₹{coupon.minOrderAmount}</strong></div>
                {coupon.maxDiscount && (
                  <div>• Maximum Discount: <strong className="text-gray-800">₹{coupon.maxDiscount}</strong></div>
                )}
                <div>• Applicable on all items in Brodipet menu</div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
              <button
                onClick={() => handleCopy(coupon.code)}
                className={`flex-1 py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  copiedCode === coupon.code
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                    : 'bg-[#FAF5EE] text-[#4A2E18] border-amber-200 hover:bg-amber-100'
                }`}
              >
                {copiedCode === coupon.code ? (
                  <>
                    <Check className="w-3.5 h-3.5" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Copy Code
                  </>
                )}
              </button>

              <Link
                href="/menu"
                className="py-2.5 px-4 bg-[#4A2E18] hover:bg-[#2A170F] text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1"
              >
                <span>Order</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
