"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaEnvelope, FaPhoneAlt } from "react-icons/fa";
import { toast } from 'react-hot-toast';
import { FaFacebook, FaInstagram, FaLinkedinIn } from 'react-icons/fa6';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        subject: "",
        message: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const storedUser = localStorage.getItem("user");

        if (!storedUser) {
            toast.error("Vous devez être connecté pour envoyer un message.");
            router.push("/login");
            return;
        }

        const user = JSON.parse(storedUser);
        const user_id = user.id;

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    user_id: user_id,
                    subject: formData.subject,
                    message: formData.message,
                }),
            });

            const result = await response.json();

            if (response.ok) {
                toast.success("Message envoyé avec succès ! Nous vous répondrons rapidement.", {
                    duration: 5000,
                    position: "top-center",
                });
                setFormData({ subject: "", message: "" });
            } else {
                toast.error(result.error || "Erreur lors de l'envoi.");
            }
        } catch {
            toast.error("Erreur serveur. Veuillez réessayer plus tard.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center py-32 px-4 sm:px-6 lg:px-8">
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: "url('/img/bgContact.jpg')" }}
            />
            <div className="absolute inset-0 bg-bleuNuit/80 backdrop-blur-sm" />

            <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">

                <div className="w-full lg:w-3/5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 sm:p-12 shadow-2xl">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
                            Contactez-<span className="text-bleuElec">nous</span>
                        </h1>
                        <p className="text-gray-300">
                            Une question ? Un partenariat ? Remplissez le formulaire ci-dessous.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                                Sujet
                            </label>
                            <input
                                type="text"
                                id="subject"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                required
                                placeholder="Ex: Demande d'information"
                                className="w-full bg-bleuNuit/50 border border-white/10 text-white placeholder-gray-500 rounded-xl px-4 py-3.5 focus:outline-none focus:border-bleuElec focus:ring-1 focus:ring-bleuElec transition-all"
                            />
                        </div>

                        <div>
                            <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                                Message
                            </label>
                            <textarea
                                id="message"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                required
                                placeholder="Écrivez votre message ici..."
                                className="w-full bg-bleuNuit/50 border border-white/10 text-white placeholder-gray-500 rounded-xl px-4 py-3.5 focus:outline-none focus:border-bleuElec focus:ring-1 focus:ring-bleuElec transition-all h-40 resize-none"
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-4 bg-bleuElec text-white font-bold rounded-xl hover:bg-orMetallique hover:text-bleuNuit transition-all duration-300 shadow-[0_0_15px_rgba(0,119,255,0.4)] hover:shadow-[0_0_25px_rgba(255,186,8,0.6)] disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-1"
                        >
                            {isSubmitting ? "Envoi en cours..." : "Envoyer le message"}
                        </button>
                    </form>
                </div>

                <div className="w-full lg:w-2/5 flex flex-col gap-6">

                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl grow">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                            <span className="w-8 h-1 bg-orMetallique rounded-full"></span>
                            Coordonnées
                        </h2>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4 group">
                                <div className="w-12 h-12 rounded-full bg-bleuElec/20 flex items-center justify-center group-hover:bg-bleuElec transition-colors duration-300 shrink-0">
                                    <FaPhoneAlt className="text-bleuElec group-hover:text-white transition-colors duration-300" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400 mb-1">Téléphone</p>
                                    <p className="text-white font-medium">+261 38 00 000 00</p>
                                    <p className="text-white font-medium">+261 39 00 000 00</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 group">
                                <div className="w-12 h-12 rounded-full bg-bleuElec/20 flex items-center justify-center group-hover:bg-bleuElec transition-colors duration-300 shrink-0">
                                    <FaEnvelope className="text-bleuElec group-hover:text-white transition-colors duration-300" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400 mb-1">Email</p>
                                    <a href="mailto:contact@tapakila.app.mg" className="text-white font-medium hover:text-orMetallique transition-colors">
                                        contact@tapakila.app.mg
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl">
                        <h3 className="text-xl font-bold text-white mb-6">Suivez-nous</h3>
                        <div className="flex gap-4">
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                                className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-[#1877F2] hover:border-[#1877F2] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                                <FaFacebook size={20} />
                            </a>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                                className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-linear-to-tr hover:from-yellow-400 hover:via-pink-500 hover:to-purple-500 hover:border-transparent transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                                <FaInstagram size={20} />
                            </a>
                            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
                                className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-[#0A66C2] hover:border-[#0A66C2] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                                <FaLinkedinIn size={20} />
                            </a>
                        </div>
                        <p className="text-sm text-gray-400 mt-6">
                            Rejoignez notre communauté pour ne rien manquer des prochains événements.
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
}