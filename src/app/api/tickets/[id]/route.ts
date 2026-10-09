import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Ticket from '@/models/Ticket';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const { id } = params;
    const body = await request.json();

    const updatedTicket = await Ticket.findOneAndUpdate(
      { ticketId: id },
      { $set: body },
      { new: true }
    );

    if (!updatedTicket) {
      return NextResponse.json(
        { success: false, error: 'Không tìm thấy ticket' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updatedTicket }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}