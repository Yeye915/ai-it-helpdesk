import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import Ticket from '../../../../models/Ticket';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
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

    return NextResponse.json(
      { success: true, data: updatedTicket },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Đã xảy ra lỗi máy chủ';

    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
