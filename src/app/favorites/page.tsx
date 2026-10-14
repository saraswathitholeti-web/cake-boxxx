'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Product } from '@/types';
import { useAuth } from '@/context/AuthContext';
import ProductCard from '@/components/ProductCard';
import { Heart, ArrowRight } from 'lucide-react';

export default function FavoritesPage() {
  const { favorites } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFavs() {
      try {
        setLoading(true);
        const res = await fetch('/api/products');
        const all: Product[] = await res.json();
        setProducts(all.filter((p) => favorites.includes(p.id)));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadFavs();
  }, [favorites]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <span className="text-xs font-bold text-[#E85A71] uppercase tracking-widest flex items-center gap-1">
          <Heart className="w-3.5 h-3.5 fill-[#E85A71]" /> Wishlist
        </span>
        <h1 className="text-3xl font-black text-[#4A2E18] tracking-tight">
          Your Favorite Bakes ({products.length})
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Your saved cakes, pizzas, and desserts for quick ordering.
        </p>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-gray-400">Loading your favorites...</div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-amber-100 max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full bg-pink-50 text-[#E85A71] flex items-center justify-center mx-auto text-2xl">
            ❤️
          </div>
          <h3 className="text-lg font-bold text-[#4A2E18]">No Favorites Yet</h3>
          <p className="text-xs text-gray-500">
            Click the heart icon on any cake, pizza or chocolate to save your favorites here.
          </p>
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 py-2.5 px-6 bg-[#4A2E18] text-white rounded-2xl text-xs font-bold"
          >
            <span>Explore Menu</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
