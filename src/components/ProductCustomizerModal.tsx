'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Product, ProductVariant, ProductAddon } from '@/types';
import { useCart } from '@/context/CartContext';
import { X, Check, Plus, Minus, Sparkles, Heart } from 'lucide-react';

interface ProductCustomizerModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductCustomizerModal({
  product,
  isOpen,
  onClose,
}: ProductCustomizerModalProps) {
  const { addToCart } = useCart();

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    product?.variants?.find((v) => v.isDefault) || product?.variants?.[0]
  );
  const [selectedAddons, setSelectedAddons] = useState<ProductAddon[]>([]);
  const [cakeMessage, setCakeMessage] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addedToast, setAddedToast] = useState(false);

  // Sync state whenever product opens
  React.useEffect(() => {
    if (product) {
      setSelectedVariant(product.variants?.find((v) => v.isDefault) || product.variants?.[0]);
      setSelectedAddons([]);
      setCakeMessage('');
      setSpecialInstructions('');
      setQuantity(1);
      setAddedToast(false);
    }
  }, [product]);

  if (!isOpen || !product) return null;

  // Calculate unit price based on selected variant and addons
  const baseVariantPrice = selectedVariant ? selectedVariant.price : product.basePrice;
  const addonsTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);
  const unitPrice = baseVariantPrice + addonsTotal;
  const totalPrice = unitPrice * quantity;

  const toggleAddon = (addon: ProductAddon) => {
    if (selectedAddons.some((a) => a.id === addon.id)) {
      setSelectedAddons(selectedAddons.filter((a) => a.id !== addon.id));
    } else {
      setSelectedAddons([...selectedAddons, addon]);
    }
  };

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      productName: product.name,
      productImage: product.imageUrl,
      dietaryType: product.dietaryType,
      variant: selectedVariant,
      selectedAddons: selectedAddons.length > 0 ? selectedAddons : undefined,
      cakeMessage: cakeMessage.trim() ? cakeMessage.trim() : undefined,
      specialInstructions: specialInstructions.trim() ? specialInstructions.trim() : undefined,
      unitPrice,
      quantity,
    });

    setAddedToast(true);
    setTimeout(() => {
      setAddedToast(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-amber-100 animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="relative h-48 sm:h-56 w-full bg-amber-50 flex-shrink-0">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 text-gray-800 flex items-center justify-center hover:bg-white transition-all shadow-md"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="flex items-center gap-2 mb-1">
              {product.dietaryType === 'eggless' ? (
                <span className="eggless-badge">🌱 100% Eggless</span>
              ) : product.dietaryType === 'veg' ? (
                <span className="veg-badge"><span className="veg-badge-dot"></span></span>
              ) : (
                <span className="non-veg-badge"><span className="non-veg-badge-dot"></span></span>
              )}
              {product.isBestseller && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E85A71] text-white">
                  Bestseller
                </span>
              )}
              <span className="text-xs text-amber-200 font-semibold ml-auto flex items-center gap-1">
                ★ {product.rating} ({product.reviewCount})
              </span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white drop-shadow-sm">
              {product.name}
            </h2>
          </div>
        </div>

        {/* Customization Options Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          <p className="text-xs text-gray-600 leading-relaxed">
            {product.description}
          </p>

          {/* Variants (Weight or Size) */}
          {product.variants && product.variants.length > 0 && (
            <div>
              <div className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2">
                Choose Size / Weight
              </div>
              <div className="grid grid-cols-3 gap-2.5">
                {product.variants.map((v) => {
                  const isSelected = selectedVariant?.id === v.id;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setSelectedVariant(v)}
                      className={`p-3 rounded-2xl border text-center transition-all ${
                        isSelected
                          ? 'border-[#4A2E18] bg-[#FAF5EE] text-[#4A2E18] ring-2 ring-[#4A2E18]/20 shadow-xs'
                          : 'border-gray-200 hover:border-amber-300 text-gray-700 bg-white'
                      }`}
                    >
                      <div className="text-xs font-bold">{v.name}</div>
                      <div className="text-xs font-semibold text-[#E85A71] mt-1">₹{v.price}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Cake Message Input */}
          {product.allowsCakeMessage && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Message on Cake
                </label>
                <span className="text-[10px] text-gray-400">Max 30 characters</span>
              </div>
              <input
                type="text"
                maxLength={30}
                value={cakeMessage}
                onChange={(e) => setCakeMessage(e.target.value)}
                placeholder="e.g. Happy Birthday Rohit!"
                className="w-full text-xs p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#4A2E18] bg-amber-50/30"
              />
            </div>
          )}

          {/* Add-ons */}
          {product.addons && product.addons.length > 0 && (
            <div>
              <div className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2">
                Celebration Add-ons
              </div>
              <div className="space-y-2">
                {product.addons.map((addon) => {
                  const isChecked = selectedAddons.some((a) => a.id === addon.id);
                  return (
                    <div
                      key={addon.id}
                      onClick={() => toggleAddon(addon)}
                      className={`flex items-center justify-between p-2.5 rounded-xl border text-xs cursor-pointer transition-colors ${
                        isChecked
                          ? 'border-[#4A2E18] bg-amber-50/50'
                          : 'border-gray-200 hover:border-amber-200 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                            isChecked
                              ? 'bg-[#4A2E18] border-[#4A2E18] text-white'
                              : 'border-gray-300 bg-white'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span className="font-medium text-gray-800">{addon.name}</span>
                      </div>
                      <span className="font-bold text-[#E85A71]">+₹{addon.price}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Cooking / Packaging instructions */}
          <div>
            <label className="text-xs font-bold text-gray-800 uppercase tracking-wider block mb-1.5">
              Special Instructions
            </label>
            <input
              type="text"
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="e.g. Please pack extra tissue paper and cutlery"
              className="w-full text-xs p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#4A2E18]"
            />
          </div>
        </div>

        {/* Modal Footer with Price & Add to Cart */}
        <div className="p-4 border-t border-gray-100 bg-[#FAF5EE]/70 flex items-center justify-between gap-4">
          <div className="flex items-center border border-gray-300 rounded-xl bg-white overflow-hidden shadow-xs">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-2.5 text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="px-3.5 text-xs font-bold text-[#4A2E18]">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="p-2.5 text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={handleAddToCart}
            className="flex-1 py-3 px-6 bg-[#4A2E18] hover:bg-[#2A170F] text-white rounded-2xl text-xs font-bold shadow-lg shadow-[#4A2E18]/25 flex items-center justify-between transition-all"
          >
            <span>{addedToast ? 'Added to Cart! ✓' : 'Add to Cart'}</span>
            <span className="text-amber-200 font-black">₹{totalPrice}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
