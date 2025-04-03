"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { BookATicket } from "@/app/actions";
import TicketTable from "@/components/TicketTable";
import { FaTicketAlt, FaSpinner, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

interface Ticket {
    id: string;
    type: string;
    price: number;
    status: string;
    user_id?: string;
    event_id?: string;
    event_name?: string;
    event_image?: string;
    event_date?: string;
    event_place?: string;
}

export default function ReservationsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedType, setSelectedType] = useState<string>("EARLY_BIRD");
    const [ticketCount, setTicketCount] = useState<number>(1);
    const [isBooking, setIsBooking] = useState(false);
    const [step, setStep] = useState<"selection" | "confirmation" | "completed">("selection");
    const [reservationDetails, setReservationDetails] = useState<any>(null);
    const [eventDetails, setEventDetails] = useState<any>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const eventId = searchParams.get("eventId") || "";

    useEffect(() => {
        if (!eventId) {
            toast.error("No event selected - redirecting...");
            router.push("/events");
        }
    }, [eventId, router]);

    useEffect(() => {
        console.log("Authentication status:", status);
        console.log("Session data:", session);
    }, [status, session])

    useEffect(() => {
        const checkAuth = () => {
            const localUser = localStorage.getItem('user');
            const localUserId = localStorage.getItem('user_id');
            let userId = session?.user?.id;
        
            if (!userId && localUser) {
                try {
                    const userData = JSON.parse(localUser);
                    userId = userData.id || localUserId;
                } catch (e) {
                    console.error("Failed to parse user data from localStorage", e);
                }
            }
        
            const isAuth = status === "authenticated" || !!localUser;
            setIsAuthenticated(isAuth);
        
            console.log("Auth status:", {
                nextAuthStatus: status,
                hasLocalUser: !!localUser,
                isAuthenticated: isAuth,
                userId: userId
            });
        };

        checkAuth();
        window.addEventListener('storage', checkAuth);

        return () => {
            window.removeEventListener('storage', checkAuth);
        };
    }, [status, session]);

    useEffect(() => {
        async function fetchData() {
            try {
                const ticketsUrl = eventId ? `/api/tickets?idEvent=${eventId}` : "/api/tickets";
                const ticketsResponse = await fetch(ticketsUrl);

                if (!ticketsResponse.ok) throw new Error("Failed to fetch tickets");

                const ticketsData = await ticketsResponse.json();
                const formattedTickets = ticketsData.tickets?.map((ticket: any) => ({
                    id: ticket.ticket_id,
                    type: ticket.ticket_type,
                    price: ticket.ticket_price,
                    status: ticket.ticket_status,
                    user_id: ticket.user_id,
                    event_id: ticket.event_id
                })) || [];

                setTickets(formattedTickets);

                if (eventId) {
                    const eventResponse = await fetch(`/api/events/${eventId}`);
                    if (eventResponse.ok) {
                        const eventData = await eventResponse.json();
                        setEventDetails({
                            name: eventData.event_name,
                            image: eventData.event_image,
                            date: eventData.event_date,
                            place: eventData.event_place
                        });
                    }
                }

            } catch (error) {
                console.error("Error fetching data:", error);
                toast.error("Erreur lors du chargement des données");
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [eventId]);

    const availableTickets = tickets.filter(t => t.status === "AVAILABLE");
    const userTickets = tickets.filter(t =>
        t.user_id === session?.user?.id ||
        t.user_id === localStorage.getItem('user_id')
    );

    const handleBookTickets = async () => {
        if (!isAuthenticated) {
            toast.error("Vous devez être connecté pour réserver des billets");
            return;
        }

        const availableCount = availableTickets
            .filter(t => t.type === selectedType)
            .length;

        if (availableCount < ticketCount) {
            toast.error(`Seulement ${availableCount} billets disponibles pour ce type`);
            return;
        }

        setReservationDetails({
            type: selectedType,
            count: ticketCount,
            price: availableTickets.find(t => t.type === selectedType)?.price || 0,
            total: (availableTickets.find(t => t.type === selectedType)?.price || 0) * ticketCount
        });
        setStep("confirmation");
    };

    const confirmReservation = async () => {
        if (!isAuthenticated || !reservationDetails) {
            toast.error("Authentication or reservation details missing");
            return;
        }

        let userId = session?.user?.id;
        if (!userId) {
            userId = localStorage.getItem('user_id') || '';
            if (!userId) {
                toast.error("User ID is missing - please login again");
                return;
            }
        }

        if (!eventId) {
            toast.error("Event ID is missing - please select an event");
            return;
        }

        setIsBooking(true);
        try {
            const result = await BookATicket({
                data: {
                    userId: userId,
                    ticketNumber: reservationDetails.count,
                    ticketType: reservationDetails.type as "VIP" | "STANDARD" | "EARLY_BIRD",
                    requestType: "BOOK",
                    eventId: eventId
                },
            });

            if (!result) {
                throw new Error("Server did not respond - please try again later");
            }

            if (result.status !== 200) {
                throw new Error(result.message || "Failed to process reservation");
            }

            setStep("completed");
            toast.success(`${result.count} ticket(s) reserved successfully!`);

        } catch (error) {
            console.error("Booking error:", error);
            toast.error(error instanceof Error ? error.message : "Reservation failed");
            setStep("selection");
        } finally {
            setIsBooking(false);
        }
    };

    const handleCancelTickets = async () => {
        if (!isAuthenticated) {
            toast.error("Vous devez être connecté pour annuler des billets");
            return;
        }

        let userId = session?.user?.id;
        if (!userId) {
            userId = localStorage.getItem('user_id') || '';
            if (!userId) {
                toast.error("User ID is missing - please login again");
                return;
            }
        }

        if (!eventId) {
            toast.error("Event ID is missing - please select an event");
            return;
        }

        setIsBooking(true);
        try {
            const result = await BookATicket({
                data: {
                    userId: userId,
                    ticketNumber: ticketCount,
                    ticketType: selectedType as "VIP" | "STANDARD" | "EARLY_BIRD",
                    requestType: "CANCEL",
                    eventId: eventId
                },
            });

            if (!result) {
                throw new Error("No response from server");
            }

            if (result.status === 200) {
                toast.success(`${result.count} billet(s) annulé(s) avec succès!`);
                router.refresh();
            } else {
                throw new Error(result.message || "Erreur lors de l'annulation");
            }
        } catch (error) {
            console.error("Cancellation error:", error);
            toast.error(error instanceof Error ? error.message : "Erreur lors de l'annulation");
        } finally {
            setIsBooking(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen relative">
                <Image
                    src="/img/bgReservation.jpg"
                    alt="Background"
                    fill
                    className="object-cover"
                    quality={100}
                    priority
                />
                <div className="absolute inset-0 bg-black bg-opacity-70"></div>
                <div className="relative z-10">
                    <FaSpinner className="animate-spin text-4xl text-bleuNuit" />
                </div>
            </div>
        );
    }

    if (step === "confirmation" && reservationDetails) {
        return (
            <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 relative">
                <Image
                    src="/img/bgReservation.jpg"
                    alt="Background"
                    fill
                    className="object-cover"
                    quality={100}
                    priority
                />
                <div className="absolute inset-0 bg-black bg-opacity-70"></div>
                <div className="relative z-10">
                    <div className="max-w-4xl mx-auto bg-bleuNuit bg-opacity-70 p-6 rounded-lg shadow-md">
                        <h1 className="text-3xl font-bold text-blancCasse mb-6 flex items-center">
                            <FaTicketAlt className="mr-2" />
                            Confirmation de réservation
                        </h1>

                        {eventDetails && (
                            <div className="mb-8">
                                <h2 className="text-xl font-semibold text-blancCasse mb-4">Événement</h2>
                                <div className="flex flex-col md:flex-row gap-6">
                                    <div className="w-full md:w-1/3 h-48 relative rounded-lg overflow-hidden">
                                        <Image
                                            src={eventDetails.image}
                                            alt={eventDetails.name}
                                            fill
                                            className="object-cover"
                                            quality={100}
                                        />
                                    </div>
                                    <div className="w-full md:w-2/3">
                                        <h3 className="text-2xl font-bold text-blancCasse">{eventDetails.name}</h3>
                                        <p className="text-gray-300 mt-2">
                                            {new Date(eventDetails.date).toLocaleDateString()} - {new Date(eventDetails.date).toLocaleTimeString()}
                                        </p>
                                        <p className="text-gray-300">{eventDetails.place}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="mb-8">
                            <h2 className="text-xl font-semibold text-blancCasse mb-4">Détails de la réservation</h2>
                            <div className="space-y-4 text-gray-300">
                                <div className="flex justify-between">
                                    <span>Type de billet:</span>
                                    <span className="font-semibold text-blancCasse">{reservationDetails.type}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Quantité:</span>
                                    <span className="font-semibold text-blancCasse">{reservationDetails.count}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Prix unitaire:</span>
                                    <span className="font-semibold text-blancCasse">{reservationDetails.price.toLocaleString()} Ar</span>
                                </div>
                                <div className="flex justify-between border-t border-gray-600 pt-2">
                                    <span>Total:</span>
                                    <span className="font-bold text-lg text-blancCasse">{(reservationDetails.total).toLocaleString()} Ar</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => setStep("selection")}
                                className="px-4 py-2 border border-blancCasse text-blancCasse rounded-md hover:bg-bleuNuit hover:bg-opacity-90"
                                disabled={isBooking}
                            >
                                Retour
                            </button>
                            <button
                                onClick={confirmReservation}
                                disabled={isBooking}
                                className="px-4 py-2 bg-bleuElec text-white rounded-md hover:bg-bleuNuit hover:text-orMetallique disabled:opacity-50"
                            >
                                {isBooking ? (
                                    <span className="flex items-center justify-center">
                                        <FaSpinner className="animate-spin mr-2" />
                                        Confirmation en cours...
                                    </span>
                                ) : (
                                    "Confirmer la réservation"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (step === "completed") {
        return (
            <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 relative mt-20">
                <Image
                    src="/img/bgReservation.jpg"
                    alt="Background"
                    fill
                    className="object-cover"
                    quality={100}
                    priority
                />
                <div className="absolute inset-0 bg-black bg-opacity-70"></div>
                <div className="relative z-10">
                    <div className="max-w-4xl mx-auto bg-bleuNuit bg-opacity-70 p-6 rounded-lg shadow-md text-center">
                        <div className="flex justify-center mb-6">
                            <FaCheckCircle className="text-green-400 text-6xl" />
                        </div>
                        <h1 className="text-3xl font-bold text-blancCasse mb-4">
                            Réservation confirmée !
                        </h1>
                        <p className="text-lg text-gray-300 mb-6">
                            Votre réservation a été enregistrée avec succès.
                        </p>

                        {eventDetails && (
                            <div className="mb-8 text-left">
                                <h2 className="text-xl font-semibold text-blancCasse mb-4">Détails de l'événement</h2>
                                <div className="flex flex-col md:flex-row gap-6">
                                    <div className="w-full md:w-1/3 h-48 relative rounded-lg overflow-hidden">
                                        <Image
                                            src={eventDetails.image}
                                            alt={eventDetails.name}
                                            fill
                                            className="object-cover"
                                            quality={100}
                                        />
                                    </div>
                                    <div className="w-full md:w-2/3">
                                        <h3 className="text-2xl font-bold text-blancCasse">{eventDetails.name}</h3>
                                        <p className="text-gray-300 mt-2">
                                            {new Date(eventDetails.date).toLocaleDateString()} - {new Date(eventDetails.date).toLocaleTimeString()}
                                        </p>
                                        <p className="text-gray-300">{eventDetails.place}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {reservationDetails && (
                            <div className="mb-8 text-left">
                                <h2 className="text-xl font-semibold text-blancCasse mb-4">Détails de la réservation</h2>
                                <div className="space-y-4 text-gray-300">
                                    <div className="flex justify-between">
                                        <span>Type de billet:</span>
                                        <span className="font-semibold text-blancCasse">{reservationDetails.type}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Quantité:</span>
                                        <span className="font-semibold text-blancCasse">{reservationDetails.count}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Prix unitaire:</span>
                                        <span className="font-semibold text-blancCasse">{reservationDetails.price.toLocaleString()} Ar</span>
                                    </div>
                                    <div className="flex justify-between border-t border-gray-600 pt-2">
                                        <span>Total:</span>
                                        <span className="font-bold text-lg text-blancCasse">{(reservationDetails.total).toLocaleString()} Ar</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <button
                            onClick={() => {
                                setStep("selection");
                                router.refresh();
                            }}
                            className="px-6 py-3 bg-bleuElec text-white rounded-md hover:bg-bleuElecDark"
                        >
                            Retour aux réservations
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-8 pt-20 px-4 sm:px-6 lg:px-8 relative">
            <Image
                src="/img/bgReservation.jpg"
                alt="Background"
                fill
                className="object-cover"
                quality={100}
                priority
            />
            <div className="absolute inset-0 bg-black bg-opacity-70"></div>
            <div className="relative z-10">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold text-blancCasse mb-8 flex items-center mt-7">
                        <FaTicketAlt className="mr-2" />
                        Réservation de billets
                    </h1>

                    {eventDetails && (
                        <div className="mb-8 bg-bleuNuit bg-opacity-70 p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-semibold text-blancCasse mb-4">Événement sélectionné</h2>
                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="w-full md:w-1/4 h-32 relative rounded-lg overflow-hidden">
                                    <Image
                                        src={eventDetails.image}
                                        alt={eventDetails.name}
                                        fill
                                        className="object-cover"
                                        quality={100}
                                    />
                                </div>
                                <div className="w-full md:w-3/4">
                                    <h3 className="text-xl font-bold text-blancCasse">{eventDetails.name}</h3>
                                    <p className="text-gray-300 mt-1">
                                        {new Date(eventDetails.date).toLocaleDateString()} - {new Date(eventDetails.date).toLocaleTimeString()}
                                    </p>
                                    <p className="text-gray-300">{eventDetails.place}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-bleuNuit bg-opacity-70 p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-bold text-blancCasse mb-4">
                                Réserver des billets
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-blancCasse mb-1">
                                        Type de billet
                                    </label>
                                    <select
                                        value={selectedType}
                                        onChange={(e) => setSelectedType(e.target.value)}
                                        className="w-full p-2 border border-gray-900 rounded-md bg-gray-900 text-white"
                                    >
                                        <option value="EARLY_BIRD">Early Bird</option>
                                        <option value="STANDARD">Standard</option>
                                        <option value="VIP">VIP</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-blancCasse mb-1">
                                        Nombre de billets
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="5"
                                        value={ticketCount}
                                        onChange={(e) => setTicketCount(parseInt(e.target.value))}
                                        className="w-full p-2 border border-gray-900 rounded-md bg-gray-900 text-white"
                                    />
                                </div>

                                <button
                                    onClick={handleBookTickets}
                                    disabled={isBooking || !isAuthenticated}
                                    className={`w-full py-2 px-4 rounded-md transition-colors ${isBooking || !isAuthenticated
                                        ? 'bg-bleuElec/50 text-blancGlacial/50 cursor-not-allowed'
                                        : 'bg-bleuElec text-blancGlacial hover:bg-gray-900 hover:text-orMetallique'
                                        }`}
                                >
                                    {isBooking ? (
                                        <span className="flex items-center justify-center">
                                            <FaSpinner className="animate-spin mr-2" />
                                            Réservation en cours...
                                        </span>
                                    ) : (
                                        "Passer à la confirmation"
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="bg-bleuNuit bg-opacity-70 p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-bold text-blancCasse mb-4">
                                Annuler des réservations
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-blancCasse mb-1">
                                        Type de billet
                                    </label>
                                    <select
                                        value={selectedType}
                                        onChange={(e) => setSelectedType(e.target.value)}
                                        className="w-full p-2 border border-gray-900 rounded-md bg-gray-900 text-white"
                                    >
                                        <option value="EARLY_BIRD">Early Bird</option>
                                        <option value="STANDARD">Standard</option>
                                        <option value="VIP">VIP</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-blancCasse mb-1">
                                        Nombre de billets à annuler
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="5"
                                        value={ticketCount}
                                        onChange={(e) => setTicketCount(parseInt(e.target.value))}
                                        className="w-full p-2 border border-gray-900 rounded-md bg-gray-900 text-blancGlacial"
                                    />
                                </div>

                                <button
                                    onClick={handleCancelTickets}
                                    disabled={isBooking || !isAuthenticated}
                                    className={`w-full py-2 px-4 rounded-md transition-colors ${isBooking || !isAuthenticated
                                        ? 'bg-bleuElec/50 text-blancGlacial/50 cursor-not-allowed'
                                        : 'bg-bleuElec text-blancGlacial hover:bg-gray-900 hover:text-orMetallique'
                                        }`}
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
                        <h2 className="text-2xl font-bold text-blancCasse mb-4">
                            Billets disponibles
                        </h2>
                        <TicketTable tickets={availableTickets} />
                    </div>

                    {userTickets.length > 0 && (
                        <div className="mt-8">
                            <h2 className="text-2xl font-bold text-blancCasse mb-4">
                                Mes billets réservés
                            </h2>
                            <TicketTable tickets={userTickets} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}