"use server";

import { prisma } from "@/lib/prisma";
import { neon } from "@neondatabase/serverless";
import { Type } from "@prisma/client";

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
        const { userId, ticketNumber, ticketType, requestType, eventId } = data;

        if (!userId || !eventId) {
            return {
                status: 400,
                message: "User ID and Event ID are required"
            };
        }

        if (requestType === "BOOK") {
            const event = await prisma.event.findUnique({
                where: { event_id: eventId }
            });

            if (!event) {
                return {
                    status: 404,
                    message: "Event not found"
                };
            }

            const limit = event.event_tickets_limit_by_user_by_type ?? 5;
            if (ticketNumber > limit) {
                return {
                    status: 400,
                    message: `You can't book more than ${limit} tickets of this type`
                };
            }

            const foundTickets = await prisma.ticket.findMany({
                take: ticketNumber,
                where: {
                    ticket_status: "AVAILABLE",
                    ticket_type: ticketType,
                    event_id: eventId
                }
            });

            if (foundTickets.length === 0) {
                return {
                    status: 400,
                    message: "No more tickets available for this type"
                };
            }

            const updatedTickets = await prisma.ticket.updateMany({
                where: {
                    ticket_id: { in: foundTickets.map(t => t.ticket_id) }
                },
                data: {
                    ticket_status: 'SOLD',
                    user_id: userId
                }
            });

            return {
                status: 200,
                success: true,
                count: updatedTickets.count,
                message: "Reservation successful"
            };
        } else {
            const foundTickets = await prisma.ticket.findMany({
                take: ticketNumber,
                where: {
                    user_id: userId,
                    ticket_type: ticketType,
                    event_id: eventId
                }
            });

            if (foundTickets.length === 0) {
                return {
                    status: 400,
                    message: "No tickets found to cancel"
                };
            }

            const canceledTickets = await prisma.ticket.updateMany({
                where: {
                    ticket_id: { in: foundTickets.map(t => t.ticket_id) }
                },
                data: {
                    ticket_status: "AVAILABLE",
                    user_id: null
                }
            });

            return {
                status: 200,
                success: true,
                count: canceledTickets.count,
                message: "Cancellation successful"
            };
        }
    } catch (e) {
        console.error("Error in BookATicket:", e);
        return {
            status: 500,
            message: "Internal server error",
            error: e instanceof Error ? e.message : "Unknown error"
        };
    } finally {
        await prisma.$disconnect();
    }
}