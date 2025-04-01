"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { BookATicket } from "@/app/actions";
import TicketTable from "@/components/TicketTable";
import { FaTicketAlt, FaSpinner } from "react-icons/fa";
import { toast } from "react-hot-toast";

interface Ticket {
    id: string;
    type: string;
    price: number;
    status: string;
    [x: string]: string | number | undefined;
}

export default function ReservationsPage() {
    const { data: session } = useSession();
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedType, setSelectedType] = useState<string>("EARLY_BIRD");
    const [ticketCount, setTicketCount] = useState<number>(1);
    const [isBooking, setIsBooking] = useState(false);

    useEffect(() => {
        async function fetchTickets() {
            try {
                const response = await fetch("/api/tickets");
                if (!response.ok) {
                    throw new Error("Failed to fetch tickets");
                }
                const data = await response.json();

                // Format tickets for display
                const formattedTickets = data.tickets?.map((ticket: any) => ({
                    id: ticket.ticket_id,
                    type: ticket.ticket_type,
                    price: ticket.ticket_price,
                    status: ticket.ticket_status,
                })) || [];

                setTickets(formattedTickets);
            } catch (error) {
                console.error("Error fetching tickets:", error);
                toast.error("Erreur lors du chargement des billets");
            } finally {
                setLoading(false);
            }
        }

        fetchTickets();
    }, []);

    const availableTickets = tickets.filter(t => t.status === "AVAILABLE");
    const userTickets = tickets.filter(t => t.user_id === session?.user?.id);

    const handleBookTickets = async () => {
        if (!session?.user?.id) {
            toast.error("Vous devez être connecté pour réserver des billets");
            return;
        }

        setIsBooking(true);
        try {
            const response = await BookATicket({
                data: {
                    userId: session.user.id,
                    ticketNumber: ticketCount,
                    ticketType: selectedType as "VIP" | "STANDARD" | "EARLY_BIRD",
                    requestType: "BOOK",
                },
            });

            if (response?.ok) {
                const result = await response.json();
                toast.success(`${result.count} billet(s) réservé(s) avec succès!`);
                // Refresh tickets after booking
                window.location.reload();
            } else {
                const error = await response?.json();
                toast.error(error.message || "Erreur lors de la réservation");
            }
        } catch (error) {
            console.error("Booking error:", error);
            toast.error("Erreur lors de la réservation");
        } finally {
            setIsBooking(false);
        }
    };

    const handleCancelTickets = async () => {
        if (!session?.user?.id) {
            toast.error("Vous devez être connecté pour annuler des billets");
            return;
        }

        setIsBooking(true);
        try {
            const response = await BookATicket({
                data: {
                    userId: session.user.id,
                    ticketNumber: ticketCount,
                    ticketType: selectedType as "VIP" | "STANDARD" | "EARLY_BIRD",
                    requestType: "CANCEL",
                },
            });

            if (response?.ok) {
                const result = await response.json();
                toast.success(`${result.count} billet(s) annulé(s) avec succès!`);
                // Refresh tickets after cancellation
                window.location.reload();
            } else {
                const error = await response?.json();
                toast.error(error.message || "Erreur lors de l'annulation");
            }
        } catch (error) {
            console.error("Cancellation error:", error);
            toast.error("Erreur lors de l'annulation");
        } finally {
            setIsBooking(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <FaSpinner className="animate-spin text-4xl text-bleuNuit" />
            </div>
        );
    }

    return (
        <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-blancGlacialNeutre">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-bleuNuit mb-8 flex items-center">
                    <FaTicketAlt className="mr-2" />
                    Réservation de billets
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-blancCasse p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-bold text-bleuNuit mb-4">
                            Réserver des billets
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-bleuNuit mb-1">
                                    Type de billet
                                </label>
                                <select
                                    value={selectedType}
                                    onChange={(e) => setSelectedType(e.target.value)}
                                    className="w-full p-2 border border-grisAnthracite rounded-md"
                                >
                                    <option value="EARLY_BIRD">Early Bird</option>
                                    <option value="STANDARD">Standard</option>
                                    <option value="VIP">VIP</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-bleuNuit mb-1">
                                    Nombre de billets
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max="5"
                                    value={ticketCount}
                                    onChange={(e) => setTicketCount(parseInt(e.target.value))}
                                    className="w-full p-2 border border-grisAnthracite rounded-md"
                                />
                            </div>

                            <button
                                onClick={handleBookTickets}
                                disabled={isBooking}
                                className="w-full bg-bleuElec text-white py-2 px-4 rounded-md hover:bg-bleuNuit transition-colors disabled:opacity-50"
                            >
                                {isBooking ? (
                                    <span className="flex items-center justify-center">
                                        <FaSpinner className="animate-spin mr-2" />
                                        Réservation en cours...
                                    </span>
                                ) : (
                                    "Réserver"
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="bg-blancCasse p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-bold text-bleuNuit mb-4">
                            Annuler des réservations
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-bleuNuit mb-1">
                                    Type de billet
                                </label>
                                <select
                                    value={selectedType}
                                    onChange={(e) => setSelectedType(e.target.value)}
                                    className="w-full p-2 border border-grisAnthracite rounded-md"
                                >
                                    <option value="EARLY_BIRD">Early Bird</option>
                                    <option value="STANDARD">Standard</option>
                                    <option value="VIP">VIP</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-bleuNuit mb-1">
                                    Nombre de billets à annuler
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max="5"
                                    value={ticketCount}
                                    onChange={(e) => setTicketCount(parseInt(e.target.value))}
                                    className="w-full p-2 border border-grisAnthracite rounded-md"
                                />
                            </div>

                            <button
                                onClick={handleCancelTickets}
                                disabled={isBooking}
                                className="w-full bg-rougeError text-white py-2 px-4 rounded-md hover:bg-rougeErrorDark transition-colors disabled:opacity-50"
                            >
                                {isBooking ? (
                                    <span className="flex items-center justify-center">
                                        <FaSpinner className="animate-spin mr-2" />
                                        Annulation en cours...
                                    </span>
                                ) : (
                                    "Annuler"
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-8">
                    <h2 className="text-2xl font-bold text-bleuNuit mb-4">
                        Billets disponibles
                    </h2>
                    <TicketTable tickets={availableTickets} />
                </div>

                {userTickets.length > 0 && (
                    <div className="mt-8">
                        <h2 className="text-2xl font-bold text-bleuNuit mb-4">
                            Mes billets réservés
                        </h2>
                        <TicketTable tickets={userTickets} />
                    </div>
                )}
            </div>
        </div>
    );
}