'use client';
import { useEffect } from 'react';
import Pusher from 'pusher-js';

export default function EventNotifications() {
  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: 'eu'
    });

    const channel = pusher.subscribe('global-notifications');
    
    channel.bind('event-sold-out', (data: { eventId: string, message: string }) => {
      alert(`Nouvelle alerte : ${data.message}`);

    });

    return () => pusher.unsubscribe('global-notifications');
  }, []);

  return null;
}
