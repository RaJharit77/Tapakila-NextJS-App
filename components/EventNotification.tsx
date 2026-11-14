'use client';
import { useEffect } from 'react';
import Pusher from 'pusher-js';
import toast from 'react-hot-toast';

export default function EventNotifications() {
  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_PUSHER_KEY) return;

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: 'eu'
    });

    const channel = pusher.subscribe('global-notifications');
    
    channel.bind('event-sold-out', (data: { eventId: string, message: string }) => {
      toast.error(
        (t) => (
          <span>
            <b>Alerte :</b> {data.message}
            <button 
              onClick={() => toast.dismiss(t.id)} 
              className="ml-3 text-xs underline opacity-70 hover:opacity-100"
            >
              Fermer
            </button>
          </span>
        ), 
        {
          duration: 6000,
          position: 'top-center',
          style: {
            background: '#14213D',
            color: '#fff',
            borderRadius: '12px',
            border: '1px solid #FFBA08'
          },
          iconTheme: {
            primary: '#FFBA08',
            secondary: '#14213D',
          },
        }
      );
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, []);

  return null;
}