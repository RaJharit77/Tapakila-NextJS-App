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
  req: Request
) {
  const { eventId, eventName } = await req.json();

  console.log("Checking tickets for event:", eventId);

  // 1. Vérification des tickets
  const availableTickets = await prisma.ticket.count({
    where: {
      event_id: eventId,
      ticket_status: "AVAILABLE"
    }
  });
  console.log("Available tickets:", availableTickets);

  if (availableTickets === 0) {
    await pusher.trigger(
        'global-notifications', 
        'event-sold-out', 
        {
          eventId: eventId, 
          eventName: eventName,
          message: `L'événement ${eventId} est complet !`
        }
    );
  }

  return NextResponse.json({
    availableTickets,
    isFull: availableTickets === 0
  });
}