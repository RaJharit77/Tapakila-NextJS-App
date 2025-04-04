"use client";

import EventCard from "@/components/EventCard";
import { useEventStore } from "@/stores/eventStore";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
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
    const [isLoading, setIsLoading] = useState(true);
    const searchParams = useSearchParams();
    const nameQuery = searchParams.get("name") || "";
    const locationQuery = searchParams.get("location") || "";
    const dateQuery = searchParams.get("date") || "";
    const categoryQuery = searchParams.get("category") || "";

    useEffect(() => {
        async function fetchEvents() {
            try {
                setIsLoading(true);
                let url = "/api/events";
                const params = new URLSearchParams();

                if (nameQuery) params.append("name", nameQuery);
                if (locationQuery) params.append("location", locationQuery);
                if (dateQuery) params.append("date", dateQuery);
                if (categoryQuery) params.append("category", categoryQuery);

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
            } finally {
                setIsLoading(false);
            }
        }
        fetchEvents();
    }, [setEvents, nameQuery, locationQuery, dateQuery, categoryQuery]);

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

                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="flex flex-col items-center">
                            <svg
                                className="animate-spin h-12 w-12 text-blancGlacialNeutre mb-4"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                            </svg>
                            <p className="text-blancGlacialNeutre text-xl">
                                Chargement des événements...
                            </p>
                        </div>
                    </div>
                ) : Object.entries(eventsByCategory).length > 0 ? (
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
                    <div className="text-center text-blancGlacialNeutre text-xl mt-44">
                        Aucun événement trouvé pour votre recherche.
                    </div>
                )}
            </div>
        </div>
    );
}