'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import ProductCustomizerModal from '@/components/ProductCustomizerModal';
import { Star, Plus, Check, Heart, SlidersHorizontal } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, items } = useCart();
  const { isFavorite, toggleFavorite } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const isConfigurable = (product.variants && product.variants.length > 1) || product.allowsCakeMessage || (product.addons && product.addons.length > 0);
  const isFav = isFavorite(product.id);

  // Check how many of this product are in cart
  const inCartQty = items
    .filter((item) => item.productId === product.id)
    .reduce((sum, item) => sum + item.quantity, 0);

  const handleQuickAdd = () => {
    if (isConfigurable) {
      setIsModalOpen(true);
      return;
    }

    addToCart({
      productId: product.id,
      productName: product.name,
      productImage: product.imageUrl,
      dietaryType: product.dietaryType,
      unitPrice: product.basePrice,
      quantity: 1,
    });

    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 800);
  };

  return (
    <>
      <div className="bg-white rounded-3xl border border-amber-100/90 overflow-hidden shadow-xs hover:shadow-xl hover:border-amber-200 transition-all flex flex-col group">
        {/* Product Image */}
        <div
          onClick={() => setIsModalOpen(true)}
          className="relative h-44 sm:h-48 w-full bg-amber-50 cursor-pointer overflow-hidden"
        >
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
            {product.isBestseller && (
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#E85A71] text-white shadow-xs">
                BESTSELLER
              </span>
            )}
            {product.dietaryType === 'eggless' ? (
              <span className="eggless-badge shadow-xs">🌱 Eggless</span>
            ) : product.dietaryType === 'veg' ? (
              <span className="veg-badge shadow-xs"><span className="veg-badge-dot"></span></span>
            ) : (
              <span className="non-veg-badge shadow-xs"><span className="non-veg-badge-dot"></span></span>
            )}
          </div>

          {/* Wishlist Heart */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(product.id);
            }}
            className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
              isFav
                ? 'bg-red-50 text-red-500 shadow-md'
                : 'bg-white/80 text-gray-400 hover:text-red-500 hover:bg-white shadow-xs'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
          </button>

          {/* Quick Customization overlay tag */}
          {isConfigurable && (
            <div className="absolute bottom-2.5 right-2.5 bg-black/60 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
              <SlidersHorizontal className="w-2.5 h-2.5" /> Customizable
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between gap-1 mb-1">
              <h3
                onClick={() => setIsModalOpen(true)}
                className="font-bold text-sm text-[#4A2E18] hover:text-[#E85A71] transition-colors cursor-pointer line-clamp-1"
              >
                {product.name}
              </h3>
              <div className="flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-md flex-shrink-0">
                <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                <span>{product.rating}</span>
              </div>
            </div>

            <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Price & Action Button */}
          <div className="pt-2 border-t border-amber-50 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-gray-400 block font-medium">Starting from</span>
              <span className="text-base font-black text-[#4A2E18]">
                ₹{product.basePrice}
              </span>
            </div>

            {isConfigurable ? (
              <button
                onClick={() => setIsModalOpen(true)}
                className="py-1.5 px-3.5 bg-amber-50 hover:bg-[#FAF5EE] border border-[#4A2E18]/30 hover:border-[#4A2E18] text-[#4A2E18] rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 group-hover:shadow-xs"
              >
                <span>Add</span>
                <span className="text-[10px] text-gray-400 font-normal">+</span>
              </button>
            ) : (
              <button
                onClick={handleQuickAdd}
                className="py-1.5 px-3.5 bg-[#4A2E18] hover:bg-[#2A170F] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1"
              >
                {justAdded ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-300" /> Added
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5 text-amber-200" /> Add
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Modal for detailed customization */}
      <ProductCustomizerModal
        product={product}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
