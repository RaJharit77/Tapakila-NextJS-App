// components/EventNotifications.tsx
'use client';
import { useEffect } from 'react';
import Pusher from 'pusher-js';
import { toast } from 'sonner';



export default function EventNotifications() {
  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: 'eu'
    });

    const channel = pusher.subscribe('global-notifications'); // Même canal pour tous
    
    channel.bind('event-sold-out', (data: { eventId: string, eventName: string, message: string }) => {
    
      toast(`L'Événement ${data.eventName} est complet  !`, {
        description: data.message,
        action: {
          label: 'Voir',
          onClick: () => window.location.href = `/events/${data.eventId}`
        },
        position: 'top-right',
        duration: 8000, 
        style: {
          background: '#1e293b',
          color: 'white',
          border: 'none'
        }
      });   

    });
    return () => pusher.unsubscribe('global-notifications');
    
  }, []);

  return null;
}
