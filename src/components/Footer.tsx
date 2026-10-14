import React from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail, Clock, Heart, ShieldCheck } from 'lucide-react';
import { GUNTUR_LOCALITIES } from '@/lib/geo';

export default function Footer() {
  return (
    <footer className="bg-[#2A170F] text-amber-100/90 pt-12 pb-24 md:pb-12 border-t border-amber-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-[#2A170F] font-black text-lg">
                CB
              </div>
              <div>
                <span className="text-xl font-black text-amber-200 tracking-tight">CAKE BOX</span>
                <p className="text-[10px] text-amber-300/70 uppercase tracking-wider font-semibold">Guntur, Andhra Pradesh</p>
              </div>
            </div>
            <p className="text-xs text-amber-200/80 leading-relaxed">
              Fresh bakes, sweet celebration moments, and sizzling fast food delivered directly from our Brodipet kitchen to your doorstep in Guntur.
            </p>
            <div className="flex items-center gap-2 text-xs text-amber-300">
              <Clock className="w-4 h-4 text-[#E85A71]" />
              <span>10:00 AM – 10:30 PM (All 7 Days)</span>
            </div>
          </div>

          {/* Location & Contacts */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-amber-200 uppercase tracking-widest">Bakery Address</h4>
            <div className="space-y-2 text-xs text-amber-200/80">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#E85A71] flex-shrink-0 mt-0.5" />
                <span>4th Lane, Beside ICICI Bank, Brodipet, Guntur, Andhra Pradesh 522002</span>
              </div>
              <div className="text-[11px] text-amber-300/70 pl-6">
                Plus Code: <span className="font-mono text-amber-200">8C3J+F8, Guntur</span>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <Phone className="w-4 h-4 text-[#E85A71] flex-shrink-0" />
                <a href="tel:+918632234567" className="hover:text-white transition-colors">
                  +91 863 223 4567
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#E85A71] flex-shrink-0" />
                <a href="mailto:orders@cakeboxguntur.com" className="hover:text-white transition-colors">
                  orders@cakeboxguntur.com
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-amber-200 uppercase tracking-widest">Quick Navigation</h4>
            <ul className="space-y-1.5 text-xs text-amber-200/80">
              <li>
                <Link href="/menu" className="hover:text-amber-300 transition-colors">
                  Full Menu & Categories
                </Link>
              </li>
              <li>
                <Link href="/menu?category=cat-birthday-cakes" className="hover:text-amber-300 transition-colors">
                  Custom Birthday Cakes
                </Link>
              </li>
              <li>
                <Link href="/menu?category=cat-pizza" className="hover:text-amber-300 transition-colors">
                  Pizzas & Fast Food
                </Link>
              </li>
              <li>
                <Link href="/offers" className="hover:text-amber-300 transition-colors">
                  Offers & Coupon Codes
                </Link>
              </li>
              <li>
                <Link href="/track" className="hover:text-amber-300 transition-colors">
                  Live Order Tracking
                </Link>
              </li>
              <li>
                <Link href="/support" className="hover:text-amber-300 transition-colors">
                  Customer Care & Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Policies & Portals */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-amber-200 uppercase tracking-widest">Policies & Portals</h4>
            <ul className="space-y-1.5 text-xs text-amber-200/80">
              <li>
                <Link href="/policies#cancellation" className="hover:text-amber-300 transition-colors">
                  Cancellation & Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/policies#delivery" className="hover:text-amber-300 transition-colors">
                  Delivery Policy & Zones
                </Link>
              </li>
              <li>
                <Link href="/policies#terms" className="hover:text-amber-300 transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/policies#privacy" className="hover:text-amber-300 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li className="pt-2 border-t border-amber-900/60">
                <Link href="/admin" className="text-amber-300 font-semibold hover:underline flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Restaurant Admin Dashboard
                </Link>
              </li>
              <li>
                <Link href="/delivery" className="text-emerald-400 font-semibold hover:underline">
                  Delivery Partner Dashboard
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Localities delivery tag cloud */}
        <div className="pt-6 border-t border-amber-900/60 mb-6">
          <div className="text-[11px] font-bold text-amber-300/80 uppercase tracking-wider mb-2">
            Delivering Across Guntur Localities:
          </div>
          <div className="flex flex-wrap gap-1.5 text-[11px] text-amber-200/60">
            {GUNTUR_LOCALITIES.map((loc, idx) => (
              <span key={loc.name} className="hover:text-amber-200 cursor-default">
                {loc.name} {idx < GUNTUR_LOCALITIES.length - 1 && '•'}
              </span>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-6 border-t border-amber-900/40 flex flex-col sm:flex-row items-center justify-between text-xs text-amber-200/60 gap-3">
          <p>© 2026 Cake Box, Guntur. Fresh Bakes. Sweet Moments. Delivered.</p>
          <p className="flex items-center gap-1 text-[11px]">
            Made with <Heart className="w-3.5 h-3.5 text-[#E85A71] fill-current" /> for foodies in Guntur
          </p>
        </div>
      </div>
    </footer>
  );
}
