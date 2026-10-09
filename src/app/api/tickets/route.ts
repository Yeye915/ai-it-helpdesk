import { NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';
import Ticket from '../../../models/Ticket';

export async function GET() {
  try {
    await connectDB();
    const tickets = await Ticket.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: tickets }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { title, description } = body;

    if (!title || !description) {
      return NextResponse.json(
        { success: false, error: 'Tiêu đề và mô tả không được để trống' },
        { status: 400 }
      );
    }

    const ticketId = `TCK-${Math.floor(100000 + Math.random() * 900000)}`;

    const newTicket = await Ticket.create({
      ticketId,
      title,
      description,
      status: 'Open',
    });

    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;
    if (n8nWebhookUrl) {
      fetch(n8nWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticketId: newTicket.ticketId,
          title: newTicket.title,
          description: newTicket.description,
        }),
      }).catch((err) => {
        console.error('Lỗi khi gọi n8n webhook:', err);
      });
    }

    return NextResponse.json(
      { success: true, message: 'Tạo ticket thành công', data: newTicket },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}