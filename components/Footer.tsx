'use client';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import {
    FaCcMastercard,
    FaCcVisa,
    FaFacebookMessenger,
    FaPaypal,
    FaFacebook,
    FaInstagram,
    FaLinkedinIn,
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
        <footer className="bg-bleuNuit text-blancCasse py-6">
            <div className="container mx-auto flex flex-col lg:flex-row justify-between items-center px-4">
                <div className="flex items-center space-x-4 mb-4 lg:mb-0">
                    <Link href="/" className="w-20 h-20 rounded-full overflow-hidden">
                        <Image
                            src="/img/tapakila.png"
                            alt="Tapakila Logo"
                            width={200}
                            height={200}
                            className="w-full h-full object-cover"
                        />
                    </Link>
                    <h1 className="text-2xl font-bold text-blancCasse">
                        <span className="text-bleuElec">Tap</span>
                        <span className="text-orMetallique">akila</span>
                    </h1>
                </div>

                <div className="flex flex-wrap justify-center lg:justify-end space-x-6 items-center mb-6 lg:mb-0">
                    <a href="https://www.facebook.com/" className="text-blancCasse hover:text-orMetallique transition-all duration-300 hover:scale-110 hover:rotate-6" target="_blank" rel="noopener noreferrer">
                        <FaFacebook size={30} />
                    </a>
                    <a href="https://www.messenger.com/" className="text-blancCasse hover:text-orMetallique transition-all duration-300 hover:scale-110 hover:rotate-6" target="_blank" rel="noopener noreferrer">
                        <FaFacebookMessenger size={30} />
                    </a>
                    <a href="https://www.instagram.com/" className="text-blancCasse hover:text-orMetallique transition-all duration-300 hover:scale-110 hover:rotate-6" target="_blank" rel="noopener noreferrer">
                        <FaInstagram size={30} />
                    </a>
                    <a href="https://linkedin.com/" className="text-blancCasse hover:text-orMetallique transition-all duration-300 hover:scale-110 hover:rotate-6" target="_blank" rel="noopener noreferrer">
                        <FaLinkedinIn size={30} />
                    </a>
                    <a href="https://web.whatsapp.com/" className="text-blancCasse hover:text-orMetallique transition-all duration-300 hover:scale-110 hover:rotate-6" target="_blank" rel="noopener noreferrer">
                        <FaWhatsapp size={30} />
                    </a>
                    <a href="mailto: contact@tapakila.app.mg" className="text-blancCasse hover:text-orMetallique transition-all duration-300 hover:scale-110 hover:rotate-6">
                        <MdEmail size={30} />
                    </a>
                </div>
            </div>

            <div className="text-center mt-3">
                <h3 className="text-lg font-semibold text-blancCasse mb-4">Moyens de Paiement</h3>
                <div className="flex justify-center space-x-6">
                    <a href="https://www.visa.com/" className="text-blancCasse hover:text-orMetallique transition-all duration-300 hover:scale-110 hover:rotate-6" target="_blank" rel="noopener noreferrer">
                        <FaCcVisa size={40} />
                    </a>
                    <a href="https://www.mastercard.com/" className="text-blancCasse hover:text-orMetallique transition-all duration-300 hover:scale-110 hover:rotate-6" target="_blank" rel="noopener noreferrer">
                        <FaCcMastercard size={40} />
                    </a>
                    <a href="https://www.paypal.com/" className="text-blancCasse hover:text-orMetallique transition-all duration-300 hover:scale-110 hover:rotate-6" target="_blank" rel="noopener noreferrer">
                        <FaPaypal size={40} />
                    </a>
                </div>
            </div>

            <div className="text-center mt-7 px-4">
                <div className="flex flex-wrap justify-center gap-4">
                    <Link href="/" className="text-blancCasse hover:text-orMetallique transition-all duration-300 hover:underline hover:scale-105">Accueil</Link>
                    <Link href="/about" className="text-blancCasse hover:text-orMetallique transition-all duration-300 hover:underline hover:scale-105">À propos de Tapakila</Link>
                    <Link href="/contact" className="text-blancCasse hover:text-orMetallique transition-all duration-300 hover:underline hover:scale-105">Prendre contact</Link>
                    <Link href={profileLink} className="text-blancCasse hover:text-orMetallique transition-all duration-300 hover:underline hover:scale-105">{profileText}</Link>
                </div>
            </div>

            <div className="w-full text-center py-3 mt-7">
                <p className="text-blancCasse">
                    &copy; {new Date().getFullYear()} Tapakila App. Created by CodeV. All rights reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
