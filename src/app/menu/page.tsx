'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import { Product, Category, DietaryType } from '@/types';
import { Search, SlidersHorizontal, Sparkles, Filter, X } from 'lucide-react';

function MenuContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const initialSearch = searchParams.get('search') || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedDietary, setSelectedDietary] = useState<'all' | DietaryType>('all');
  const [sortBy, setSortBy] = useState<'bestseller' | 'price-low' | 'price-high' | 'rating'>('bestseller');
  const [maxPrice, setMaxPrice] = useState<number>(2000);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Sync category or search from query params
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setSelectedCategory(cat);
    const q = searchParams.get('search');
    if (q) setSearchQuery(q);
  }, [searchParams]);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [prodRes, catRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/settings'), // to check settings or seed
        ]);
        const prodData = await prodRes.json();
        setProducts(prodData);

        // Fetch categories from initial
        const { initialCategories } = await import('@/data/seedData');
        setCategories(initialCategories);
      } catch (err) {
        console.error('Failed to load menu products', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Filter logic
  const filteredProducts = products.filter((product) => {
    // Category check
    if (selectedCategory !== 'all' && product.categoryId !== selectedCategory) {
      return false;
    }
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = product.name.toLowerCase().includes(q);
      const matchDesc = product.description.toLowerCase().includes(q);
      if (!matchName && !matchDesc) return false;
    }
    // Dietary
    if (selectedDietary !== 'all') {
      if (selectedDietary === 'eggless') {
        if (product.dietaryType !== 'eggless') return false;
      } else if (selectedDietary === 'veg') {
        if (product.dietaryType === 'non-veg') return false;
      } else if (selectedDietary === 'non-veg') {
        if (product.dietaryType !== 'non-veg') return false;
      }
    }
    // Max price
    if (product.basePrice > maxPrice) {
      return false;
    }
    return true;
  });

  // Sorting logic
  filteredProducts.sort((a, b) => {
    if (sortBy === 'price-low') return a.basePrice - b.basePrice;
    if (sortBy === 'price-high') return b.basePrice - a.basePrice;
    if (sortBy === 'rating') return b.rating - a.rating;
    // default bestseller
    return (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Page Header */}
      <div className="mb-6">
        <span className="text-xs font-bold text-[#E85A71] uppercase tracking-widest flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5" /> Cake Box Kitchen Menu
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-[#4A2E18] tracking-tight">
          Brodipet Bakery & Fast Food Catalog
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Handcrafted cakes, fresh cream pastries, artisan chocolates, burgers, and hot pizzas delivered across Guntur.
        </p>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white rounded-3xl p-4 border border-amber-100 shadow-xs mb-8 space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          {/* Search Box */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search cakes, pizza, puffs, shakes..."
              className="w-full text-xs sm:text-sm pl-10 pr-8 py-2.5 bg-[#FAF5EE] rounded-2xl border border-amber-100 focus:outline-none focus:ring-1 focus:ring-[#4A2E18]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Dietary Filter Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 no-scrollbar">
            <button
              onClick={() => setSelectedDietary('all')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedDietary === 'all'
                  ? 'bg-[#4A2E18] text-white shadow-xs'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Items
            </button>
            <button
              onClick={() => setSelectedDietary('eggless')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1 ${
                selectedDietary === 'eggless'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
              }`}
            >
              🌱 Eggless Only
            </button>
            <button
              onClick={() => setSelectedDietary('veg')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1 ${
                selectedDietary === 'veg'
                  ? 'bg-green-700 text-white shadow-xs'
                  : 'bg-green-50 text-green-800 hover:bg-green-100'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-green-600"></span> Veg
            </button>
            <button
              onClick={() => setSelectedDietary('non-veg')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1 ${
                selectedDietary === 'non-veg'
                  ? 'bg-red-700 text-white shadow-xs'
                  : 'bg-red-50 text-red-800 hover:bg-red-100'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-red-600"></span> Non-Veg
            </button>

            {/* Mobile Filter Toggle Button */}
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="md:hidden ml-auto p-2 rounded-xl bg-amber-50 text-[#4A2E18] border border-amber-200 text-xs font-bold flex items-center gap-1"
            >
              <Filter className="w-4 h-4" /> Filters
            </button>
          </div>

          {/* Sort Selector */}
          <div className="hidden md:flex items-center gap-2">
            <span className="text-xs text-gray-500 font-medium">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs font-semibold p-2 bg-[#FAF5EE] border border-amber-100 rounded-xl text-[#4A2E18] focus:outline-none"
            >
              <option value="bestseller">Popular / Bestsellers</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Customer Rated</option>
            </select>
          </div>
        </div>

        {/* Categories Strip */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-2 border-t border-gray-100">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-[#E85A71] text-white shadow-xs'
                : 'bg-amber-50/70 text-[#4A2E18] hover:bg-amber-100'
            }`}
          >
            All Categories ({products.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-[#E85A71] text-white shadow-xs'
                  : 'bg-[#FAF5EE] text-gray-700 hover:text-[#4A2E18] hover:bg-amber-100/60'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Mobile Filter Drawer (Expandable) */}
        {showMobileFilters && (
          <div className="md:hidden pt-3 border-t border-gray-100 space-y-3">
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Max Price: ₹{maxPrice}
              </label>
              <input
                type="range"
                min="50"
                max="2000"
                step="50"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#4A2E18]"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Sort by</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full text-xs p-2 bg-[#FAF5EE] border border-gray-200 rounded-xl"
              >
                <option value="bestseller">Popular / Bestsellers</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Customer Rated</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">
          Showing <span className="text-[#4A2E18] font-black">{filteredProducts.length}</span> delicious items
        </div>

        {(selectedCategory !== 'all' || searchQuery || selectedDietary !== 'all') && (
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
              setSelectedDietary('all');
            }}
            className="text-xs font-bold text-[#E85A71] hover:underline flex items-center gap-1"
          >
            <X className="w-3.5 h-3.5" /> Clear Filters
          </button>
        )}
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-3xl h-72 border border-gray-100 animate-pulse"></div>
          ))}
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-3xl p-12 text-center border border-amber-100 max-w-lg mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full bg-amber-50 text-[#C68B59] flex items-center justify-center mx-auto text-2xl">
            🧁
          </div>
          <h3 className="text-lg font-bold text-[#4A2E18]">No Matching Treats Found</h3>
          <p className="text-xs text-gray-500">
            We couldn’t find any bakery items matching &ldquo;{searchQuery || selectedCategory}&rdquo;. Try another search term or explore our full Brodipet menu!
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
              setSelectedDietary('all');
            }}
            className="py-2.5 px-6 bg-[#4A2E18] text-white rounded-2xl text-xs font-bold hover:bg-[#2A170F] transition-colors"
          >
            Reset Filters & View All
          </button>
        </div>
      )}
    </div>
  );
}

export default function MenuPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs">Loading Cake Box Menu...</div>}>
      <MenuContent />
    </Suspense>
  );
}
