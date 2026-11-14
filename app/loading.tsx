import Spinner from "@/components/Spinner";

export default function Loading() {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-bleuNuit/90 backdrop-blur-md min-h-screen">
            <div className="flex flex-col items-center bg-white/5 border border-white/10 p-10 rounded-3xl shadow-2xl">
                <div className="relative">
                    <div className="absolute inset-0 bg-bleuElec/30 blur-xl rounded-full"></div>
                    <Spinner size="lg" color="text-bleuElec" />
                </div>
                
                <p className="mt-6 text-white font-semibold text-lg animate-pulse tracking-wide">
                    Chargement en cours...
                </p>
            </div>
        </div>
    );
}