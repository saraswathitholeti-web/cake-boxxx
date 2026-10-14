import { NextResponse } from 'next/server';
import { getCoupons, createCoupon } from '@/lib/db';

export async function GET() {
  try {
    const coupons = await getCoupons();
    return NextResponse.json(coupons);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch coupons' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.code || !body.discountValue) {
      return NextResponse.json({ error: 'Missing required coupon fields' }, { status: 400 });
    }
    const coupon = await createCoupon(body);
    return NextResponse.json(coupon, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create coupon' }, { status: 500 });
  }
}
