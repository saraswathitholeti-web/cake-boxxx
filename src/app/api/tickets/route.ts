import { NextResponse } from 'next/server';
import { getTickets, createTicket, updateTicketStatus } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || undefined;
    const tickets = await getTickets(userId);
    return NextResponse.json(tickets);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch tickets' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.category || !body.description || !body.userName || !body.userPhone) {
      return NextResponse.json({ error: 'Missing required support ticket fields' }, { status: 400 });
    }
    const ticket = await createTicket({
      userId: body.userId || 'u-default',
      userName: body.userName,
      userPhone: body.userPhone,
      orderId: body.orderId || undefined,
      category: body.category,
      description: body.description,
      priority: body.priority || 'Medium',
      status: 'Open',
    });
    return NextResponse.json(ticket, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create ticket' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status, adminNotes } = body;
    if (!id || !status) {
      return NextResponse.json({ error: 'Ticket ID and status are required' }, { status: 400 });
    }
    const updated = await updateTicketStatus(id, status, adminNotes);
    if (!updated) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update ticket' }, { status: 500 });
  }
}
