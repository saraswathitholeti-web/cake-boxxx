'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Order, OrderStatus } from '@/types';
import { CAKEBOX_LOCATION } from '@/lib/geo';
import {
  MapPin,
  Bike,
  Clock,
  Phone,
  CheckCircle,
  HelpCircle,
  ShieldCheck,
  Search,
  Sparkles,
  Play,
  RotateCcw,
  ChefHat,
  PackageCheck,
  Home,
} from 'lucide-react';

const STATUS_STEPS: OrderStatus[] = [
  'Order Placed',
  'Order Confirmed',
  'Preparing Your Order',
  'Ready for Pickup',
  'Delivery Partner Assigned',
  'Picked Up',
  'Out for Delivery',
  'Delivered',
];

function TrackContent() {
  const searchParams = useSearchParams();
  const initialOrderNum = searchParams.get('order') || 'CB-8821';

  const [searchNum, setSearchNum] = useState(initialOrderNum);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // Simulation states
  const [isSimulating, setIsSimulating] = useState(false);
  const [simStep, setSimStep] = useState(0);

  const fetchOrder = async (num: string) => {
    try {
      setLoading(true);
      setErrorMsg('');
      const res = await fetch(`/api/orders/${num}`);
      if (!res.ok) {
        throw new Error('Order not found');
      }
      const data = await res.json();
      setOrder(data);
    } catch (err: any) {
      setErrorMsg(`Could not find order "${num}". Please check order number.`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialOrderNum) {
      fetchOrder(initialOrderNum);
    }
  }, [initialOrderNum]);

  // Demo Movement Simulation effect
  useEffect(() => {
    let interval: any;
    if (isSimulating && order) {
      interval = setInterval(() => {
        setSimStep((prev) => {
          const next = (prev + 1) % 6;
          // Interpolate latitude and longitude between Brodipet (16.3067, 80.4365) and Arundelpet (16.3012, 80.4411)
          const fraction = next / 5;
          const currentLat = 16.3067 + (16.3012 - 16.3067) * fraction;
          const currentLng = 80.4365 + (80.4411 - 80.4365) * fraction;

          setOrder((curr) => {
            if (!curr) return null;
            let status: OrderStatus = 'Out for Delivery';
            if (next === 5) status = 'Delivered';
            return {
              ...curr,
              orderStatus: status,
              driverLocation: { lat: currentLat, lng: currentLng },
              deliveryPartner: curr.deliveryPartner
                ? { ...curr.deliveryPartner, currentLat, currentLng }
                : {
                    id: 'dp-1',
                    name: 'Ramesh Naidu',
                    phone: '+91 94401 56789',
                    vehicle: 'Hero Splendor (AP 07 BK 4521)',
                    currentLat,
                    currentLng,
                    rating: 4.9,
                  },
            };
          });

          return next;
        });
      }, 3500);
    }
    return () => clearInterval(interval);
  }, [isSimulating]);

  const currentStepIndex = order ? STATUS_STEPS.indexOf(order.orderStatus) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-bold text-[#E85A71] uppercase tracking-widest flex items-center gap-1">
            <Bike className="w-3.5 h-3.5" /> Real-time Guntur Delivery Tracking
          </span>
          <h1 className="text-3xl font-black text-[#4A2E18] tracking-tight">
            Live Order Tracking
          </h1>
        </div>

        {/* Order Number Lookup */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (searchNum.trim()) fetchOrder(searchNum.trim());
          }}
          className="flex items-center gap-2"
        >
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchNum}
              onChange={(e) => setSearchNum(e.target.value.toUpperCase())}
              placeholder="Enter Order # (e.g. CB-8821)"
              className="text-xs uppercase pl-9 pr-3 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#4A2E18] w-48 sm:w-56"
            />
          </div>
          <button
            type="submit"
            className="py-2.5 px-4 bg-[#4A2E18] text-white rounded-xl text-xs font-bold hover:bg-[#2A170F] transition-colors"
          >
            Track
          </button>
        </form>
      </div>

      {errorMsg ? (
        <div className="bg-white p-8 rounded-3xl border border-red-200 text-center max-w-md mx-auto space-y-3">
          <div className="text-red-500 font-bold text-sm">{errorMsg}</div>
          <p className="text-xs text-gray-500">
            Check your recent order number on the My Orders page, or track demonstration order <strong>CB-8821</strong>.
          </p>
          <button
            onClick={() => {
              setSearchNum('CB-8821');
              fetchOrder('CB-8821');
            }}
            className="py-2 px-4 bg-[#4A2E18] text-white rounded-xl text-xs font-bold"
          >
            Track Sample Order CB-8821
          </button>
        </div>
      ) : loading ? (
        <div className="p-12 text-center text-xs text-gray-500">Loading order tracking details...</div>
      ) : order ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Interactive Map & Driver Card */}
          <div className="lg:col-span-7 space-y-6">
            {/* Visual Map Simulator */}
            <div className="bg-white rounded-3xl p-4 border border-amber-100 shadow-md overflow-hidden relative">
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                  <span className="text-xs font-bold text-[#4A2E18]">Live Delivery Route (Guntur)</span>
                </div>

                {/* Demo Simulation Toggle */}
                <button
                  onClick={() => setIsSimulating(!isSimulating)}
                  className={`text-[11px] font-bold px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-all ${
                    isSimulating
                      ? 'bg-amber-100 text-amber-900 border-amber-300'
                      : 'bg-[#FAF5EE] text-[#4A2E18] border-amber-200 hover:bg-amber-100'
                  }`}
                >
                  {isSimulating ? (
                    <>
                      <RotateCcw className="w-3 h-3 animate-spin" /> Simulating Driver Movement
                    </>
                  ) : (
                    <>
                      <Play className="w-3 h-3 text-[#E85A71]" /> Demo Mode: Simulate Driver
                    </>
                  )}
                </button>
              </div>

              {/* Map Canvas / Visual Map representation */}
              <div className="relative h-72 sm:h-80 w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                {/* Embed OpenStreetMap / Google Map centered around Brodipet & Arundelpet */}
                <iframe
                  title="Guntur Delivery Route"
                  src={`https://maps.google.com/maps?q=${
                    order.driverLocation?.lat || 16.3045
                  },${order.driverLocation?.lng || 80.4382}&z=15&output=embed`}
                  className="w-full h-full border-0 pointer-events-none opacity-85"
                ></iframe>

                {/* Overlaid Route Details HUD */}
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-md border border-amber-100 max-w-xs space-y-1">
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    From Brodipet Bakery
                  </div>
                  <div className="text-xs font-bold text-[#4A2E18] flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#E85A71]" />
                    <span>Cake Box, 4th Lane, Brodipet</span>
                  </div>
                  <div className="text-[10px] text-gray-500 pt-1 border-t border-gray-100 flex items-center gap-1">
                    <Home className="w-3.5 h-3.5 text-emerald-600" />
                    <span>To: {order.deliveryAddress.locality}, Guntur</span>
                  </div>
                </div>

                {/* Floating Driver Status Pill */}
                <div className="absolute bottom-3 right-3 bg-[#4A2E18]/90 backdrop-blur-md text-white px-4 py-2 rounded-2xl shadow-lg flex items-center gap-2">
                  <Bike className="w-4 h-4 text-amber-200 animate-bounce" />
                  <div>
                    <div className="text-[10px] text-amber-200">Status</div>
                    <div className="text-xs font-black">{order.orderStatus}</div>
                  </div>
                </div>

                {isSimulating && (
                  <div className="absolute top-3 right-3 bg-amber-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs uppercase tracking-wider">
                    Demo Simulation Active
                  </div>
                )}
              </div>
            </div>

            {/* Delivery Partner Details Card */}
            {order.deliveryPartner ? (
              <div className="bg-white rounded-3xl p-5 border border-amber-100 shadow-xs flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 text-[#4A2E18] flex items-center justify-center font-black text-lg">
                    RN
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-[#4A2E18]">
                        {order.deliveryPartner.name}
                      </h4>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                        ★ {order.deliveryPartner.rating}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {order.deliveryPartner.vehicle}
                    </p>
                    <span className="text-[10px] text-emerald-600 font-semibold">
                      Vaccinated & Temperature Checked
                    </span>
                  </div>
                </div>

                <a
                  href={`tel:${order.deliveryPartner.phone}`}
                  className="p-3 bg-[#FAF5EE] hover:bg-[#F2E7DC] text-[#4A2E18] rounded-2xl transition-colors flex items-center gap-1.5 text-xs font-bold border border-amber-200"
                >
                  <Phone className="w-4 h-4 text-[#E85A71]" />
                  <span className="hidden sm:inline">Call Partner</span>
                </a>
              </div>
            ) : (
              <div className="bg-amber-50/50 rounded-3xl p-5 border border-amber-200/60 flex items-center gap-3 text-xs text-[#4A2E18]">
                <ChefHat className="w-5 h-5 text-[#E85A71]" />
                <span>Our Brodipet kitchen is baking your treats. A delivery partner will be assigned once baking finishes!</span>
              </div>
            )}
          </div>

          {/* Right Column: Order Timeline & Receipt Breakdown */}
          <div className="lg:col-span-5 space-y-6">
            {/* Status Timeline */}
            <div className="bg-white rounded-3xl p-6 border border-amber-100 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                    Order Number
                  </span>
                  <span className="font-mono font-black text-base text-[#4A2E18]">
                    {order.orderNumber}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                    Est. Arrival
                  </span>
                  <span className="font-black text-sm text-[#E85A71]">
                    ~{order.estimatedDeliveryMins} mins
                  </span>
                </div>
              </div>

              {/* Progress Steps Timeline */}
              <div className="space-y-4">
                {STATUS_STEPS.map((stepName, idx) => {
                  const isDone = idx <= currentStepIndex;
                  const isCurrent = idx === currentStepIndex;

                  return (
                    <div key={stepName} className="flex items-start gap-3 relative">
                      {/* Vertical line connector */}
                      {idx < STATUS_STEPS.length - 1 && (
                        <div
                          className={`absolute left-3.5 top-6 bottom-0 w-0.5 -mb-4 ${
                            idx < currentStepIndex ? 'bg-[#E85A71]' : 'bg-gray-200'
                          }`}
                        ></div>
                      )}

                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 z-10 transition-colors ${
                          isDone
                            ? 'bg-[#E85A71] text-white shadow-xs'
                            : 'bg-gray-100 text-gray-400'
                        }`}
                      >
                        {isDone ? (
                          <CheckCircle className="w-4 h-4 stroke-[2.5]" />
                        ) : (
                          <span className="text-xs font-bold">{idx + 1}</span>
                        )}
                      </div>

                      <div className="pt-0.5">
                        <div
                          className={`text-xs font-bold ${
                            isCurrent
                              ? 'text-[#E85A71] text-sm'
                              : isDone
                              ? 'text-[#4A2E18]'
                              : 'text-gray-400'
                          }`}
                        >
                          {stepName}
                        </div>
                        {isCurrent && (
                          <div className="text-[11px] text-gray-500 mt-0.5">
                            {idx === 0 && 'We have received your order at Brodipet.'}
                            {idx === 1 && 'Order confirmed by Cake Box manager.'}
                            {idx === 2 && 'Bakers are putting on fresh toppings and frosting.'}
                            {idx === 3 && 'Packed in insulated box, waiting for pickup.'}
                            {idx === 4 && 'Delivery rider assigned and heading to bakery.'}
                            {idx === 5 && 'Package picked up from 4th Lane, Brodipet.'}
                            {idx === 6 && 'On the way to your Guntur address!'}
                            {idx === 7 && 'Delivered! Sweet moments enjoyed!'}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Order Items & Receipt Summary */}
            <div className="bg-white rounded-3xl p-6 border border-amber-100 shadow-xs space-y-4">
              <h3 className="text-xs font-bold text-[#4A2E18] uppercase tracking-wider">
                Order Summary
              </h3>

              <div className="space-y-2.5 divide-y divide-gray-50 text-xs text-gray-700">
                {order.items.map((item) => (
                  <div key={item.id} className="pt-2 flex justify-between items-start">
                    <div>
                      <div className="font-bold text-[#4A2E18]">
                        {item.quantity}x {item.productName}
                      </div>
                      {item.selectedVariant && (
                        <div className="text-[11px] text-gray-500">Size: {item.selectedVariant}</div>
                      )}
                      {item.cakeMessage && (
                        <div className="text-[11px] text-amber-700 italic">
                          &ldquo;{item.cakeMessage}&rdquo;
                        </div>
                      )}
                    </div>
                    <span className="font-semibold text-gray-900">₹{item.lineTotal}</span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-gray-100 space-y-1.5 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{order.subtotal}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Discount</span>
                    <span>-₹{order.discount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>{order.deliveryFee === 0 ? 'FREE' : `₹${order.deliveryFee}`}</span>
                </div>
                <div className="flex justify-between">
                  <span>Packaging & Taxes</span>
                  <span>₹{order.packagingFee + order.tax}</span>
                </div>
                <div className="pt-2 border-t border-gray-100 flex justify-between font-black text-sm text-[#4A2E18]">
                  <span>Total Amount</span>
                  <span>₹{order.totalAmount}</span>
                </div>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-gray-200 text-gray-700 text-xs font-bold hover:bg-gray-50 transition-colors"
                >
                  Print Invoice
                </button>
                <Link
                  href="/support"
                  className="py-2.5 px-4 rounded-xl bg-amber-50 text-[#4A2E18] text-xs font-bold hover:bg-amber-100 transition-colors flex items-center gap-1"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-[#E85A71]" /> Need Help?
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs">Loading Live Tracking...</div>}>
      <TrackContent />
    </Suspense>
  );
}
