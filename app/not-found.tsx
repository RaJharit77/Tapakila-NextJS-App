import Link from "next/link";
import Image from "next/image";
import { FaExclamationTriangle } from "react-icons/fa";

export default function NotFound() {
    return (
        <div className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20">
            {/* Image de fond avec overlay sombre */}
            <Image
                src="/img/bgEvent.jpg"
                alt="Fond de page introuvable"
                fill
                className="object-cover"
                priority
            />
            <div className="absolute inset-0 bg-bleuNuit/90 backdrop-blur-sm" />

            {/* Carte Glassmorphism */}
            <div className="relative z-10 w-full max-w-xl bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 sm:p-12 text-center shadow-2xl">

                {/* Effet "Glow" derrière le 404 */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-bleuElec/20 rounded-full blur-3xl pointer-events-none"></div>

                <div className="relative">
                    <h1 className="text-8xl sm:text-9xl font-black text-transparent bg-clip-text bg-linear-to-r from-bleuElec to-orMetallique mb-6 drop-shadow-sm">
                        404
                    </h1>

                    <div className="mx-auto w-16 h-16 bg-bleuElec/20 border border-bleuElec/30 text-bleuElec rounded-full flex items-center justify-center mb-6">
                        <FaExclamationTriangle className="text-2xl" />
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                        Oups ! Page introuvable
                    </h2>

                    <p className="text-gray-300 mb-8 text-base sm:text-lg">
                        Il semblerait que l'événement ou la page que vous recherchez n'existe pas ou a été déplacé.
                    </p>

                    <Link
                        href="/"
                        className="inline-block w-full sm:w-auto bg-bleuElec text-white font-bold px-10 py-4 rounded-xl hover:bg-orMetallique hover:text-bleuNuit transition-all duration-300 shadow-[0_0_15px_rgba(0,119,255,0.4)] hover:shadow-[0_0_25px_rgba(255,186,8,0.6)] transform hover:-translate-y-1"
                    >
                        Retour à l'accueil
                    </Link>
                </div>
            </div>
        </div>
    );
}