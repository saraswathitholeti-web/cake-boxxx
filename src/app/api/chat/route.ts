import { NextResponse } from 'next/server';
import { getProducts, getOrderById, getSettings, getCoupons } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { message, orderId } = await request.json();
    const query = (message || '').trim().toLowerCase();

    const [products, settings, coupons] = await Promise.all([
      getProducts(),
      getSettings(),
      getCoupons(),
    ]);

    // 1. Order status lookup
    const orderMatch = query.match(/cb-\d{4}/i) || (orderId ? [orderId] : null);
    if (
      orderMatch ||
      query.includes('where is my order') ||
      query.includes('track order') ||
      query.includes('status of my order')
    ) {
      if (orderMatch) {
        const orderNum = orderMatch[0].toUpperCase();
        const order = await getOrderById(orderNum);
        if (order) {
          const itemsSummary = order.items.map((i) => `${i.quantity}x ${i.productName}`).join(', ');
          return NextResponse.json({
            reply: `📦 **Order Found: ${order.orderNumber}**\n\n• **Status:** ${order.orderStatus}\n• **Items:** ${itemsSummary}\n• **Total:** ₹${order.totalAmount} (${order.paymentStatus})\n• **Destination:** ${order.deliveryAddress.locality}, ${order.deliveryAddress.city}\n• **Est. Delivery:** ~${order.estimatedDeliveryMins} mins\n\n${
              order.deliveryPartner
                ? `🛵 **Delivery Partner:** ${order.deliveryPartner.name} (${order.deliveryPartner.vehicle})`
                : '👨‍🍳 Our Brodipet kitchen is freshly preparing your treats!'
            }`,
            action: { type: 'view_order', orderNumber: order.orderNumber },
          });
        } else {
          return NextResponse.json({
            reply: `I searched our records for **${orderNum}**, but couldn't find an order with that number. Please verify the order number (e.g. CB-8821) or check your **My Orders** page.`,
          });
        }
      } else {
        return NextResponse.json({
          reply: `I can help track your order! Please enter your **Order Number** (e.g. **CB-8821**) or click your active order on your dashboard.`,
        });
      }
    }

    // 2. Cancellation and refund policy
    if (query.includes('cancel') || query.includes('refund')) {
      return NextResponse.json({
        reply: `🎂 **Cake Box Cancellation & Refund Policy:**\n\n• Orders can be cancelled free of charge if the kitchen has not yet started preparation (within ~5 minutes of placing the order).\n• Once baking or preparation begins, personalized cakes cannot be cancelled.\n• In case of payment failure with debit or damaged items, refunds are processed back to your original payment method within 3–5 business days.\n• Need instant assistance? You can submit a ticket on our **Customer Support** page or call our Brodipet branch at ${settings.contactPhone}.`,
      });
    }

    // 3. Opening hours & location
    if (
      query.includes('timing') ||
      query.includes('hours') ||
      query.includes('open') ||
      query.includes('close') ||
      query.includes('location') ||
      query.includes('address') ||
      query.includes('where is cake box')
    ) {
      return NextResponse.json({
        reply: `📍 **Cake Box Guntur Store Details:**\n\n• **Address:** ${settings.address}, Brodipet, Guntur, AP 522002 (Plus Code: ${settings.plusCode})\n• **Store Status:** ${settings.isOpen ? '🟢 Open Now' : '🔴 Currently Closed'}\n• **Operating Hours:** ${settings.openingHours}\n• **Delivery Radius:** Up to ${settings.deliveryRadiusKm} km across Guntur (Arundelpet, Lakshmipuram, Koretipadu, Pattabhipuram, etc.)\n• **Phone:** ${settings.contactPhone}`,
      });
    }

    // 4. Coupons & offers
    if (query.includes('coupon') || query.includes('offer') || query.includes('discount') || query.includes('promo')) {
      const activeCoupons = coupons.filter((c) => c.isActive);
      const couponList = activeCoupons
        .map(
          (c) =>
            `• **${c.code}**: ${c.description} (Min. order: ₹${c.minOrderAmount})`
        )
        .join('\n');
      return NextResponse.json({
        reply: `🎉 **Current Cake Box Offers & Promo Codes:**\n\n${couponList}\n\n*Apply these codes in your cart during checkout to claim your instant bakery discount!*`,
      });
    }

    // 5. Eggless cakes & dietary options
    if (query.includes('eggless') || query.includes('pure veg') || query.includes('egg')) {
      const egglessCakes = products.filter((p) => p.dietaryType === 'eggless');
      const sampleNames = egglessCakes.slice(0, 4).map((c) => `• **${c.name}** (from ₹${c.basePrice})`).join('\n');
      return NextResponse.json({
        reply: `🌱 **Yes! All our premium celebration cakes are 100% Eggless** by default!\n\nPopular eggless bakes include:\n${sampleNames}\n\nYou can also add custom cake messages and choose 500g, 1kg, or 2kg sizes on the product page.`,
      });
    }

    // 6. Delivery area / fees
    if (query.includes('deliver') || query.includes('area') || query.includes('radius') || query.includes('pincode')) {
      return NextResponse.json({
        reply: `🛵 **Delivery Information in Guntur:**\n\n• **Base Fee:** ₹${settings.baseDeliveryFee} (FREE for orders above ₹${settings.freeDeliveryThreshold})\n• **Coverage:** Brodipet, Arundelpet, Lakshmipuram, Koretipadu, Pattabhipuram, Syamala Nagar, Vidya Nagar, Brindavan Gardens, Gujjanagundla, and surrounding localities up to ${settings.deliveryRadiusKm} km.\n• **Average Time:** 30–45 minutes from our Brodipet bakery.`,
      });
    }

    // 7. Product recommendations
    if (
      query.includes('cake') ||
      query.includes('pizza') ||
      query.includes('burger') ||
      query.includes('chocolate') ||
      query.includes('pastry') ||
      query.includes('puff') ||
      query.includes('recommend')
    ) {
      const matching = products
        .filter(
          (p) =>
            query.includes(p.name.toLowerCase()) ||
            query.includes(p.categoryId.toLowerCase()) ||
            p.description.toLowerCase().includes(query)
        )
        .slice(0, 3);

      const itemsToShow = matching.length > 0 ? matching : products.filter((p) => p.isBestseller).slice(0, 3);
      const list = itemsToShow
        .map((p) => `• **${p.name}** — ₹${p.basePrice} (${p.dietaryType.toUpperCase()}, ★ ${p.rating})`)
        .join('\n');

      return NextResponse.json({
        reply: `🍰 Here are our top recommendations freshly baked at Cake Box:\n\n${list}\n\nWould you like me to help you add any of these to your cart?`,
      });
    }

    // Default friendly assistant reply
    return NextResponse.json({
      reply: `Hello! I'm your **Cake Box Assistant** from our Brodipet bakery! 🍰✨\n\nI can help you with:\n• **Track your order** (Send your order number like *CB-8821*)\n• **Menu & Cake Recommendations** (Birthday cakes, eggless options, pizzas, burgers)\n• **Today's Promo Codes** (e.g. WELCOME10, SWEET50)\n• **Delivery zones in Guntur** & delivery fees\n• **Store timings & Brodipet location**\n\nHow may I delight you today?`,
    });
  } catch (error) {
    console.error('Chatbot error:', error);
    return NextResponse.json({
      reply: "I'm having a slight moment connecting to our Brodipet kitchen system. Please reach us at +91 863 223 4567 or submit a ticket on our Customer Care page!",
    });
  }
}
