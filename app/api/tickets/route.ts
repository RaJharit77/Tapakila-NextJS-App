import { prisma } from "@/lib/prisma";
import { Status, Type } from "@prisma/client";
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
    })

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
  



    return NextResponse.json({ ticketsNumber }, { status: 200 });
    

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
    const { ticketNumber } = await request.json()
    const foundTickets = await prisma.ticket.findMany({
      take: Number(ticketNumber),
      where: {
        ticket_status: "AVAILABLE"
      }
    })

    const deleteTickets = await prisma.ticket.deleteMany({
      where: {
        ticket_id: {
          in: foundTickets.map(t => t.ticket_id)
        }
      }
    })

    return new NextResponse(JSON.stringify(deleteTickets), { status: 200 });

  } catch (e) {
    console.error("Error while deleting the ticket", e)
    return new NextResponse(JSON.stringify({ error: "Repository error" }),
      { status: 500 }
    );

  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: Request) {
  try {
    const { ticketNumber, idEvent, ticket_type, ticketPrice } = await request.json();

    if (!ticketNumber || !idEvent || !ticket_type || ticketPrice === undefined) {
      return new NextResponse(JSON.stringify({ error: "Champs requis manquants" }), { 
        status: 400 
      });
    }

    const lastTicket = await prisma.ticket.findFirst({
      where: {
        event_id: idEvent,
        ticket_id: { startsWith: idEvent + "TKT" }
      },
      orderBy: { ticket_creation_date: "desc" },
      select: { ticket_id: true }
    });

    const lastId = lastTicket 
      ? parseInt(lastTicket.ticket_id.split(idEvent + "TKT")[1] || "0")
      : 0;

    const ticketsToCreate = [];
    for (let i = 1; i <= ticketNumber; i++) {
      ticketsToCreate.push({
        ticket_id: `${idEvent}TKT${lastId + i}`,
        ticket_status: "AVAILABLE" as Status,
        event_id: idEvent,
        ticket_type,
        ticket_price: ticketPrice,
        ticket_creation_date: new Date(),
      });
    }

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
    console.error("Erreur lors de la création des tickets:", e);
    return new NextResponse(JSON.stringify({ 
      error: "Repository error",
    }), { 
      status: 500 
    });
  } finally {
    await prisma.$disconnect();
  }
}