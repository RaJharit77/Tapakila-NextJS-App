'use client';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import {
    FaCcMastercard,
    FaCcVisa,
    FaFacebook,
    FaInstagram,
    FaLinkedinIn,
    FaPaypal,
    FaWhatsapp,
} from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';

const Footer: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const user = localStorage.getItem('user');
            setIsLoggedIn(!!user);
        }
    }, []);

    const profileLink = isLoggedIn ? '/dashboard/profile' : '/login';
    const profileText = isLoggedIn ? 'Mon profil' : 'Se connecter';

    return (
        <footer className="bg-bleuNuit text-gray-300 pt-16 pb-8 border-t border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* GRILLE PRINCIPALE */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

                    {/* Colonne 1 : Logo & Description */}
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center gap-2 group w-max">
                            <Image
                                src="/img/tapakila.png"
                                alt="Tapakila Logo"
                                width={100}
                                height={100}
                                className="w-12 h-12 rounded-full group-hover:scale-110 transition-transform duration-300"
                            />
                            <span className="text-2xl font-extrabold tracking-tight">
                                <span className="text-bleuElec">Tap</span>
                                <span className="text-orMetallique">akila</span>
                            </span>
                        </Link>
                        <p className="text-sm leading-relaxed text-gray-400 mt-4">
                            Votre plateforme de référence pour la réservation de billets d'événements culturels, sportifs et artistiques.
                        </p>
                    </div>

                    {/* Colonne 2 : Navigation */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-6 uppercase tracking-wider">Navigation</h3>
                        <ul className="space-y-3 text-sm">
                            <li>
                                <Link href="/" className="hover:text-orMetallique transition-colors duration-300 flex items-center gap-2">
                                    <span className="w-1 h-1 bg-bleuElec rounded-full"></span> Accueil
                                </Link>
                            </li>
                            <li>
                                <Link href="/events" className="hover:text-orMetallique transition-colors duration-300 flex items-center gap-2">
                                    <span className="w-1 h-1 bg-bleuElec rounded-full"></span> Événements
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="hover:text-orMetallique transition-colors duration-300 flex items-center gap-2">
                                    <span className="w-1 h-1 bg-bleuElec rounded-full"></span> À propos
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="hover:text-orMetallique transition-colors duration-300 flex items-center gap-2">
                                    <span className="w-1 h-1 bg-bleuElec rounded-full"></span> Contact
                                </Link>
                            </li>
                            {!isLoggedIn && (
                                <li>
                                    <Link href="/signup" className="hover:text-orMetallique transition-colors duration-300 flex items-center gap-2">
                                        <span className="w-1 h-1 bg-bleuElec rounded-full"></span> Créer un compte
                                    </Link>
                                </li>
                            )}
                            <li>
                                <Link href={profileLink} className="hover:text-orMetallique transition-colors duration-300 flex items-center gap-2">
                                    <span className="w-1 h-1 bg-bleuElec rounded-full"></span> {profileText}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Colonne 3 : Contact */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-6 uppercase tracking-wider">Contact</h3>
                        <ul className="space-y-4 text-sm">
                            <li className="flex items-start gap-3">
                                <MdEmail className="text-orMetallique text-xl mt-0.5" />
                                <a href="mailto:contact@tapakila.app.mg" className="hover:text-white transition-colors">
                                    contact@tapakila.app.mg
                                </a>
                            </li>
                            <li className="flex items-start gap-3">
                                <FaWhatsapp className="text-orMetallique text-xl mt-0.5" />
                                <span>+261 038 00 000 00</span>
                            </li>
                        </ul>
                    </div>

                    {/* Colonne 4 : Réseaux Sociaux */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-6 uppercase tracking-wider">Suivez-nous</h3>
                        <p className="text-sm text-gray-400 mb-4">Rejoignez notre communauté sur les réseaux.</p>
                        <div className="flex space-x-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-bleuElec hover:text-white transition-all duration-300 hover:-translate-y-1">
                                <FaFacebook size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-linear-to-tr from-yellow-400 via-pink-500 to-purple-500 hover:text-white transition-all duration-300 hover:-translate-y-1">
                                <FaInstagram size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all duration-300 hover:-translate-y-1">
                                <FaLinkedinIn size={18} />
                            </a>
                        </div>
                    </div>
                </div>

                {/* BARRE DE PAIEMENT */}
                <div className="border-t border-white/10 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-gray-400">Paiements 100% sécurisés</p>
                    <div className="flex items-center space-x-4">
                        <FaCcVisa size={32} className="text-gray-400 hover:text-white transition-colors" />
                        <FaCcMastercard size={32} className="text-gray-400 hover:text-white transition-colors" />
                        <FaPaypal size={32} className="text-gray-400 hover:text-white transition-colors" />
                    </div>
                </div>

                {/* COPYRIGHT */}
                <div className="border-t border-white/10 pt-6 text-center text-xs text-gray-500">
                    <p>&copy; 2025 - {new Date().getFullYear()} Tapakila App. Tous droits réservés.</p>
                    <p className="mt-1">Build with ❤️ by <span className="text-orMetallique">CodeV</span>.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;