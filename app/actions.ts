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

const checkTickets = async (eventId: string) => {
 
    await fetch(`/api/tickets/update?eventId=${eventId}`, {
      method: 'POST'
    });
  };


export async function BookATicket({ data }: { data: { userId: string, ticketNumber: number, requestType: "CANCEL" | "BOOK", ticketType: Type, eventId: string } }) {
    try {
        const { userId, ticketNumber, ticketType, requestType, eventId } = data;

        if (!userId || !eventId) {
            return {
                status: 400,
                message: "User ID and Event ID are required"
            };
        }

        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
        const url = new URL(`${baseUrl}/api/tickets/update`);
        url.searchParams.append('eventId', eventId);

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

            const response = await fetch(url.toString(), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId,
                    ticketNumber,
                    ticketType,
                    requestType,
                    eventId
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            await checkTickets(eventId);
            return result;
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