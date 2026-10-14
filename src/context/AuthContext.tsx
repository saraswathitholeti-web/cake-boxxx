'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'admin' | 'delivery_partner';
}

interface AuthContextType {
  user: UserProfile | null;
  isAdmin: boolean;
  isDeliveryPartner: boolean;
  login: (email: string, role?: 'customer' | 'admin' | 'delivery_partner') => void;
  logout: () => void;
  favorites: string[];
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
}

const defaultUser: UserProfile = {
  id: 'u-default',
  name: 'Priya Sharma',
  email: 'priya.sharma@example.com',
  phone: '9848022334',
  role: 'customer',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(defaultUser);
  const [favorites, setFavorites] = useState<string[]>(['cake-1', 'pastry-14', 'pizza-24']);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('cakebox_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      const storedFavs = localStorage.getItem('cakebox_favs');
      if (storedFavs) {
        setFavorites(JSON.parse(storedFavs));
      }
    } catch (e) {
      console.error('Error loading auth from localStorage', e);
    }
  }, []);

  const login = (email: string, role: 'customer' | 'admin' | 'delivery_partner' = 'customer') => {
    let name = 'Customer';
    let phone = '9848022334';
    if (role === 'admin') {
      name = 'Cake Box Admin (Brodipet)';
    } else if (role === 'delivery_partner') {
      name = 'Ramesh Naidu (Partner)';
      phone = '9440156789';
    } else {
      name = email.split('@')[0] || 'Customer';
    }

    const newUser: UserProfile = {
      id: role === 'admin' ? 'admin-1' : role === 'delivery_partner' ? 'dp-1' : 'u-default',
      name,
      email,
      phone,
      role,
    };
    setUser(newUser);
    try {
      localStorage.setItem('cakebox_user', JSON.stringify(newUser));
    } catch (e) {}
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem('cakebox_user');
    } catch (e) {}
  };

  const toggleFavorite = (productId: string) => {
    setFavorites((prev) => {
      const updated = prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId];
      try {
        localStorage.setItem('cakebox_favs', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const isFavorite = (productId: string) => favorites.includes(productId);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin: user?.role === 'admin',
        isDeliveryPartner: user?.role === 'delivery_partner',
        login,
        logout,
        favorites,
        toggleFavorite,
        isFavorite,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
