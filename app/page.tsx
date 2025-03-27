"use client";

import EventCard from "@/components/EventCard";
import { Slide } from "@mui/material";
import { toast } from "react-hot-toast";
import { useEffect, useState } from "react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const user = localStorage.getItem("user");
      setIsAuthenticated(!!user);
    };

    checkAuth();

    window.addEventListener("storage", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch("/api/events");

        if (!response.ok) {
          throw new Error("Erreur de chargement de la page");
        }

        const data = await response.json();

        const formattedEvents = data.map((event: any) => ({
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

  const handleDiscoverClick = () => {
    if (!isAuthenticated) {
      toast.error(
        "Vous devez créer un compte ou vous connecter pour accéder aux événements.",
        {
          duration: 3000,
          position: "top-center",
          style: {
            backgroundColor: "#f87171",
            color: "#fff",
          },
          icon: "🔒",
        }
      );
    } else {
      window.location.href = "/events";
    }
  };

  const currentDate = new Date();

  const upcomingEvents = events.filter((event) => new Date(event.date) >= currentDate);
  const pastEvents = events.filter((event) => new Date(event.date) < currentDate);

  return (
    <div className="bg-blancGlacialNeutre min-h-screen">
      <section
        className="relative h-screen flex items-center justify-start bg-cover bg-center"
        style={{
          backgroundImage: "url('/img/home.jpg')",
        }}
      >
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
                <button
                  onClick={handleDiscoverClick}
                  className="bg-bleuElec text-blancGlacialNeutre px-6 py-3 rounded-lg text-lg hover:bg-bleuNuit hover:text-orMetallique transition-colors"
                >
                  Découvrir Maintenant
                </button>
              </div>
            </Slide>
          )}
        </div>
      </section>

      <section
        className="relative py-16 bg-cover bg-center"
        style={{
          backgroundImage: "url('/img/event.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative z-10">
          <h2 className="text-2xl font-bold text-blancGlacialNeutre mb-8 text-center">
            Événements à l'affiche
          </h2>
          {upcomingEvents.length > 0 ? (
            <Swiper
              spaceBetween={30}
              centeredSlides={true}
              autoplay={{
                delay: 2500,
                disableOnInteraction: false,
              }}
              pagination={{
                clickable: true,
              }}
              navigation={true}
              modules={[Autoplay, Pagination, Navigation]}
              className="mySwiper"
            >
              {upcomingEvents.map((event) => (
                <SwiperSlide key={event.id}>
                  <div className="flex justify-center">
                    <EventCard {...event} />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <p className="text-blancGlacialNeutre text-xl text-center">
              Aucun événement à l'affiche pour le moment.
            </p>
          )}
        </div>
      </section>

      <section
        className="relative py-16 px-6 bg-cover bg-center"
        style={{
          backgroundImage: "url('/img/eventSoon.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative z-10">
          <h2 className="text-2xl font-bold text-blancGlacialNeutre mb-8 text-center">
            Événements à Venir
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map((event) => (
                <EventCard key={event.id} {...event} />
              ))
            ) : (
              <p className="text-blancGlacialNeutre text-xl text-center">
                Aucun événement à venir pour le moment.
              </p>
            )}
          </div>
        </div>
      </section>

      <section
        className="relative py-12 px-6 bg-cover bg-center"
        style={{
          backgroundImage: "url('/img/concert.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative z-10">
          <h2 className="text-2xl font-bold text-blancGlacialNeutre mb-8">Spectacles & Concerts</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.filter((event) => event.category === "Spectacle" || event.category === "Concert").length > 0 ? (
              upcomingEvents
                .filter((event) => event.category === "Spectacle" || event.category === "Concert")
                .map((event) => (
                  <EventCard key={event.id} {...event} />
                ))
            ) : (
              <p className="text-blancGlacialNeutre text-xl text-center">
                Aucun spectacle ou concert disponible pour le moment.
              </p>
            )}
          </div>
        </div>
      </section>

      <section
        className="relative py-12 px-6 bg-cover bg-center"
        style={{
          backgroundImage: "url('/img/festival.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative z-10">
          <h2 className="text-2xl font-bold text-blancGlacialNeutre mb-8">Festival & Culture</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.filter((event) => event.category === "Culture" || event.category === "Théâtre" || event.category === "Festival").length > 0 ? (
              upcomingEvents
                .filter((event) => event.category === "Culture" || event.category === "Théâtre" || event.category === "Festival")
                .map((event) => (
                  <EventCard key={event.id} {...event} />
                ))
            ) : (
              <p className="text-blancGlacialNeutre text-xl text-center">
                Aucun festival ou événement culturel disponible pour le moment.
              </p>
            )}
          </div>
        </div>
      </section>

      <section
        className="relative py-12 px-6 bg-cover bg-center"
        style={{
          backgroundImage: "url('/img/football.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative z-10">
          <h2 className="text-2xl font-bold text-blancGlacialNeutre mb-8">Sports & Loisirs</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.filter((event) => event.category === "Sport" || event.category === "Loisir").length > 0 ? (
              upcomingEvents
                .filter((event) => event.category === "Sport" || event.category === "Loisir")
                .map((event) => (
                  <EventCard key={event.id} {...event} />
                ))
            ) : (
              <p className="text-blancGlacialNeutre text-xl text-center">
                Aucun événement sportif disponible pour le moment.
              </p>
            )}
          </div>
        </div>
      </section>

      <section
        className="relative py-12 px-6 bg-cover bg-center"
        style={{
          backgroundImage: "url('/img/bgOther.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative z-10">
          <h2 className="text-2xl font-bold text-blancGlacialNeutre mb-8">Autres</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.filter((event) => event.category === "Autres" || event.category === "Conférence").length > 0 ? (
              upcomingEvents
                .filter((event) => event.category === "Autres" || event.category === "Conférence")
                .map((event) => (
                  <EventCard key={event.id} {...event} />
                ))
            ) : (
              <p className="text-blancGlacialNeutre text-xl text-center">
                Aucun autre événement disponible pour le moment.
              </p>
            )}
          </div>
        </div>
      </section>

      <section
        className="relative py-12 px-6 bg-cover bg-center"
        style={{
          backgroundImage: "url('/img/pastEvent.jpg')",
        }}
      >
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
              <p className="text-blancGlacialNeutre text-xl text-center">
                Aucun événement passé disponible pour le moment.
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}