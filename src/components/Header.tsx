'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import AddressModal from '@/components/AddressModal';
import {
  ShoppingBag,
  MapPin,
  Search,
  User,
  Sparkles,
  ChevronDown,
  Phone,
  Shield,
  Truck,
  LogOut,
  Heart,
  Clock,
} from 'lucide-react';

export default function Header() {
  const pathname = usePathname();
  const { itemCount, subtotal, deliveryAddress } = useCart();
  const { user, logout, login } = useAuth();
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Menu', href: '/menu' },
    { name: 'Cakes', href: '/menu?category=cat-birthday-cakes' },
    { name: 'Fast Food', href: '/menu?category=cat-pizza' },
    { name: 'Desserts', href: '/menu?category=cat-desserts' },
    { name: 'Chocolates', href: '/menu?category=cat-chocolates' },
    { name: 'Offers', href: '/offers' },
    { name: 'Track Order', href: '/track' },
    { name: 'Support', href: '/support' },
  ];

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-[#2A170F] text-amber-100 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-medium text-amber-200">Brodipet Bakery Open Now</span>
            <span className="hidden sm:inline text-amber-300/70">| 10:00 AM – 10:30 PM | Free delivery on orders above ₹499!</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-amber-200/90">
            <a href="tel:+918632234567" className="hover:text-white flex items-center gap-1">
              <Phone className="w-3 h-3" /> +91 863 223 4567
            </a>
            <span className="hidden md:inline">4th Lane, Beside ICICI Bank, Brodipet, Guntur</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-100/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Brand Logo & Name */}
            <div className="flex items-center gap-6">
              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4A2E18] to-[#2A170F] flex items-center justify-center text-white shadow-md shadow-[#4A2E18]/15 group-hover:scale-105 transition-transform">
                  <span className="font-black text-lg tracking-tighter text-amber-200">CB</span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xl font-black tracking-tight text-[#4A2E18]">CAKE BOX</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#FDE8EC] text-[#E85A71]">GUNTUR</span>
                  </div>
                  <p className="text-[10px] font-medium text-gray-500 tracking-wide hidden sm:block">
                    Fresh Bakes. Sweet Moments. Delivered.
                  </p>
                </div>
              </Link>

              {/* Delivery Location Selector */}
              <button
                onClick={() => setIsAddressModalOpen(true)}
                className="hidden md:flex items-center gap-2 py-1.5 px-3 rounded-full bg-[#FAF5EE] hover:bg-[#F2E7DC] border border-amber-200/70 text-left transition-colors max-w-xs"
              >
                <div className="w-6 h-6 rounded-full bg-[#E85A71]/10 flex items-center justify-center flex-shrink-0 text-[#E85A71]">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <div className="truncate">
                  <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                    Delivering to <ChevronDown className="w-2.5 h-2.5" />
                  </div>
                  <div className="text-xs font-semibold text-gray-800 truncate">
                    {deliveryAddress.locality || 'Add your address'}, Guntur
                  </div>
                </div>
              </button>
            </div>

            {/* Search, Cart & Account Actions */}
            <div className="flex items-center gap-3">
              {/* Quick Search Button */}
              <Link
                href="/menu"
                className="hidden lg:flex items-center gap-2 bg-[#FAF5EE] hover:bg-gray-100 text-gray-400 hover:text-gray-600 px-3 py-1.5 rounded-full text-xs border border-amber-100 transition-colors w-48"
              >
                <Search className="w-3.5 h-3.5 text-gray-500" />
                <span>Search cakes, pizzas...</span>
              </Link>

              {/* Favorites Wishlist */}
              <Link
                href="/favorites"
                className="p-2 rounded-full text-gray-600 hover:text-[#E85A71] hover:bg-[#FDE8EC]/60 transition-colors hidden sm:block"
                title="Your Favorites"
              >
                <Heart className="w-5 h-5" />
              </Link>

              {/* Shopping Cart Button */}
              <Link
                href="/cart"
                className="flex items-center gap-2.5 bg-[#4A2E18] hover:bg-[#2A170F] text-white px-3.5 py-2 rounded-full font-semibold text-xs shadow-md shadow-[#4A2E18]/15 transition-all group"
              >
                <div className="relative">
                  <ShoppingBag className="w-4 h-4 group-hover:scale-110 transition-transform text-amber-200" />
                  {itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-[#E85A71] text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                      {itemCount}
                    </span>
                  )}
                </div>
                <div className="text-left hidden sm:block">
                  <span className="text-[11px] font-bold text-amber-100">
                    {itemCount > 0 ? `₹${subtotal}` : 'Cart'}
                  </span>
                </div>
              </Link>

              {/* Profile / Account Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-1.5 p-1.5 sm:px-3 sm:py-1.5 rounded-full border border-gray-200 hover:border-amber-300 text-gray-700 bg-white hover:bg-amber-50/50 text-xs font-medium transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-amber-100 text-[#4A2E18] flex items-center justify-center font-bold text-xs">
                    {user?.name ? user.name[0].toUpperCase() : <User className="w-3.5 h-3.5" />}
                  </div>
                  <span className="hidden md:inline font-semibold text-gray-800">
                    {user ? user.name.split(' ')[0] : 'Sign In'}
                  </span>
                  <ChevronDown className="w-3 h-3 text-gray-400" />
                </button>

                {isProfileOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-gray-100">
                      <div className="font-bold text-xs text-[#4A2E18]">
                        {user ? user.name : 'Welcome to Cake Box'}
                      </div>
                      <div className="text-[11px] text-gray-500 truncate">
                        {user ? user.phone : 'Freshly baked moments in Guntur'}
                      </div>
                    </div>

                    <Link
                      href="/orders"
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-gray-700 hover:bg-amber-50/60 hover:text-[#4A2E18] transition-colors"
                    >
                      <Clock className="w-4 h-4 text-amber-600" /> My Orders & History
                    </Link>

                    <Link
                      href="/favorites"
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-gray-700 hover:bg-amber-50/60 hover:text-[#4A2E18] transition-colors"
                    >
                      <Heart className="w-4 h-4 text-[#E85A71]" /> Favorite Products
                    </Link>

                    <Link
                      href="/support"
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-gray-700 hover:bg-amber-50/60 hover:text-[#4A2E18] transition-colors"
                    >
                      <Sparkles className="w-4 h-4 text-emerald-600" /> Customer Support & Care
                    </Link>

                    <div className="border-t border-gray-100 my-1"></div>

                    {/* Quick Role Switches for Testing / Portals */}
                    <div className="px-4 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      Management Portals
                    </div>

                    <Link
                      href="/admin"
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-indigo-700 hover:bg-indigo-50 font-medium transition-colors"
                    >
                      <Shield className="w-4 h-4" /> Restaurant Admin Dashboard
                    </Link>

                    <Link
                      href="/delivery"
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-emerald-700 hover:bg-emerald-50 font-medium transition-colors"
                    >
                      <Truck className="w-4 h-4" /> Delivery Partner Dashboard
                    </Link>

                    <div className="border-t border-gray-100 my-1"></div>

                    {user ? (
                      <button
                        onClick={logout}
                        className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    ) : (
                      <button
                        onClick={() => login('customer@example.com')}
                        className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-xs text-[#4A2E18] font-bold hover:bg-amber-50 transition-colors"
                      >
                        <User className="w-4 h-4" /> Quick Customer Login
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Desktop Navigation Category Strip */}
          <nav className="hidden md:flex items-center gap-1 pt-2.5 overflow-x-auto no-scrollbar text-xs font-semibold">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-full transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-[#4A2E18] text-white shadow-xs'
                      : 'text-gray-600 hover:text-[#4A2E18] hover:bg-amber-50/70'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Address Selector Modal */}
      <AddressModal isOpen={isAddressModalOpen} onClose={() => setIsAddressModalOpen(false)} />
    </>
  );
}
