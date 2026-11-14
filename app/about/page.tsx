"use client";

import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";
import Image from "next/image";
import { FaBullseye, FaHistory, FaHeart } from "react-icons/fa";

export default function AboutPage() {
    useEffect(() => {
        AOS.init({
            duration: 800,
            once: true,
            easing: "ease-out-cubic",
        });
    }, []);

    return (
        <div className="relative min-h-screen py-32 px-4 sm:px-6 lg:px-8">
            {/* Image de fond avec overlay sombre standardisé */}
            <Image
                src="/img/bgAbout.jpg"
                alt="À propos de Tapakila"
                fill
                className="object-cover"
                priority
            />
            <div className="absolute inset-0 bg-bleuNuit/90 backdrop-blur-sm pointer-events-none" />

            <div className="relative z-10 max-w-6xl mx-auto">

                {/* En-tête de page */}
                <div className="text-center mb-20" data-aos="fade-down">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
                        À propos de <span className="text-transparent bg-clip-text bg-linear-to-r from-bleuElec to-orMetallique">Tapakila</span>
                    </h1>
                    <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                        Tapakila est une plateforme innovante dédiée à la billetterie événementielle. Notre objectif est de simplifier la réservation de billets pour des événements culturels, sportifs et artistiques, tout en offrant une expérience utilisateur fluide et sécurisée.
                    </p>
                </div>

                {/* Grille de contenu */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    {/* Carte Mission */}
                    <div
                        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors duration-300 shadow-xl group"
                        data-aos="fade-up"
                        data-aos-delay="100"
                    >
                        <div className="w-16 h-16 bg-bleuElec/20 text-bleuElec rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                            <FaBullseye className="text-3xl" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-4">Notre Mission</h2>
                        <p className="text-gray-300 leading-relaxed mb-4 text-sm sm:text-base">
                            Notre mission est de connecter les passionnés d&apos;événements aux organisateurs, en proposant une plateforme intuitive et fiable. Nous souhaitons rendre la billetterie accessible à tous.
                        </p>
                        <p className="text-gray-400 leading-relaxed text-sm sm:text-base">
                            Nous nous engageons à offrir un service de qualité, avec un support réactif et des fonctionnalités innovantes.
                        </p>
                    </div>

                    {/* Carte Histoire */}
                    <div
                        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors duration-300 shadow-xl group"
                        data-aos="fade-up"
                        data-aos-delay="200"
                    >
                        <div className="w-16 h-16 bg-orMetallique/20 text-orMetallique rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                            <FaHistory className="text-3xl" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-4">Notre Histoire</h2>
                        <p className="text-gray-300 leading-relaxed mb-4 text-sm sm:text-base">
                            Tapakila a été fondé en 2023 par une équipe de passionnés de technologie et d&apos;événements. Inspirés par les défis rencontrés lors de la réservation, nous avons décidé de créer une solution qui simplifie ce processus.
                        </p>
                        <p className="text-gray-400 leading-relaxed text-sm sm:text-base">
                            Depuis notre lancement, nous avons aidé des milliers d&apos;utilisateurs à réserver des billets pour des événements mémorables.
                        </p>
                    </div>

                    {/* Carte Valeurs */}
                    <div
                        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors duration-300 shadow-xl group"
                        data-aos="fade-up"
                        data-aos-delay="300"
                    >
                        <div className="w-16 h-16 bg-pink-500/20 text-pink-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                            <FaHeart className="text-3xl" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-4">Nos Valeurs</h2>
                        <p className="text-gray-300 leading-relaxed mb-4 text-sm sm:text-base">
                            Chez Tapakila, nous croyons en l&apos;innovation, la transparence et l&apos;accessibilité. Ces valeurs guident chacune de nos décisions et actions au quotidien.
                        </p>
                        <p className="text-gray-400 leading-relaxed text-sm sm:text-base">
                            Nous nous engageons à offrir une plateforme sécurisée, respectueuse de la vie privée, et à promouvoir des événements enrichissants.
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
}