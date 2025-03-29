"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface User {
    user_id: string;
    user_name: string;
    user_email: string;
    user_first_login_date: string;
    tickets?: {
        ticket_id: string;
        ticket_type: string;
        ticket_price: number;
        event: {
            event_name: string;
        };
    }[];
}

const ProfilePage = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // Récupération des données depuis localStorage
                const storedUser = localStorage.getItem("user");
                if (!storedUser) {
                    router.push("/login");
                    return;
                }

                const parsedUser = JSON.parse(storedUser);
                
                // Vérification si c'est la première connexion
                const isFirstLogin = !parsedUser.user_first_login_date;
                const loginDate = isFirstLogin 
                    ? new Date().toISOString() 
                    : parsedUser.user_first_login_date;

                // Mise à jour de la date si première connexion
                if (isFirstLogin) {
                    localStorage.setItem("user", JSON.stringify({
                        ...parsedUser,
                        user_first_login_date: loginDate
                    }));
                }

                // Récupération des billets depuis l'API avec gestion des erreurs
                let tickets = [];
                try {
                    const ticketsResponse = await fetch(`/api/users/${parsedUser.user_id}`);
                    if (ticketsResponse.ok) {
                        const ticketsData = await ticketsResponse.json();
                        tickets = ticketsData?.tickets || [];
                    }
                } catch (error) {
                    console.error("Error fetching tickets:", error);
                }

                setUser({
                    user_id: parsedUser.user_id,
                    user_name: parsedUser.user_name || parsedUser.name || "",
                    user_email: parsedUser.user_email || parsedUser.email || "",
                    user_first_login_date: loginDate,
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
            <div
                className="min-h-screen flex items-center justify-center bg-cover bg-center"
                style={{ backgroundImage: "url('/img/bgProfile.jpg')" }}
            >
                <div className="text-white text-2xl font-bold">Chargement en cours...</div>
            </div>
        );
    }

    if (!user) {
        return (
            <div
                className="min-h-screen flex items-center justify-center bg-cover bg-center"
                style={{ backgroundImage: "url('/img/bgProfile.jpg')" }}
            >
                <div className="text-white text-2xl font-bold">Erreur de chargement du profil</div>
            </div>
        );
    }

    return (
        <div
            className="min-h-screen p-6 bg-cover bg-center py-40"
            style={{ backgroundImage: "url('/img/bgProfile.jpg')" }}
        >
            <ToastContainer />
            <div className="max-w-4xl mx-auto bg-gray-900 bg-opacity-70 p-8 rounded-lg shadow-lg">
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
                            <label className="block text-sm font-medium text-orMetallique">Date d'adhésion</label>
                            <p className="mt-1 text-lg text-blancCasse">
                                {new Date(user.user_first_login_date).toLocaleDateString('fr-FR', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                })}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-8">
                    <h2 className="text-2xl font-bold mb-4 text-orMetallique">Billets achetés</h2>
                    {user.tickets && user.tickets.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-gray-800 bg-opacity-50 rounded-lg">
                                <thead>
                                    <tr>
                                        <th className="px-4 py-2 text-left text-orMetallique">Événement</th>
                                        <th className="px-4 py-2 text-left text-orMetallique">Type</th>
                                        <th className="px-4 py-2 text-left text-orMetallique">Prix</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {user.tickets.map((ticket) => (
                                        <tr key={ticket.ticket_id} className="border-t border-gray-700">
                                            <td className="px-4 py-2 text-blancCasse">{ticket.event?.event_name || 'Événement inconnu'}</td>
                                            <td className="px-4 py-2 text-blancCasse">{ticket.ticket_type}</td>
                                            <td className="px-4 py-2 text-blancCasse">{ticket.ticket_price} €</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-blancCasse">Aucun billet acheté pour le moment.</p>
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