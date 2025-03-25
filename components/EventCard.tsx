import Link from "next/link";
import { FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";

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
    const handleViewDetails = (e: React.MouseEvent) => {
        const user = localStorage.getItem("user");
        if (!user) {
            e.preventDefault();
            toast.error(
                "Veuillez vous connecter pour voir les détails de l'événement.",
                {
                    duration: 3000,
                    position: "top-center",
                    style: {
                        backgroundColor: "#f87171",
                        color: "#fff",
                    },
                    icon: "🔒",
                }
            );
        }
    };

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
                        onClick={handleViewDetails}
                        className="inline-block px-4 py-2 bg-bleuElec text-white rounded-md hover:bg-bleuNuit transition"
                    >
                        Voir détails
                    </Link>
                </div>
            </div>
        </div>
    );
}
