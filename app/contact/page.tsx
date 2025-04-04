"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaEnvelope } from "react-icons/fa";
import { toast } from 'react-hot-toast';
import { FaFacebook, FaInstagram, FaLinkedinIn, FaPhone } from 'react-icons/fa6';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        subject: "",
        message: "",
    });
    const [status, setStatus] = useState<{ message: string; type: "success" | "error" } | null>(null);
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        try {
            const storedUser = localStorage.getItem("user");
            
            if (!storedUser) {
                toast.error("You must be logged in to send a message.");
                router.push("/login");
                return;
            }
    
            const user = JSON.parse(storedUser);
            
            if (!user.user_id) {
                toast.error("User information is incomplete.");
                return;
            }
    
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    user_id: user.user_id,
                    subject: formData.subject,
                    message: formData.message,
                }),
            });
    
            const result = await response.json();
    
            if (response.ok) {
                toast.success("Message sent successfully!");
                setFormData({
                    subject: "",
                    message: "",
                });
            } else {
                toast.error(result.error || "Failed to send message.");
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("An error occurred. Please try again.");
        }
    };

    return (
        <div
            className="min-h-screen bg-cover bg-center flex items-center justify-center"
            style={{
                backgroundImage: "url('/img/bgContact.jpg')",
            }}
        >
            <div className="flex flex-col lg:flex-row items-center justify-center gap-8 w-full max-w-6xl p-4 py-32">
                <div className="bg-gray-900 bg-opacity-70 rounded-xl shadow-lg w-full lg:w-1/2 p-6 lg:p-10">
                    <h1 className="text-3xl font-extrabold text-center text-blancCasse mb-8">
                        Contactez-nous
                    </h1>
                    <form onSubmit={handleSubmit} className="space-y-6 text-blancCasse">
                        <input
                            type="text"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            placeholder="Sujet"
                            className="w-full bg-bleuNuit p-4 border border-gray-700 rounded-md shadow-sm focus:ring-2 focus:ring-gray-700 focus:outline-none"
                        />
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            placeholder="Votre message"
                            className="w-full bg-bleuNuit p-4 border border-gray-700 rounded-md shadow-sm focus:ring-2 focus:ring-gray-700 focus:outline-none h-40"
                        ></textarea>
                        <button
                            type="submit"
                            className="w-full py-3 bg-bleuElec text-blancCasse rounded-md shadow-lg font-medium hover:bg-bleuNuit hover:text-orMetallique transition-all"
                        >
                            Envoyer
                        </button>
                    </form>
                    {status && (
                        <p
                            className={`text-center mt-4 ${status.type === "success" ? "text-green-500" : "text-red-500"
                                }`}
                        >
                            {status.message}
                        </p>
                    )}
                </div>
                <div className="bg-gray-900 bg-opacity-70 rounded-xl shadow-lg w-full lg:w-1/2 p-6 lg:p-10">
                    <h2 className="text-2xl font-bold text-center text-blancCasse mb-6">
                        Coordonnées
                    </h2>
                    <p className="text-gray-300 text-center mb-6">
                        Vous pouvez également nous contacter directement à notre adresse ou par
                        téléphone.
                    </p>
                    <div className="space-y-4 text-blancCasse">
                        <div className="flex items-center">
                            <FaPhone className="text-3xl text-blancCasse mr-4" />
                            <p className="text-lg font-medium">
                                +261 038 00 000 00 ou +261 039 00 000 00
                            </p>
                        </div>
                        <div className="flex items-center">
                            <FaEnvelope className="text-3xl text-blancCasse mr-4" />
                            <p className="text-lg font-medium">contact@tapakila.app.mg</p>
                        </div>
                    </div>
                    <div className="mt-8">
                        <h3 className="text-xl font-semibold text-left text-blancCasse mb-4">
                            Liens sociaux
                        </h3>
                        <div className="flex items-center">
                            <FaFacebook className="text-3xl text-blancCasse mr-4" />
                            <p className="text-lg font-medium">TapakilaApp</p>
                        </div>
                        <div className="flex items-center mt-3">
                            <FaInstagram className="text-3xl text-blancCasse mr-4" />
                            <p className="text-lg font-medium">Tapakila_App_Mdg</p>
                        </div>
                        <div className="flex items-center mt-3">
                            <FaLinkedinIn className="text-3xl text-blancCasse mr-4" />
                            <p className="text-lg font-medium">Tapakila.app.mg</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
