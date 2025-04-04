import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface EventDetail {
  id: string;
  name: string;
  date: string;
  location: string;
  description: string;
  imageUrl: string;
  category: string;
  tickets?: {
    id: string;
    type: string;
    price: number;
    status: string;
  }[];
}

interface EventDetailState {
  event: EventDetail | null;
  isLoading: boolean;
  error: string | null;
  setEvent: (event: EventDetail) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearEvent: () => void;
}

export const useEventDetailStore = create<EventDetailState>()(
  devtools(
    persist(
      (set) => ({
        event: null,
        isLoading: false,
        error: null,
        setEvent: (event) => set({ event }),
        setLoading: (isLoading) => set({ isLoading }),
        setError: (error) => set({ error }),
        clearEvent: () => set({ event: null, error: null }),
      }),
      {
        name: 'event-detail-storage',
      }
    )
  )
); 