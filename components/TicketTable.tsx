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
        <div className="w-full">
            <div className="mb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <FaTicketAlt className="text-orMetallique" />
                    Types de Billets
                </h3>
            </div>

            <div className="w-full">
                <table className="w-full text-left text-sm text-gray-300">
                    <thead className="text-xs uppercase bg-white/5 text-gray-400 border-b border-white/10">
                        <tr>
                            <th scope="col" className="px-2 py-3">Type</th>
                            <th scope="col" className="px-2 py-3">Prix</th>
                            <th scope="col" className="px-2 py-3">Statut</th>
                            <th scope="col" className="px-2 py-3 text-right">Nb</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedTickets.map((ticket) => (
                            <tr key={`${ticket.type}-${ticket.status}`} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                <td className="px-2 py-3 font-medium text-white truncate max-w-20" title={ticket.type}>
                                    {ticket.type.toLowerCase().replace('_', ' ')}
                                </td>
                                <td className="px-2 py-3 whitespace-nowrap text-gray-300">
                                    {ticket.price.toLocaleString()} Ar
                                </td>
                                <td className="px-2 py-3">
                                    <span className={`px-2 py-1 text-[10px] font-bold rounded-full ${ticket.status === 'AVAILABLE'
                                        ? 'bg-green-500/20 text-green-400'
                                        : ticket.status === 'SOLD'
                                            ? 'bg-red-500/20 text-red-400'
                                            : 'bg-yellow-500/20 text-yellow-400'
                                        }`}>
                                        {ticket.status === 'AVAILABLE' ? 'Dispo' :
                                            ticket.status === 'SOLD' ? 'Vendu' : 'Réservé'}
                                    </span>
                                </td>
                                <td className="px-2 py-3 text-right font-bold text-white">
                                    {ticket.count}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-1 mt-6">
                    <button
                        type="button"
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="px-2 py-1 text-xs rounded-md border border-white/20 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
                    >
                        Préc.
                    </button>

                    {getPageNumbers().map((page, index) =>
                        page === "ellipsis" ? (
                            <span key={`ellipsis-${index}`} className="px-1 text-gray-500">
                                …
                            </span>
                        ) : (
                            <button
                                key={page}
                                type="button"
                                onClick={() => setCurrentPage(page)}
                                className={`px-2 py-1 text-xs rounded-md border transition-colors ${page === currentPage
                                    ? "bg-bleuElec text-white border-bleuElec"
                                    : "border-white/20 text-white hover:bg-white/10"
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
                        className="px-2 py-1 text-xs rounded-md border border-white/20 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
                    >
                        Suiv.
                    </button>
                </div>
            )}

            <div className="mt-4 text-xs text-gray-400 text-center">
                Total: {tickets.length} billets | {uniqueTickets.length} types
            </div>
        </div>
    );
}