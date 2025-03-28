"use client";

import EventCard from "@/components/EventCard";
import { useEventStore } from "@/stores/eventStore";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

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
                if (nameQuery) {
                    url += `?name=${encodeURIComponent(nameQuery)}`;
                } else if (locationQuery) {
                    url += `?location=${encodeURIComponent(locationQuery)}`;
                } else if (dateQuery) {
                    url += `?date=${encodeURIComponent(dateQuery)}`;
                }

                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error("Erreur lors du chargement des événements");
                }
                const rawEvents = await response.json();
                const formattedEvents = rawEvents.map((event: any) => ({
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
                console.error(error);
            }
        }
        fetchEvents();
    }, [setEvents, nameQuery, locationQuery, dateQuery]);

    const eventsByCategory = events.reduce((acc: Record<string, any[]>, event: any) => {
        if (!acc[event.category]) {
            acc[event.category] = [];
        }
        acc[event.category].push(event);
        return acc;
    }, {} as Record<string, any[]>);

    return (
        <div
            className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 relative bg-cover bg-center"
            style={{
                backgroundImage: "url('/img/bgEvent.jpg')"
            }}
        >
            <div className="absolute inset-0 bg-black bg-opacity-60 pointer-events-none"></div>
            <div className="p-16 relative z-10">
                <h1 className="text-4xl font-bold text-bleuNuit text-center mb-8">
                    Événements
                </h1>
                {Object.entries(eventsByCategory).length > 0 ? (
                    Object.entries(eventsByCategory).map(([category, events]) => (
                        <section key={category} className="mb-12">
                            <h2 className="text-3xl font-bold text-bleuNuit mb-6">
                                {category}
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {(events as any[]).map((event: any) => (
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