import fs from 'fs';
import path from 'path';
import {
  Product,
  Category,
  Order,
  Coupon,
  Review,
  SupportTicket,
  BusinessSettings,
  Address,
  OrderStatus,
} from '@/types';
import {
  initialProducts,
  initialCategories,
  initialCoupons,
  initialBusinessSettings,
  initialReviews,
} from '@/data/seedData';

interface DatabaseSchema {
  products: Product[];
  categories: Category[];
  orders: Order[];
  coupons: Coupon[];
  reviews: Review[];
  tickets: SupportTicket[];
  settings: BusinessSettings;
  addresses: Address[];
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'cakebox_db.json');

const initialOrders: Order[] = [
  {
    id: 'ord-1001',
    orderNumber: 'CB-8821',
    userId: 'u-default',
    customerName: 'Priya Sharma',
    customerPhone: '9848022334',
    deliveryAddress: {
      id: 'addr-sample',
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
    },
    items: [
      {
        id: 'oi-1',
        productId: 'cake-1',
        productName: 'Chocolate Truffle Cake',
        productImage: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80',
        dietaryType: 'eggless',
        quantity: 1,
        unitPrice: 499,
        lineTotal: 499,
        selectedVariant: '500 g',
        cakeMessage: 'Happy 10th Birthday Ananya!',
      },
      {
        id: 'oi-2',
        productId: 'pastry-14',
        productName: 'Chocolate Lava Cake',
        productImage: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=600&auto=format&fit=crop&q=80',
        dietaryType: 'eggless',
        quantity: 2,
        unitPrice: 120,
        lineTotal: 240,
      },
    ],
    subtotal: 739,
    discount: 50,
    couponCode: 'SWEET50',
    deliveryFee: 0,
    packagingFee: 20,
    tax: 35,
    totalAmount: 744,
    orderStatus: 'Out for Delivery',
    paymentMethod: 'UPI',
    paymentStatus: 'Paid',
    deliveryType: 'standard',
    estimatedDeliveryMins: 15,
    deliveryPartner: {
      id: 'dp-1',
      name: 'Ramesh Naidu',
      phone: '+91 94401 56789',
      vehicle: 'Hero Splendor (AP 07 BK 4521)',
      currentLat: 16.3045,
      currentLng: 80.4382,
      rating: 4.9,
    },
    driverLocation: {
      lat: 16.3045,
      lng: 80.4382,
    },
    createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
];

const initialTickets: SupportTicket[] = [
  {
    id: 't-1',
    ticketNumber: 'TKT-4401',
    userId: 'u-default',
    userName: 'Priya Sharma',
    userPhone: '9848022334',
    orderId: 'CB-8821',
    category: 'Order Status',
    description: 'Could you please ensure extra paper plates and wooden spoons are packed with the birthday cake?',
    priority: 'Medium',
    status: 'In Progress',
    adminNotes: 'Notified kitchen packing team in Brodipet to include wooden cutlery set.',
    createdAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
  },
];

function ensureDataFile(): DatabaseSchema {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    const initialData: DatabaseSchema = {
      products: initialProducts,
      categories: initialCategories,
      orders: initialOrders,
      coupons: initialCoupons,
      reviews: initialReviews,
      tickets: initialTickets,
      settings: initialBusinessSettings,
      addresses: [
        {
          id: 'addr-1',
          userId: 'u-default',
          recipientName: 'Kalyan Chakravarthy',
          recipientPhone: '9848022334',
          houseFlat: 'Flat 401, Sri Krishna Enclave',
          street: '4th Lane, Brodipet (Opp. ICICI Bank)',
          locality: 'Brodipet',
          landmark: 'Beside ICICI Bank',
          city: 'Guntur',
          state: 'Andhra Pradesh',
          pincode: '522002',
          addressType: 'Home',
          latitude: 16.3065,
          longitude: 80.4368,
          isDefault: true,
        },
      ],
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
    return initialData;
  }

  try {
    const content = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    console.error('Failed reading DB file, recreating default:', err);
    const initialData: DatabaseSchema = {
      products: initialProducts,
      categories: initialCategories,
      orders: initialOrders,
      coupons: initialCoupons,
      reviews: initialReviews,
      tickets: initialTickets,
      settings: initialBusinessSettings,
      addresses: [],
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
    return initialData;
  }
}

function saveDatabase(data: DatabaseSchema): void {
  ensureDataFile();
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// ---------------- PRODUCTS ----------------
export async function getProducts(): Promise<Product[]> {
  const db = ensureDataFile();
  return db.products;
}

export async function getProductById(id: string): Promise<Product | null> {
  const db = ensureDataFile();
  return db.products.find((p) => p.id === id) || null;
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
  const db = ensureDataFile();
  const index = db.products.findIndex((p) => p.id === id);
  if (index === -1) return null;
  db.products[index] = { ...db.products[index], ...updates };
  saveDatabase(db);
  return db.products[index];
}

export async function createProduct(product: Omit<Product, 'id'> & { id?: string }): Promise<Product> {
  const db = ensureDataFile();
  const newProduct: Product = {
    ...product,
    id: product.id || `prod-${Date.now()}`,
    rating: product.rating ?? 4.8,
    reviewCount: product.reviewCount ?? 1,
    preparationTimeMins: product.preparationTimeMins ?? 20,
    isAvailable: product.isAvailable ?? true,
  };
  db.products.push(newProduct);
  saveDatabase(db);
  return newProduct;
}

export async function deleteProduct(id: string): Promise<boolean> {
  const db = ensureDataFile();
  const index = db.products.findIndex((p) => p.id === id);
  if (index === -1) return false;
  db.products.splice(index, 1);
  saveDatabase(db);
  return true;
}

// ---------------- CATEGORIES ----------------
export async function getCategories(): Promise<Category[]> {
  const db = ensureDataFile();
  return db.categories;
}

// ---------------- ORDERS ----------------
export async function getOrders(userId?: string): Promise<Order[]> {
  const db = ensureDataFile();
  if (userId) {
    return db.orders.filter((o) => o.userId === userId);
  }
  return db.orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getOrderById(idOrNumber: string): Promise<Order | null> {
  const db = ensureDataFile();
  return (
    db.orders.find((o) => o.id === idOrNumber || o.orderNumber.toLowerCase() === idOrNumber.toLowerCase()) ||
    null
  );
}

export async function createOrder(orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>): Promise<Order> {
  const db = ensureDataFile();
  const orderNumber = `CB-${Math.floor(1000 + Math.random() * 9000)}`;
  const now = new Date().toISOString();
  const newOrder: Order = {
    ...orderData,
    id: `ord-${Date.now()}`,
    orderNumber,
    createdAt: now,
    updatedAt: now,
  };
  db.orders.unshift(newOrder);

  // If a coupon was used, increment usage count
  if (orderData.couponCode) {
    const coupon = db.coupons.find((c) => c.code.toUpperCase() === orderData.couponCode?.toUpperCase());
    if (coupon) {
      coupon.usageCount = (coupon.usageCount || 0) + 1;
    }
  }

  saveDatabase(db);
  return newOrder;
}

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
  driverUpdate?: { lat: number; lng: number }
): Promise<Order | null> {
  const db = ensureDataFile();
  const order = db.orders.find((o) => o.id === orderId || o.orderNumber === orderId);
  if (!order) return null;

  order.orderStatus = status;
  order.updatedAt = new Date().toISOString();

  if (status === 'Delivered') {
    if (order.paymentMethod === 'COD') {
      order.paymentStatus = 'Paid';
    }
  }

  if (driverUpdate) {
    order.driverLocation = driverUpdate;
    if (order.deliveryPartner) {
      order.deliveryPartner.currentLat = driverUpdate.lat;
      order.deliveryPartner.currentLng = driverUpdate.lng;
    }
  }

  saveDatabase(db);
  return order;
}

export async function assignDeliveryPartner(orderId: string, partner: Order['deliveryPartner']): Promise<Order | null> {
  const db = ensureDataFile();
  const order = db.orders.find((o) => o.id === orderId || o.orderNumber === orderId);
  if (!order) return null;

  order.deliveryPartner = partner;
  order.orderStatus = 'Delivery Partner Assigned';
  if (partner) {
    order.driverLocation = { lat: partner.currentLat, lng: partner.currentLng };
  }
  order.updatedAt = new Date().toISOString();
  saveDatabase(db);
  return order;
}

// ---------------- COUPONS ----------------
export async function getCoupons(): Promise<Coupon[]> {
  const db = ensureDataFile();
  return db.coupons;
}

export async function validateCoupon(code: string, subtotal: number): Promise<{ valid: boolean; discount: number; message: string; coupon?: Coupon }> {
  const db = ensureDataFile();
  const coupon = db.coupons.find((c) => c.code.toUpperCase() === code.toUpperCase() && c.isActive);

  if (!coupon) {
    return { valid: false, discount: 0, message: 'Invalid or expired coupon code' };
  }

  if (subtotal < coupon.minOrderAmount) {
    return {
      valid: false,
      discount: 0,
      message: `Minimum order amount of ₹${coupon.minOrderAmount} required for this coupon`,
    };
  }

  let discount = 0;
  if (coupon.discountType === 'percentage') {
    discount = Math.round((subtotal * coupon.discountValue) / 100);
    if (coupon.maxDiscount && discount > coupon.maxDiscount) {
      discount = coupon.maxDiscount;
    }
  } else {
    discount = coupon.discountValue;
  }

  return {
    valid: true,
    discount,
    message: `Coupon applied: ₹${discount} discount`,
    coupon,
  };
}

export async function createCoupon(couponData: Omit<Coupon, 'id' | 'usageCount'>): Promise<Coupon> {
  const db = ensureDataFile();
  const newCoupon: Coupon = {
    ...couponData,
    id: `coup-${Date.now()}`,
    usageCount: 0,
  };
  db.coupons.push(newCoupon);
  saveDatabase(db);
  return newCoupon;
}

// ---------------- SETTINGS ----------------
export async function getSettings(): Promise<BusinessSettings> {
  const db = ensureDataFile();
  return db.settings;
}

export async function updateSettings(settings: Partial<BusinessSettings>): Promise<BusinessSettings> {
  const db = ensureDataFile();
  db.settings = { ...db.settings, ...settings };
  saveDatabase(db);
  return db.settings;
}

// ---------------- REVIEWS ----------------
export async function getReviews(productId?: string): Promise<Review[]> {
  const db = ensureDataFile();
  if (productId) {
    return db.reviews.filter((r) => r.productId === productId);
  }
  return db.reviews;
}

export async function addReview(review: Omit<Review, 'id' | 'createdAt'>): Promise<Review> {
  const db = ensureDataFile();
  const newReview: Review = {
    ...review,
    id: `rev-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  db.reviews.unshift(newReview);

  // Update product rating
  const prod = db.products.find((p) => p.id === review.productId);
  if (prod) {
    const prodReviews = db.reviews.filter((r) => r.productId === review.productId);
    const avg = prodReviews.reduce((sum, r) => sum + r.rating, 0) / prodReviews.length;
    prod.rating = parseFloat(avg.toFixed(1));
    prod.reviewCount = prodReviews.length;
  }

  saveDatabase(db);
  return newReview;
}

// ---------------- TICKETS ----------------
export async function getTickets(userId?: string): Promise<SupportTicket[]> {
  const db = ensureDataFile();
  if (userId) {
    return db.tickets.filter((t) => t.userId === userId);
  }
  return db.tickets.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function createTicket(ticket: Omit<SupportTicket, 'id' | 'ticketNumber' | 'createdAt' | 'updatedAt'>): Promise<SupportTicket> {
  const db = ensureDataFile();
  const now = new Date().toISOString();
  const newTicket: SupportTicket = {
    ...ticket,
    id: `tkt-${Date.now()}`,
    ticketNumber: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
    createdAt: now,
    updatedAt: now,
  };
  db.tickets.unshift(newTicket);
  saveDatabase(db);
  return newTicket;
}

export async function updateTicketStatus(
  id: string,
  status: SupportTicket['status'],
  adminNotes?: string
): Promise<SupportTicket | null> {
  const db = ensureDataFile();
  const ticket = db.tickets.find((t) => t.id === id || t.ticketNumber === id);
  if (!ticket) return null;

  ticket.status = status;
  if (adminNotes !== undefined) {
    ticket.adminNotes = adminNotes;
  }
  ticket.updatedAt = new Date().toISOString();
  saveDatabase(db);
  return ticket;
}

// ---------------- ADDRESSES ----------------
export async function getAddresses(userId: string): Promise<Address[]> {
  const db = ensureDataFile();
  return db.addresses.filter((a) => a.userId === userId || a.userId === 'u-default');
}

export async function saveAddress(address: Omit<Address, 'id'> & { id?: string }): Promise<Address> {
  const db = ensureDataFile();
  if (address.id) {
    const index = db.addresses.findIndex((a) => a.id === address.id);
    if (index !== -1) {
      db.addresses[index] = { ...db.addresses[index], ...address };
      saveDatabase(db);
      return db.addresses[index];
    }
  }

  const newAddress: Address = {
    ...address,
    id: address.id || `addr-${Date.now()}`,
  };

  if (newAddress.isDefault) {
    db.addresses.forEach((a) => {
      a.isDefault = false;
    });
  }

  db.addresses.push(newAddress);
  saveDatabase(db);
  return newAddress;
}

export async function deleteAddress(id: string): Promise<boolean> {
  const db = ensureDataFile();
  const index = db.addresses.findIndex((a) => a.id === id);
  if (index === -1) return false;
  db.addresses.splice(index, 1);
  saveDatabase(db);
  return true;
}
