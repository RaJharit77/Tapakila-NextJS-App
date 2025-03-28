import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {


    const { id } = await params
    try {
        const ticket = await prisma.ticket.findUnique({
            where: {
                ticket_id: id
            },
            include: {
                user: true,
                event: true
            }
        })

        return new NextResponse(JSON.stringify(ticket), { status: 200, headers: { 'Content-Type': 'application/json' } })
    }
    catch (error) {
        console.error("error fetching datas", error)
        return new NextResponse(JSON.stringify({ error: "Repository Error" }), { status: 500 })

    }
    finally {
        prisma.$disconnect()
    }
}


export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try{
        const body = await request.json()
        const { id } = await params
        const ticketToUpdate = await prisma.ticket.findUnique({
            where: {
                ticket_id: id
            }
        })

        if (ticketToUpdate == null) {
            return new NextResponse(JSON.stringify({ error: "Ticket not found" }), { status: 404 })
        }
        else {
            const updatedTicket = await prisma.ticket.update({
                where: {
                    ticket_id: ticketToUpdate.ticket_id
                },
                data: body

            })

            return new NextResponse(JSON.stringify(updatedTicket), { status: 200 })
        }
    } catch (error) {
        console.error("Error while updating the ticket", error)
        return new NextResponse(JSON.stringify({ error: "Repository error" }),
            { status: 500 }
        )
    }
    finally {
        await prisma.$disconnect()
    }
}