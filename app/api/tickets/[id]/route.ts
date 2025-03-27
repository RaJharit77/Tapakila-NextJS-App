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