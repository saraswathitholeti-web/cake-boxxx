'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Order,
  Product,
  Coupon,
  SupportTicket,
  BusinessSettings,
  OrderStatus,
} from '@/types';
import {
  ShieldCheck,
  Package,
  ShoppingBag,
  TrendingUp,
  Clock,
  CheckCircle,
  Truck,
  Plus,
  Edit,
  Trash2,
  Tag,
  Settings,
  MessageSquare,
  Search,
  Printer,
  X,
  AlertCircle,
  Power,
} from 'lucide-react';

const ORDER_STATUSES: OrderStatus[] = [
  'Order Placed',
  'Order Confirmed',
  'Preparing Your Order',
  'Ready for Pickup',
  'Delivery Partner Assigned',
  'Picked Up',
  'Out for Delivery',
  'Delivered',
  'Cancelled',
];

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'coupons' | 'settings' | 'tickets'>('orders');

  // Data states
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [settings, setSettings] = useState<BusinessSettings | null>(null);
  const [loading, setLoading] = useState(true);

  // Search & Filters
  const [orderSearch, setOrderSearch] = useState('');
  const [productSearch, setProductSearch] = useState('');

  // Edit / Add Product Modal
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [showProductModal, setShowProductModal] = useState(false);

  // New Coupon Modal
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    description: '',
    discountType: 'percentage' as 'percentage' | 'fixed',
    discountValue: 10,
    minOrderAmount: 249,
    maxDiscount: 100,
    validUntil: '2026-12-31',
    isActive: true,
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [ordRes, prodRes, coupRes, tktRes, setRes] = await Promise.all([
        fetch('/api/orders'),
        fetch('/api/products'),
        fetch('/api/coupons'),
        fetch('/api/tickets'),
        fetch('/api/settings'),
      ]);
      const [ordData, prodData, coupData, tktData, setData] = await Promise.all([
        ordRes.json(),
        prodRes.json(),
        coupRes.json(),
        tktRes.json(),
        setRes.json(),
      ]);

      setOrders(ordData);
      setProducts(prodData);
      setCoupons(coupData);
      setTickets(tktData);
      setSettings(setData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Update order status
  const handleUpdateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderStatus: status }),
      });
      if (res.ok) {
        loadData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Toggle product availability
  const handleToggleProductAvailability = async (product: Product) => {
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isAvailable: !product.isAvailable }),
      });
      if (res.ok) {
        loadData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Save / Update product
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      if (editingProduct.id) {
        // Update
        await fetch(`/api/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingProduct),
        });
      } else {
        // Create
        await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingProduct),
        });
      }
      setShowProductModal(false);
      setEditingProduct(null);
      loadData();
    } catch (e) {
      console.error(e);
    }
  };

  // Save new coupon
  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCoupon),
      });
      setShowCouponModal(false);
      loadData();
    } catch (e) {
      console.error(e);
    }
  };

  // Save settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    try {
      await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      alert('Cake Box business settings saved successfully!');
    } catch (e) {
      console.error(e);
    }
  };

  // Resolve Ticket
  const handleResolveTicket = async (ticketId: string, status: SupportTicket['status'], adminNotes: string) => {
    try {
      await fetch('/api/tickets', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: ticketId, status, adminNotes }),
      });
      loadData();
    } catch (e) {
      console.error(e);
    }
  };

  // KPI Calculations
  const totalSales = orders
    .filter((o) => o.orderStatus !== 'Cancelled')
    .reduce((sum, o) => sum + o.totalAmount, 0);
  const activeOrdersCount = orders.filter((o) => o.orderStatus !== 'Delivered' && o.orderStatus !== 'Cancelled').length;
  const preparingCount = orders.filter((o) => o.orderStatus === 'Preparing Your Order').length;
  const outCount = orders.filter((o) => o.orderStatus === 'Out for Delivery').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Admin Top Banner */}
      <div className="bg-[#2A170F] text-white p-6 rounded-3xl shadow-lg border border-amber-950 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-[#2A170F] flex items-center justify-center font-black text-xl shadow-xs">
            CB
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight">Cake Box Restaurant Admin</h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                Brodipet Kitchen
              </span>
            </div>
            <p className="text-xs text-amber-200/70">
              Manage live orders, 50+ bakery items, delivery dispatch & store settings
            </p>
          </div>
        </div>

        {/* Live Store Toggle */}
        {settings && (
          <div className="flex items-center gap-3 bg-white/10 p-2 px-4 rounded-2xl border border-white/10 self-start md:self-auto">
            <span className="text-xs font-semibold">Store Status:</span>
            <button
              onClick={() => {
                const updated = { ...settings, isOpen: !settings.isOpen };
                setSettings(updated);
                fetch('/api/settings', {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(updated),
                });
              }}
              className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 transition-colors ${
                settings.isOpen ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
              }`}
            >
              <Power className="w-3.5 h-3.5" />
              <span>{settings.isOpen ? 'OPEN FOR ORDERS' : 'STORE CLOSED'}</span>
            </button>
          </div>
        )}
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-amber-100 shadow-xs space-y-1">
          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" /> Total Sales
          </div>
          <div className="text-2xl font-black text-[#4A2E18]">₹{totalSales.toLocaleString('en-IN')}</div>
          <div className="text-[10px] text-gray-500">Across {orders.length} total orders</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-amber-100 shadow-xs space-y-1">
          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-amber-600" /> Active Orders
          </div>
          <div className="text-2xl font-black text-amber-600">{activeOrdersCount}</div>
          <div className="text-[10px] text-gray-500">Orders in kitchen / delivery</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-amber-100 shadow-xs space-y-1">
          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1">
            <Package className="w-3.5 h-3.5 text-[#E85A71]" /> In Kitchen Baking
          </div>
          <div className="text-2xl font-black text-[#E85A71]">{preparingCount}</div>
          <div className="text-[10px] text-gray-500">Ovens and chefs active</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-amber-100 shadow-xs space-y-1">
          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1">
            <Truck className="w-3.5 h-3.5 text-blue-600" /> Out for Delivery
          </div>
          <div className="text-2xl font-black text-blue-600">{outCount}</div>
          <div className="text-[10px] text-gray-500">On roads across Guntur</div>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex border-b border-gray-200 overflow-x-auto no-scrollbar gap-2 text-xs font-bold">
        {[
          { key: 'orders', label: `Live Orders (${orders.length})`, icon: ShoppingBag },
          { key: 'products', label: `Product Catalog (${products.length})`, icon: Package },
          { key: 'coupons', label: `Promotions & Coupons (${coupons.length})`, icon: Tag },
          { key: 'tickets', label: `Customer Tickets (${tickets.length})`, icon: MessageSquare },
          { key: 'settings', label: 'Bakery Settings', icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`py-3 px-4 border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
                isActive
                  ? 'border-[#4A2E18] text-[#4A2E18]'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: LIVE ORDERS MANAGER */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                placeholder="Search by Order # or customer name..."
                className="w-full text-xs pl-9 pr-3 py-2 border border-gray-200 rounded-xl bg-white"
              />
            </div>
            <button
              onClick={loadData}
              className="py-2 px-3 text-xs font-bold text-[#4A2E18] bg-amber-50 hover:bg-amber-100 rounded-xl transition-colors"
            >
              Refresh Orders
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-amber-100 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF5EE] text-[#4A2E18] font-bold border-b border-amber-100">
                  <tr>
                    <th className="p-3.5">Order #</th>
                    <th className="p-3.5">Customer & Phone</th>
                    <th className="p-3.5">Items Ordered</th>
                    <th className="p-3.5">Total & Payment</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Update Status</th>
                    <th className="p-3.5">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders
                    .filter((o) =>
                      o.orderNumber.toLowerCase().includes(orderSearch.toLowerCase()) ||
                      o.customerName.toLowerCase().includes(orderSearch.toLowerCase())
                    )
                    .map((order) => (
                      <tr key={order.id} className="hover:bg-amber-50/30">
                        <td className="p-3.5 font-mono font-bold text-[#4A2E18]">
                          {order.orderNumber}
                          <div className="text-[10px] text-gray-400 font-sans">
                            {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </td>

                        <td className="p-3.5">
                          <div className="font-bold text-gray-800">{order.customerName}</div>
                          <div className="text-[11px] text-gray-500">{order.customerPhone}</div>
                          <div className="text-[10px] text-gray-400">{order.deliveryAddress.locality}</div>
                        </td>

                        <td className="p-3.5 max-w-xs">
                          {order.items.map((i, idx) => (
                            <div key={idx} className="text-[11px] text-gray-700 truncate">
                              • {i.quantity}x {i.productName} {i.selectedVariant ? `(${i.selectedVariant})` : ''}
                              {i.cakeMessage && <span className="text-amber-700 italic"> [Msg: {i.cakeMessage}]</span>}
                            </div>
                          ))}
                        </td>

                        <td className="p-3.5">
                          <div className="font-black text-[#4A2E18]">₹{order.totalAmount}</div>
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                              order.paymentStatus === 'Paid'
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-amber-50 text-amber-700'
                            }`}
                          >
                            {order.paymentMethod} • {order.paymentStatus}
                          </span>
                        </td>

                        <td className="p-3.5">
                          <span
                            className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                              order.orderStatus === 'Delivered'
                                ? 'bg-emerald-100 text-emerald-800'
                                : order.orderStatus === 'Cancelled'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-amber-100 text-[#4A2E18]'
                            }`}
                          >
                            {order.orderStatus}
                          </span>
                        </td>

                        <td className="p-3.5">
                          <select
                            value={order.orderStatus}
                            onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as OrderStatus)}
                            className="text-xs p-1.5 border border-gray-200 rounded-lg bg-white focus:outline-none"
                          >
                            {ORDER_STATUSES.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                        </td>

                        <td className="p-3.5">
                          <a
                            href={`/track?order=${order.orderNumber}`}
                            target="_blank"
                            className="p-1.5 text-gray-500 hover:text-[#4A2E18] inline-block"
                            title="View tracking"
                          >
                            <Printer className="w-4 h-4" />
                          </a>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCT CATALOG MANAGER */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm w-full">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                placeholder="Search products by title..."
                className="w-full text-xs pl-9 pr-3 py-2 border border-gray-200 rounded-xl bg-white"
              />
            </div>
            <button
              onClick={() => {
                setEditingProduct({
                  name: '',
                  description: '',
                  basePrice: 299,
                  categoryId: 'cat-birthday-cakes',
                  dietaryType: 'eggless',
                  imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80',
                  isAvailable: true,
                });
                setShowProductModal(true);
              }}
              className="py-2.5 px-4 bg-[#4A2E18] hover:bg-[#2A170F] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" /> Add New Bakery Product
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-amber-100 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF5EE] text-[#4A2E18] font-bold border-b border-amber-100">
                  <tr>
                    <th className="p-3.5">Image</th>
                    <th className="p-3.5">Name & Category</th>
                    <th className="p-3.5">Dietary</th>
                    <th className="p-3.5">Base Price</th>
                    <th className="p-3.5">Stock Status</th>
                    <th className="p-3.5">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products
                    .filter((p) => p.name.toLowerCase().includes(productSearch.toLowerCase()))
                    .map((prod) => (
                      <tr key={prod.id} className="hover:bg-amber-50/20">
                        <td className="p-3.5">
                          <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-amber-50">
                            <Image src={prod.imageUrl} alt={prod.name} fill className="object-cover" />
                          </div>
                        </td>

                        <td className="p-3.5">
                          <div className="font-bold text-gray-800">{prod.name}</div>
                          <div className="text-[10px] text-gray-400">{prod.categoryId}</div>
                        </td>

                        <td className="p-3.5">
                          {prod.dietaryType === 'eggless' ? (
                            <span className="eggless-badge text-[10px]">🌱 Eggless</span>
                          ) : prod.dietaryType === 'veg' ? (
                            <span className="veg-badge"><span className="veg-badge-dot"></span></span>
                          ) : (
                            <span className="non-veg-badge"><span className="non-veg-badge-dot"></span></span>
                          )}
                        </td>

                        <td className="p-3.5 font-bold text-[#4A2E18]">₹{prod.basePrice}</td>

                        <td className="p-3.5">
                          <button
                            onClick={() => handleToggleProductAvailability(prod)}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-colors ${
                              prod.isAvailable
                                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                : 'bg-red-100 text-red-800 hover:bg-red-200'
                            }`}
                          >
                            {prod.isAvailable ? 'In Stock' : 'Out of Stock'}
                          </button>
                        </td>

                        <td className="p-3.5">
                          <button
                            onClick={() => {
                              setEditingProduct(prod);
                              setShowProductModal(true);
                            }}
                            className="p-1.5 text-gray-500 hover:text-[#4A2E18]"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PROMOTIONS & COUPONS */}
      {activeTab === 'coupons' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-[#4A2E18]">Active Promo Codes & Discounts</h3>
            <button
              onClick={() => setShowCouponModal(true)}
              className="py-2 px-4 bg-[#4A2E18] text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Create Coupon Code
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {coupons.map((c) => (
              <div key={c.id} className="bg-white p-5 rounded-3xl border border-amber-100 shadow-xs space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-mono font-black text-sm text-[#4A2E18] bg-amber-100 px-2.5 py-0.5 rounded-lg">
                    {c.code}
                  </span>
                  <span className="text-[10px] font-bold text-gray-500">Used {c.usageCount || 0} times</span>
                </div>
                <div className="font-bold text-xs text-gray-800">{c.description}</div>
                <div className="text-[11px] text-gray-500">
                  Min. Order: ₹{c.minOrderAmount} • {c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `₹${c.discountValue} OFF`}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: SUPPORT TICKETS */}
      {activeTab === 'tickets' && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-[#4A2E18]">Customer Care Inquiries</h3>
          <div className="bg-white rounded-3xl border border-amber-100 shadow-xs divide-y divide-gray-100 overflow-hidden">
            {tickets.map((t) => (
              <div key={t.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-[#4A2E18]">{t.ticketNumber}</span>
                    <span className="text-xs font-bold text-gray-700">by {t.userName} ({t.userPhone})</span>
                    {t.orderId && <span className="text-[10px] text-gray-400">Order: {t.orderId}</span>}
                  </div>
                  <div className="text-xs font-semibold text-[#E85A71]">{t.category}</div>
                  <p className="text-xs text-gray-600 leading-relaxed">{t.description}</p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={t.status}
                    onChange={(e) => handleResolveTicket(t.id, e.target.value as any, t.adminNotes || '')}
                    className="text-xs p-2 border border-gray-200 rounded-xl bg-white"
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: BUSINESS SETTINGS */}
      {activeTab === 'settings' && settings && (
        <form onSubmit={handleSaveSettings} className="bg-white rounded-3xl p-6 border border-amber-100 shadow-xs space-y-6 max-w-3xl">
          <h3 className="text-sm font-bold text-[#4A2E18] uppercase tracking-wider">
            Bakery Operating & Pricing Settings
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Restaurant Name</label>
              <input
                type="text"
                value={settings.restaurantName}
                onChange={(e) => setSettings({ ...settings, restaurantName: e.target.value })}
                className="w-full text-xs p-2.5 border border-gray-200 rounded-xl"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Store Contact Phone</label>
              <input
                type="text"
                value={settings.contactPhone}
                onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                className="w-full text-xs p-2.5 border border-gray-200 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Opening Hours</label>
              <input
                type="text"
                value={settings.openingHours}
                onChange={(e) => setSettings({ ...settings, openingHours: e.target.value })}
                className="w-full text-xs p-2.5 border border-gray-200 rounded-xl"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Delivery Radius (km)</label>
              <input
                type="number"
                value={settings.deliveryRadiusKm}
                onChange={(e) => setSettings({ ...settings, deliveryRadiusKm: Number(e.target.value) })}
                className="w-full text-xs p-2.5 border border-gray-200 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Base Delivery Fee (₹)</label>
              <input
                type="number"
                value={settings.baseDeliveryFee}
                onChange={(e) => setSettings({ ...settings, baseDeliveryFee: Number(e.target.value) })}
                className="w-full text-xs p-2.5 border border-gray-200 rounded-xl"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Free Delivery Min (₹)</label>
              <input
                type="number"
                value={settings.freeDeliveryThreshold}
                onChange={(e) => setSettings({ ...settings, freeDeliveryThreshold: Number(e.target.value) })}
                className="w-full text-xs p-2.5 border border-gray-200 rounded-xl"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Packaging Charge (₹)</label>
              <input
                type="number"
                value={settings.packagingCharge}
                onChange={(e) => setSettings({ ...settings, packagingCharge: Number(e.target.value) })}
                className="w-full text-xs p-2.5 border border-gray-200 rounded-xl"
              />
            </div>
          </div>

          <button
            type="submit"
            className="py-3 px-6 bg-[#4A2E18] text-white rounded-xl text-xs font-bold shadow-md hover:bg-[#2A170F] transition-colors"
          >
            Save All Settings
          </button>
        </form>
      )}

      {/* Edit / Add Product Modal */}
      {showProductModal && editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-amber-100 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <h3 className="font-bold text-sm text-[#4A2E18]">
                {editingProduct.id ? 'Edit Product' : 'Add New Bakery Product'}
              </h3>
              <button onClick={() => setShowProductModal(false)}>
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  value={editingProduct.name || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full p-2.5 border border-gray-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingProduct.description || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full p-2.5 border border-gray-200 rounded-xl"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Base Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.basePrice || 0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, basePrice: Number(e.target.value) })}
                    className="w-full p-2.5 border border-gray-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Dietary Tag</label>
                  <select
                    value={editingProduct.dietaryType || 'eggless'}
                    onChange={(e) => setEditingProduct({ ...editingProduct, dietaryType: e.target.value as any })}
                    className="w-full p-2.5 border border-gray-200 rounded-xl bg-white"
                  >
                    <option value="eggless">🌱 Eggless</option>
                    <option value="veg">Veg</option>
                    <option value="non-veg">Non-Veg</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Image URL</label>
                <input
                  type="url"
                  required
                  value={editingProduct.imageUrl || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, imageUrl: e.target.value })}
                  className="w-full p-2.5 border border-gray-200 rounded-xl"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="py-2 px-4 rounded-xl border border-gray-200 text-gray-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-5 rounded-xl bg-[#4A2E18] text-white font-bold"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Coupon Modal */}
      {showCouponModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-amber-100 space-y-4 text-xs">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <h3 className="font-bold text-sm text-[#4A2E18]">Create New Coupon</h3>
              <button onClick={() => setShowCouponModal(false)}>
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-3">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Coupon Code</label>
                <input
                  type="text"
                  required
                  value={newCoupon.code}
                  onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. DIWALI100"
                  className="w-full p-2.5 uppercase border border-gray-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Description</label>
                <input
                  type="text"
                  required
                  value={newCoupon.description}
                  onChange={(e) => setNewCoupon({ ...newCoupon, description: e.target.value })}
                  placeholder="e.g. ₹100 OFF on festive orders"
                  className="w-full p-2.5 border border-gray-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Discount Value</label>
                  <input
                    type="number"
                    required
                    value={newCoupon.discountValue}
                    onChange={(e) => setNewCoupon({ ...newCoupon, discountValue: Number(e.target.value) })}
                    className="w-full p-2.5 border border-gray-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Min. Order Amount (₹)</label>
                  <input
                    type="number"
                    required
                    value={newCoupon.minOrderAmount}
                    onChange={(e) => setNewCoupon({ ...newCoupon, minOrderAmount: Number(e.target.value) })}
                    className="w-full p-2.5 border border-gray-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCouponModal(false)}
                  className="py-2 px-4 rounded-xl border border-gray-200 text-gray-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-5 rounded-xl bg-[#4A2E18] text-white font-bold"
                >
                  Create Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
