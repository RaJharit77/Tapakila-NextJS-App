"use client";

import { useEffect } from "react";
import Image from "next/image";
import { FaExclamationTriangle } from "react-icons/fa";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Erreur interceptée :", error);
    }, [error]);

    return (
        <div className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20">
            {/* Image de fond avec overlay sombre */}
            <Image
                src="/img/bgEvent.jpg" // Vous pouvez utiliser une autre image si vous préférez
                alt="Fond d'erreur"
                fill
                className="object-cover"
                priority
            />
            <div className="absolute inset-0 bg-bleuNuit/90 backdrop-blur-sm" />

            {/* Carte Glassmorphism */}
            <div className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 sm:p-12 text-center shadow-2xl">

                {/* Halo de lumière rouge derrière l'icône */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-red-500/20 rounded-full blur-3xl pointer-events-none"></div>

                <div className="relative">
                    {/* Icône d'alerte */}
                    <div className="mx-auto w-20 h-20 bg-red-500/20 border border-red-500/30 text-red-400 rounded-full flex items-center justify-center mb-6">
                        <FaExclamationTriangle className="text-4xl" />
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                        Oups, une erreur est survenue
                    </h2>

                    <p className="text-gray-300 mb-8 text-base">
                        Désolé, quelque chose s'est mal passé de notre côté. Notre équipe a été notifiée. Veuillez réessayer.
                    </p>

                    <button
                        onClick={() => reset()}
                        className="w-full bg-bleuElec text-white font-bold py-4 rounded-xl hover:bg-orMetallique hover:text-bleuNuit transition-all duration-300 shadow-[0_0_15px_rgba(0,119,255,0.4)] hover:shadow-[0_0_25px_rgba(255,186,8,0.6)] transform hover:-translate-y-1"
                    >
                        Réessayer
                    </button>
                </div>
            </div>
        </div>
    );
}