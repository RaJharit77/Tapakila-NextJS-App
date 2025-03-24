"use client";

import TicketTable from "@/components/TicketTable";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaArrowLeft, FaTicketAlt } from "react-icons/fa";

export default function EventPage({ params }: { params: { eventId: string } }) {
    const [event, setEvent] = useState<any>(null);
    const { eventId } = useParams() as { eventId: string };
    const router = useRouter();

    useEffect(() => {
        async function fetchEvent() {
            try {
                const response = await fetch(`/api/events/${eventId}`);
                if (!response.ok) {
                    throw new Error("Événement non trouvé");
                }
                const eventData = await response.json();
                setEvent(eventData);
            } catch (error) {
                console.error(error);
            }
        }
        fetchEvent();
    }, [eventId]);

    if (!event) {
        return <div className="text-center text-bleuNuit mt-8">Événement non trouvé</div>;
    }

    return (
        <div
            className="min-h-screen py-40 px-4 sm:px-6 lg:px-8 relative bg-cover bg-center"
            style={{
                backgroundImage: "url('/img/bgEventId.jpg')",
            }}
        >
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

                    <div className="w-full h-[400px] sm:h-[500px] lg:h-[600px] overflow-hidden rounded-xl mb-8">
                        <img
                            src={event.event_image}
                            alt={event.event_name}
                            className="w-full h-full object-cover object-center"
                            loading="lazy"
                        />
                    </div>

                    <h1 className="text-4xl font-bold text-bleuNuit mb-6">{event.event_name}</h1>
                    <p className="text-lg text-grisAnthracite mb-8">{event.event_description}</p>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div>
                            <div className="mb-6">
                                <h2 className="text-2xl font-semibold text-bleuNuit mb-2">Date et Heure</h2>
                                <p className="text-grisAnthracite">
                                    {new Date(event.event_date).toLocaleDateString()} -{" "}
                                    {new Date(event.event_date).toLocaleTimeString()}
                                </p>
                            </div>
                            <div className="mb-6">
                                <h2 className="text-2xl font-semibold text-bleuNuit mb-2">Lieu</h2>
                                <p className="text-grisAnthracite">{event.event_place}</p>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-2xl font-semibold text-bleuNuit mb-6">Billets Disponibles</h2>
                            <TicketTable
                                tickets={event.tickets.map((ticket: any) => ({
                                    id: ticket.ticket_id,
                                    type: ticket.ticket_type,
                                    price: ticket.ticket_price,
                                    status: ticket.ticket_status,
                                }))}
                            />

                            <button
                                onClick={() => {
                                    alert("Fonctionnalité de réservation à implémenter !");
                                }}
                                className="mt-6 w-full bg-bleuElec text-blancCasse px-4 py-2 rounded-lg hover:bg-bleuNuit transition-colors flex items-center justify-center"
                            >
                                <FaTicketAlt className="mr-2" />
                                Réserver
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}