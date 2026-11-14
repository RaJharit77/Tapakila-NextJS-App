import Spinner from "@/components/Spinner";

export default function Loading() {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-50/80 backdrop-blur-sm min-h-screen">
            <div className="flex flex-col items-center">
                <Spinner size="lg" color="text-bleuElec" />
                
                <p className="mt-6 text-bleuNuit font-semibold text-lg animate-pulse">
                    Chargement en cours...
                </p>
            </div>
        </div>
    );
}