"use client";

import EventCard from "@/components/EventCard";
import { Slide } from "@mui/material";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import useSWR from "swr";

interface ApiEvent {
  event_id: string;
  event_name: string;
  event_date: string;
  event_place: string;
  event_description: string;
  event_image: string;
  event_category?: string;
}

interface Event {
  id: string;
  name: string;
  date: string;
  location: string;
  description: string;
  imageUrl: string;
  category: string;
}

interface TicketStats {
  type: string;
  count: number;
  color: string;
}

const eventsFetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error("Erreur de chargement de la page");
  const data: ApiEvent[] = await response.json();
  return data.map((event) => ({
    id: event.event_id,
    name: event.event_name,
    date: event.event_date,
    location: event.event_place,
    description: event.event_description,
    imageUrl: event.event_image,
    category: event.event_category || "Autres",
  }));
};

const ticketStatsFetcher = async (url: string) => {
  const response = await fetch(url);
  const data = await response.json();
  return [
    { type: 'VIP', count: data.vipCount || 0, color: '#FF6384' },
    { type: 'STANDARD', count: data.standardCount || 0, color: '#36A2EB' },
    { type: 'EARLY_BIRD', count: data.earlyBirdCount || 0, color: '#FFCE56' }
  ];
};

export default function Home() {
  const [showContent, setShowContent] = useState(false);

  const { data: events, error: eventsError, isLoading: eventsLoading } = useSWR<Event[]>(
    "/api/events",
    eventsFetcher,
    {
      refreshInterval: 5000,
      revalidateOnFocus: true,
      onSuccess: () => setShowContent(true)
    }
  );

  const { data: ticketStats = [] } = useSWR<TicketStats[]>(
    "/api/tickets",
    ticketStatsFetcher,
    { refreshInterval: 5000 }
  );

  const total = ticketStats.reduce((sum, stat) => sum + stat.count, 0);
  const currentDate = new Date();
  const upcomingEvents = events?.filter((event) => new Date(event.date) >= currentDate) || [];
  const pastEvents = events?.filter((event) => new Date(event.date) < currentDate) || [];

  const renderEventSection = (
    title: string,
    filterFn: (event: Event) => boolean,
    bgImage: string,
    emptyMessage: string
  ) => (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8">
      <Image src={bgImage} alt={`Background ${title}`} fill className="object-cover" quality={80} />
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative z-10 max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-10 text-center md:text-left">{title}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center">
          {upcomingEvents.filter(filterFn).length > 0 ? (
            upcomingEvents.filter(filterFn).map((event) => (
              <EventCard key={event.id} {...event} />
            ))
          ) : (
            <p className="text-gray-300 text-lg text-center col-span-full py-10">{emptyMessage}</p>
          )}
        </div>
      </div>
    </section>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      <section className="relative h-screen flex items-center">
        <Image src="/img/home.jpg" alt="Background accueil" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-linear-to-r from-black/80 to-black/30" />
        <div className="relative z-10 px-6 sm:px-12 lg:px-24 max-w-4xl text-white">
          {eventsLoading ? (
            <div className="text-xl animate-pulse">Chargement en cours...</div>
          ) : eventsError ? (
            <div className="text-red-400 text-xl">Impossible de charger les événements.</div>
          ) : (
            <Slide in={showContent} direction="up" timeout={1000}>
              <div>
                {/* Modification ici : "Tap" en bleuElec */}
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
                  Bienvenue sur <span className="text-bleuElec">Tap</span><span className="text-orMetallique">akila</span>
                </h1>
                <p className="text-lg sm:text-xl md:text-2xl mb-10 text-gray-200">
                  Découvrez et réservez vos billets pour les meilleurs événements de votre vie.
                </p>
                <Link
                  href="/events"
                  className="inline-block bg-bleuElec text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-orMetallique hover:text-bleuNuit transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Découvrir Maintenant
                </Link>
              </div>
            </Slide>
          )}
        </div>
      </section>

      {/* SWIPER SECTION */}
      <section className="relative py-24">
        <Image src="/img/event.jpg" alt="Événements à l'affiche" fill className="object-cover" />
        <div className="absolute inset-0 bg-black/70" />
        <div className="relative z-10 max-w-5xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">
            Événements à l'affiche
          </h2>
          {upcomingEvents.length > 0 ? (
            <div className="px-4 sm:px-12 pb-12">
              <Swiper
                slidesPerView={1}
                spaceBetween={30}
                centeredSlides={true}
                loop={true}
                autoplay={{ delay: 4000, disableOnInteraction: false }}
                pagination={{ clickable: true, dynamicBullets: true }}
                navigation={true}
                modules={[Autoplay, Pagination, Navigation]}
                breakpoints={{
                  768: { slidesPerView: 2 },
                  1024: { slidesPerView: 3 },
                }}
                className="pb-14"
              >
                {upcomingEvents.map((event) => (
                  <SwiperSlide key={event.id} className="h-auto py-4">
                    <EventCard {...event} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          ) : (
            <p className="text-gray-300 text-lg text-center">Aucun événement pour le moment.</p>
          )}
        </div>
      </section>

      {/* SECTIONS DYNAMIQUES */}
      {renderEventSection("Événements à Venir", () => true, "/img/eventSoon.jpg", "Aucun événement à venir.")}
      {renderEventSection("Spectacles & Concerts", (e) => ["Spectacle", "Concert"].includes(e.category), "/img/concert.jpg", "Aucun spectacle disponible.")}
      {renderEventSection("Festival & Culture", (e) => ["Culture", "Théâtre", "Festival"].includes(e.category), "/img/festival.jpg", "Aucun festival disponible.")}
      {renderEventSection("Sports & Loisirs", (e) => ["Sport", "Loisir"].includes(e.category), "/img/football.jpg", "Aucun événement sportif.")}
      {renderEventSection("Autres", (e) => ["Autres", "Conférence"].includes(e.category), "/img/bgOther.jpg", "Aucun autre événement.")}

      {/* STATS SECTION */}
      <section className="relative py-24 px-4 sm:px-6">
        <Image src="/img/TicketsStats.jpg" alt="Stats" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-bleuNuit/90" />

        <div className="relative z-10 max-w-5xl mx-auto text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-orMetallique">Statistiques des Billets</h2>

          {eventsLoading ? (
            <div className="text-center animate-pulse text-xl">Chargement des données...</div>
          ) : (
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
                <div className="relative w-64 h-64 shrink-0">
                  <div className="absolute inset-0 rounded-full border-12 border-bleuElec/30 shadow-inner">
                    {ticketStats.map((stat, index) => {
                      const percentage = total > 0 ? (stat.count / total) * 100 : 0;
                      const offset = ticketStats.slice(0, index).reduce((sum, s) => sum + (s.count / total) * 100, 0);
                      return (
                        <div
                          key={stat.type}
                          className="absolute inset-0 rounded-full"
                          style={{
                            background: `conic-gradient(${stat.color} 0% ${percentage}%, transparent ${percentage}% 100%)`,
                            transform: `rotate(${offset * 3.6}deg)`
                          }}
                        />
                      );
                    })}
                  </div>
                  <div className="absolute inset-6 rounded-full bg-bleuNuit flex flex-col items-center justify-center shadow-lg border border-white/10">
                    <span className="text-gray-300 text-sm uppercase tracking-widest">Total</span>
                    <span className="text-5xl font-extrabold text-orMetallique">{total}</span>
                  </div>
                </div>

                {/* Barres de progression */}
                <div className="flex-1 w-full">
                  <h3 className="text-2xl font-semibold mb-6 text-center lg:text-left">Répartition par catégorie</h3>
                  <div className="space-y-6">
                    {ticketStats.map(stat => {
                      const percent = total > 0 ? Math.round((stat.count / total) * 100) : 0;
                      return (
                        <div key={stat.type} className="bg-black/30 p-4 rounded-xl border border-white/10">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: stat.color }} />
                              <span className="font-semibold tracking-wide">{stat.type}</span>
                            </div>
                            <span className="font-bold text-lg">{stat.count} <span className="text-sm font-normal text-gray-300">({percent}%)</span></span>
                          </div>
                          <div className="w-full bg-gray-700/50 rounded-full h-3 overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-1000 ease-out"
                              style={{ width: `${percent}%`, backgroundColor: stat.color }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* PAST EVENTS */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <Image src="/img/pastEvent.jpg" alt="Événements passés" fill className="object-cover" />
        <div className="absolute inset-0 bg-black/70" />
        <div className="relative z-10 max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-10 text-center md:text-left">Événements Passés</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center">
            {pastEvents.length > 0 ? (
              pastEvents.map((event) => <EventCard key={event.id} {...event} />)
            ) : (
              <p className="text-gray-300 text-lg text-center col-span-full py-10">Aucun événement passé.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}