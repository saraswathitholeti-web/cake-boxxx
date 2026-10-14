'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Order } from '@/types';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import {
  Clock,
  Truck,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  FileText,
  Star,
  ArrowRight,
  ShoppingBag,
} from 'lucide-react';

export default function OrdersPage() {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  useEffect(() => {
    async function loadOrders() {
      try {
        setLoading(true);
        const res = await fetch(`/api/orders?userId=${user?.id || 'u-default'}`);
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error('Failed to load orders', err);
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, [user]);

  const handleReorder = (order: Order) => {
    for (const item of order.items) {
      addToCart({
        productId: item.productId,
        productName: item.productName,
        productImage: item.productImage,
        dietaryType: item.dietaryType,
        unitPrice: item.unitPrice,
        quantity: item.quantity,
      });
    }
    alert(`Added ${order.items.length} items to your cart!`);
  };

  const filteredOrders = orders.filter((o) => {
    if (filter === 'active') {
      return o.orderStatus !== 'Delivered' && o.orderStatus !== 'Cancelled';
    }
    if (filter === 'completed') {
      return o.orderStatus === 'Delivered';
    }
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-bold text-[#E85A71] uppercase tracking-widest flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> Order History
          </span>
          <h1 className="text-3xl font-black text-[#4A2E18] tracking-tight">
            My Orders
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Track active deliveries, download invoices, or re-order your favorite bakery treats.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex bg-[#FAF5EE] p-1 rounded-2xl border border-amber-200/60 self-start sm:self-auto text-xs font-semibold">
          {(['all', 'active', 'completed'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-xl capitalize transition-all ${
                filter === tab
                  ? 'bg-[#4A2E18] text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab === 'all' ? `All (${orders.length})` : tab}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-gray-400">Loading your orders...</div>
      ) : filteredOrders.length > 0 ? (
        <div className="space-y-6">
          {filteredOrders.map((order) => {
            const isActive = order.orderStatus !== 'Delivered' && order.orderStatus !== 'Cancelled';
            return (
              <div
                key={order.id}
                className="bg-white rounded-3xl border border-amber-100 shadow-xs hover:shadow-md transition-shadow p-6 space-y-4"
              >
                {/* Order Top Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="font-mono font-black text-sm text-[#4A2E18]">
                      {order.orderNumber}
                    </div>
                    <span className="text-[11px] text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full ${
                        order.orderStatus === 'Delivered'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : order.orderStatus === 'Cancelled'
                          ? 'bg-red-50 text-red-700 border border-red-200'
                          : 'bg-amber-100 text-[#4A2E18] border border-amber-300 animate-pulse'
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                    <span className="text-xs font-black text-gray-900">
                      ₹{order.totalAmount}
                    </span>
                  </div>
                </div>

                {/* Items Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 p-2 rounded-2xl bg-[#FAF5EE]/50 border border-amber-100/60"
                    >
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-amber-50 flex-shrink-0">
                        <Image
                          src={item.productImage}
                          alt={item.productName}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-xs text-[#4A2E18] truncate">
                          {item.quantity}x {item.productName}
                        </div>
                        {item.selectedVariant && (
                          <div className="text-[10px] text-gray-400">Size: {item.selectedVariant}</div>
                        )}
                        <span className="text-[11px] font-black text-gray-800">
                          ₹{item.lineTotal}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bottom Actions */}
                <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-[11px] text-gray-500">
                    <span>Delivered to: </span>
                    <span className="font-semibold text-gray-700">
                      {order.deliveryAddress.locality}, Guntur
                    </span>
                    <span className="ml-2 font-medium">({order.paymentMethod} • {order.paymentStatus})</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {isActive && (
                      <Link
                        href={`/track?order=${order.orderNumber}`}
                        className="py-2 px-4 bg-[#E85A71] hover:bg-[#D0455C] text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>Track Live</span>
                      </Link>
                    )}

                    <button
                      onClick={() => handleReorder(order)}
                      className="py-2 px-3.5 rounded-xl border border-gray-200 hover:border-amber-300 text-gray-700 text-xs font-bold transition-colors flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reorder</span>
                    </button>

                    <Link
                      href={`/track?order=${order.orderNumber}`}
                      className="py-2 px-3.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-[#4A2E18] text-xs font-bold transition-colors flex items-center gap-1"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Invoice</span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-amber-100 max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full bg-amber-50 text-[#C68B59] flex items-center justify-center mx-auto text-2xl">
            📦
          </div>
          <h3 className="text-lg font-bold text-[#4A2E18]">No Orders Found</h3>
          <p className="text-xs text-gray-500">
            You don’t have any {filter !== 'all' ? filter : ''} orders yet. Start exploring our bakery!
          </p>
          <Link
            href="/menu"
            className="inline-block py-2.5 px-6 bg-[#4A2E18] text-white rounded-2xl text-xs font-bold"
          >
            Explore Menu
          </Link>
        </div>
      )}
    </div>
  );
}
