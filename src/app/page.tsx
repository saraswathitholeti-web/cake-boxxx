import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getProducts, getCategories, getCoupons, getReviews, getSettings } from '@/lib/db';
import ProductCard from '@/components/ProductCard';
import {
  Search,
  Sparkles,
  ArrowRight,
  Clock,
  ShieldCheck,
  Bike,
  Heart,
  Tag,
  Star,
  MapPin,
  HelpCircle,
  Cake,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [products, categories, coupons, reviews, settings] = await Promise.all([
    getProducts(),
    getCategories(),
    getCoupons(),
    getReviews(),
    getSettings(),
  ]);

  const bestsellers = products.filter((p) => p.isBestseller).slice(0, 8);
  const popularCakes = products.filter((p) => p.categoryId === 'cat-birthday-cakes' || p.categoryId === 'cat-fresh-cream-cakes').slice(0, 4);
  const chocolates = products.filter((p) => p.categoryId === 'cat-chocolates').slice(0, 4);
  const fastFood = products.filter((p) => p.categoryId === 'cat-pizza' || p.categoryId === 'cat-burgers').slice(0, 4);

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FAF5EE] via-[#FFFDF9] to-white pt-8 pb-14 border-b border-amber-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Hero Text */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/70 border border-amber-200 text-[#4A2E18] text-xs font-bold tracking-wide">
                <Sparkles className="w-4 h-4 text-[#E85A71]" />
                <span>Guntur’s Premier Bakery & Fast-Food Kitchen</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#4A2E18] tracking-tight leading-[1.15]">
                Your Favourite Treats,{' '}
                <span className="text-[#E85A71] relative inline-block">
                  Delivered Fresh!
                  <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 200 8" fill="none">
                    <path d="M1 5.5C40 2 120 2 199 5.5" stroke="#E85A71" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                </span>
              </h1>

              <p className="text-sm sm:text-base text-gray-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                From celebration cakes with custom messages to sizzling pizzas, crunchy burgers and artisan chocolates. Freshly baked at 4th Lane, Brodipet, Guntur.
              </p>

              {/* Prominent Search Bar */}
              <form action="/menu" method="GET" className="max-w-md mx-auto lg:mx-0">
                <div className="relative flex items-center bg-white rounded-2xl shadow-lg shadow-amber-900/5 border-2 border-amber-200/80 p-1.5 focus-within:border-[#4A2E18] transition-all">
                  <Search className="w-5 h-5 text-gray-400 ml-3 flex-shrink-0" />
                  <input
                    type="text"
                    name="search"
                    placeholder="Search cakes, burgers, chocolates, pastries..."
                    className="w-full text-xs sm:text-sm px-3 py-2 text-gray-800 placeholder-gray-400 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="py-2.5 px-5 bg-[#4A2E18] hover:bg-[#2A170F] text-white rounded-xl text-xs font-bold transition-colors flex-shrink-0 shadow-xs"
                  >
                    Search
                  </button>
                </div>
              </form>

              {/* Hero Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                <Link
                  href="/menu"
                  className="py-3 px-6 rounded-2xl bg-[#E85A71] hover:bg-[#D0455C] text-white font-bold text-xs sm:text-sm shadow-md shadow-[#E85A71]/25 transition-all flex items-center gap-2"
                >
                  <span>Order Now</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/menu"
                  className="py-3 px-6 rounded-2xl bg-white hover:bg-[#FAF5EE] text-[#4A2E18] font-bold text-xs sm:text-sm border border-amber-200 shadow-xs transition-all"
                >
                  Explore 50+ Menu Items
                </Link>

                <Link
                  href="/offers"
                  className="py-3 px-5 rounded-2xl bg-[#FAF5EE] hover:bg-amber-100/70 text-[#C68B59] font-bold text-xs sm:text-sm transition-all flex items-center gap-1.5"
                >
                  <Tag className="w-4 h-4" />
                  <span>View Offers</span>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-amber-100/80 max-w-lg mx-auto lg:mx-0 text-left">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 text-xs font-bold">
                    ✓
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-800">100% Eggless</div>
                    <div className="text-[10px] text-gray-500">Available on all cakes</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-amber-100 text-[#4A2E18] flex items-center justify-center flex-shrink-0 text-xs font-bold">
                    <Bike className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-800">~30 Mins</div>
                    <div className="text-[10px] text-gray-500">Fast Guntur Delivery</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-pink-100 text-[#E85A71] flex items-center justify-center flex-shrink-0 text-xs font-bold">
                    ★
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-800">4.9 Star Bakes</div>
                    <div className="text-[10px] text-gray-500">Over 500+ happy reviews</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Hero Visual Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Background decorative blob */}
                <div className="absolute -top-6 -left-6 w-72 h-72 bg-[#FDE8EC] rounded-full filter blur-3xl opacity-70"></div>
                <div className="absolute -bottom-6 -right-6 w-72 h-72 bg-amber-200/50 rounded-full filter blur-3xl opacity-60"></div>

                {/* Main featured image card */}
                <div className="relative bg-white p-3 rounded-3xl shadow-2xl border border-amber-100 overflow-hidden transform lg:rotate-1 hover:rotate-0 transition-transform duration-300">
                  <div className="relative h-72 sm:h-80 w-full rounded-2xl overflow-hidden">
                    <Image
                      src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&auto=format&fit=crop&q=80"
                      alt="Chocolate Truffle Cake - Cake Box Guntur"
                      fill
                      priority
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E85A71] text-white uppercase tracking-wider mb-1 inline-block">
                        Chef’s Masterpiece
                      </span>
                      <h3 className="text-xl font-black">Chocolate Truffle Cake</h3>
                      <p className="text-xs text-amber-200">Pure Belgian cocoa ganache • Custom message available</p>
                    </div>
                  </div>

                  {/* Floating Price Pill */}
                  <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-2xl shadow-lg border border-amber-100 flex items-center gap-1.5">
                    <span className="text-xs text-gray-500 font-medium">From</span>
                    <span className="text-sm font-black text-[#4A2E18]">₹499</span>
                  </div>
                </div>

                {/* Floating mini card */}
                <div className="absolute -bottom-6 -left-4 sm:left-4 bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-xl border border-amber-100 flex items-center gap-3 animate-float">
                  <div className="w-12 h-12 rounded-xl overflow-hidden relative flex-shrink-0">
                    <Image
                      src="https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=300&auto=format&fit=crop&q=80"
                      alt="Pizza"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#4A2E18]">Hot Margherita Pizza</div>
                    <div className="text-[11px] text-[#E85A71] font-black">₹149 • 20 Mins</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid (12 Categories) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-2">
          <div>
            <span className="text-xs font-bold text-[#E85A71] uppercase tracking-widest flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Handcrafted with Love
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#4A2E18] tracking-tight">
              Explore Our Brodipet Menu
            </h2>
          </div>
          <Link
            href="/menu"
            className="text-xs font-bold text-[#4A2E18] hover:text-[#E85A71] flex items-center gap-1 transition-colors"
          >
            <span>View All 50 Items</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/menu?category=${cat.id}`}
              className="group bg-white rounded-3xl p-3 border border-amber-100 hover:border-[#4A2E18]/40 hover:shadow-xl transition-all flex flex-col items-center text-center"
            >
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden mb-2.5 bg-amber-50 group-hover:scale-105 transition-transform">
                <Image src={cat.imageUrl} alt={cat.name} fill className="object-cover" />
              </div>
              <h3 className="font-bold text-xs sm:text-sm text-[#4A2E18] group-hover:text-[#E85A71] transition-colors line-clamp-1">
                {cat.name}
              </h3>
              <p className="text-[10px] text-gray-400 mt-0.5">{cat.itemCount || '4+'} options</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Active Promotional Banners */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {coupons.map((coupon, idx) => (
            <div
              key={coupon.id}
              className={`p-5 rounded-3xl border flex items-center justify-between gap-4 relative overflow-hidden ${
                idx === 0
                  ? 'bg-gradient-to-br from-[#4A2E18] to-[#2A170F] text-white border-[#4A2E18]'
                  : idx === 1
                  ? 'bg-gradient-to-br from-[#FDE8EC] to-white border-pink-200 text-[#4A2E18]'
                  : 'bg-gradient-to-br from-[#FAF5EE] to-amber-50 border-amber-200 text-[#4A2E18]'
              }`}
            >
              <div>
                <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full inline-block mb-1.5 ${
                  idx === 0 ? 'bg-amber-400 text-[#2A170F]' : 'bg-[#E85A71] text-white'
                }`}>
                  {coupon.code}
                </span>
                <h4 className="font-black text-base">{coupon.description}</h4>
                <p className="text-[11px] opacity-80 mt-1">Min. order ₹{coupon.minOrderAmount}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <Link
                  href="/menu"
                  className={`text-xs font-bold py-2 px-3.5 rounded-xl transition-all shadow-xs inline-block ${
                    idx === 0
                      ? 'bg-amber-300 hover:bg-amber-200 text-[#2A170F]'
                      : 'bg-[#4A2E18] hover:bg-[#2A170F] text-white'
                  }`}
                >
                  Apply
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Best Sellers Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs font-bold text-[#E85A71] uppercase tracking-widest flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-[#E85A71]" /> Customer Favourites
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#4A2E18] tracking-tight">
              Best Sellers at Cake Box
            </h2>
          </div>
          <Link
            href="/menu"
            className="text-xs font-bold text-[#4A2E18] hover:text-[#E85A71] flex items-center gap-1 transition-colors"
          >
            <span>See Menu</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {bestsellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Popular Cakes Showcase Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-[#FAF5EE] rounded-3xl p-6 sm:p-8 border border-amber-200/80">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-2">
            <div>
              <span className="text-xs font-bold text-[#C68B59] uppercase tracking-widest flex items-center gap-1">
                <Cake className="w-4 h-4" /> Brodipet Cake Studio
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#4A2E18]">
                Popular Celebration Cakes
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Customize with your personal message on top, select 500g, 1kg or 2kg, and schedule your birthday delivery date!
              </p>
            </div>
            <Link
              href="/menu?category=cat-birthday-cakes"
              className="py-2 px-4 rounded-xl bg-[#4A2E18] text-white text-xs font-bold hover:bg-[#2A170F] transition-colors self-start md:self-auto"
            >
              View All Cakes
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {popularCakes.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Fast Food & Chocolates Collection */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Sizzling Pizza & Burgers */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#E85A71] uppercase tracking-widest">Sizzling & Crispy</span>
                <h3 className="text-xl font-black text-[#4A2E18]">Pizzas & Burgers</h3>
              </div>
              <Link href="/menu?category=cat-pizza" className="text-xs font-bold text-[#4A2E18] hover:underline">
                Explore More
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {fastFood.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>

          {/* Artisan Chocolates */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#C68B59] uppercase tracking-widest">Gift Hampers & Truffles</span>
                <h3 className="text-xl font-black text-[#4A2E18]">Handmade Chocolates</h3>
              </div>
              <Link href="/menu?category=cat-chocolates" className="text-xs font-bold text-[#4A2E18] hover:underline">
                Explore More
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {chocolates.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Cake Box Section */}
      <section className="bg-gradient-to-b from-white to-[#FAF5EE] py-12 border-y border-amber-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold text-[#E85A71] uppercase tracking-widest">The Brodipet Promise</span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#4A2E18] mt-1">
              Why Guntur Loves Cake Box
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-2">
              We believe every celebration in Guntur deserves mouth-watering taste, pure ingredients, and lightning-fast delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-amber-100 shadow-xs text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-sm text-[#4A2E18]">100% Eggless Pure Veg</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                All celebration cakes and pastries can be prepared 100% eggless with certified pure dairy ingredients.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-amber-100 shadow-xs text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-[#4A2E18] flex items-center justify-center mx-auto">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-sm text-[#4A2E18]">Fresh Brodipet Kitchen</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                No refrigerated leftover sponge. Cakes are baked fresh to order beside ICICI Bank, Brodipet 4th Lane.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-amber-100 shadow-xs text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-pink-100 text-[#E85A71] flex items-center justify-center mx-auto">
                <Bike className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-sm text-[#4A2E18]">30–45 Mins Express Delivery</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Carefully packaged in insulated cake boxes with live driver GPS tracking right to your doorstep.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-amber-100 shadow-xs text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mx-auto">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-sm text-[#4A2E18]">Personalized Cake Messages</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Write names, birthday wishes, and choose accessories like golden toppers and sparkling candles.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-bold text-[#E85A71] uppercase tracking-widest">Guntur Foodie Reviews</span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#4A2E18] mt-1">
            Sweet Words From Our Regulars
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white p-6 rounded-3xl border border-amber-100 shadow-xs flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-1 text-amber-500">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-xs text-gray-700 italic leading-relaxed">
                  &ldquo;{rev.comment}&rdquo;
                </p>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <div className="font-bold text-xs text-[#4A2E18]">{rev.userName}</div>
                  <div className="text-[10px] text-gray-400">Ordered: {rev.productName}</div>
                </div>
                {rev.isVerifiedPurchase && (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                    Verified Order
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQs Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <span className="text-xs font-bold text-[#C68B59] uppercase tracking-widest flex items-center justify-center gap-1">
            <HelpCircle className="w-4 h-4" /> Got Questions?
          </span>
          <h2 className="text-2xl font-black text-[#4A2E18] mt-1">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {[
            {
              q: 'What are the delivery areas covered by Cake Box in Guntur?',
              a: 'We deliver throughout Guntur city including Brodipet, Arundelpet, Lakshmipuram, Koretipadu, Pattabhipuram, Syamala Nagar, Vidya Nagar, Brindavan Gardens, Gujjanagundla, and surrounding areas within 12 km from our bakery.',
            },
            {
              q: 'Can I add a personalized birthday message on the cake?',
              a: 'Yes! While adding any cake to your cart, you can enter a personalized message (up to 30 characters), and our bakers will hand-pipe it onto the cake with fresh cream.',
            },
            {
              q: 'Can I schedule a cake delivery for a specific date or time?',
              a: 'Absolutely. During checkout, you can select "Scheduled Delivery" and pick your desired celebration date and delivery time slot.',
            },
            {
              q: 'What payment methods do you accept?',
              a: 'We accept UPI (Google Pay, PhonePe, Paytm, BHIM), Credit/Debit cards, Netbanking, and Cash on Delivery (COD).',
            },
          ].map((faq, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-4 border border-amber-100 shadow-xs">
              <h4 className="font-bold text-xs sm:text-sm text-[#4A2E18] mb-1.5">{faq.q}</h4>
              <p className="text-xs text-gray-600 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bakery Location & Contact Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-[#FAF5EE] rounded-3xl p-6 sm:p-10 border border-amber-200">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="text-xs font-bold text-[#E85A71] uppercase tracking-widest">Visit Our Kitchen</span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#4A2E18]">
                Cake Box Brodipet, Guntur
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Located in the heart of Brodipet, beside ICICI Bank. Walk in for hot pastries, puffs, and milkshakes, or order online for fast home delivery across Guntur!
              </p>

              <div className="space-y-2 pt-2 text-xs text-gray-700">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-[#E85A71] mt-0.5 flex-shrink-0" />
                  <span>{settings.address}, Brodipet, Guntur, AP 522002</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#E85A71] flex-shrink-0" />
                  <span>{settings.openingHours}</span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <a
                  href="tel:+918632234567"
                  className="py-2.5 px-5 bg-[#4A2E18] text-white rounded-xl text-xs font-bold hover:bg-[#2A170F] transition-colors"
                >
                  Call +91 863 223 4567
                </a>
                <Link
                  href="/menu"
                  className="py-2.5 px-5 bg-white text-[#4A2E18] border border-amber-200 rounded-xl text-xs font-bold hover:bg-amber-50 transition-colors"
                >
                  Order Online
                </Link>
              </div>
            </div>

            {/* Interactive Map card */}
            <div className="bg-white rounded-2xl p-4 border border-amber-100 shadow-md">
              <div className="relative h-64 w-full rounded-xl overflow-hidden bg-amber-50">
                <iframe
                  title="Cake Box Brodipet Guntur Map"
                  src="https://maps.google.com/maps?q=16.3067,80.4365&z=15&output=embed"
                  className="w-full h-full border-0"
                  loading="lazy"
                ></iframe>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                <span className="font-semibold text-[#4A2E18]">Plus Code: 8C3J+F8, Guntur</span>
                <span className="text-emerald-600 font-bold">● Active Delivery Area</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
