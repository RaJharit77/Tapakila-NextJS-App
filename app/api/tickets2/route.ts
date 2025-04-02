import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"


export async function GET(request: Request) {
    try {
      const { searchParams } = new URL(request.url)
      const page = Number(searchParams.get('page')) || 1
      const pageSize = Number(searchParams.get('pageSize')) || 10
      const skip = (page - 1) * pageSize
  
      const [tickets, totalTickets] = await Promise.all([
        prisma.ticket.findMany({
          skip,
          take: pageSize,
          orderBy: { ticket_creation_date: 'desc' },
        }),
        prisma.ticket.count()
      ])
  
      return NextResponse.json({
        tickets,
        totalPages: Math.ceil(totalTickets / pageSize),
        currentPage: page,
      }, { status: 200 })
  
    } catch (error) {
      console.error('Error fetching tickets:', error)
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des tickets.' },
        { status: 500 }
      )
    } finally {
      await prisma.$disconnect()
    }
}

  export async function POST(request: Request) {
    try {
      const { eventData, ticketCounts } = await request.json()
  
      const { vip = 0, earlyBird = 0, standard = 0 } = ticketCounts
  
      const event = await prisma.event.create({
        data: {
          ...eventData,
          tickets: {
            create: [
              ...Array(vip).fill({ 
                ticket_type: 'VIP',
                ticket_price: eventData.vipPrice,
                ticket_status: 'AVAILABLE'
              }),
              ...Array(earlyBird).fill({ 
                ticket_type: 'EARLY_BIRD',
                ticket_price: eventData.earlyBirdPrice,
                ticket_status: 'AVAILABLE'
              }),
              ...Array(standard).fill({ 
                ticket_type: 'STANDARD',
                ticket_price: eventData.standardPrice,
                ticket_status: 'AVAILABLE'
              }),
            ],
          },
        },
      })
  
      return NextResponse.json(event, { status: 201 })
  
    } catch (error) {
      console.error('Error creating event:', error)
      return NextResponse.json(
        { error: 'Erreur lors de la création de l\'événement et des tickets.' },
        { status: 500 }
      )
    } finally {
      await prisma.$disconnect()
    }
  }

    
export async function DELETE(request: Request) {
    try {
      const { ticket_id } = await request.json()
  
      const ticket = await prisma.ticket.findUnique({
        where: { ticket_id },
      })
  
      if (!ticket) {
        return NextResponse.json(
          { error: 'Ticket non trouvé.' },
          { status: 404 }
        )
      }
  
      if (ticket.user_id !== null) {
        return NextResponse.json(
          { error: 'Le ticket est associé à un utilisateur.' },
          { status: 400 }
        )
      }
  
      await prisma.ticket.delete({
        where: { ticket_id },
      })
  
      return NextResponse.json(
        { message: 'Ticket supprimé avec succès.' },
        { status: 200 }
      )
  
    } catch (error) {
      console.error('Error deleting ticket:', error)
      return NextResponse.json(
        { error: 'Erreur lors de la suppression du ticket.' },
        { status: 500 }
      )
    } finally {
      await prisma.$disconnect()
    }
  }