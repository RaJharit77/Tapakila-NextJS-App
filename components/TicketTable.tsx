"use client";

import { FaTicketAlt } from "react-icons/fa";
import { useState } from "react";

interface Ticket {
    id: string;
    type: string;
    price: number;
    status: string;
}

interface TicketTableProps {
    tickets: Ticket[];
    itemsPerPage?: number;
}

export default function TicketTable({ tickets, itemsPerPage = 5 }: TicketTableProps) {
    const [currentPage, setCurrentPage] = useState(1);

    const ticketCounts = tickets.reduce((acc, ticket) => {
        const key = `${ticket.type}-${ticket.status}`;
        if (!acc[key]) {
            acc[key] = {
                type: ticket.type,
                status: ticket.status,
                price: ticket.price,
                count: 0
            };
        }
        acc[key].count++;
        return acc;
    }, {} as Record<string, { type: string; status: string; price: number; count: number }>);

    const uniqueTickets = Object.values(ticketCounts);

    const totalPages = Math.ceil(uniqueTickets.length / itemsPerPage);
    const paginatedTickets = uniqueTickets.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const getPageNumbers = (): (number | "ellipsis")[] => {
        if (totalPages <= 7) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }
        const pages: (number | "ellipsis")[] = [];
        const leftBound = Math.max(2, currentPage - 2);
        const rightBound = Math.min(totalPages - 1, currentPage + 2);

        pages.push(1);
        if (leftBound > 2) pages.push("ellipsis");
        for (let i = leftBound; i <= rightBound; i++) {
            pages.push(i);
        }
        if (rightBound < totalPages - 1) pages.push("ellipsis");
        pages.push(totalPages);

        return pages;
    };

    return (
        <div className="bg-blancCasse text-bleuNuit rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
                <FaTicketAlt className="inline-block mr-2" />
                Types de Billets
            </h3>

            <table className="w-full text-left mb-4">
                <thead>
                    <tr className="border-b">
                        <th className="py-2">Type</th>
                        <th className="py-2">Prix</th>
                        <th className="py-2">Statut</th>
                        <th className="py-2">Nombre</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedTickets.map((ticket) => (
                        <tr key={`${ticket.type}-${ticket.status}`} className="border-b">
                            <td className="py-3 capitalize">{ticket.type.toLowerCase().replace('_', ' ')}</td>
                            <td className="py-3">{ticket.price.toLocaleString()} Ar</td>
                            <td className="py-3">
                                <span className={`px-2 py-1 rounded-full text-xs ${ticket.status === 'AVAILABLE'
                                    ? 'bg-green-100 text-green-800'
                                    : ticket.status === 'SOLD'
                                        ? 'bg-red-100 text-red-800'
                                        : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                    {ticket.status === 'AVAILABLE' ? 'Disponible' :
                                        ticket.status === 'SOLD' ? 'Vendu' : 'Réservé'}
                                </span>
                            </td>
                            <td className="py-3">{ticket.count}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-1 mt-4">
                    <button
                        type="button"
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 text-sm rounded-md border border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100"
                    >
                        Préc.
                    </button>

                    {getPageNumbers().map((page, index) =>
                        page === "ellipsis" ? (
                            <span key={`ellipsis-${index}`} className="px-2 text-gray-400">
                                …
                            </span>
                        ) : (
                            <button
                                key={page}
                                type="button"
                                onClick={() => setCurrentPage(page)}
                                className={`px-3 py-1 text-sm rounded-md border ${page === currentPage
                                    ? "bg-blue-600 text-white border-blue-600"
                                    : "border-gray-300 hover:bg-gray-100"
                                    }`}
                            >
                                {page}
                            </button>
                        )
                    )}

                    <button
                        type="button"
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 text-sm rounded-md border border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100"
                    >
                        Suiv.
                    </button>
                </div>
            )}

            <div className="mt-4 text-sm text-gray-600">
                Total: {tickets.length} billets | {uniqueTickets.length} types différents
            </div>
        </div>
    );
}