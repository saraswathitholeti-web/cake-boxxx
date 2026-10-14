import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Clock, MapPin, Truck, RefreshCw, FileText } from 'lucide-react';

export default function PoliciesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-12 text-[#4A2E18]">
      {/* Header */}
      <div className="text-center space-y-2">
        <span className="text-xs font-bold text-[#E85A71] uppercase tracking-widest">
          Cake Box Brodipet, Guntur
        </span>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
          Policies & Terms of Service
        </h1>
        <p className="text-xs sm:text-sm text-gray-500">
          Last updated: October 2026 • Effective across all Cake Box Guntur online ordering services
        </p>
      </div>

      {/* Cancellation & Refund Policy */}
      <section id="cancellation" className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-100 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
          <RefreshCw className="w-5 h-5 text-[#E85A71]" />
          <h2 className="text-xl font-bold">Cancellation & Refund Policy</h2>
        </div>
        <div className="text-xs text-gray-600 space-y-3 leading-relaxed">
          <p>
            At Cake Box, we bake each cake fresh to celebrate your special moments. Please review our policies regarding order modifications and cancellations:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>
              <strong>Cancellation Window:</strong> Standard orders can be cancelled free of charge if the kitchen has not yet started preparation (within ~5 minutes of placing your order).
            </li>
            <li>
              <strong>Personalized & Custom Cakes:</strong> Once custom message piping or baking has commenced, customized birthday and celebration cakes cannot be cancelled.
            </li>
            <li>
              <strong>Quality Assurance:</strong> If you receive an incorrect item or damaged packaging, please notify our customer care team within 1 hour of delivery with photos via our Customer Support page.
            </li>
            <li>
              <strong>Refund Processing:</strong> Approved refunds for online payments (UPI, Cards, Netbanking) are initiated immediately and credited back to the original source within 3–5 working days. For Cash on Delivery orders, store credit or direct bank transfer is arranged.
            </li>
          </ul>
        </div>
      </section>

      {/* Delivery Policy */}
      <section id="delivery" className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-100 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
          <Truck className="w-5 h-5 text-[#E85A71]" />
          <h2 className="text-xl font-bold">Delivery Policy & Zones</h2>
        </div>
        <div className="text-xs text-gray-600 space-y-3 leading-relaxed">
          <p>
            Cake Box operates a direct kitchen delivery fleet across Guntur:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>
              <strong>Delivery Coverage:</strong> We currently deliver up to 12 km from our bakery located at 4th Lane, Beside ICICI Bank, Brodipet, Guntur (PIN 522002).
            </li>
            <li>
              <strong>Major Localities:</strong> Brodipet, Arundelpet, Lakshmipuram, Koretipadu, Pattabhipuram, Syamala Nagar, Vidya Nagar, Brindavan Gardens, Gujjanagundla, Amaravathi Road, Old Guntur, and Collectorate.
            </li>
            <li>
              <strong>Delivery Fees:</strong> Base delivery fee is ₹35 for up to 3 km, plus ₹10 per additional kilometer. Orders above ₹499 qualify for <strong>FREE Delivery</strong>.
            </li>
            <li>
              <strong>Delivery Timings:</strong> Orders are delivered between 10:00 AM and 10:30 PM. Average delivery time is 30–45 minutes depending on traffic and preparation requirements.
            </li>
          </ul>
        </div>
      </section>

      {/* Terms and Conditions */}
      <section id="terms" className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-100 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
          <FileText className="w-5 h-5 text-[#E85A71]" />
          <h2 className="text-xl font-bold">Terms & Conditions</h2>
        </div>
        <div className="text-xs text-gray-600 space-y-3 leading-relaxed">
          <p>
            By using the Cake Box website and placing orders, you agree to comply with our terms of service:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Prices listed on the starter catalog are in Indian Rupees (INR) and are subject to change as configured by Cake Box management.</li>
            <li>Dietary tags (100% Eggless, Vegetarian, Non-Vegetarian) are prepared strictly following food safety and FSSAI standards.</li>
            <li>Coupon codes are valid on eligible products and cannot be combined unless explicitly stated.</li>
          </ul>
        </div>
      </section>

      {/* Privacy Policy */}
      <section id="privacy" className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-100 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
          <ShieldCheck className="w-5 h-5 text-[#E85A71]" />
          <h2 className="text-xl font-bold">Privacy Policy</h2>
        </div>
        <div className="text-xs text-gray-600 space-y-3 leading-relaxed">
          <p>
            We respect your privacy. Customer phone numbers, addresses, and recipient names are used exclusively for dispatching food orders and sending delivery status SMS/WhatsApp updates. We do not sell or share customer data with unauthorized third parties.
          </p>
        </div>
      </section>
    </div>
  );
}
