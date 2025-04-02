"use server";

import { prisma } from "@/lib/prisma";
import { neon } from "@neondatabase/serverless";
import { Type } from "@prisma/client";
import { NextResponse } from "next/server";

export async function getData() {
    if (!process.env.DATABASE_URL) {
        throw new Error("DATABASE_URL is not defined");
    }
    const sql = neon(process.env.DATABASE_URL);
    const data = await sql`...`;
    return data;
}


export async function BookATicket({ data }: { data: { userId: string, ticketNumber: number, requestType: "CANCEL" | "BOOK", ticketType: Type, eventId: string } }) {
    try {
        const { userId, ticketNumber, ticketType, requestType, eventId } = data


        if (requestType == "BOOK") {
            const event = await prisma.event.findUnique({
                where: {
                    event_id: eventId
                }
            })

            if ((event?.event_tickets_limit_by_user_by_type ?? 5) < ticketNumber) {
                return new Response(JSON.stringify({ message: "you can't book more than the limit" }))
            }

            const foundTickets = await prisma.ticket.findMany({
                take: ticketNumber,
                where: {
                    ticket_status: "AVAILABLE",
                    ticket_type: ticketType,
                    event_id: eventId
                }
            })

            if (foundTickets.length == 0) {
                return new Response(JSON.stringify({ message: "no more ticket available for this type" }))
            }

            const book = await prisma.ticket.updateMany({
                where: {
                    ticket_id: {
                        in: foundTickets.map(t => t.ticket_id)
                    }
                },
                data: {
                    ticket_status: 'SOLD',
                    user_id: userId
                }

            })

            return new NextResponse(JSON.stringify(book), { status: 200 })


        } else {
            // si on veut annuler
            const foundTickets = await prisma.ticket.findMany({
                take: ticketNumber,
                where: {
                    user_id: userId,
                    ticket_type: ticketType
                }
            })

            if (foundTickets.length == 0) {
                return new Response(JSON.stringify({ message: "you have booked no ticket of that type" }))
            }
            const cancel = await prisma.ticket.updateMany({
                where: {
                    ticket_id: {
                        in: foundTickets.map(t => t.ticket_id)
                    }
                },
                data: {
                    ticket_status: "AVAILABLE",
                    user_id: null
                }
            })

            return new Response(JSON.stringify(cancel), { status: 200 })

        }

    } catch (e) {
        console.error("Error while updating the ticket", e)
    } finally {
        await prisma.$disconnect()
    }
}