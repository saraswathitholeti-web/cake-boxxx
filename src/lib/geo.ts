// Cake Box Guntur location: 4th Lane, Beside ICICI Bank, Brodipet, Guntur, AP 522002
export const CAKEBOX_LOCATION = {
  name: 'Cake Box Guntur',
  address: '4th Lane, Beside ICICI Bank, Brodipet, Guntur, Andhra Pradesh 522002',
  plusCode: '8C3J+F8, Guntur, Andhra Pradesh',
  lat: 16.3067,
  lng: 80.4365,
};

export const GUNTUR_LOCALITIES = [
  { name: 'Brodipet (Cake Box Kitchen)', lat: 16.3067, lng: 80.4365, distanceKm: 0.2 },
  { name: 'Arundelpet', lat: 16.3012, lng: 80.4411, distanceKm: 1.2 },
  { name: 'Lakshmipuram', lat: 16.315, lng: 80.432, distanceKm: 1.5 },
  { name: 'Koretipadu', lat: 16.321, lng: 80.428, distanceKm: 2.1 },
  { name: 'Pattabhipuram', lat: 16.295, lng: 80.429, distanceKm: 2.0 },
  { name: 'Syamala Nagar', lat: 16.292, lng: 80.448, distanceKm: 2.6 },
  { name: 'Vidya Nagar', lat: 16.318, lng: 80.419, distanceKm: 2.8 },
  { name: 'Chandramouli Nagar', lat: 16.324, lng: 80.415, distanceKm: 3.2 },
  { name: 'Brindavan Gardens', lat: 16.329, lng: 80.422, distanceKm: 3.5 },
  { name: 'Gujjanagundla', lat: 16.285, lng: 80.421, distanceKm: 3.8 },
  { name: 'Old Guntur', lat: 16.299, lng: 80.462, distanceKm: 4.2 },
  { name: 'Amaravathi Road', lat: 16.335, lng: 80.405, distanceKm: 4.8 },
  { name: 'Nallapadu', lat: 16.275, lng: 80.395, distanceKm: 6.5 },
  { name: 'Pedakakani (Outer limit)', lat: 16.368, lng: 80.495, distanceKm: 9.8 },
];

/**
 * Calculate distance between two coordinates in kilometers using Haversine formula
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radius of Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return parseFloat(d.toFixed(2));
}

/**
 * Check if address coordinates fall within Cake Box's configured delivery radius
 */
export function isWithinDeliveryRadius(
  destLat: number,
  destLng: number,
  maxRadiusKm = 12
): { allowed: boolean; distanceKm: number } {
  const distanceKm = calculateDistanceKm(
    CAKEBOX_LOCATION.lat,
    CAKEBOX_LOCATION.lng,
    destLat,
    destLng
  );
  return {
    allowed: distanceKm <= maxRadiusKm,
    distanceKm,
  };
}

/**
 * Calculate delivery fee based on distance and order subtotal
 */
export function calculateDeliveryFee(
  distanceKm: number,
  subtotal: number,
  baseFee = 35,
  freeThreshold = 499
): number {
  if (subtotal >= freeThreshold) {
    return 0; // Free delivery for orders above threshold
  }
  // Base fee covers first 3 km, then ₹10 per additional km
  if (distanceKm <= 3) {
    return baseFee;
  }
  const extraKm = Math.ceil(distanceKm - 3);
  return baseFee + extraKm * 10;
}

/**
 * Estimate delivery duration in minutes
 */
export function estimateDeliveryDuration(
  distanceKm: number,
  prepTimeMins = 25
): number {
  // Guntur city average delivery speed approx 20 km/h (3 mins per km) + prep time
  const travelMins = Math.max(10, Math.ceil(distanceKm * 3.5));
  return prepTimeMins + travelMins;
}
