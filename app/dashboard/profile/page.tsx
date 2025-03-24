"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface User {
    user_id: string;
    user_name: string;
    user_email: string;
    date_joined: string;
    city: string;
    postal_code: string;
    country: string;
    address: string;
}

const ProfilePage = () => {
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser({
                user_id: parsedUser.user_id || "",
                user_name: parsedUser.name || "",
                user_email: parsedUser.email || "",
                date_joined: parsedUser.date_joined || new Date().toISOString(),
                city: parsedUser.city || "",
                postal_code: parsedUser.postal_code || "",
                country: parsedUser.country || "",
                address: parsedUser.address || "",
            });
        } else {
            router.push("/login");
        }
    }, [router]);

    if (!user) {
        return (
            <div
                className="min-h-screen flex items-center justify-center bg-cover bg-center"
                style={{ backgroundImage: "url('/img/bgProfile.jpg')" }}
            >
                <div className="text-white text-2xl font-bold">Chargement en cours...</div>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-7">
                        <div>
                            <label className="block text-sm font-medium text-orMetallique">Nom et Prénom</label>
                            <p className="mt-1 text-lg text-blancCasse">{user.user_name}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-orMetallique">Email</label>
                            <p className="mt-1 text-lg text-blancCasse">{user.user_email}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-orMetallique">Date d'adhésion</label>
                            <p className="mt-1 text-lg text-blancCasse">
                                {new Date(user.date_joined).toLocaleDateString()}
                            </p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-orMetallique">Ville</label>
                            <p className="mt-1 text-lg text-blancCasse">{user.city}</p>
                        </div>
                    </div>
                    <div className="space-y-7 text-right">
                        <div>
                            <label className="block text-sm font-medium text-orMetallique">Pays</label>
                            <p className="mt-1 text-lg text-blancCasse">{user.country}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-orMetallique">Code Postal</label>
                            <p className="mt-1 text-lg text-blancCasse">{user.postal_code}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-orMetallique">Adresse</label>
                            <p className="mt-1 text-lg text-blancCasse">{user.address}</p>
                        </div>
                    </div>
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