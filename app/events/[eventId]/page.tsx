"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { useEffect, useState } from "react";
import { FaArrowLeft, FaTicketAlt, FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";
import TicketTable from "@/components/TicketTable";
import { useEventDetailStore } from "@/stores/eventDetailStore";
import useSWR from "swr";
import Spinner from "@/components/Spinner";

interface Event {
    event_id: string;
    event_name: string;
    event_description: string;
    event_date: string;
    event_place: string;
    event_image: string;
    event_category?: string;
    tickets: {
        ticket_id: string;
        ticket_type: string;
        ticket_price: number;
        ticket_status: string;
    }[];
}

const fetcher = async (url: string) => {
    const response = await fetch(url);
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Événement non trouvé");
    }
    return response.json();
};

export default function EventPage() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const { eventId } = useParams() as { eventId: string };
    const router = useRouter();
    const { event, setEvent, setLoading, setError, clearEvent } = useEventDetailStore();

    const { error, isLoading } = useSWR<Event>(
        eventId ? `/api/events/${eventId}` : null,
        fetcher,
        {
            revalidateOnFocus: false,
            onSuccess: (data: Event) => {
                setEvent({
                    id: data.event_id,
                    name: data.event_name,
                    description: data.event_description,
                    date: data.event_date,
                    location: data.event_place,
                    imageUrl: data.event_image,
                    category: data.event_category || "Autres",
                    tickets: data.tickets.map(ticket => ({
                        id: ticket.ticket_id,
                        type: ticket.ticket_type,
                        price: ticket.ticket_price,
                        status: ticket.ticket_status
                    }))
                });
                setLoading(false);
                setError(null);
            },
            onError: (err) => {
                setError(err.message);
                setLoading(false);
            }
        }
    );

    useEffect(() => {
        const user = localStorage.getItem("user");
        setIsLoggedIn(!!user);

        return () => {
            clearEvent();
        };
    }, [clearEvent]);

    const handleReservationClick = () => {
        if (!isLoggedIn) {
            toast.error("Veuillez vous connecter pour effectuer une réservation", {
                duration: 4000,
                position: "top-center",
            });
            router.push("/login");
            return;
        }
        router.push(`/dashboard/reservations?eventId=${eventId}`);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center relative bg-bleuNuit">
                <Image src="/img/bgEventId.jpg" alt="Background" fill className="object-cover opacity-40" priority />
                <div className="relative z-10 flex flex-col items-center">
                    <Spinner size="lg" color="text-bleuElec" />
                    <p className="mt-6 text-white font-medium animate-pulse">Chargement de l'événement...</p>
                </div>
            </div>
        );
    }

    if (error || !event) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center relative bg-bleuNuit px-4">
                <Image src="/img/bgEventId.jpg" alt="Background" fill className="object-cover opacity-40" priority />
                <div className="relative z-10 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10 text-center max-w-md w-full shadow-2xl">
                    <div className="w-16 h-16 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-2xl font-bold">!</span>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-4">Erreur</h2>
                    <p className="text-gray-300 mb-8">{error?.message || "Événement non trouvé"}</p>
                    <button onClick={() => router.back()} className="w-full bg-bleuElec hover:bg-orMetallique hover:text-bleuNuit text-white font-bold py-3 rounded-xl transition-all duration-300">
                        Retour
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-32 px-4 sm:px-6 lg:px-8 relative">
            {/* Background */}
            <Image src="/img/bgEventId.jpg" alt="Background" fill className="object-cover" priority />
            <div className="absolute inset-0 bg-bleuNuit/90 backdrop-blur-sm pointer-events-none" />

            <div className="relative z-10 max-w-5xl mx-auto">
                {/* Bouton Retour */}
                <button
                    onClick={() => router.back()}
                    className="mb-8 flex items-center gap-2 text-gray-300 hover:text-orMetallique transition-colors bg-white/5 px-4 py-2 rounded-full backdrop-blur-md w-max border border-white/10"
                >
                    <FaArrowLeft />
                    Retour aux événements
                </button>

                {/* Carte Principale */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">

                    {/* Image de couverture */}
                    <div className="relative w-full h-75 sm:h-100">
                        <Image
                            src={event.imageUrl}
                            alt={event.name}
                            fill
                            className="object-cover"
                            priority
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-bleuNuit to-transparent opacity-80"></div>
                        <div className="absolute bottom-6 left-6 right-6">
                            <span className="inline-block bg-orMetallique text-bleuNuit text-sm font-bold px-4 py-1.5 rounded-full mb-4 shadow-lg">
                                {event.category}
                            </span>
                            <h1 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight drop-shadow-lg">
                                {event.name}
                            </h1>
                        </div>
                    </div>

                    {/* Contenu */}
                    <div className="p-6 sm:p-10">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                            {/* Colonne Infos */}
                            <div className="lg:col-span-2 space-y-8">
                                <div>
                                    <h2 className="text-xl font-bold text-orMetallique mb-3">À propos de l'événement</h2>
                                    <p className="text-gray-300 leading-relaxed text-base sm:text-lg">
                                        {event.description}
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-black/20 p-6 rounded-2xl border border-white/5">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-bleuElec/20 rounded-full flex items-center justify-center shrink-0">
                                            <FaCalendarAlt className="text-bleuElec text-xl" />
                                        </div>
                                        <div>
                                            <h3 className="text-white font-semibold mb-1">Date et Heure</h3>
                                            <p className="text-gray-400 text-sm">
                                                {new Date(event.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                                <br />
                                                à {new Date(event.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-orMetallique/20 rounded-full flex items-center justify-center shrink-0">
                                            <FaMapMarkerAlt className="text-orMetallique text-xl" />
                                        </div>
                                        <div>
                                            <h3 className="text-white font-semibold mb-1">Lieu</h3>
                                            <p className="text-gray-400 text-sm">{event.location}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Colonne Billets */}
                            <div className="lg:col-span-1">
                                <div className="bg-black/30 rounded-2xl p-6 border border-white/10 shadow-xl">
                                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                        <FaTicketAlt className="text-orMetallique" />
                                        Billets
                                    </h2>

                                    <div className="mb-6">
                                        <TicketTable
                                            tickets={event.tickets?.map(ticket => ({
                                                id: ticket.id,
                                                type: ticket.type,
                                                price: ticket.price,
                                                status: ticket.status,
                                            })) || []}
                                        />
                                    </div>

                                    <button
                                        onClick={handleReservationClick}
                                        className="w-full py-4 rounded-xl flex items-center justify-center font-bold text-lg bg-bleuElec text-white hover:bg-orMetallique hover:text-bleuNuit transition-all duration-300 shadow-[0_0_15px_rgba(0,119,255,0.4)] hover:shadow-[0_0_25px_rgba(255,186,8,0.6)] transform hover:-translate-y-1"
                                    >
                                        {isLoggedIn ? "Réserver maintenant" : "Se connecter pour réserver"}
                                    </button>
                                    <p className="text-center text-xs text-gray-400 mt-4">
                                        Paiement 100% sécurisé
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}