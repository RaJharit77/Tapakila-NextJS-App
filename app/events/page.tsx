"use client";

import { Suspense } from "react";
import EventCard from "@/components/EventCard";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import useSWR from "swr";
import Spinner from "@/components/Spinner";

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

const fetcher = async (url: string) => {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error("Erreur lors du chargement des événements");
    }
    const rawEvents: ApiEvent[] = await response.json();
    return rawEvents.map((event) => ({
        id: event.event_id,
        name: event.event_name,
        date: new Date(event.event_date).toISOString(),
        location: event.event_place,
        description: event.event_description,
        imageUrl: event.event_image,
        category: event.event_category || "Autres",
    }));
};

function EventsContent() {
    const searchParams = useSearchParams();
    const nameQuery = searchParams.get("name") || "";
    const locationQuery = searchParams.get("location") || "";
    const dateQuery = searchParams.get("date") || "";
    const categoryQuery = searchParams.get("category") || "";

    let url = "/api/events";
    const params = new URLSearchParams();

    if (nameQuery) params.append("name", nameQuery);
    if (locationQuery) params.append("location", locationQuery);
    if (dateQuery) params.append("date", dateQuery);
    if (categoryQuery) params.append("category", categoryQuery);

    if (params.toString()) url += `?${params.toString()}`;

    const { data: events, error, isLoading } = useSWR<Event[]>(url, fetcher, {
        refreshInterval: 5000,
        revalidateOnFocus: true,
    });

    const eventsByCategory = events?.reduce((acc: Record<string, Event[]>, event) => {
        if (!acc[event.category]) {
            acc[event.category] = [];
        }
        acc[event.category].push(event);
        return acc;
    }, {}) || {};

    return (
        <div className="min-h-screen py-32 px-4 sm:px-6 lg:px-8 relative">
            <Image
                src="/img/bgEvent.jpg"
                alt="Background événements"
                fill
                className="object-cover"
                priority
            />
            <div className="absolute inset-0 bg-bleuNuit/90 backdrop-blur-sm pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
                        Tous les <span className="text-bleuElec">Événements</span>
                    </h1>
                    <p className="text-gray-300 max-w-2xl mx-auto">
                        Trouvez l'événement qui vous correspond et réservez vos billets en un clic.
                    </p>
                </div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Spinner size="lg" color="text-bleuElec" />
                        <p className="mt-4 text-white font-medium animate-pulse">Chargement des événements...</p>
                    </div>
                ) : error ? (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-8 text-center max-w-lg mx-auto backdrop-blur-md">
                        <p className="text-red-400 text-lg font-medium">Erreur lors du chargement des événements.</p>
                        <button onClick={() => window.location.reload()} className="mt-4 bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors">
                            Réessayer
                        </button>
                    </div>
                ) : Object.entries(eventsByCategory).length > 0 ? (
                    Object.entries(eventsByCategory).map(([category, categoryEvents]) => (
                        <section key={category} className="mb-16">
                            <div className="flex items-center gap-4 mb-8">
                                <h2 className="text-2xl sm:text-3xl font-bold text-orMetallique">
                                    {category}
                                </h2>
                                <div className="h-px bg-white/20 flex-1"></div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center">
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
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-12 text-center max-w-lg mx-auto shadow-xl">
                        <p className="text-white text-2xl font-bold mb-2">Aucun événement trouvé.</p>
                        <p className="text-gray-400">Essayez de modifier vos critères de recherche ou revenez plus tard.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function EventsPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen flex flex-col items-center justify-center bg-bleuNuit">
                    <Spinner size="lg" color="text-bleuElec" />
                    <p className="mt-4 text-white animate-pulse">Chargement...</p>
                </div>
            }
        >
            <EventsContent />
        </Suspense>
    );
}