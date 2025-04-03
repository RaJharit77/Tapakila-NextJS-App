"use client";

import Link from "next/link";
import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

function SignupPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, email, password }),
            });

            if (!res.ok) {
                const data = await res.json();
                setErrorMessage(data.message || "Erreur lors de l'inscription.");
                return;
            }

            const signupData = await res.json();

            if (signupData.error) {
                setErrorMessage(signupData.error);
                return;
            }

            try {
                const loginRes = await fetch("/api/auth/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email, password }),
                });

                if (!loginRes.ok) {
                    const data = await loginRes.json();
                    setErrorMessage(data.message || "Erreur lors de la connexion");
                    return;
                }

                const loginData = await loginRes.json();

                localStorage.setItem("user", JSON.stringify({
                    id: loginData.user.id,
                    name: loginData.user.name,
                    email: loginData.user.email
                }));

                localStorage.setItem("user_id", loginData.user.id);

                window.location.href = "/dashboard/profile";
            } catch {
                setErrorMessage("Erreur lors de la connexion");
            }
        } catch {
            setErrorMessage("Erreur lors de l'inscription. Veuillez réessayer.");
        }
    };

    return (
        <div
            className="relative bg-cover bg-center min-h-screen flex items-center justify-center"
            style={{ backgroundImage: "url('/img/bgSignup.jpg')" }}
        >
            <div className="absolute inset-0 bg-black bg-opacity-70"></div>

            <form
                onSubmit={handleSubmit}
                className="relative bg-gray-900 bg-opacity-50 p-6 rounded-lg shadow-lg w-96 z-10 bottom-0 text-orMetallique"
            >
                <h2 className="text-2xl font-bold mb-4 text-center">Créer un compte</h2>
                <div className="mb-4">
                    <label className="block mb-2">Nom complet</label>
                    <input
                        type="text"
                        placeholder="John Doe"
                        className="w-full px-4 py-2 border-gray-800 rounded-md bg-bleuNuit"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2">Email</label>
                    <input
                        type="email"
                        placeholder="john.doe@gmail.com"
                        className="w-full px-4 py-2 border-gray-800 rounded-md bg-bleuNuit"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-4 relative">
                    <label className="block mb-2">Mot de passe</label>
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="votre mot de passe"
                        className="w-full px-4 py-2 border-gray-800 rounded-md bg-bleuNuit pr-10"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button
                        type="button"
                        className="absolute top-3/4 right-3 transform -translate-y-1/2 text-gray-300 hover:text-gray-100"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
                    </button>
                </div>
                {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}
                <button
                    className="w-full bg-bleuElec hover:bg-bleuNuit text-blancCasse hover:text-orMetallique px-4 py-2 rounded-lg"
                >
                    S&apos;inscrire
                </button>
                <p className="mt-4 text-center">
                    Déjà un compte ?{" "}
                    <Link href="/login" className="text-grisArgent hover:underline">
                        Connectez-vous
                    </Link>
                </p>
            </form>
        </div>
    );
}

export default SignupPage;
