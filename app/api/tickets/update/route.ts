import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import Pusher from 'pusher';

const pusher = new Pusher({
  appId: process.env.NEXT_PUBLIC_PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: 'eu',
  useTLS: true
});

export async function POST(
  req: Request,
  { params }: { params: { eventId: string } }
) {
  const eventId = params.eventId;

  // 1. Vérification des tickets
  const availableTickets = await prisma.ticket.count({
    where: {
      event_id: eventId,
      ticket_status: "AVAILABLE"
    }
  });


  if (availableTickets === 0) {
    await pusher.trigger(
        'global-notifications', 
        'event-sold-out', 
        {
          eventId: eventId, 
          message: `L'événement ${eventId} est complet !`
        }
    );
  }

  return NextResponse.json({
    availableTickets,
    isFull: availableTickets === 0
  });
}