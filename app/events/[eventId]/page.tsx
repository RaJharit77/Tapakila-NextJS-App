"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { useEffect, useState } from "react";
import { FaArrowLeft, FaTicketAlt } from "react-icons/fa";
import TicketTable from "@/components/TicketTable";
import { useEventDetailStore } from "@/stores/eventDetailStore";
import useSWR from "swr";

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

    const { data, error, isLoading } = useSWR<Event>(
        eventId ? `/api/events/${eventId}` : null,
        fetcher,
        {
            refreshInterval: 30000,
            revalidateOnFocus: true,
            revalidateOnReconnect: true,
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
    }, []);

    const handleReservationClick = () => {
        if (!isLoggedIn) {
            toast.error("Veuillez vous connecter pour effectuer une réservation", {
                duration: 4000,
                position: "top-center",
                style: {
                    backgroundColor: "#f87171",
                    color: "#fff",
                },
                icon: "🔒",
                ariaProps: {
                    role: 'status',
                    'aria-live': 'polite',
                },
            });
            return;
        }

        router.push(`/dashboard/reservations?eventId=${eventId}`);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center relative">
                <Image
                    src="/img/bgEventId.jpg"
                    alt="Background"
                    fill
                    className="object-cover"
                    quality={80}
                    priority
                />
                <div className="absolute inset-0 bg-black bg-opacity-70 pointer-events-none"></div>
                <div className="relative z-10 text-center text-blancGlacialNeutre text-xl">
                    Chargement...
                </div>
            </div>
        );
    }

    if (error || !event) {
        return (
            <div className="min-h-screen flex items-center justify-center relative">
                <Image
                    src="/img/bgEventId.jpg"
                    alt="Background"
                    fill
                    className="object-cover"
                    quality={80}
                    priority
                />
                <div className="absolute inset-0 bg-black bg-opacity-70 pointer-events-none"></div>
                <div className="relative z-10 text-center text-red-500 text-xl">
                    {error?.message || "Événement non trouvé"}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-40 px-4 sm:px-6 lg:px-8 relative">
            <Image
                src="/img/bgEventId.jpg"
                alt="Background"
                fill
                className="object-cover"
                quality={80}
                priority
            />
            <div className="absolute inset-0 bg-black bg-opacity-70 pointer-events-none"></div>

            <div className="relative z-10 flex justify-center">
                <div className="w-full max-w-3xl bg-blancCasse rounded-lg shadow-lg p-8">
                    <button
                        onClick={() => router.back()}
                        className="mb-6 flex items-center text-bleuNuit hover:text-bleuElec transition-colors"
                    >
                        <FaArrowLeft className="mr-2" />
                        Retour
                    </button>

                    <div className="w-full h-[400px] sm:h-[500px] relative mb-8">
                        <div className="relative w-full h-full rounded-xl overflow-hidden">
                            <Image
                                src={event.imageUrl}
                                alt={event.name}
                                fill
                                className="object-contain"
                                style={{ objectPosition: 'center' }}
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                priority
                            />
                        </div>
                    </div>

                    <h1 className="text-3xl font-bold text-bleuNuit mb-6">
                        {event.name}
                    </h1>
                    <p className="text-lg text-grisAnthracite mb-8">
                        {event.description}
                    </p>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div>
                            <div className="mb-6">
                                <h2 className="text-xl font-semibold text-bleuNuit mb-2">
                                    Date et Heure
                                </h2>
                                <p className="text-grisAnthracite">
                                    {new Date(event.date).toLocaleDateString('fr-FR', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric'
                                    })} -{" "}
                                    {new Date(event.date).toLocaleTimeString('fr-FR', {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </p>
                            </div>
                            <div className="mb-6">
                                <h2 className="text-xl font-semibold text-bleuNuit mb-2">
                                    Lieu
                                </h2>
                                <p className="text-grisAnthracite">{event.location}</p>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold text-bleuNuit mb-6">
                                Billets Disponibles
                            </h2>

                            <TicketTable
                                tickets={event.tickets?.map(ticket => ({
                                    id: ticket.id,
                                    type: ticket.type,
                                    price: ticket.price,
                                    status: ticket.status,
                                })) || []}
                            />

                            <button
                                onClick={handleReservationClick}
                                className={`mt-6 w-full px-4 py-3 rounded-lg flex items-center justify-center ${
                                    isLoggedIn 
                                        ? "bg-bleuElec text-blancCasse hover:bg-bleuNuit hover:text-orMetallique transition-colors"
                                        : "bg-bleuElec text-blancGlacialNeutre cursor-not-allowed"
                                }`}
                            >
                                <FaTicketAlt className="mr-2" />
                                {isLoggedIn ? "Réserver maintenant" : "Connectez-vous pour réserver"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}