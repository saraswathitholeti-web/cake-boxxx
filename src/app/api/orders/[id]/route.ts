import { NextResponse } from 'next/server';
import { getOrderById, updateOrderStatus, assignDeliveryPartner } from '@/lib/db';
import { OrderStatus } from '@/types';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const order = await getOrderById(id);
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { orderStatus, deliveryPartner, driverLocation } = body;

    let updatedOrder = null;

    if (deliveryPartner) {
      updatedOrder = await assignDeliveryPartner(id, deliveryPartner);
    }

    if (orderStatus) {
      updatedOrder = await updateOrderStatus(id, orderStatus as OrderStatus, driverLocation);
    } else if (driverLocation) {
      const existing = await getOrderById(id);
      if (existing) {
        updatedOrder = await updateOrderStatus(id, existing.orderStatus, driverLocation);
      }
    }

    if (!updatedOrder) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
