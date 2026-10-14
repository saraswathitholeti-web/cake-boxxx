# 🎂 Cake Box Guntur — Online Food Ordering & Delivery Platform

> **"Fresh Bakes. Sweet Moments. Delivered."**  
> Serving Brodipet, Arundelpet, Lakshmipuram, Koretipadu, Pattabhipuram, and across Guntur, Andhra Pradesh.

---

## 📍 Restaurant Details

- **Name:** Cake Box
- **Address:** 4th Lane, Beside ICICI Bank, Brodipet, Guntur, Andhra Pradesh 522002, India
- **Plus Code:** `8C3J+F8, Guntur, Andhra Pradesh`
- **Phone:** +91 863 223 4567
- **Email:** orders@cakeboxguntur.com
- **Operating Hours:** 10:00 AM – 10:30 PM (All 7 Days)
- **Delivery Radius:** Up to 12 km across Guntur (Free delivery above ₹499)

---

## 🚀 Key Features

### 🛍️ Customer Experience
- **Interactive Homepage:** Hero showcase, 12 bakery categories, bestsellers, chef recommendations, customer reviews, FAQs, and Brodipet location map.
- **Delivery Location Selector:** Geolocation detection, popular Guntur localities (Brodipet, Arundelpet, Lakshmipuram, etc.), manual address input with distance validation and delivery radius enforcement.
- **50-Item Initial Catalog:**
  - **Cakes (8 items):** Chocolate Truffle, Black Forest, White Forest, Red Velvet, Butterscotch, Pineapple Cream, Vanilla Fresh Cream, Chocolate Fudge Cake.
    - *Customizations:* 500g / 1kg / 2kg weight choices, personalized piped messages, 100% eggless options, sparklers, and golden birthday toppers.
  - **Pastries & Slices (6 items):** Chocolate Pastry, Black Forest Pastry, Red Velvet Pastry, Pineapple Pastry, Walnut Brownie, Molten Lava Cake.
  - **Artisan Chocolates (6 items):** Assorted Box, Milk/Dark Chocolate Bars, Truffles, Chocolate-Dipped Strawberries, Gift Hampers.
  - **Oven-Fresh Pizza (5 items):** Margherita, Farmhouse, Corn & Cheese, Paneer Tikka, Loaded Cheese with Regular 7", Medium 9", Large 12" sizes and extra mozzarella.
  - **Burgers (5 items):** Classic Veg, Crispy Veg, Cheese Burger, Paneer Burger, Double Cheese.
  - **Sandwiches & Wraps (4 items):** Veg Grilled, Cheese Corn, Paneer Tikka, Veg Wrap.
  - **Puffs & Snacks (4 items):** Veg Puff, Paneer Puff, Egg Puff, Chicken Puff with strict dietary tagging.
  - **Fries & Starters (4 items):** French Fries, Peri-Peri, Cheese Fries, Crispy Nuggets.
  - **Gourmet Desserts (4 items):** Chocolate Mousse, New York Cheesecake, Tiramisu Cup, Dessert Combo Box.
  - **Beverages (4 items):** Cold Coffee, Chocolate Shake, Strawberry Shake, Fresh Lime Soda.
- **Product Customizer Modal:** Live weight price recalculation, custom cake message, dietary badges, add-on checkboxes.
- **Shopping Cart:** Real-time subtotal, coupon application (`WELCOME10`, `SWEET50`, `CAKECOMBO`), bakery packaging charge (₹20), GST (5%), and free delivery calculation.
- **Multi-Step Checkout:**
  - Delivery address with 10-digit phone verification
  - Timing: Standard (30-45 mins), Scheduled celebration slot, or Express
  - Payment: UPI (GPay, PhonePe, Paytm, QR), Credit/Debit Cards, Net Banking, and Cash on Delivery (COD)
- **Order Confirmation:** Celebratory confetti animation, printable bill receipt, and instant tracking CTA.
- **Live Swiggy-like Order Tracking (`/track`):**
  - Brodipet bakery marker, customer drop marker, live delivery rider marker
  - 8-stage progress timeline (Placed → Confirmed → Baking → Ready → Rider Assigned → Picked Up → Out for Delivery → Delivered)
  - Delivery partner details card (Ramesh Naidu, Hero Splendor AP 07 BK 4521)
  - **Demo Simulation Mode:** Interactive button to simulate live driver movement along Guntur roads towards the customer.
- **Cake Box Assistant Chatbot:** Floating widget with real-time order lookup, menu recommendations, eggless options, promo codes, and opening hours.
- **Customer Care & Tickets (`/support`):** Ticket creation (TKT-XXXX) and resolution status history.
- **Customer Profile & Orders (`/orders`):** Order history, one-click re-order, printable invoices.
- **Wishlist (`/favorites`):** Saved favorites with quick cart additions.

### 🛡️ Restaurant Admin Dashboard (`/admin`)
- KPI stats: Today's orders, total revenue, baking queue, out for delivery.
- Live order manager: update preparation lifecycle, filter, search, print KOT receipts.
- Product Catalog manager: add new products, edit prices, descriptions, toggle in-stock/out-of-stock.
- Coupon & promo manager: create percentage or fixed discount coupons.
- Customer support ticket resolution.
- Business settings: Opening hours, delivery radius, base delivery fee, free delivery threshold, temporary store open/close toggle.

### 🛵 Delivery Partner Interface (`/delivery`)
- Active assigned deliveries view with pickup from Brodipet and customer address.
- Google Maps navigation deep links.
- Order progression buttons: Mark Picked Up, Out for Delivery, Delivered.
- Live GPS coordinate broadcasting.

---

## 🛠️ Technology Stack

- **Framework:** Next.js 16 (App Router) + React 19 + TypeScript
- **Styling:** Tailwind CSS (Custom bakery palette: chocolate brown, warm cream, strawberry pink, caramel)
- **Icons & Animation:** Lucide Icons, Canvas Confetti
- **Storage & Database:** Local file-based JSON persistence engine (`src/lib/db.ts`) with auto-seeding
- **Geo & Radius:** Haversine distance calculations and Guntur locality validation (`src/lib/geo.ts`)

---

## 🏃 Running the Application

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### 3. Run Automated Verification Tests
```bash
npm test
```
Executes the automated end-to-end test suite checking delivery radius validation, 50-item catalog integrity, coupon discounts, order lifecycle transitions, and chatbot order tracking.

### 4. Build for Production
```bash
npm run build
npm start
```
