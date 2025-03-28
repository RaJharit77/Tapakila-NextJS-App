import Link from "next/link";
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
    return (
        <div className="bg-blancGlacialNeutre rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow">
            <img src={imageUrl} alt={name} className="w-full h-52 object-cover" />
            <div className="p-4">
                <h3 className="text-xl font-bold text-bleuNuit">{name}</h3>
                <p className="text-bleuNuit mt-2">{description}</p>
                <div className="mt-4 flex items-center text-grisAnthracite text-sm">
                    <FaCalendarAlt className="mr-2" />
                    <span>{new Date(date).toLocaleDateString()}</span>
                </div>
                <div className="mt-2 flex items-center text-grisAnthracite text-sm">
                    <FaMapMarkerAlt className="mr-2" />
                    <span>{location}</span>
                </div>
                <div className="mt-4">
                    <Link
                        href={`/events/${id}`}
                        className="inline-block px-4 py-2 bg-bleuElec text-white rounded-md hover:bg-bleuNuit hover:text-orMetallique transition"
                    >
                        Voir détails
                    </Link>
                </div>
            </div>
        </div>
    );
}
