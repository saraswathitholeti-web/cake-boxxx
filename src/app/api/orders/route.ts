import { NextResponse } from 'next/server';
import { getOrders, createOrder, getProductById, validateCoupon, getSettings } from '@/lib/db';
import { isWithinDeliveryRadius, calculateDeliveryFee, estimateDeliveryDuration } from '@/lib/geo';
import { OrderItem } from '@/types';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || undefined;
    const orders = await getOrders(userId);
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      userId = 'u-default',
      customerName,
      customerPhone,
      deliveryAddress,
      items,
      couponCode,
      paymentMethod = 'UPI',
      deliveryType = 'standard',
      scheduledDate,
      scheduledTime,
      deliveryInstructions,
      cookingInstructions,
    } = body;

    if (!customerName || !customerPhone || !deliveryAddress || !items || !items.length) {
      return NextResponse.json({ error: 'Missing required order details' }, { status: 400 });
    }

    const settings = await getSettings();

    // 1. Verify delivery address radius
    if (deliveryAddress.latitude && deliveryAddress.longitude) {
      const geoCheck = isWithinDeliveryRadius(
        deliveryAddress.latitude,
        deliveryAddress.longitude,
        settings.deliveryRadiusKm
      );
      if (!geoCheck.allowed) {
        return NextResponse.json(
          {
            error: `Sorry, this address is ${geoCheck.distanceKm} km away. Cake Box only delivers within ${settings.deliveryRadiusKm} km of our Brodipet bakery.`,
          },
          { status: 400 }
        );
      }
    }

    // 2. Revalidate items and prices from DB
    let revalidatedSubtotal = 0;
    const verifiedItems: OrderItem[] = [];

    for (const item of items) {
      const product = await getProductById(item.productId);
      if (!product || !product.isAvailable) {
        return NextResponse.json(
          { error: `Item "${item.productName || 'Unknown'}" is currently out of stock or unavailable.` },
          { status: 400 }
        );
      }

      // Check variant price or base price
      let unitPrice = product.basePrice;
      let variantName: string | undefined;

      if (item.variant) {
        const matchingVariant = product.variants?.find((v) => v.id === item.variant.id || v.name === item.variant.name);
        if (matchingVariant) {
          unitPrice = matchingVariant.price;
          variantName = matchingVariant.name;
        }
      }

      // Add addon prices
      let addonsTotal = 0;
      const addonNames: string[] = [];
      if (item.selectedAddons && item.selectedAddons.length > 0) {
        for (const addon of item.selectedAddons) {
          const matchingAddon = product.addons?.find((a) => a.id === addon.id || a.name === addon.name);
          if (matchingAddon) {
            addonsTotal += matchingAddon.price;
            addonNames.push(matchingAddon.name);
          }
        }
      }

      const verifiedUnitPrice = unitPrice + addonsTotal;
      const quantity = Math.max(1, parseInt(item.quantity, 10) || 1);
      const lineTotal = verifiedUnitPrice * quantity;

      revalidatedSubtotal += lineTotal;

      verifiedItems.push({
        id: `oi-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        productId: product.id,
        productName: product.name,
        productImage: product.imageUrl,
        dietaryType: product.dietaryType,
        quantity,
        unitPrice: verifiedUnitPrice,
        lineTotal,
        selectedVariant: variantName,
        selectedAddons: addonNames.length > 0 ? addonNames : undefined,
        cakeMessage: item.cakeMessage || undefined,
      });
    }

    // Check minimum order value
    if (revalidatedSubtotal < settings.minimumOrderValue) {
      return NextResponse.json(
        { error: `Minimum order value at Cake Box is ₹${settings.minimumOrderValue}` },
        { status: 400 }
      );
    }

    // 3. Revalidate Coupon
    let discount = 0;
    let appliedCouponCode: string | undefined;

    if (couponCode) {
      const couponResult = await validateCoupon(couponCode, revalidatedSubtotal);
      if (couponResult.valid) {
        discount = couponResult.discount;
        appliedCouponCode = couponCode.toUpperCase();
      }
    }

    // 4. Calculate Delivery Fee
    const distanceKm = deliveryAddress.latitude && deliveryAddress.longitude
      ? isWithinDeliveryRadius(deliveryAddress.latitude, deliveryAddress.longitude).distanceKm
      : 2.5;

    const deliveryFee = calculateDeliveryFee(
      distanceKm,
      revalidatedSubtotal,
      settings.baseDeliveryFee,
      settings.freeDeliveryThreshold
    );

    const packagingFee = settings.packagingCharge;
    const taxableAmount = Math.max(0, revalidatedSubtotal - discount);
    const tax = Math.round((taxableAmount * settings.taxRatePercent) / 100);
    const totalAmount = taxableAmount + deliveryFee + packagingFee + tax;

    const estimatedDeliveryMins = estimateDeliveryDuration(distanceKm, settings.estimatedPrepTimeMins);

    // Initial order status and payment status
    const isCod = paymentMethod === 'COD';
    const orderStatus = isCod ? 'Order Placed' : 'Order Confirmed';
    const paymentStatus = isCod ? 'Awaiting Collection' : 'Paid';

    const newOrder = await createOrder({
      userId,
      customerName,
      customerPhone,
      deliveryAddress,
      items: verifiedItems,
      subtotal: revalidatedSubtotal,
      discount,
      couponCode: appliedCouponCode,
      deliveryFee,
      packagingFee,
      tax,
      totalAmount,
      orderStatus,
      paymentMethod,
      paymentStatus,
      deliveryType,
      scheduledDate,
      scheduledTime,
      deliveryInstructions,
      cookingInstructions,
      estimatedDeliveryMins,
      driverLocation: { lat: 16.3067, lng: 80.4365 }, // Starts at Cake Box Brodipet
    });

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
