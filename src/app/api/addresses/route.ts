import { NextResponse } from 'next/server';
import { getAddresses, saveAddress, deleteAddress } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'u-default';
    const addresses = await getAddresses(userId);
    return NextResponse.json(addresses);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch addresses' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.recipientName || !body.recipientPhone || !body.houseFlat || !body.street) {
      return NextResponse.json({ error: 'Missing required address fields' }, { status: 400 });
    }
    const saved = await saveAddress({
      ...body,
      userId: body.userId || 'u-default',
    });
    return NextResponse.json(saved, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save address' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Address ID is required' }, { status: 400 });
    }
    const success = await deleteAddress(id);
    if (!success) {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete address' }, { status: 500 });
  }
}
