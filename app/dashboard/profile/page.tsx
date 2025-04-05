"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaTicketAlt } from "react-icons/fa";

interface Ticket {
    ticket_id: string;
    ticket_type: string;
    ticket_price: number;
    ticket_status: string;
    event: {
        event_id: string;
        event_name: string;
        event_image: string;
        event_date: string;
    };
}

interface User {
    user_id: string;
    user_name: string;
    user_email: string;
    user_first_login_date: string;
    user_address?: string;
    user_city?: string;
    tickets?: Ticket[];
}

const ProfilePage = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [ticketSummary, setTicketSummary] = useState<{
        [key: string]: {
            type: string;
            status: string;
            price: number;
            count: number;
            event: {
                name: string;
                image: string;
                date: string;
            };
        };
    }>({});
    const router = useRouter();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const storedUser = localStorage.getItem("user");
                if (!storedUser) {
                    router.push("/login");
                    return;
                }

                const parsedUser = JSON.parse(storedUser);
                const userId = parsedUser.id || parsedUser.user_id;

                const isFirstLogin = !parsedUser.user_first_login_date;
                const loginDate = isFirstLogin
                    ? new Date().toISOString()
                    : parsedUser.user_first_login_date;

                if (isFirstLogin) {
                    localStorage.setItem("user", JSON.stringify({
                        ...parsedUser,
                        user_first_login_date: loginDate
                    }));
                }

                let tickets: Ticket[] = [];
                try {
                    const ticketsResponse = await fetch(`/api/users/${userId}/tickets`);
                    if (ticketsResponse.ok) {
                        const ticketsData = await ticketsResponse.json();
                        tickets = ticketsData?.tickets || [];
                    }
                } catch (error) {
                    console.error("Error fetching tickets:", error);
                }

                const summary: typeof ticketSummary = {};
                tickets.forEach(ticket => {
                    const key = `${ticket.event.event_id}-${ticket.ticket_type}`;
                    if (!summary[key]) {
                        summary[key] = {
                            type: ticket.ticket_type,
                            status: ticket.ticket_status,
                            price: ticket.ticket_price,
                            count: 0,
                            event: {
                                name: ticket.event.event_name,
                                image: ticket.event.event_image,
                                date: ticket.event.event_date
                            }
                        };
                    }
                    summary[key].count += 1;
                });

                setTicketSummary(summary);
                setUser({
                    user_id: userId,
                    user_name: parsedUser.user_name || parsedUser.name || "",
                    user_email: parsedUser.user_email || parsedUser.email || "",
                    user_first_login_date: loginDate,
                    user_address: parsedUser.user_address,
                    user_city: parsedUser.user_city,
                    tickets
                });
            } catch (error) {
                console.error("Error fetching user data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: "url('/img/bgProfile.jpg')" }}>
                <div className="text-white text-2xl font-bold flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Chargement en cours...
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: "url('/img/bgProfile.jpg')" }}>
                <div className="text-white text-2xl font-bold flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Erreur de chargement du profil
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-6 bg-cover bg-center py-40" style={{ backgroundImage: "url('/img/bgProfile.jpg')" }}>
            <ToastContainer />
            <div className="max-w-6xl mx-auto bg-gray-900 bg-opacity-70 p-8 rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold mb-6 text-center text-blancCasse">Profil</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-orMetallique">Nom</label>
                            <p className="mt-1 text-lg text-blancCasse">{user.user_name}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-orMetallique">Email</label>
                            <p className="mt-1 text-lg text-blancCasse">{user.user_email}</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-orMetallique">Adresse</label>
                            <p className="mt-1 text-lg text-blancCasse">
                                {user.user_address || "Non renseignée"}
                            </p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-orMetallique">Ville</label>
                            <p className="mt-1 text-lg text-blancCasse">
                                {user.user_city || "Non renseignée"}
                            </p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-orMetallique">Date d'adhésion</label>
                            <p className="mt-1 text-lg text-blancCasse">
                                {new Date(user.user_first_login_date).toLocaleDateString('fr-FR', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                })}
                            </p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-orMetallique">Total de billets</label>
                            <p className="mt-1 text-lg text-blancCasse">
                                {user.tickets?.length || 0} billet(s)
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-8">
                    <h2 className="text-2xl font-bold mb-4 text-orMetallique flex items-center">
                        <FaTicketAlt className="mr-2" />
                        Mes billets
                    </h2>

                    {Object.keys(ticketSummary).length > 0 ? (
                        <div className="space-y-6">
                            {Object.entries(ticketSummary).map(([key, summary]) => (
                                <div key={key} className="bg-gray-800 bg-opacity-50 rounded-lg p-4">
                                    <div className="flex flex-col md:flex-row gap-4">
                                        <div className="w-full md:w-1/4 h-40 relative rounded-lg overflow-hidden">
                                            <img
                                                src={summary.event.image}
                                                alt={summary.event.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="w-full md:w-3/4">
                                            <h3 className="text-xl font-bold text-blancCasse">{summary.event.name}</h3>
                                            <p className="text-gray-300 mt-1">
                                                {new Date(summary.event.date).toLocaleDateString('fr-FR', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>

                                            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div className="bg-bleuNuit bg-opacity-70 p-3 rounded-lg">
                                                    <p className="text-sm text-orMetallique">Type</p>
                                                    <p className="text-lg font-semibold text-blancCasse capitalize">
                                                        {summary.type.toLowerCase().replace('_', ' ')}
                                                    </p>
                                                </div>
                                                <div className="bg-bleuNuit bg-opacity-70 p-3 rounded-lg">
                                                    <p className="text-sm text-orMetallique">Statut</p>
                                                    <p className="text-lg font-semibold text-blancCasse capitalize">
                                                        {summary.status.toLowerCase()}
                                                    </p>
                                                </div>
                                                <div className="bg-bleuNuit bg-opacity-70 p-3 rounded-lg">
                                                    <p className="text-sm text-orMetallique">Prix unitaire</p>
                                                    <p className="text-lg font-semibold text-blancCasse">
                                                        {summary.price.toLocaleString()} Ar
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="mt-4 bg-bleuElec bg-opacity-70 p-3 rounded-lg">
                                                <p className="text-sm text-orMetallique">Nombre de billets</p>
                                                <p className="text-xl font-bold text-blancCasse">
                                                    {summary.count} billet{summary.count > 1 ? 's' : ''} - Total: {(summary.price * summary.count).toLocaleString()} Ar
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-blancCasse text-lg">Vous n'avez pas encore acheté de billets.</p>
                            <button
                                onClick={() => router.push("/events")}
                                className="mt-4 px-6 py-2 bg-bleuElec text-blancCasse rounded-lg hover:bg-bleuNuit hover:text-orMetallique transition duration-300"
                            >
                                Voir les événements
                            </button>
                        </div>
                    )}
                </div>

                <div className="mt-8 flex justify-center space-x-7">
                    <button
                        onClick={() => router.push("/dashboard/profile/update")}
                        className="px-6 py-3 bg-bleuElec text-blancCasse rounded-lg hover:bg-bleuNuit hover:text-orMetallique transition duration-300"
                    >
                        Mettre à jour le profil
                    </button>
                    <button
                        onClick={() => router.push("/")}
                        className="px-6 py-3 bg-bleuElec text-blancCasse rounded-lg hover:bg-bleuNuit hover:text-orMetallique transition duration-300"
                    >
                        Retour à l'accueil
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;