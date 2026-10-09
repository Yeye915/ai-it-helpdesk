import mongoose, { Schema, Document } from 'mongoose';

export interface ITicket extends Document {
  ticketId: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  assignedTeam: string;
  status: string;
  createdAt: Date;
}

const TicketSchema: Schema = new Schema({
  ticketId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, default: 'Unassigned' },
  priority: { type: String, default: 'Medium' },
  assignedTeam: { type: String, default: 'IT General' },
  status: { type: String, default: 'Open' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Ticket || mongoose.model<ITicket>('Ticket', TicketSchema);