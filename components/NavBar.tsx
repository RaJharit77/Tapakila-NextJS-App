"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaBars, FaSearch, FaSignOutAlt, FaTimes, FaUser } from "react-icons/fa";

// Liens synchronisés avec le dossier /app
const navLinks = [
    { name: "Accueil", href: "/" },
    { name: "Événements", href: "/events" },
    { name: "À propos", href: "/about" },
    { name: "Contact", href: "/contact" },
];

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState<string | null>(null);
    const [searchType, setSearchType] = useState<"name" | "location" | "date" | "category">("name");
    const [categories, setCategories] = useState<string[]>([]);
    const router = useRouter();

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user") || "null");
        if (user) {
            setIsLoggedIn(true);
            setUserName(user.name);
        }

        async function fetchCategories() {
            try {
                const response = await fetch('/api/events');
                if (response.ok) {
                    const events = await response.json();
                    const uniqueCategories = [...new Set(events.map((event: { event_category?: string }) => event.event_category || 'Autres'))] as string[];
                    setCategories(uniqueCategories.filter(Boolean));
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        }
        fetchCategories();
    }, []);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchValue.trim()) {
            if (searchType === "date") {
                const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
                if (!dateRegex.test(searchValue)) {
                    alert("Veuillez entrer une date au format JJ/MM/AAAA");
                    return;
                }
                const [day, month, year] = searchValue.split('/');
                router.push(`/events?date=${year}-${month}-${day}`);
            } else {
                router.push(`/events?${searchType}=${encodeURIComponent(searchValue)}`);
            }
        }
    };

    const handleCategorySelect = (category: string) => {
        router.push(`/events?category=${encodeURIComponent(category)}`);
    };

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("user_id");
        setIsLoggedIn(false);
        setUserName(null);
        router.push("/login");
    };

    return (
        <nav
            className={`fixed w-full top-0 z-50 transition-all duration-500 ${isScrolled || isMenuOpen || isSearchOpen
                ? "bg-bleuNuit/90 backdrop-blur-lg shadow-lg py-2"
                : "bg-transparent py-4"
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center space-x-3">
                        <Link href="/" className="flex items-center gap-2 group">
                            <Image
                                src="/img/tapakila.png"
                                alt="Tapakila App Logo"
                                width={100}
                                height={100}
                                className="rounded-full group-hover:scale-110 transition-transform duration-300 object-cover w-12 h-12 shadow-md"
                                priority
                            />
                            <span className="text-2xl font-extrabold tracking-tight transition-all duration-300 group-hover-neon">
                                <span className="text-bleuElec">Tap</span>
                                <span className="text-orMetallique">akila</span>
                            </span>
                        </Link>
                    </div>

                    {/* SEARCH BAR DESKTOP */}
                    <form
                        onSubmit={handleSearchSubmit}
                        className={`hidden lg:flex items-center bg-white/10 border border-white/20 text-white rounded-full px-4 py-2 w-1/3 transition-all duration-300 ${isSearchFocused ? "bg-white/20 border-orMetallique shadow-[0_0_15px_rgba(255,186,8,0.3)]" : ""
                            }`}
                    >
                        <select
                            value={searchType}
                            onChange={(e) => setSearchType(e.target.value as any)}
                            className="bg-transparent text-sm font-medium text-gray-300 focus:outline-none cursor-pointer hover:text-white"
                        >
                            <option value="name" className="text-bleuNuit">Nom</option>
                            <option value="location" className="text-bleuNuit">Lieu</option>
                            <option value="date" className="text-bleuNuit">Date</option>
                            <option value="category" className="text-bleuNuit">Catégorie</option>
                        </select>
                        <div className="w-px h-4 bg-white/30 mx-3"></div>
                        <FaSearch className="text-gray-400" />
                        {searchType === "category" ? (
                            <select
                                value={searchValue}
                                onChange={(e) => {
                                    setSearchValue(e.target.value);
                                    handleCategorySelect(e.target.value);
                                }}
                                className="ml-3 bg-transparent text-sm text-white outline-none w-full cursor-pointer"
                            >
                                <option value="" className="text-bleuNuit">Toutes catégories</option>
                                {categories.map((category) => (
                                    <option key={category} value={category} className="text-bleuNuit">
                                        {category}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <input
                                type="text"
                                placeholder={
                                    searchType === "name" ? "Rechercher un événement..." :
                                        searchType === "location" ? "Rechercher un lieu..." :
                                            "Date (JJ/MM/AAAA)..."
                                }
                                className="ml-3 bg-transparent outline-none w-full text-sm placeholder-gray-400 text-white"
                                onFocus={() => setIsSearchFocused(true)}
                                onBlur={() => setIsSearchFocused(false)}
                                onChange={(e) => setSearchValue(e.target.value)}
                                value={searchValue}
                            />
                        )}
                    </form>

                    {/* DESKTOP LINKS */}
                    <div className="hidden lg:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="relative text-sm font-medium text-blancGlacialNeutre group overflow-hidden"
                            >
                                <span className="group-hover:text-orMetallique transition-colors duration-300">{link.name}</span>
                                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-orMetallique transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                            </Link>
                        ))}

                        {isLoggedIn ? (
                            <div className="flex items-center space-x-3 border-l border-white/20 pl-6">
                                <span className="text-sm font-medium text-gray-300">Salut, {userName}</span>
                                <Link href="/dashboard/profile" className="p-2.5 bg-bleuElec/20 text-bleuElec rounded-full hover:bg-bleuElec hover:text-white transition-all duration-300">
                                    <FaUser size={16} />
                                </Link>
                                <button onClick={handleLogout} className="p-2.5 bg-red-500/20 text-red-400 rounded-full hover:bg-red-500 hover:text-white transition-all duration-300">
                                    <FaSignOutAlt size={16} />
                                </button>
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                className="flex items-center gap-2 text-sm font-bold bg-bleuElec text-white px-5 py-2.5 rounded-full hover:bg-orMetallique hover:text-bleuNuit hover:shadow-[0_0_20px_rgba(255,186,8,0.4)] transition-all duration-300"
                            >
                                <FaUser size={14} />
                                Connexion
                            </Link>
                        )}
                    </div>

                    {/* MOBILE TOGGLES */}
                    <div className="lg:hidden flex items-center gap-4">
                        <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="text-white p-2">
                            <FaSearch size={20} />
                        </button>
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white p-2">
                            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                        </button>
                    </div>
                </div>

                {/* MOBILE SEARCH */}
                {isSearchOpen && (
                    <div className="lg:hidden mt-4 animate-in fade-in slide-in-from-top-4 duration-300">
                        <form onSubmit={handleSearchSubmit} className="flex flex-col gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 shadow-xl">
                            <select value={searchType} onChange={(e) => setSearchType(e.target.value as any)} className="bg-transparent text-white font-medium text-sm outline-none border-b border-white/20 pb-2">
                                <option value="name" className="text-bleuNuit">Nom</option>
                                <option value="location" className="text-bleuNuit">Lieu</option>
                                <option value="date" className="text-bleuNuit">Date</option>
                                <option value="category" className="text-bleuNuit">Catégorie</option>
                            </select>
                            <div className="flex items-center bg-black/20 rounded-lg px-3 py-2">
                                <FaSearch className="text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Rechercher..."
                                    className="ml-3 bg-transparent outline-none w-full text-white placeholder-gray-400 text-sm"
                                    onChange={(e) => setSearchValue(e.target.value)}
                                    value={searchValue}
                                />
                            </div>
                        </form>
                    </div>
                )}

                {/* MOBILE MENU */}
                {isMenuOpen && (
                    <div className="lg:hidden mt-4 animate-in fade-in slide-in-from-top-4 duration-300 pb-4">
                        <div className="flex flex-col space-y-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 shadow-xl">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="text-white font-medium py-3 px-4 rounded-xl hover:bg-white/10 transition-colors"
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <hr className="border-white/10 my-2" />
                            {isLoggedIn ? (
                                <>
                                    <Link href="/dashboard/profile" className="flex items-center gap-3 text-white font-medium py-3 px-4 rounded-xl hover:bg-white/10 transition-colors">
                                        <FaUser /> Profil de {userName}
                                    </Link>
                                    <button onClick={handleLogout} className="flex items-center gap-3 text-red-400 font-medium py-3 px-4 rounded-xl hover:bg-red-500/20 transition-colors">
                                        <FaSignOutAlt /> Déconnexion
                                    </button>
                                </>
                            ) : (
                                <div className="flex flex-col gap-2">
                                    <Link href="/login" className="flex items-center justify-center gap-2 bg-bleuElec text-white font-bold py-3 rounded-xl hover:bg-orMetallique transition-colors">
                                        <FaUser /> Se Connecter
                                    </Link>
                                    <Link href="/signup" className="flex items-center justify-center gap-2 bg-white/10 border border-white/20 text-white font-medium py-3 rounded-xl hover:bg-white/20 transition-colors">
                                        Créer un compte
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}