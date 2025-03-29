"use client";

import EventCard from "@/components/EventCard";
import { useEventStore } from "@/stores/eventStore";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";

interface Event {
    id: string;
    name: string;
    date: string;
    location: string;
    description: string;
    imageUrl: string;
    category: string;
}

interface ApiEvent {
    event_id: string;
    event_name: string;
    event_date: string;
    event_place: string;
    event_description: string;
    event_image: string;
    event_category?: string;
}

export default function EventsPage() {
    const { events, setEvents } = useEventStore();
    const searchParams = useSearchParams();
    const nameQuery = searchParams.get("name") || "";
    const locationQuery = searchParams.get("location") || "";
    const dateQuery = searchParams.get("date") || "";

    useEffect(() => {
        async function fetchEvents() {
            try {
                let url = "/api/events";
                const params = new URLSearchParams();

                if (nameQuery) params.append("name", nameQuery);
                if (locationQuery) params.append("location", locationQuery);
                if (dateQuery) params.append("date", dateQuery);

                if (params.toString()) url += `?${params.toString()}`;

                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error("Erreur lors du chargement des événements");
                }

                const rawEvents: ApiEvent[] = await response.json();
                const formattedEvents: Event[] = rawEvents.map((event) => ({
                    id: event.event_id,
                    name: event.event_name,
                    date: new Date(event.event_date).toISOString(),
                    location: event.event_place,
                    description: event.event_description,
                    imageUrl: event.event_image,
                    category: event.event_category || "Autres",
                }));

                setEvents(formattedEvents);
            } catch (error) {
                console.error("Erreur de chargement:", error);
            }
        }
        fetchEvents();
    }, [setEvents, nameQuery, locationQuery, dateQuery]);

    const eventsByCategory = events.reduce((acc: Record<string, Event[]>, event) => {
        if (!acc[event.category]) {
            acc[event.category] = [];
        }
        acc[event.category].push(event);
        return acc;
    }, {});

    return (
        <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 relative">
            <Image
                src="/img/bgEvent.jpg"
                alt="Background événements"
                fill
                className="object-cover"
                quality={80}
                priority
            />
            <div className="absolute inset-0 bg-black bg-opacity-60 pointer-events-none" />

            <div className="p-16 relative z-10">
                <h1 className="text-4xl font-bold text-bleuNuit text-center mb-8">
                    Événements
                </h1>

                {Object.entries(eventsByCategory).length > 0 ? (
                    Object.entries(eventsByCategory).map(([category, categoryEvents]) => (
                        <section key={category} className="mb-12">
                            <h2 className="text-3xl font-bold text-bleuNuit mb-6">
                                {category}
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {categoryEvents.map((event) => (
                                    <EventCard
                                        key={event.id}
                                        id={event.id}
                                        name={event.name}
                                        date={event.date}
                                        location={event.location}
                                        description={event.description}
                                        imageUrl={event.imageUrl}
                                    />
                                ))}
                            </div>
                        </section>
                    ))
                ) : (
                    <div className="text-center text-blancGlacialNeutre text-xl">
                        Aucun événement trouvé pour votre recherche.
                    </div>
                )}
            </div>
        </div>
    );
}