'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Address, Coupon } from '@/types';
import { calculateDeliveryFee } from '@/lib/geo';

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'id' | 'totalPrice'> & { id?: string }) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  discount: number;
  deliveryFee: number;
  packagingFee: number;
  tax: number;
  totalAmount: number;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  deliveryAddress: Address;
  setDeliveryAddress: (address: Address) => void;
  deliveryType: 'standard' | 'scheduled' | 'express';
  setDeliveryType: (type: 'standard' | 'scheduled' | 'express') => void;
  scheduledDate: string;
  setScheduledDate: (date: string) => void;
  scheduledTime: string;
  setScheduledTime: (time: string) => void;
  deliveryInstructions: string;
  setDeliveryInstructions: (text: string) => void;
  cookingInstructions: string;
  setCookingInstructions: (text: string) => void;
}

const defaultAddress: Address = {
  id: 'addr-default-guntur',
  recipientName: 'Priya Sharma',
  recipientPhone: '9848022334',
  houseFlat: 'Flat 302, Sai Residency',
  street: '7th Line, Arundelpet',
  locality: 'Arundelpet',
  landmark: 'Near NTR Statue',
  city: 'Guntur',
  state: 'Andhra Pradesh',
  pincode: '522002',
  addressType: 'Home',
  latitude: 16.3012,
  longitude: 80.4411,
  isDefault: true,
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [deliveryAddress, setDeliveryAddress] = useState<Address>(defaultAddress);
  const [deliveryType, setDeliveryType] = useState<'standard' | 'scheduled' | 'express'>('standard');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const [cookingInstructions, setCookingInstructions] = useState('');

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const savedItems = localStorage.getItem('cakebox_cart');
      if (savedItems) {
        setItems(JSON.parse(savedItems));
      }
      const savedAddress = localStorage.getItem('cakebox_address');
      if (savedAddress) {
        setDeliveryAddress(JSON.parse(savedAddress));
      }
      const savedCoupon = localStorage.getItem('cakebox_coupon');
      if (savedCoupon) {
        setAppliedCoupon(JSON.parse(savedCoupon));
      }
    } catch (e) {
      console.error('Error hydrating cart from localStorage', e);
    }
  }, []);

  // Save items to localStorage
  const saveCart = (newItems: CartItem[]) => {
    setItems(newItems);
    try {
      localStorage.setItem('cakebox_cart', JSON.stringify(newItems));
    } catch (e) {}
  };

  const addToCart = (newItemData: Omit<CartItem, 'id' | 'totalPrice'> & { id?: string }) => {
    const existingIndex = items.findIndex(
      (item) =>
        item.productId === newItemData.productId &&
        item.variant?.id === newItemData.variant?.id &&
        item.cakeMessage === newItemData.cakeMessage
    );

    let updated: CartItem[];
    if (existingIndex > -1) {
      updated = [...items];
      const existing = updated[existingIndex];
      const newQty = existing.quantity + newItemData.quantity;
      updated[existingIndex] = {
        ...existing,
        quantity: newQty,
        totalPrice: existing.unitPrice * newQty,
      };
    } else {
      const id = newItemData.id || `cart-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
      const cartItem: CartItem = {
        ...newItemData,
        id,
        totalPrice: newItemData.unitPrice * newItemData.quantity,
      };
      updated = [...items, cartItem];
    }
    saveCart(updated);
  };

  const removeFromCart = (itemId: string) => {
    const updated = items.filter((item) => item.id !== itemId);
    saveCart(updated);
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    const updated = items.map((item) => {
      if (item.id === itemId) {
        return {
          ...item,
          quantity,
          totalPrice: item.unitPrice * quantity,
        };
      }
      return item;
    });
    saveCart(updated);
  };

  const clearCart = () => {
    saveCart([]);
    setAppliedCoupon(null);
    try {
      localStorage.removeItem('cakebox_coupon');
    } catch (e) {}
  };

  // Calculations
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = items.reduce((acc, item) => acc + item.totalPrice, 0);

  // Revalidate coupon on subtotal
  let discount = 0;
  if (appliedCoupon && subtotal >= appliedCoupon.minOrderAmount) {
    if (appliedCoupon.discountType === 'percentage') {
      discount = Math.round((subtotal * appliedCoupon.discountValue) / 100);
      if (appliedCoupon.maxDiscount && discount > appliedCoupon.maxDiscount) {
        discount = appliedCoupon.maxDiscount;
      }
    } else {
      discount = appliedCoupon.discountValue;
    }
  }

  const distanceKm = 2.5; // Typical Guntur town distance
  const baseDelivery = calculateDeliveryFee(distanceKm, subtotal, 35, 499);
  const deliveryFee = items.length === 0 ? 0 : baseDelivery;
  const packagingFee = items.length === 0 ? 0 : 20;
  const taxableAmount = Math.max(0, subtotal - discount);
  const tax = items.length === 0 ? 0 : Math.round((taxableAmount * 5) / 100);
  const totalAmount = items.length === 0 ? 0 : taxableAmount + deliveryFee + packagingFee + tax;

  const applyCoupon = async (code: string): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, subtotal }),
      });
      const data = await res.json();
      if (data.valid && data.coupon) {
        setAppliedCoupon(data.coupon);
        try {
          localStorage.setItem('cakebox_coupon', JSON.stringify(data.coupon));
        } catch (e) {}
        return { success: true, message: data.message };
      }
      return { success: false, message: data.message || 'Invalid coupon code' };
    } catch (error) {
      return { success: false, message: 'Failed to apply coupon' };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    try {
      localStorage.removeItem('cakebox_coupon');
    } catch (e) {}
  };

  const handleSetAddress = (addr: Address) => {
    setDeliveryAddress(addr);
    try {
      localStorage.setItem('cakebox_address', JSON.stringify(addr));
    } catch (e) {}
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        itemCount,
        subtotal,
        discount,
        deliveryFee,
        packagingFee,
        tax,
        totalAmount,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        deliveryAddress,
        setDeliveryAddress: handleSetAddress,
        deliveryType,
        setDeliveryType,
        scheduledDate,
        setScheduledDate,
        scheduledTime,
        setScheduledTime,
        deliveryInstructions,
        setDeliveryInstructions,
        cookingInstructions,
        setCookingInstructions,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
