import { prisma } from "@/lib/prisma";
import { Status, Type, Ticket, Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    const type = url.searchParams.get('type');
    const idEvent = url.searchParams.get('idEvent');

    const ticketsNumber = await prisma.ticket.count({
      where:{
        ticket_status: "SOLD" as Status
      }
    });

    const ticketStats = await prisma.ticket.groupBy({
      by: ['ticket_type'],
      where: {
        ticket_status: "SOLD" as Status
      },
      _count: {
        ticket_type: true
      }
    });

    const formattedStats = {
      vipCount: ticketStats.find(stat => stat.ticket_type === 'VIP')?._count.ticket_type || 0,
      standardCount: ticketStats.find(stat => stat.ticket_type === 'STANDARD')?._count.ticket_type || 0,
      earlyBirdCount: ticketStats.find(stat => stat.ticket_type === 'EARLY_BIRD')?._count.ticket_type || 0,
      total: ticketStats.reduce((sum, stat) => sum + stat._count.ticket_type, 0)
    };

    if(status || type || idEvent){
      const tickets = await prisma.ticket.findMany({
        where: {
          ...(status && { ticket_status: status as Status }),
          ...(type && { ticket_type: type as Type }),
          ...(idEvent && { event_id: idEvent })
        }
      })

      return NextResponse.json({ tickets }, { status: 200 });
    }

    return NextResponse.json({ ...formattedStats, ticketsNumber }, { status: 200 });

  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json(
      { error: 'Repository Error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}


//  ========== ADMIN ==========
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const ticketNumber = searchParams.get('ticketNumber');
    const eventId = searchParams.get('event_id');
    const ticketType = searchParams.get('ticket_type');

    if (!ticketNumber || !eventId) {
      return new NextResponse(
        JSON.stringify({ error: "Paramètres requis manquants : ticketNumber ou event_id" }),
        { status: 400 }
      );
    }

    const numRequestedTickets = Number(ticketNumber);
    if (isNaN(numRequestedTickets)) {
      return new NextResponse(
        JSON.stringify({ error: "Le paramètre ticketNumber doit être un nombre valide" }),
        { status: 400 }
      );
    }


    const whereClause: any = {
      event_id: eventId,
      ticket_status: "AVAILABLE"
    };

    if (ticketType) {
      whereClause.ticket_type = ticketType;
    }


    const availableTickets = await prisma.ticket.count({
      where: whereClause
    });

    if (availableTickets < numRequestedTickets) {
      return new NextResponse(
        JSON.stringify({
          error: "Stock insuffisant",
          details: {
            requested: numRequestedTickets,
            available: availableTickets,
            ticketType: ticketType || "Tous types"
          }
        }),
        { status: 409 } 
      );
    }


    const foundTickets = await prisma.ticket.findMany({
      take: numRequestedTickets,
      where: whereClause,

    });

  
    const deleteResult = await prisma.ticket.deleteMany({
      where: {
        ticket_id: { in: foundTickets.map(t => t.ticket_id) }
      }
    });

    return new NextResponse(JSON.stringify({
      success: true,
      deletedCount: deleteResult.count,
      remaining: availableTickets - deleteResult.count,
      eventId,
      ticketTypeFilter: ticketType || "Tous types"
    }), { status: 200 });

  } catch (e) {
    console.error("Erreur :", e);
    return new NextResponse(
      JSON.stringify({ 
        error: "Erreur lors de la suppression",
        details: e instanceof Error ? e.message : "Erreur inconnue"
      }),
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: Request) {
  try {
    const { ticketNumber, idEvent, ticket_type, ticketPrice } = await request.json();
    console.log(ticketNumber);
    console.log(idEvent);
    console.log(ticket_type);
    console.log(ticketPrice);


 
    if (!ticketNumber || !idEvent || !ticket_type || ticketPrice === undefined) {
      return new NextResponse(JSON.stringify({ error: "Missing required fields" }), { 
        status: 400 
      });
    }

    if (typeof idEvent !== 'string') {
      return new NextResponse(JSON.stringify({ error: "Invalid event ID format" }), { 
        status: 400 
      });
    }

  
    let lastId = 0;
    try {
      const lastTicket = await prisma.ticket.findFirst({
        where: {
          event_id: idEvent,
          ticket_id: { startsWith: idEvent + "TKT" }
        },
        orderBy: { ticket_creation_date: 'desc' }, 
        select: { ticket_id: true }
      });

      if (lastTicket) {
        console.log("Found last ticket:", lastTicket.ticket_id); // Added log
        const match = lastTicket.ticket_id.match(new RegExp(`${idEvent}TKT(\\d+)`));
        lastId = match ? parseInt(match[1]) : 0;
        console.log("Calculated lastId:", lastId); // Added log
      } else {
        console.log("No previous tickets found for this event."); // Added log for clarity
      }
    } catch (queryError) {
      console.error("Query error:", queryError);
 
    }

 
    const ticketsToCreate = Array.from({ length: ticketNumber }, (_, i) => ({
      ticket_id: `${idEvent}TKT${lastId + i + 1}`,
      ticket_status: "AVAILABLE" as const,
      event_id: idEvent,
      ticket_type,
      ticket_price: ticketPrice,
    }));

    console.log(ticketsToCreate);


    const result = await prisma.ticket.createMany({
      data: ticketsToCreate,
      skipDuplicates: true,
    });

    return new NextResponse(JSON.stringify({ 
      created: result.count 
    }), { 
      status: 201 
    });

  } catch (e) {
    console.error("Ticket creation failed:", e);
    return new NextResponse(JSON.stringify({ 
      error: e instanceof Error ? e.message : "Internal server error",
    }), { 
      status: 500 
    });
  } finally {
    await prisma.$disconnect();
  }
}
