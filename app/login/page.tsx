"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlineMail, AiOutlineLock } from "react-icons/ai";
import { FaArrowRight } from "react-icons/fa";

const LoginPage = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage("");
        setIsLoading(true);

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!res.ok) {
                const data = await res.json();
                setErrorMessage(data.message || "Erreur lors de la connexion");
                setIsLoading(false);
                return;
            }

            const data = await res.json();

            localStorage.setItem("user", JSON.stringify({
                id: data.user.id,
                name: data.user.name,
                email: data.user.email
            }));
            localStorage.setItem("user_id", data.user.id);

            window.location.href = "/dashboard/profile";
        } catch {
            setErrorMessage("Erreur de connexion au serveur.");
            setIsLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8">
            {/* Background Image */}
            <Image
                src="/img/bgLogin.jpg"
                alt="Background Connexion"
                fill
                className="object-cover"
                priority
            />
            <div className="absolute inset-0 bg-bleuNuit/90 backdrop-blur-sm pointer-events-none" />

            {/* Formulaire Glassmorphism */}
            <div className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl">

                <div className="text-center mb-8">
                    <Link href="/" className="inline-block mb-4">
                        <h1 className="text-3xl font-extrabold">
                            <span className="text-bleuElec">Tap</span>
                            <span className="text-orMetallique">akila</span>
                        </h1>
                    </Link>
                    <h2 className="text-2xl font-bold text-white mb-2">Bon retour !</h2>
                    <p className="text-gray-400 text-sm">Connectez-vous pour accéder à votre compte.</p>
                </div>

                {errorMessage && (
                    <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm text-center">
                        {errorMessage}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Email */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                            Adresse email
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <AiOutlineMail className="text-gray-400" />
                            </div>
                            <input
                                type="email"
                                id="email"
                                placeholder="john.doe@gmail.com"
                                className="w-full pl-10 pr-4 py-3 bg-black/20 border border-white/10 text-white placeholder-gray-500 rounded-xl focus:outline-none focus:border-bleuElec focus:ring-1 focus:ring-bleuElec transition-all"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {/* Mot de passe */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                            Mot de passe
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <AiOutlineLock className="text-gray-400" />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                placeholder="••••••••"
                                className="w-full pl-10 pr-12 py-3 bg-black/20 border border-white/10 text-white placeholder-gray-500 rounded-xl focus:outline-none focus:border-bleuElec focus:ring-1 focus:ring-bleuElec transition-all"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full mt-2 py-3.5 bg-bleuElec text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-orMetallique hover:text-bleuNuit transition-all duration-300 shadow-[0_0_15px_rgba(0,119,255,0.4)] hover:shadow-[0_0_25px_rgba(255,186,8,0.6)] transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        {isLoading ? "Connexion en cours..." : "Se connecter"}
                        {!isLoading && <FaArrowRight size={14} />}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-gray-400">
                    Pas encore de compte ?{" "}
                    <Link href="/signup" className="text-orMetallique font-semibold hover:text-white transition-colors">
                        Créer un compte
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;