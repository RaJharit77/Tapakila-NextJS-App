"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
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

const UpdateProfilePage = () => {
    const [user, setUser] = useState<User | null>(null);
    const [formData, setFormData] = useState({
        user_name: "",
        city: "",
        postal_code: "",
        country: "",
        address: "",
    });
    const router = useRouter();

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await fetch("/api/users");
                if (!response.ok) {
                    throw new Error("Failed to fetch user profile");
                }
                const data = await response.json();
                setUser(data);
                setFormData({
                    user_name: data.user_name,
                    city: data.city,
                    postal_code: data.postal_code,
                    country: data.country,
                    address: data.address,
                });
            } catch (error) {
                console.error("Error fetching user profile:", error);
                toast.error("Erreur lors du chargement du profil.", { autoClose: 3000 });
            }
        };

        fetchUserProfile();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch(`/api/users/${user?.user_id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error("Failed to update profile");
            }

            toast.success("Profil mis à jour avec succès !", { autoClose: 3000 });
            setTimeout(() => {
                router.push("/dashboard/profile");
            }, 1500);
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("Erreur lors de la mise à jour du profil.", { autoClose: 3000 });
        }
    };

    const handleCancel = () => {
        router.push("/dashboard/profile");
    };

    if (!user) {
        return (
            <div
                className="min-h-screen flex items-center justify-center bg-cover bg-center"
                style={{ backgroundImage: "url('/img/bgProfileUpdate.jpg')" }}
            >
                <div className="text-white text-2xl font-bold">Chargement en cours...</div>
            </div>
        );
    }

    return (
        <div
            className="min-h-screen p-6 bg-cover bg-center py-36"
            style={{ backgroundImage: "url('/img/bgProfileUpdate.jpg')" }}
        >
            <ToastContainer />
            <div className="max-w-lg mx-auto bg-gray-900 bg-opacity-70 p-8 rounded-xl shadow-xl">
                <h1 className="text-3xl font-bold mb-6 text-center text-blancCasse">Mettre à jour le profil</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-orMetallique">Nom et Prénom</label>
                        <input
                            type="text"
                            name="user_name"
                            value={formData.user_name}
                            onChange={handleChange}
                            className="mt-1 block w-full px-4 py-2 bg-bleuNuit border border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-bleuElec focus:border-bleuElec"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-orMetallique">Ville</label>
                        <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            className="mt-1 block w-full px-4 py-2 bg-bleuNuit border border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-bleuElec focus:border-bleuElec"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-orMetallique">Code Postal</label>
                        <input
                            type="text"
                            name="postal_code"
                            value={formData.postal_code}
                            onChange={handleChange}
                            className="mt-1 block w-full px-4 py-2 bg-bleuNuit border border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-bleuElec focus:border-bleuElec"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-orMetallique">Pays</label>
                        <input
                            type="text"
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            className="mt-1 block w-full px-4 py-2 bg-bleuNuit border border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-bleuElec focus:border-bleuElec"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-orMetallique">Adresse</label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="mt-1 block w-full px-4 py-2 bg-bleuNuit border border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-bleuElec focus:border-bleuElec"
                        />
                    </div>
                    <div className="flex space-x-4">
                        <button
                            type="submit"
                            className="w-full px-6 py-3 bg-bleuElec text-blancCasse rounded-xl hover:bg-bleuNuit hover:text-orMetallique transition duration-300"
                        >
                            Enregistrer
                        </button>
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="w-full px-6 py-3 bg-bleuElec text-blancCasse rounded-xl hover:bg-bleuNuit hover:text-orMetallique transition duration-300"
                        >
                            Annuler
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateProfilePage;