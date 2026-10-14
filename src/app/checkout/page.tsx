'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { GUNTUR_LOCALITIES, isWithinDeliveryRadius } from '@/lib/geo';
import { Address, PaymentMethod } from '@/types';
import {
  MapPin,
  Calendar,
  Clock,
  CreditCard,
  QrCode,
  Smartphone,
  Banknote,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
  Truck,
  Sparkles,
  Printer,
} from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const {
    items,
    clearCart,
    subtotal,
    discount,
    deliveryFee,
    packagingFee,
    tax,
    totalAmount,
    appliedCoupon,
    deliveryAddress,
    setDeliveryAddress,
    deliveryType,
    setDeliveryType,
    scheduledDate,
    setScheduledDate,
    scheduledTime,
    setScheduledTime,
    deliveryInstructions,
    setDeliveryInstructions,
    cookingInstructions,
  } = useCart();

  const [step, setStep] = useState<number>(1);
  const [recipientName, setRecipientName] = useState(deliveryAddress.recipientName || user?.name || 'Priya Sharma');
  const [recipientPhone, setRecipientPhone] = useState(deliveryAddress.recipientPhone || user?.phone || '9848022334');
  const [houseFlat, setHouseFlat] = useState(deliveryAddress.houseFlat || 'Flat 302, Sai Residency');
  const [street, setStreet] = useState(deliveryAddress.street || '7th Line');
  const [selectedLocality, setSelectedLocality] = useState(deliveryAddress.locality || 'Arundelpet');
  const [landmark, setLandmark] = useState(deliveryAddress.landmark || 'Near NTR Statue');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [upiApp, setUpiApp] = useState('Google Pay');

  // Submit states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [placedOrder, setPlacedOrder] = useState<any>(null);

  // If cart is empty and not on confirmed step, redirect
  if (items.length === 0 && !placedOrder) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-3xl border border-amber-100 text-center space-y-4">
        <h2 className="text-xl font-bold text-[#4A2E18]">Your cart is empty</h2>
        <p className="text-xs text-gray-500">Please add items to your cart before proceeding to checkout.</p>
        <Link
          href="/menu"
          className="inline-block py-2.5 px-6 bg-[#4A2E18] text-white rounded-xl text-xs font-bold"
        >
          Browse Menu
        </Link>
      </div>
    );
  }

  const handleProceedToPayment = () => {
    // Validate address locality radius
    const loc = GUNTUR_LOCALITIES.find((l) => l.name === selectedLocality) || GUNTUR_LOCALITIES[1];
    const geo = isWithinDeliveryRadius(loc.lat, loc.lng);
    if (!geo.allowed) {
      setErrorMsg(`Address is ${geo.distanceKm} km away. Cake Box only delivers within 12 km in Guntur.`);
      return;
    }
    setErrorMsg('');

    // Update active address
    const updatedAddr: Address = {
      ...deliveryAddress,
      recipientName,
      recipientPhone,
      houseFlat,
      street,
      locality: selectedLocality,
      landmark,
      latitude: loc.lat,
      longitude: loc.lng,
    };
    setDeliveryAddress(updatedAddr);
    setStep(2);
  };

  const handlePlaceOrder = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const orderPayload = {
        userId: user?.id || 'u-default',
        customerName: recipientName,
        customerPhone: recipientPhone,
        deliveryAddress: {
          ...deliveryAddress,
          recipientName,
          recipientPhone,
          houseFlat,
          street,
          locality: selectedLocality,
          landmark,
        },
        items,
        couponCode: appliedCoupon?.code,
        paymentMethod,
        deliveryType,
        scheduledDate: deliveryType === 'scheduled' ? scheduledDate : undefined,
        scheduledTime: deliveryType === 'scheduled' ? scheduledTime : undefined,
        deliveryInstructions,
        cookingInstructions,
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to place order');
      }

      setPlacedOrder(data);
      clearCart();

      // Trigger celebratory confetti
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#E85A71', '#4A2E18', '#F59E0B', '#10B981'],
      });
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong while placing your order. Please retry.');
      setIsSubmitting(false);
    }
  };

  // Step 5: Successful Order Confirmation
  if (placedOrder) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-amber-100 shadow-xl text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
          </div>

          <div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              {placedOrder.paymentMethod === 'COD' ? 'Order Placed (Cash on Delivery)' : 'Payment Verified & Confirmed'}
            </span>
            <h1 className="text-3xl font-black text-[#4A2E18] mt-3">
              Thank You for Your Order!
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Our Brodipet kitchen is freshly preparing your treats.
            </p>
          </div>

          {/* Order Details Card */}
          <div className="bg-[#FAF5EE] rounded-2xl p-5 text-left border border-amber-200/80 space-y-3 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-amber-200/60">
              <div>
                <span className="text-gray-500 block text-[10px]">Order Number</span>
                <span className="font-mono font-black text-sm text-[#4A2E18]">
                  {placedOrder.orderNumber}
                </span>
              </div>
              <div className="text-right">
                <span className="text-gray-500 block text-[10px]">Estimated Delivery</span>
                <span className="font-bold text-[#E85A71]">~{placedOrder.estimatedDeliveryMins} Minutes</span>
              </div>
            </div>

            <div className="space-y-1 text-gray-700">
              <div className="font-bold text-gray-900">Items Ordered:</div>
              {placedOrder.items.map((item: any, idx: number) => (
                <div key={idx} className="flex justify-between text-xs">
                  <span>{item.quantity}x {item.productName} {item.selectedVariant ? `(${item.selectedVariant})` : ''}</span>
                  <span className="font-semibold">₹{item.lineTotal}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-amber-200/60 flex justify-between font-black text-sm text-[#4A2E18]">
              <span>Total Paid / Payable</span>
              <span>₹{placedOrder.totalAmount}</span>
            </div>

            <div className="pt-2 border-t border-amber-200/60 text-[11px] text-gray-500">
              <span>Delivering to: </span>
              <span className="font-medium text-gray-800">
                {placedOrder.deliveryAddress.houseFlat}, {placedOrder.deliveryAddress.locality}, Guntur
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link
              href={`/track?order=${placedOrder.orderNumber}`}
              className="py-3 px-6 bg-[#4A2E18] hover:bg-[#2A170F] text-white rounded-2xl text-xs sm:text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Truck className="w-4 h-4 text-amber-200" />
              <span>Track Order Live</span>
            </Link>

            <button
              onClick={() => window.print()}
              className="py-3 px-6 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-2xl text-xs sm:text-sm font-bold shadow-xs transition-all flex items-center justify-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>Print Bill Receipt</span>
            </button>

            <Link
              href="/menu"
              className="py-3 px-6 bg-[#FAF5EE] hover:bg-amber-100 text-[#4A2E18] rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center"
            >
              Explore More Bakes
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Checkout Progress Steps */}
      <div className="flex items-center justify-center gap-3 mb-8 text-xs font-bold">
        <div
          className={`flex items-center gap-2 px-4 py-2 rounded-full ${
            step === 1 ? 'bg-[#4A2E18] text-white' : 'bg-emerald-100 text-emerald-800'
          }`}
        >
          <span>1. Delivery & Address</span>
        </div>
        <span className="text-gray-300">───</span>
        <div
          className={`flex items-center gap-2 px-4 py-2 rounded-full ${
            step === 2 ? 'bg-[#4A2E18] text-white' : 'bg-gray-100 text-gray-500'
          }`}
        >
          <span>2. Payment & Review</span>
        </div>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs sm:text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form Steps */}
        <div className="lg:col-span-8 space-y-6">
          {step === 1 ? (
            /* STEP 1: Address & Scheduling */
            <div className="bg-white rounded-3xl p-6 border border-amber-100 shadow-xs space-y-6">
              <div className="flex items-center gap-2.5 pb-4 border-b border-gray-100">
                <div className="w-8 h-8 rounded-full bg-[#E85A71]/10 text-[#E85A71] flex items-center justify-center font-bold">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-[#4A2E18]">Delivery Address & Options</h2>
                  <p className="text-[11px] text-gray-400">Where should we deliver your Cake Box order in Guntur?</p>
                </div>
              </div>

              {/* Recipient Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Recipient Name</label>
                  <input
                    type="text"
                    required
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="e.g. Priya Sharma"
                    className="w-full text-xs p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#4A2E18]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Mobile Number (Indian 10-digit)</label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={recipientPhone}
                    onChange={(e) => setRecipientPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="e.g. 9848022334"
                    className="w-full text-xs p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#4A2E18]"
                  />
                </div>
              </div>

              {/* Address Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Flat / House / Building</label>
                  <input
                    type="text"
                    required
                    value={houseFlat}
                    onChange={(e) => setHouseFlat(e.target.value)}
                    placeholder="e.g. Flat 302, Sai Residency"
                    className="w-full text-xs p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#4A2E18]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Guntur Locality</label>
                  <select
                    value={selectedLocality}
                    onChange={(e) => setSelectedLocality(e.target.value)}
                    className="w-full text-xs p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#4A2E18] bg-white font-medium"
                  >
                    {GUNTUR_LOCALITIES.map((loc) => (
                      <option key={loc.name} value={loc.name}>
                        {loc.name} (~{loc.distanceKm} km from Brodipet)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Street / Road / Lane</label>
                  <input
                    type="text"
                    required
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="e.g. 7th Line, Arundelpet"
                    className="w-full text-xs p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#4A2E18]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Landmark</label>
                  <input
                    type="text"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    placeholder="e.g. Near ICICI Bank or NTR Circle"
                    className="w-full text-xs p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#4A2E18]"
                  />
                </div>
              </div>

              {/* Delivery Timing Options */}
              <div className="pt-4 border-t border-gray-100 space-y-3">
                <label className="text-xs font-bold text-[#4A2E18] uppercase tracking-wider block">
                  Select Delivery Speed / Timing
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div
                    onClick={() => setDeliveryType('standard')}
                    className={`p-3.5 rounded-2xl border cursor-pointer text-xs transition-all ${
                      deliveryType === 'standard'
                        ? 'border-[#4A2E18] bg-[#FAF5EE] ring-2 ring-[#4A2E18]/20 font-bold'
                        : 'border-gray-200 hover:border-amber-300'
                    }`}
                  >
                    <div className="text-[#4A2E18] font-bold">Standard Delivery</div>
                    <div className="text-[11px] text-gray-500 mt-1">30–45 Mins (Fastest)</div>
                  </div>

                  <div
                    onClick={() => setDeliveryType('scheduled')}
                    className={`p-3.5 rounded-2xl border cursor-pointer text-xs transition-all ${
                      deliveryType === 'scheduled'
                        ? 'border-[#4A2E18] bg-[#FAF5EE] ring-2 ring-[#4A2E18]/20 font-bold'
                        : 'border-gray-200 hover:border-amber-300'
                    }`}
                  >
                    <div className="text-[#4A2E18] font-bold">Scheduled Celebration</div>
                    <div className="text-[11px] text-gray-500 mt-1">Pick Date & Time slot</div>
                  </div>

                  <div
                    onClick={() => setDeliveryType('express')}
                    className={`p-3.5 rounded-2xl border cursor-pointer text-xs transition-all ${
                      deliveryType === 'express'
                        ? 'border-[#4A2E18] bg-[#FAF5EE] ring-2 ring-[#4A2E18]/20 font-bold'
                        : 'border-gray-200 hover:border-amber-300'
                    }`}
                  >
                    <div className="text-[#4A2E18] font-bold">Priority Express</div>
                    <div className="text-[11px] text-gray-500 mt-1">Direct kitchen dispatch</div>
                  </div>
                </div>

                {/* Scheduling Date/Time Picker */}
                {deliveryType === 'scheduled' && (
                  <div className="grid grid-cols-2 gap-3 p-3 bg-amber-50/50 rounded-2xl border border-amber-200/50">
                    <div>
                      <label className="text-[11px] font-bold text-gray-700 block mb-1">Preferred Date</label>
                      <input
                        type="date"
                        value={scheduledDate}
                        onChange={(e) => setScheduledDate(e.target.value)}
                        className="w-full text-xs p-2.5 border border-gray-200 rounded-xl bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-gray-700 block mb-1">Time Window</label>
                      <select
                        value={scheduledTime}
                        onChange={(e) => setScheduledTime(e.target.value)}
                        className="w-full text-xs p-2.5 border border-gray-200 rounded-xl bg-white"
                      >
                        <option value="">Select slot</option>
                        <option value="12:00 PM – 02:00 PM">Lunch (12:00 PM – 02:00 PM)</option>
                        <option value="04:00 PM – 06:00 PM">Evening High-Tea (04:00 PM – 06:00 PM)</option>
                        <option value="07:00 PM – 09:00 PM">Dinner & Birthday (07:00 PM – 09:00 PM)</option>
                        <option value="09:00 PM – 10:30 PM">Late Night Party (09:00 PM – 10:30 PM)</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Delivery Instructions */}
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Delivery Partner Instructions
                </label>
                <input
                  type="text"
                  value={deliveryInstructions}
                  onChange={(e) => setDeliveryInstructions(e.target.value)}
                  placeholder="e.g. Ring the bell twice, leave with security if unavailable..."
                  className="w-full text-xs p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#4A2E18]"
                />
              </div>

              <button
                onClick={handleProceedToPayment}
                className="w-full py-3.5 bg-[#4A2E18] hover:bg-[#2A170F] text-white rounded-2xl text-xs sm:text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>Continue to Payment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            /* STEP 2: Payment Selection */
            <div className="bg-white rounded-3xl p-6 border border-amber-100 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-[#4A2E18]">Choose Payment Method</h2>
                    <p className="text-[11px] text-gray-400">100% secure payment gateway for India</p>
                  </div>
                </div>
                <button
                  onClick={() => setStep(1)}
                  className="text-xs font-semibold text-[#E85A71] hover:underline"
                >
                  Edit Address
                </button>
              </div>

              {/* Payment Methods Accordion / Options */}
              <div className="space-y-3">
                {/* UPI Option */}
                <div
                  onClick={() => setPaymentMethod('UPI')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'UPI'
                      ? 'border-[#4A2E18] bg-[#FAF5EE] ring-2 ring-[#4A2E18]/20'
                      : 'border-gray-200 hover:border-amber-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                        <Smartphone className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#4A2E18]">UPI & UPI QR</div>
                        <div className="text-[10px] text-gray-500">Google Pay, PhonePe, Paytm, BHIM</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      Zero Extra Fee
                    </span>
                  </div>

                  {paymentMethod === 'UPI' && (
                    <div className="mt-3 pt-3 border-t border-amber-200/60 flex flex-wrap gap-2 text-xs">
                      {['Google Pay', 'PhonePe', 'Paytm', 'Scan UPI QR'].map((app) => (
                        <button
                          key={app}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setUpiApp(app);
                          }}
                          className={`px-3 py-1.5 rounded-xl border text-xs font-semibold ${
                            upiApp === app
                              ? 'bg-[#4A2E18] text-white border-[#4A2E18]'
                              : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          {app}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Cards Option */}
                <div
                  onClick={() => setPaymentMethod('Card')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'Card'
                      ? 'border-[#4A2E18] bg-[#FAF5EE] ring-2 ring-[#4A2E18]/20'
                      : 'border-gray-200 hover:border-amber-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#4A2E18]">Credit / Debit Cards</div>
                        <div className="text-[10px] text-gray-500">Visa, Mastercard, RuPay, Maestro</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Net Banking */}
                <div
                  onClick={() => setPaymentMethod('Netbanking')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'Netbanking'
                      ? 'border-[#4A2E18] bg-[#FAF5EE] ring-2 ring-[#4A2E18]/20'
                      : 'border-gray-200 hover:border-amber-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-amber-100 text-[#4A2E18] flex items-center justify-center">
                        <QrCode className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#4A2E18]">Net Banking</div>
                        <div className="text-[10px] text-gray-500">SBI, ICICI Bank, HDFC, Union Bank, etc.</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cash on Delivery (COD) */}
                <div
                  onClick={() => setPaymentMethod('COD')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'COD'
                      ? 'border-[#4A2E18] bg-[#FAF5EE] ring-2 ring-[#4A2E18]/20'
                      : 'border-gray-200 hover:border-amber-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                        <Banknote className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#4A2E18]">Cash on Delivery (COD)</div>
                        <div className="text-[10px] text-gray-500">Pay cash or scan QR when driver arrives</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pay Now Button */}
              <button
                onClick={handlePlaceOrder}
                disabled={isSubmitting}
                className="w-full py-4 bg-[#E85A71] hover:bg-[#D0455C] text-white rounded-2xl text-xs sm:text-sm font-black shadow-lg shadow-[#E85A71]/25 flex items-center justify-between px-6 transition-all disabled:opacity-50"
              >
                <span>{isSubmitting ? 'Confirming Order with Kitchen...' : paymentMethod === 'COD' ? 'Place Order (Cash on Delivery)' : `Pay ₹${totalAmount} Securely`}</span>
                <span className="text-amber-200 font-bold">₹{totalAmount}</span>
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Order Summary Card */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-3xl p-5 border border-amber-100 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-[#4A2E18] uppercase tracking-wider">
              Order Review ({items.length} items)
            </h3>

            {/* Items list preview */}
            <div className="space-y-3 max-h-56 overflow-y-auto divide-y divide-gray-50 pr-1">
              {items.map((item) => (
                <div key={item.id} className="pt-2 flex justify-between items-start text-xs">
                  <div>
                    <div className="font-bold text-gray-800 line-clamp-1">{item.productName}</div>
                    <div className="text-[10px] text-gray-400">
                      Qty: {item.quantity} {item.variant ? `• ${item.variant.name}` : ''}
                    </div>
                    {item.cakeMessage && (
                      <div className="text-[10px] text-amber-700">Msg: &ldquo;{item.cakeMessage}&rdquo;</div>
                    )}
                  </div>
                  <span className="font-bold text-gray-900 ml-2">₹{item.totalPrice}</span>
                </div>
              ))}
            </div>

            {/* Bill breakdown */}
            <div className="pt-3 border-t border-gray-100 space-y-1.5 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Discount</span>
                  <span>-₹{discount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span>
              </div>
              <div className="flex justify-between">
                <span>Packaging</span>
                <span>₹{packagingFee}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes (5% GST)</span>
                <span>₹{tax}</span>
              </div>
              <div className="pt-2 border-t border-gray-100 flex justify-between font-black text-sm text-[#4A2E18]">
                <span>Total Payable</span>
                <span>₹{totalAmount}</span>
              </div>
            </div>

            <div className="p-3 bg-amber-50/60 rounded-2xl text-[11px] text-gray-600 border border-amber-200/50 space-y-1">
              <div className="font-bold text-[#4A2E18]">Delivering To:</div>
              <div>{houseFlat}, {selectedLocality}, Guntur</div>
              <div className="text-gray-500">Contact: {recipientName} ({recipientPhone})</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
