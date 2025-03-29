"use client";

import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";

export default function AboutPage() {
    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: true,
        });
    }, []);

    return (
        <div
            className="bg-cover bg-center relative min-h-screen"
            style={{ backgroundImage: "url('/img/bgAbout.jpg')" }}
            data-aos="fade-up"
        >
            <div className="absolute inset-0 bg-black bg-opacity-70"></div>

            <div className="relative z-10 max-w-4xl mx-auto text-center px-4 py-32">
                <h1 className="text-5xl font-bold mb-6 tracking-wider leading-tight text-blancCasse">
                    À propos de Tapakila
                </h1>

                <p className="text-lg leading-8 mb-8 text-blancCasse">
                    Tapakila est une plateforme innovante dédiée à la billetterie événementielle. Notre objectif est de simplifier la réservation de billets pour des événements culturels, sportifs et artistiques, tout en offrant une expérience utilisateur fluide et sécurisée.
                </p>

                <div className="mt-12" data-aos="fade-right">
                    <h2 className="text-3xl font-semibold mb-4 text-orMetallique">Notre Mission</h2>
                    <p className="text-lg leading-7 mb-6 text-blancCasse">
                        Notre mission est de connecter les passionnés d&apos;événements aux organisateurs, en proposant une plateforme intuitive et fiable. Nous souhaitons rendre la billetterie accessible à tous, tout en garantissant la sécurité des transactions.
                    </p>
                    <p className="text-lg leading-7 text-blancCasse">
                        Nous nous engageons à offrir un service de qualité, avec un support client réactif et des fonctionnalités innovantes pour améliorer l&apos;expérience utilisateur.
                    </p>
                </div>

                <div className="mt-12" data-aos="fade-left">
                    <h3 className="text-3xl font-semibold mb-4 text-orMetallique">Notre Histoire</h3>
                    <p className="text-lg leading-7 mb-6 text-blancCasse">
                        Tapakila a été fondé en 2023 par une équipe de passionnés de technologie et d&apos;événements. Inspirés par les défis rencontrés lors de la réservation de billets, nous avons décidé de créer une solution qui simplifie ce processus.
                    </p>
                    <p className="text-lg leading-7 text-blancCasse">
                        Depuis notre lancement, nous avons aidé des milliers d&apos;utilisateurs à réserver des billets pour des événements mémorables, tout en collaborant avec des organisateurs renommés.
                    </p>
                </div>

                <div className="mt-12" data-aos="fade-up">
                    <h3 className="text-3xl font-semibold mb-4 text-orMetallique">Nos Valeurs</h3>
                    <p className="text-lg leading-7 mb-6 text-blancCasse">
                        Chez Tapakila, nous croyons en l&apos;innovation, la transparence et l&apos;accessibilité. Ces valeurs guident chacune de nos décisions et actions.
                    </p>
                    <p className="text-lg leading-7 text-blancCasse">
                        Nous nous engageons à offrir une plateforme sécurisée, respectueuse de la vie privée de nos utilisateurs, et à promouvoir des événements qui enrichissent la culture et le divertissement.
                    </p>
                </div>
            </div>
        </div>
    );
}