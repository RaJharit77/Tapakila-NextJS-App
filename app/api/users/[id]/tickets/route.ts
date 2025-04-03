import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        
        const userWithTickets = await prisma.user.findUnique({
            where: {
                user_id: id
            },
            include: {
                tickets: {
                    include: {
                        event: true
                    },
                    orderBy: {
                        ticket_creation_date: 'desc'
                    }
                }
            }
        });

        if (!userWithTickets) {
            return new NextResponse(JSON.stringify({ error: "User not found" }), { status: 404 });
        }

        return new NextResponse(JSON.stringify({
            tickets: userWithTickets.tickets.map(ticket => ({
                ticket_id: ticket.ticket_id,
                ticket_type: ticket.ticket_type,
                ticket_price: ticket.ticket_price,
                ticket_status: ticket.ticket_status,
                event: {
                    event_id: ticket.event.event_id,
                    event_name: ticket.event.event_name,
                    event_image: ticket.event.event_image,
                    event_date: ticket.event.event_date
                }
            }))
        }), { 
            status: 200, 
            headers: { 'Content-Type': 'application/json' } 
        });
    } catch (error) {
        console.error("Error fetching user tickets:", error);
        return new NextResponse(
            JSON.stringify({ error: "Internal server error" }),
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}