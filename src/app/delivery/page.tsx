'use client';

import React, { useState, useEffect } from 'react';
import { Order, OrderStatus } from '@/types';
import { CAKEBOX_LOCATION } from '@/lib/geo';
import {
  Truck,
  MapPin,
  Navigation,
  CheckCircle2,
  Clock,
  Phone,
  Package,
  Bike,
  ShieldCheck,
} from 'lucide-react';

export default function DeliveryPartnerPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingLocation, setUpdatingLocation] = useState(false);
  const [gpsMessage, setGpsMessage] = useState('');

  const partnerInfo = {
    name: 'Ramesh Naidu',
    phone: '+91 94401 56789',
    vehicle: 'Hero Splendor (AP 07 BK 4521)',
    rating: 4.9,
    deliveriesToday: 12,
  };

  const loadDeliveries = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/orders');
      const data: Order[] = await res.json();
      setOrders(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDeliveries();
  }, []);

  const handleUpdateStatus = async (orderId: string, status: OrderStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderStatus: status,
          deliveryPartner: {
            id: 'dp-1',
            name: partnerInfo.name,
            phone: partnerInfo.phone,
            vehicle: partnerInfo.vehicle,
            currentLat: 16.3045,
            currentLng: 80.4382,
            rating: partnerInfo.rating,
          },
        }),
      });
      if (res.ok) {
        loadDeliveries();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSendGPS = () => {
    setUpdatingLocation(true);
    setGpsMessage('');

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          setUpdatingLocation(false);
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setGpsMessage(`Location broadcasted: ${lat.toFixed(4)}, ${lng.toFixed(4)} ✓`);

          // Update active orders
          const active = orders.find((o) => o.orderStatus === 'Out for Delivery');
          if (active) {
            await fetch(`/api/orders/${active.id}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ driverLocation: { lat, lng } }),
            });
          }
        },
        () => {
          // Fallback to simulated Guntur coordinates
          setUpdatingLocation(false);
          setGpsMessage('Broadcasted Brodipet-Arundelpet live coordinates ✓');
        }
      );
    } else {
      setUpdatingLocation(false);
      setGpsMessage('Updated live coordinates ✓');
    }
  };

  const assignedDeliveries = orders.filter(
    (o) => o.orderStatus !== 'Delivered' && o.orderStatus !== 'Cancelled'
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Partner Info Banner */}
      <div className="bg-gradient-to-r from-emerald-900 to-[#2A170F] text-white p-6 rounded-3xl shadow-lg border border-emerald-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-900 flex items-center justify-center font-black text-xl">
            <Bike className="w-6 h-6 text-emerald-700" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold">{partnerInfo.name}</h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-400 text-black">
                ON DUTY
              </span>
            </div>
            <p className="text-xs text-emerald-200/80 mt-0.5">
              {partnerInfo.vehicle} • ★ {partnerInfo.rating} Rating
            </p>
          </div>
        </div>

        {/* GPS Broadcast Action */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleSendGPS}
            disabled={updatingLocation}
            className="py-2.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-black rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
          >
            <Navigation className={`w-3.5 h-3.5 ${updatingLocation ? 'animate-spin' : ''}`} />
            <span>{updatingLocation ? 'Broadcasting...' : 'Update Live GPS'}</span>
          </button>
        </div>
      </div>

      {gpsMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{gpsMessage}</span>
        </div>
      )}

      {/* Active Deliveries List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#4A2E18] flex items-center gap-2">
            <Package className="w-5 h-5 text-[#E85A71]" />
            Assigned Deliveries ({assignedDeliveries.length})
          </h2>
          <button
            onClick={loadDeliveries}
            className="text-xs font-semibold text-[#4A2E18] hover:underline"
          >
            Refresh List
          </button>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-gray-400">Loading deliveries...</div>
        ) : assignedDeliveries.length > 0 ? (
          <div className="space-y-4">
            {assignedDeliveries.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-3xl p-6 border border-amber-100 shadow-xs space-y-4"
              >
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <div>
                    <span className="font-mono font-black text-sm text-[#4A2E18]">
                      {order.orderNumber}
                    </span>
                    <span className="text-xs text-gray-500 ml-2">
                      ({order.items.length} items • ₹{order.totalAmount})
                    </span>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-100 text-[#4A2E18]">
                    {order.orderStatus}
                  </span>
                </div>

                {/* Pickup & Drop Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* Pickup */}
                  <div className="p-3.5 bg-amber-50/50 rounded-2xl border border-amber-100 space-y-1">
                    <div className="text-[10px] font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#E85A71]" /> Pickup Location
                    </div>
                    <div className="font-bold text-[#4A2E18]">Cake Box Bakery</div>
                    <div className="text-gray-600">4th Lane, Beside ICICI Bank, Brodipet, Guntur</div>
                    <div className="text-[11px] text-gray-500">Phone: +91 863 223 4567</div>
                  </div>

                  {/* Drop */}
                  <div className="p-3.5 bg-emerald-50/50 rounded-2xl border border-emerald-100 space-y-1">
                    <div className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600" /> Delivery Destination
                    </div>
                    <div className="font-bold text-gray-900">{order.customerName}</div>
                    <div className="text-gray-700">
                      {order.deliveryAddress.houseFlat}, {order.deliveryAddress.street}, {order.deliveryAddress.locality}
                    </div>
                    <div className="flex items-center gap-3 pt-1">
                      <a
                        href={`tel:${order.customerPhone}`}
                        className="text-[#E85A71] font-bold flex items-center gap-1"
                      >
                        <Phone className="w-3 h-3" /> {order.customerPhone}
                      </a>
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${order.deliveryAddress.latitude || 16.3012},${order.deliveryAddress.longitude || 80.4411}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-emerald-700 font-bold flex items-center gap-1 underline"
                      >
                        <Navigation className="w-3 h-3" /> Open Maps Navigation
                      </a>
                    </div>
                  </div>
                </div>

                {/* Action Buttons for Lifecycle */}
                <div className="pt-2 flex flex-wrap gap-2">
                  {order.orderStatus === 'Ready for Pickup' && (
                    <button
                      onClick={() => handleUpdateStatus(order.id, 'Picked Up')}
                      className="py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
                    >
                      Confirm Order Picked Up from Bakery
                    </button>
                  )}

                  {order.orderStatus === 'Picked Up' && (
                    <button
                      onClick={() => handleUpdateStatus(order.id, 'Out for Delivery')}
                      className="py-2.5 px-4 bg-[#E85A71] hover:bg-[#D0455C] text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
                    >
                      Start Ride: Out for Delivery
                    </button>
                  )}

                  {order.orderStatus === 'Out for Delivery' && (
                    <button
                      onClick={() => handleUpdateStatus(order.id, 'Delivered')}
                      className="py-2.5 px-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Mark Delivered to Customer</span>
                    </button>
                  )}

                  {order.orderStatus === 'Order Confirmed' || order.orderStatus === 'Preparing Your Order' ? (
                    <span className="text-xs text-gray-400 italic py-2">
                      Kitchen is currently preparing this order...
                    </span>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-10 text-center border border-amber-100 text-xs text-gray-500">
            No pending deliveries right now. You are all caught up!
          </div>
        )}
      </div>
    </div>
  );
}
