"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";

interface EventCardProps {
    id: string;
    name: string;
    date: string;
    location: string;
    description: string;
    imageUrl: string;
}

const FALLBACK_IMAGE = '/img/404NotFound.jpg';

export default function EventCard({
    id,
    name,
    date,
    location,
    description,
    imageUrl,
}: EventCardProps) {
    const getValidImageUrl = (url: string) => {
        try {
            new URL(url);
            return url;
        } catch {
            return FALLBACK_IMAGE;
        }
    };

    const [imgSrc, setImgSrc] = useState(getValidImageUrl(imageUrl));

    return (
        <div className="group flex flex-col h-full w-full max-w-87.5 mx-auto bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-1 overflow-hidden">

            <div className="relative w-full h-48 sm:h-56 shrink-0 overflow-hidden">
                <Image
                    src={imgSrc}
                    alt={`Image de l'événement ${name}`}
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                    onError={() => setImgSrc(FALLBACK_IMAGE)}
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            <div className="p-5 flex flex-col grow">
                <h3 className="text-xl font-bold text-bleuNuit line-clamp-1 group-hover:text-bleuElec transition-colors">
                    {name}
                </h3>

                <p className="text-gray-500 mt-2 text-sm line-clamp-2 min-h-10 grow">
                    {description}
                </p>

                <div className="mt-4 space-y-2.5">
                    <div className="flex items-center text-gray-600 text-sm font-medium">
                        <div className="w-7 h-7 rounded-full bg-bleuElec/10 flex items-center justify-center mr-3 shrink-0">
                            <FaCalendarAlt className="text-bleuElec text-xs" />
                        </div>
                        <span>
                            {new Date(date).toLocaleDateString('fr-FR', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                            })}
                        </span>
                    </div>
                    <div className="flex items-center text-gray-600 text-sm font-medium">
                        <div className="w-7 h-7 rounded-full bg-orMetallique/20 flex items-center justify-center mr-3 shrink-0">
                            <FaMapMarkerAlt className="text-orMetallique text-xs" />
                        </div>
                        <span className="truncate">{location}</span>
                    </div>
                </div>

                <div className="mt-auto pt-6">
                    <Link
                        href={`/events/${id}`}
                        className="flex items-center justify-center w-full px-4 py-2.5 bg-bleuNuit text-white font-semibold rounded-xl hover:bg-bleuElec hover:shadow-lg transition-all duration-300 group/btn"
                        aria-label={`Voir les détails de ${name}`}
                    >
                        Voir détails
                        <svg className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </Link>
                </div>
            </div>
        </div>
    );
}