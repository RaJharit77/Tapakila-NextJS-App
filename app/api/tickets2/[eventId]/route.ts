import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { event_id: string } }) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number(searchParams.get('page')) || 1
    const pageSize = Number(searchParams.get('pageSize')) || 10
    const reserved = searchParams.get('reserved') 
    const skip = (page - 1) * pageSize
    const { event_id } = params

    if (!event_id) {
      return NextResponse.json({ error: 'event_id est requis.' }, { status: 400 })
    }

    let userFilter: any = {}
    if (reserved === 'true') {
      userFilter = { not: null } 
    } else if (reserved === 'false') {
      userFilter = null 
    }

    const [tickets, totalTickets] = await Promise.all([
      prisma.ticket.findMany({
        where: { user_id: userFilter, event_id: event_id },
        skip,
        take: pageSize,
        orderBy: { ticket_creation_date: 'desc' },
      }),
      prisma.ticket.count({ where: { user_id: userFilter, event_id: event_id } })
    ])

    return NextResponse.json({
      tickets,
      totalPages: Math.ceil(totalTickets / pageSize),
      currentPage: page,
    }, { status: 200 })

  } catch (error) {
    console.error('Erreur lors de la récupération des tickets:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des tickets.' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}



export async function POST(request: Request, { params }: { params: { event_id: string } }) {
  try {
    const { event_id } = params;
    const { ticketCounts, vipPrice, earlyBirdPrice, standardPrice } = await request.json();

    if (!event_id) {
      return NextResponse.json({ error: 'event_id est requis.' }, { status: 400 });
    }

    const eventExists = await prisma.event.findUnique({ where: { event_id } });
    if (!eventExists) {
      return NextResponse.json({ error: 'Événement introuvable.' }, { status: 404 });
    }

    const { vip = 0, earlyBird = 0, standard = 0 } = ticketCounts;

    const tickets = [
      ...Array(vip).fill({ ticket_type: 'VIP', ticket_price: vipPrice, ticket_status: 'AVAILABLE', event_id }),
      ...Array(earlyBird).fill({ ticket_type: 'EARLY_BIRD', ticket_price: earlyBirdPrice, ticket_status: 'AVAILABLE', event_id }),
      ...Array(standard).fill({ ticket_type: 'STANDARD', ticket_price: standardPrice, ticket_status: 'AVAILABLE', event_id }),
    ];

    await prisma.ticket.createMany({ data: tickets });

    return NextResponse.json({ message: 'Tickets créés avec succès', tickets }, { status: 201 });

  } catch (error) {
    console.error('Erreur lors de la création des tickets:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création des tickets.' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}


export async function DELETE(request: Request, { params }: { params: { event_id: string } }) {
  try {
    const { event_id } = params;
    const { count } = await request.json(); 

    if (!event_id) {
      return NextResponse.json({ error: 'event_id est requis.' }, { status: 400 });
    }

    if (!count || count <= 0) {
      return NextResponse.json({ error: 'Le nombre de tickets à supprimer doit être supérieur à 0.' }, { status: 400 });
    }


    const eventExists = await prisma.event.findUnique({ where: { event_id } });
    if (!eventExists) {
      return NextResponse.json({ error: 'Événement introuvable.' }, { status: 404 });
    }

    const availableTicketsCount = await prisma.ticket.count({
      where: { event_id, user_id: null },
    });

    if (availableTicketsCount === 0) {
      return NextResponse.json({ error: 'Aucun ticket disponible à supprimer.' }, { status: 400 });
    }

    if (count > availableTicketsCount) {
      return NextResponse.json({ 
        error: `Impossible de supprimer ${count} ticket(s), seulement ${availableTicketsCount} disponible(s).` 
      }, { status: 400 });
    }

   
    const availableTickets = await prisma.ticket.findMany({
      where: { event_id, user_id: null },
      orderBy: { ticket_creation_date: 'asc' }, 
      take: count,
    });

 
    const deletedTickets = await prisma.ticket.deleteMany({
      where: { ticket_id: { in: availableTickets.map(ticket => ticket.ticket_id) } }
    });

    return NextResponse.json({ message: `${deletedTickets.count} ticket(s) supprimé(s) avec succès.` }, { status: 200 });

  } catch (error) {
    console.error('Erreur lors de la suppression des tickets:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression des tickets.' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
