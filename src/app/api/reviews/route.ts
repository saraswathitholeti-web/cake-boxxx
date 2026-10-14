import { NextResponse } from 'next/server';
import { getReviews, addReview } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId') || undefined;
    const reviews = await getReviews(productId);
    return NextResponse.json(reviews);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.productId || !body.rating || !body.comment) {
      return NextResponse.json({ error: 'Missing required review fields' }, { status: 400 });
    }
    const review = await addReview({
      productId: body.productId,
      productName: body.productName || 'Bakery Item',
      userId: body.userId || 'u-default',
      userName: body.userName || 'Verified Customer',
      rating: Math.min(5, Math.max(1, Number(body.rating) || 5)),
      comment: body.comment,
      isVerifiedPurchase: true,
    });
    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 });
  }
}
