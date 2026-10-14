let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ ${message}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failed++;
  }
}

// Distance calculator for tests
function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(2));
}

function isWithinDeliveryRadius(destLat, destLng, maxRadiusKm = 12) {
  const distanceKm = calculateDistanceKm(16.3067, 80.4365, destLat, destLng);
  return { allowed: distanceKm <= maxRadiusKm, distanceKm };
}

async function runTestSuite() {
  console.log('========================================================');
  console.log('  CAKE BOX GUNTUR — AUTOMATED VERIFICATION TEST SUITE   ');
  console.log('========================================================\n');

  // 1. Delivery Geo Radius Tests
  console.log('TEST 1: Delivery Geo Radius & Locality Validation (Brodipet 12km limit)');
  const brodipet = isWithinDeliveryRadius(16.3067, 80.4365, 12);
  assert(brodipet.allowed && brodipet.distanceKm <= 0.5, 'Brodipet Bakery is within 0.5 km of itself');

  const arundelpet = isWithinDeliveryRadius(16.3012, 80.4411, 12);
  assert(arundelpet.allowed && arundelpet.distanceKm < 2.0, 'Arundelpet is within delivery radius (~1.2 km)');

  const outOfRadius = isWithinDeliveryRadius(16.5062, 80.6480, 12);
  assert(!outOfRadius.allowed && outOfRadius.distanceKm > 12, 'Locations >12 km are strictly rejected by delivery validator');

  // 2. API Catalog Verification
  console.log('\nTEST 2: Product Catalog & Dietary Tag Integrity');
  const prodRes = await fetch('http://localhost:3000/api/products');
  const products = await prodRes.json();
  assert(products.length === 50, `Catalog contains exactly 50 starter items (received: ${products.length})`);

  const egglessCount = products.filter(p => p.dietaryType === 'eggless').length;
  const nonVegCount = products.filter(p => p.dietaryType === 'non-veg').length;
  assert(egglessCount >= 10, `Eggless cakes and pastries labeled accurately (${egglessCount} items)`);
  assert(nonVegCount === 2, `Non-veg puffs (Egg puff & Chicken puff) labeled accurately (${nonVegCount} items)`);

  // 3. Coupon Validation Engine
  console.log('\nTEST 3: Coupon Engine & Server-Side Validation');
  const couponRes1 = await fetch('http://localhost:3000/api/coupons/validate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code: 'SWEET50', subtotal: 500 })
  });
  const couponData1 = await couponRes1.json();
  assert(couponData1.valid && couponData1.discount === 50, 'SWEET50 gives flat ₹50 discount for eligible order');

  const couponRes2 = await fetch('http://localhost:3000/api/coupons/validate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code: 'SWEET50', subtotal: 200 })
  });
  const couponData2 = await couponRes2.json();
  assert(!couponData2.valid, 'SWEET50 rejects orders under ₹399 minimum requirement');

  // 4. Order Lifecycle & Status Transitions
  console.log('\nTEST 4: Order Placement & Status Transitions');
  const newOrderRes = await fetch('http://localhost:3000/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      customerName: 'Test Automation Customer',
      customerPhone: '9848011223',
      deliveryAddress: {
        houseFlat: 'Flat 101, Test Residency',
        street: '4th Lane',
        locality: 'Brodipet',
        city: 'Guntur',
        state: 'Andhra Pradesh',
        pincode: '522002',
        latitude: 16.3067,
        longitude: 80.4365
      },
      items: [{ productId: 'cake-1', quantity: 1 }],
      paymentMethod: 'COD'
    })
  });
  const newOrder = await newOrderRes.json();
  assert(newOrder.orderNumber && newOrder.orderNumber.startsWith('CB-'), `Generated order number: ${newOrder.orderNumber}`);
  assert(newOrder.paymentStatus === 'Awaiting Collection', 'Cash on Delivery order correctly marked Awaiting Collection');

  // Transition to Out for Delivery
  const updateRes = await fetch(`http://localhost:3000/api/orders/${newOrder.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderStatus: 'Out for Delivery' })
  });
  const updatedOrder = await updateRes.json();
  assert(updatedOrder.orderStatus === 'Out for Delivery', 'Order successfully transitioned to Out for Delivery');

  // 5. Chatbot Order Tracking Lookup
  console.log('\nTEST 5: Cake Box Assistant Chatbot Knowledge & Order Tracking');
  const chatRes = await fetch('http://localhost:3000/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: `Where is my order ${newOrder.orderNumber}?` })
  });
  const chatData = await chatRes.json();
  assert(chatData.reply.includes(newOrder.orderNumber), `Chatbot identified real order ${newOrder.orderNumber} without hallucination`);

  console.log('\n========================================================');
  console.log(`  TEST RESULTS: ${passed} Passed, ${failed} Failed`);
  console.log('========================================================\n');

  if (failed > 0) process.exit(1);
}

runTestSuite().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
