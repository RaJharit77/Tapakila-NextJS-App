"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { useEffect, useState } from "react";
import { FaArrowLeft, FaTicketAlt } from "react-icons/fa";
import TicketTable from "@/components/TicketTable";

interface Event {
    event_id: string;
    event_name: string;
    event_description: string;
    event_date: string;
    event_place: string;
    event_image: string;
    tickets: {
        ticket_id: string;
        ticket_type: string;
        ticket_price: number;
        ticket_status: string;
    }[];
}

export default function EventPage() {
    const [event, setEvent] = useState<Event | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const { eventId } = useParams() as { eventId: string };
    const router = useRouter();

    useEffect(() => {
        async function fetchEvent() {
            if (!eventId) {
                setError("Event ID is missing");
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`/api/events/${eventId}`);
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || "Événement non trouvé");
                }
                const eventData = await response.json();
                setEvent(eventData);
            } catch (err) {
                console.error(err);
                setError(err instanceof Error ? err.message : "Une erreur s'est produite");
            } finally {
                setLoading(false);
            }
        }
        fetchEvent();
    }, [eventId]);

    const handleReservationClick = () => {
        const user = localStorage.getItem("user");

        if (!user) {
            toast.error("Veuillez vous connecter ou créer un compte pour réserver", {
                duration: 3000,
                position: "top-center",
                style: {
                    backgroundColor: "#f87171",
                    color: "#fff",
                },
                icon: "🔒",
            });
        }
    };

    if (loading) {
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
                    {error || "Événement non trouvé"}
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

            <div className="relative z-10">
                <div className="max-w-4xl mx-auto bg-blancCasse rounded-lg shadow-lg p-8">
                    <button
                        onClick={() => router.back()}
                        className="mb-6 flex items-center text-bleuNuit hover:text-bleuElec transition-colors"
                    >
                        <FaArrowLeft className="mr-2" />
                        Retour
                    </button>

                    <div className="w-full h-[400px] sm:h-[500px] lg:h-[600px] relative overflow-hidden rounded-xl mb-8">
                        <Image
                            src={event.event_image}
                            alt={event.event_name}
                            fill
                            className="object-cover object-center"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    </div>

                    <h1 className="text-4xl font-bold text-bleuNuit mb-6">
                        {event.event_name}
                    </h1>
                    <p className="text-lg text-grisAnthracite mb-8">
                        {event.event_description}
                    </p>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div>
                            <div className="mb-6">
                                <h2 className="text-2xl font-semibold text-bleuNuit mb-2">
                                    Date et Heure
                                </h2>
                                <p className="text-grisAnthracite">
                                    {new Date(event.event_date).toLocaleDateString()} -{" "}
                                    {new Date(event.event_date).toLocaleTimeString()}
                                </p>
                            </div>
                            <div className="mb-6">
                                <h2 className="text-2xl font-semibold text-bleuNuit mb-2">
                                    Lieu
                                </h2>
                                <p className="text-grisAnthracite">{event.event_place}</p>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-2xl font-semibold text-bleuNuit mb-6">
                                Billets Disponibles
                            </h2>

                            <TicketTable
                                tickets={event.tickets.map(ticket => ({
                                    id: ticket.ticket_id,
                                    type: ticket.ticket_type,
                                    price: ticket.ticket_price,
                                    status: ticket.ticket_status,
                                }))}
                            />

                            <Link
                                onClick={handleReservationClick}
                                href={`/dashboard/reservations`}
                                className="mt-6 w-full bg-bleuElec text-blancCasse px-4 py-2 rounded-lg hover:bg-bleuNuit transition-colors flex items-center justify-center"
                            >
                                <FaTicketAlt className="mr-2" />
                                Réserver
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}