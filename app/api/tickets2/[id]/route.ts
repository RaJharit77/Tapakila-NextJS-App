import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"


export async function POST(request: Request) {
    try {
      const { event_id, ticket_type, ticket_price } = await request.json()
  
      const lastTicket = await prisma.ticket.findFirst({
        where: { event_id },
        orderBy: { ticket_id: 'desc' },
      })
  
      const lastId = lastTicket
        ? parseInt(lastTicket.ticket_id.split(`${event_id}TKT`)[1] || '0')
        : 0
  
      const newTicketId = `${event_id}TKT${lastId + 1}`
  
      const ticket = await prisma.ticket.create({
        data: {
          ticket_id: newTicketId,
          event_id,
          ticket_type,
          ticket_price,
          ticket_status: 'AVAILABLE',
        },
      })
  
      return NextResponse.json(ticket, { status: 201 })
  
    } catch (error) {
      console.error('Error adding ticket:', error)
      return NextResponse.json(
        { error: 'Erreur lors de l\'ajout du ticket.' },
        { status: 500 }
      )
    } finally {
      await prisma.$disconnect()
    }
}