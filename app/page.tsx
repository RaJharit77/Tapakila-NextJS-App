"use client";

import EventCard from "@/components/EventCard";
import { Slide } from "@mui/material";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

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

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch("/api/events");

        if (!response.ok) {
          throw new Error("Erreur de chargement de la page");
        }

        const data: ApiEvent[] = await response.json();

        const formattedEvents: Event[] = data.map((event) => ({
          id: event.event_id,
          name: event.event_name,
          date: event.event_date,
          location: event.event_place,
          description: event.event_description,
          imageUrl: event.event_image,
          category: event.event_category || "Autres",
        }));

        setEvents(formattedEvents);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
        setShowContent(true);
      }
    }
    fetchEvents();
  }, []);

  const currentDate = new Date();
  const upcomingEvents = events.filter((event) => new Date(event.date) >= currentDate);
  const pastEvents = events.filter((event) => new Date(event.date) < currentDate);

  const renderEventSection = (
    title: string,
    filterFn: (event: Event) => boolean,
    bgImage: string,
    emptyMessage: string
  ) => (
    <section className="relative py-12 px-6">
      <Image
        src={bgImage}
        alt={`Background ${title}`}
        fill
        className="object-cover"
        quality={80}
      />
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <div className="relative z-10">
        <h2 className="text-2xl font-bold text-blancGlacialNeutre mb-8">
          {title}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingEvents.filter(filterFn).length > 0 ? (
            upcomingEvents.filter(filterFn).map((event) => (
              <EventCard key={event.id} {...event} />
            ))
          ) : (
            <p className="text-blancGlacialNeutre text-xl text-center col-span-full">
              {emptyMessage}
            </p>
          )}
        </div>
      </div>
    </section>
  );

  return (
    <div className="bg-blancGlacialNeutre min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-start">
        <Image
          src="/img/home.jpg"
          alt="Background accueil"
          fill
          className="object-cover"
          quality={80}
          priority
        />
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative z-10 text-blancGlacialNeutre px-8 lg:px-16">
          {loading ? (
            <div className="text-center justify-center text-blancGlacialNeutre text-xl py-36">
              Chargement en cours...
            </div>
          ) : error ? (
            <div className="text-center text-red-500 text-xl py-36">
              {error}
            </div>
          ) : (
            <Slide in={showContent} direction="up" timeout={1000}>
              <div>
                <h1 className="text-5xl font-bold mb-6">Bienvenue sur Tapakila</h1>
                <p className="text-xl mb-8">
                  Découvrez et réservez vos billets <br />pour les meilleurs événements de votre vie.
                </p>
                <Link
                  href="/events"
                  className="bg-bleuElec text-blancGlacialNeutre px-6 py-3 rounded-lg text-lg hover:bg-bleuNuit hover:text-orMetallique transition-colors"
                >
                  Découvrir Maintenant
                </Link>
              </div>
            </Slide>
          )}
        </div>
      </section>

      <section className="relative py-16">
        <Image
          src="/img/event.jpg"
          alt="Événements à l&apos;affiche"
          fill
          className="object-cover"
          quality={80}
        />
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative z-10 container mx-auto px-3">
          <h2 className="text-3xl font-bold text-blancGlacialNeutre mb-12 text-center">
            Événements à l&apos;affiche
          </h2>

          {upcomingEvents.length > 0 ? (
            <div className="px-12">
              <Swiper
                slidesPerView={1}
                spaceBetween={30}
                centeredSlides={true}
                loop={true}
                autoplay={{
                  delay: 5000,
                  disableOnInteraction: true,
                }}
                pagination={{
                  clickable: true,
                  dynamicBullets: true,
                }}
                navigation={{
                  nextEl: '.swiper-button-next',
                  prevEl: '.swiper-button-prev',
                }}
                modules={[Autoplay, Pagination, Navigation]}
                breakpoints={{
                  640: { slidesPerView: 1 },
                  768: { slidesPerView: 1 },
                  1024: { slidesPerView: 1 },
                }}
                className="relative"
              >
                {upcomingEvents.map((event) => (
                  <SwiperSlide key={event.id}>
                    <div className="flex justify-center items-center h-full py-3">
                      <div className="w-full max-w-md mx-auto">
                        <EventCard {...event} />
                      </div>
                    </div>
                  </SwiperSlide>
                ))}

                <div className="swiper-button-prev !text-orMetallique !left-0"></div>
                <div className="swiper-button-next !text-orMetallique !right-0"></div>
              </Swiper>
            </div>
          ) : (
            <p className="text-blancGlacialNeutre text-xl text-center py-12">
              Aucun événement à l&apos;affiche pour le moment.
            </p>
          )}
        </div>
      </section>

      {renderEventSection(
        "Événements à Venir",
        () => true,
        "/img/eventSoon.jpg",
        "Aucun événement à venir pour le moment."
      )}

      {renderEventSection(
        "Spectacles & Concerts",
        (event) => event.category === "Spectacle" || event.category === "Concert",
        "/img/concert.jpg",
        "Aucun spectacle ou concert disponible pour le moment."
      )}

      {renderEventSection(
        "Festival & Culture",
        (event) => ["Culture", "Théâtre", "Festival"].includes(event.category),
        "/img/festival.jpg",
        "Aucun festival ou événement culturel disponible pour le moment."
      )}

      {renderEventSection(
        "Sports & Loisirs",
        (event) => event.category === "Sport" || event.category === "Loisir",
        "/img/football.jpg",
        "Aucun événement sportif disponible pour le moment."
      )}

      {renderEventSection(
        "Autres",
        (event) => event.category === "Autres" || event.category === "Conférence",
        "/img/bgOther.jpg",
        "Aucun autre événement disponible pour le moment."
      )}

      <section className="relative py-12 px-6">
        <Image
          src="/img/pastEvent.jpg"
          alt="Événements passés"
          fill
          className="object-cover"
          quality={80}
        />
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative z-10">
          <h2 className="text-2xl font-bold text-blancGlacialNeutre mb-8">
            Événements Passés
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pastEvents.length > 0 ? (
              pastEvents.map((event) => (
                <EventCard key={event.id} {...event} />
              ))
            ) : (
              <p className="text-blancGlacialNeutre text-xl text-center col-span-full">
                Aucun événement passé disponible pour le moment.
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}