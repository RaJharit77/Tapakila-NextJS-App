"use client";

import { FaTicketAlt } from "react-icons/fa";
import { useState } from "react";
import { Pagination } from "@nextui-org/react";

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
                <div className="flex justify-center mt-4">
                    <Pagination
                        total={totalPages}
                        initialPage={1}
                        page={currentPage}
                        onChange={setCurrentPage}
                        color="primary"
                        size="sm"
                        showControls
                        showShadow
                    />
                </div>
            )}

            <div className="mt-4 text-sm text-gray-600">
                Total: {tickets.length} billets | {uniqueTickets.length} types différents
            </div>
        </div>
    );
}