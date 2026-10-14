'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { Home, Utensils, ShoppingBag, Clock, User } from 'lucide-react';

export default function MobileNav() {
  const pathname = usePathname();
  const { itemCount, subtotal } = useCart();

  const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Menu', href: '/menu', icon: Utensils },
    { name: 'Orders', href: '/orders', icon: Clock },
    { name: 'Account', href: '/support', icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-amber-100/90 shadow-lg px-2 py-1.5 flex items-center justify-around">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.name}
            href={item.href}
            className={`flex flex-col items-center py-1 px-3 rounded-xl transition-all ${
              isActive ? 'text-[#4A2E18] font-bold' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px] text-[#E85A71]' : ''}`} />
            <span className="text-[10px] mt-0.5">{item.name}</span>
          </Link>
        );
      })}

      {/* Floating Cart in Mobile Nav */}
      <Link
        href="/cart"
        className="flex flex-col items-center py-1 px-3 rounded-xl text-gray-700 relative group"
      >
        <div className="relative">
          <ShoppingBag className="w-5 h-5 text-[#4A2E18]" />
          {itemCount > 0 && (
            <span className="absolute -top-1.5 -right-2 bg-[#E85A71] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
              {itemCount}
            </span>
          )}
        </div>
        <span className="text-[10px] font-semibold text-[#4A2E18] mt-0.5">
          {itemCount > 0 ? `₹${subtotal}` : 'Cart'}
        </span>
      </Link>
    </div>
  );
}
