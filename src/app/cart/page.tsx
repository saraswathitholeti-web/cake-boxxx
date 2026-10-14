'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Sparkles,
  Tag,
  Check,
  AlertCircle,
  ShoppingBag,
  Clock,
  ShieldCheck,
  MessageSquare,
} from 'lucide-react';

export default function CartPage() {
  const {
    items,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    discount,
    deliveryFee,
    packagingFee,
    tax,
    totalAmount,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    cookingInstructions,
    setCookingInstructions,
    deliveryAddress,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponStatus, setCouponStatus] = useState<{ msg: string; isError?: boolean } | null>(null);
  const [isApplying, setIsApplying] = useState(false);

  const handleApplyCoupon = async (codeToApply?: string) => {
    const code = codeToApply || couponInput;
    if (!code.trim()) return;

    setIsApplying(true);
    setCouponStatus(null);
    const res = await applyCoupon(code);
    setIsApplying(false);

    if (res.success) {
      setCouponStatus({ msg: res.message });
      setCouponInput('');
    } else {
      setCouponStatus({ msg: res.message, isError: true });
    }
  };

  const sampleCoupons = [
    { code: 'WELCOME10', desc: '10% OFF on 1st Order' },
    { code: 'SWEET50', desc: 'Flat ₹50 OFF' },
    { code: 'CAKECOMBO', desc: '₹100 OFF on Cakes' },
  ];

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto bg-white rounded-3xl p-8 border border-amber-100 shadow-sm space-y-4">
          <div className="w-20 h-20 rounded-full bg-amber-50 text-[#C68B59] flex items-center justify-center mx-auto text-3xl">
            🛍️
          </div>
          <h2 className="text-2xl font-black text-[#4A2E18]">Your Cart is Empty</h2>
          <p className="text-xs text-gray-500 leading-relaxed">
            Looks like you haven’t added any cakes, pizzas or desserts yet! Browse our Brodipet menu to treat yourself today.
          </p>
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 py-3 px-6 bg-[#4A2E18] hover:bg-[#2A170F] text-white rounded-2xl text-xs font-bold shadow-md transition-all"
          >
            <span>Explore Menu</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="text-xs font-bold text-[#E85A71] uppercase tracking-widest flex items-center gap-1">
            <ShoppingBag className="w-3.5 h-3.5" /> Order Summary
          </span>
          <h1 className="text-3xl font-black text-[#4A2E18] tracking-tight">
            Shopping Cart ({items.length} items)
          </h1>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-bold text-gray-400 hover:text-red-600 transition-colors flex items-center gap-1"
        >
          <Trash2 className="w-3.5 h-3.5" /> Empty Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-3xl border border-amber-100 shadow-xs divide-y divide-gray-100 overflow-hidden">
            {items.map((item) => (
              <div key={item.id} className="p-4 sm:p-5 flex gap-4 items-start">
                {/* Thumbnail */}
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-amber-50 flex-shrink-0">
                  <Image
                    src={item.productImage}
                    alt={item.productName}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        {item.dietaryType === 'eggless' ? (
                          <span className="eggless-badge text-[10px]">🌱 Eggless</span>
                        ) : item.dietaryType === 'veg' ? (
                          <span className="veg-badge"><span className="veg-badge-dot"></span></span>
                        ) : (
                          <span className="non-veg-badge"><span className="non-veg-badge-dot"></span></span>
                        )}
                        <h3 className="font-bold text-sm sm:text-base text-[#4A2E18] truncate">
                          {item.productName}
                        </h3>
                      </div>

                      {/* Variant & Addons Tag */}
                      <div className="text-xs text-gray-500 space-y-0.5">
                        {item.variant && (
                          <span className="inline-block bg-[#FAF5EE] px-2 py-0.5 rounded-md font-semibold text-[#4A2E18] mr-2">
                            Size: {item.variant.name}
                          </span>
                        )}
                        {item.selectedAddons && item.selectedAddons.length > 0 && (
                          <span className="text-[11px] text-gray-500 block">
                            Add-ons: {item.selectedAddons.map((a) => a.name).join(', ')}
                          </span>
                        )}
                        {item.cakeMessage && (
                          <div className="text-[11px] text-amber-700 bg-amber-50/70 p-1 rounded-md mt-1 font-medium flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-amber-600" />
                            Message: &ldquo;{item.cakeMessage}&rdquo;
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 transition-colors rounded-lg hover:bg-gray-100"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Quantity & Line Total */}
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-50">
                    <div className="flex items-center border border-gray-300 rounded-xl bg-white overflow-hidden shadow-xs">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1.5 text-gray-600 hover:bg-gray-100"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-3 text-xs font-bold text-[#4A2E18]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1.5 text-gray-600 hover:bg-gray-100"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-gray-400 mr-2">₹{item.unitPrice} each</span>
                      <span className="font-black text-sm sm:text-base text-[#4A2E18]">
                        ₹{item.totalPrice}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Cooking & Packing Instructions */}
          <div className="bg-white rounded-3xl p-5 border border-amber-100 shadow-xs space-y-2">
            <label className="text-xs font-bold text-[#4A2E18] uppercase tracking-wider flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-amber-700" /> Special Kitchen Instructions (Optional)
            </label>
            <input
              type="text"
              value={cookingInstructions}
              onChange={(e) => setCookingInstructions(e.target.value)}
              placeholder="e.g. Please avoid plastic cutlery, pack birthday candles with care..."
              className="w-full text-xs p-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-1 focus:ring-[#4A2E18]"
            />
          </div>
        </div>

        {/* Right Column: Bill Details, Coupons & Checkout CTA */}
        <div className="lg:col-span-4 space-y-5">
          {/* Coupon Box */}
          <div className="bg-white rounded-3xl p-5 border border-amber-100 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-[#4A2E18] uppercase tracking-wider flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-[#E85A71]" /> Apply Bakery Coupon
            </h3>

            {appliedCoupon ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between">
                <div>
                  <div className="text-xs font-black text-emerald-800 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> {appliedCoupon.code} Applied!
                  </div>
                  <div className="text-[11px] text-emerald-700">
                    You saved ₹{discount} on this order!
                  </div>
                </div>
                <button
                  onClick={removeCoupon}
                  className="text-xs font-bold text-red-600 hover:underline"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleApplyCoupon();
                  }}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    placeholder="Enter promo code"
                    className="flex-1 text-xs px-3.5 py-2.5 uppercase border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#4A2E18]"
                  />
                  <button
                    type="submit"
                    disabled={isApplying || !couponInput.trim()}
                    className="py-2.5 px-4 bg-[#4A2E18] hover:bg-[#2A170F] text-white rounded-xl text-xs font-bold transition-all disabled:opacity-40"
                  >
                    {isApplying ? 'Applying...' : 'Apply'}
                  </button>
                </form>

                {couponStatus && (
                  <div
                    className={`text-xs mt-2 p-2 rounded-xl flex items-center gap-1.5 ${
                      couponStatus.isError
                        ? 'bg-red-50 text-red-700 border border-red-200'
                        : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    }`}
                  >
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{couponStatus.msg}</span>
                  </div>
                )}

                {/* Sample coupon chips */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {sampleCoupons.map((c) => (
                    <button
                      key={c.code}
                      onClick={() => handleApplyCoupon(c.code)}
                      className="text-[10px] font-bold py-1 px-2.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-[#4A2E18] border border-amber-200/80 transition-colors"
                    >
                      {c.code} ({c.desc})
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Bill Summary */}
          <div className="bg-white rounded-3xl p-5 border border-amber-100 shadow-xs space-y-3.5">
            <h3 className="text-xs font-bold text-[#4A2E18] uppercase tracking-wider">
              Bill Details
            </h3>

            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Item Subtotal</span>
                <span className="font-semibold text-gray-900">₹{subtotal}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Coupon Discount ({appliedCoupon?.code})</span>
                  <span>-₹{discount}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Bakery Packaging Charge</span>
                <span className="font-semibold text-gray-900">₹{packagingFee}</span>
              </div>

              <div className="flex justify-between">
                <div className="flex items-center gap-1">
                  <span>Delivery Fee</span>
                  {deliveryFee === 0 && (
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 rounded">
                      FREE
                    </span>
                  )}
                </div>
                <span className="font-semibold text-gray-900">
                  {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Taxes & GST (5%)</span>
                <span className="font-semibold text-gray-900">₹{tax}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#4A2E18] uppercase tracking-wider block">
                  To Pay
                </span>
                <span className="text-[10px] text-gray-400">Inclusive of all taxes</span>
              </div>
              <span className="text-xl font-black text-[#4A2E18]">₹{totalAmount}</span>
            </div>

            {/* Delivery address preview */}
            <div className="p-3 bg-amber-50/50 rounded-2xl text-[11px] text-gray-600 border border-amber-200/50">
              <div className="font-bold text-[#4A2E18] mb-0.5">Delivering To:</div>
              <div className="truncate">
                {deliveryAddress.houseFlat}, {deliveryAddress.locality}, Guntur
              </div>
            </div>

            {/* Checkout Button */}
            <Link
              href="/checkout"
              className="w-full py-3.5 px-6 bg-[#4A2E18] hover:bg-[#2A170F] text-white rounded-2xl text-xs sm:text-sm font-bold shadow-lg shadow-[#4A2E18]/25 flex items-center justify-between transition-all group"
            >
              <span>Proceed to Checkout</span>
              <div className="flex items-center gap-1 text-amber-200">
                <span>₹{totalAmount}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Safe & Secure Indian Payment Gateway</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
