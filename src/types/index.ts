export type DietaryType = 'veg' | 'non-veg' | 'eggless';

export interface ProductVariant {
  id: string;
  name: string; // e.g. "500 g", "1 kg", "2 kg" or "Regular 7\"", "Medium 9\""
  price: number;
  isDefault?: boolean;
}

export interface ProductAddon {
  id: string;
  name: string;
  price: number;
}

export interface Product {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  imageUrl: string;
  basePrice: number;
  dietaryType: DietaryType;
  isAvailable: boolean;
  isBestseller?: boolean;
  isFeatured?: boolean;
  rating: number;
  reviewCount: number;
  preparationTimeMins: number;
  variants?: ProductVariant[];
  addons?: ProductAddon[];
  allowsCakeMessage?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  iconName?: string;
  itemCount?: number;
}

export interface Address {
  id: string;
  userId?: string;
  recipientName: string;
  recipientPhone: string;
  houseFlat: string;
  street: string;
  locality: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  addressType: 'Home' | 'Work' | 'Other';
  latitude: number;
  longitude: number;
  isDefault?: boolean;
}

export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  dietaryType: DietaryType;
  variant?: ProductVariant;
  selectedAddons?: ProductAddon[];
  cakeMessage?: string;
  specialInstructions?: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}

export type OrderStatus =
  | 'Order Placed'
  | 'Order Confirmed'
  | 'Preparing Your Order'
  | 'Ready for Pickup'
  | 'Delivery Partner Assigned'
  | 'Picked Up'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancellation Requested'
  | 'Cancelled'
  | 'Payment Failed'
  | 'Refund Initiated'
  | 'Refunded';

export type PaymentMethod = 'UPI' | 'Card' | 'Netbanking' | 'COD';
export type PaymentStatus = 'Pending' | 'Paid' | 'Failed' | 'Awaiting Collection' | 'Refunded';

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  dietaryType: DietaryType;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  selectedVariant?: string;
  selectedAddons?: string[];
  cakeMessage?: string;
}

export interface DeliveryPartner {
  id: string;
  name: string;
  phone: string;
  vehicle: string;
  currentLat: number;
  currentLng: number;
  rating: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: Address;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  deliveryFee: number;
  packagingFee: number;
  tax: number;
  totalAmount: number;
  orderStatus: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  deliveryType: 'standard' | 'scheduled' | 'express';
  scheduledDate?: string;
  scheduledTime?: string;
  deliveryInstructions?: string;
  cookingInstructions?: string;
  estimatedDeliveryMins: number;
  deliveryPartner?: DeliveryPartner;
  driverLocation?: { lat: number; lng: number };
  createdAt: string;
  updatedAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount: number;
  maxDiscount?: number;
  validUntil: string;
  isActive: boolean;
  usageCount: number;
}

export interface Review {
  id: string;
  productId: string;
  productName: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  isVerifiedPurchase: boolean;
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  userId: string;
  userName: string;
  userPhone: string;
  orderId?: string;
  category: 'Order Status' | 'Payment & Refund' | 'Food Quality' | 'Late Delivery' | 'Custom Cake' | 'Other';
  description: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Open' | 'In Progress' | 'Waiting for Customer' | 'Resolved' | 'Closed';
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BusinessSettings {
  restaurantName: string;
  tagline: string;
  address: string;
  locality: string;
  city: string;
  state: string;
  pincode: string;
  plusCode: string;
  latitude: number;
  longitude: number;
  contactPhone: string;
  contactEmail: string;
  isOpen: boolean;
  openingHours: string;
  deliveryRadiusKm: number;
  baseDeliveryFee: number;
  freeDeliveryThreshold: number;
  packagingCharge: number;
  minimumOrderValue: number;
  estimatedPrepTimeMins: number;
  taxRatePercent: number;
  announcementBanner: string;
}
