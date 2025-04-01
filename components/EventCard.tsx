import Link from "next/link";
import Image from "next/image";
import { FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";

interface EventCardProps {
    id: string;
    name: string;
    date: string;
    location: string;
    description: string;
    imageUrl: string;
}

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
            return '/img/404NotFound.jpg';
        }
    };

    const validImageUrl = getValidImageUrl(imageUrl);

    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
        const target = e.target as HTMLImageElement;
        target.src = '/img/404NotFound.jpg';
    };

    return (
        <div className="bg-blancGlacialNeutre rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow h-full flex flex-col w-full max-w-[350px] mx-auto">
            <div className="relative w-full h-48 aspect-auto sm:h-56 md:h-64">
                <Image
                    src={validImageUrl}
                    alt={`${name}`}
                    fill
                    className="object-cover object-center"
                    priority={false}
                    onError={handleImageError}
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                />
            </div>
            <div className="p-4 flex-grow flex flex-col">
                <h3 className="text-xl font-bold text-bleuNuit line-clamp-1">{name}</h3>
                <p className="text-bleuNuit mt-2 line-clamp-2 text-sm">{description}</p>
                <div className="mt-3 flex items-center text-grisAnthracite text-sm">
                    <FaCalendarAlt className="mr-2 flex-shrink-0" />
                    <span>
                        {new Date(date).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                        })}
                    </span>
                </div>
                <div className="mt-2 flex items-center text-grisAnthracite text-sm">
                    <FaMapMarkerAlt className="mr-2 flex-shrink-0" />
                    <span className="truncate">{location}</span>
                </div>
                <div className="mt-4 flex-grow flex items-end">
                    <Link
                        href={`/events/${id}`}
                        className="inline-block px-4 py-2 bg-bleuElec text-white rounded-md hover:bg-bleuNuit hover:text-orMetallique transition-colors duration-300 text-center w-full"
                    >
                        Voir détails
                    </Link>
                </div>
            </div>
        </div>
    );
}