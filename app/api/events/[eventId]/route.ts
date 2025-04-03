import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { eventId: string } }) {
    const { eventId } = await params;
    if (!eventId) {
        return new NextResponse(JSON.stringify({ error: "Event ID is required" }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        const event = await prisma.event.findUnique({
            where: {
                event_id: eventId,
            },
            include: {
                tickets: true,
            },
        });

        if (!event) {
            return new NextResponse(JSON.stringify({ error: "Event not found" }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        return new NextResponse(JSON.stringify(event), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error("Error fetching event:", error);
        return new NextResponse(JSON.stringify({ error: "Failed to fetch event" }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    } finally {
        await prisma.$disconnect();
    }
}

export async function PUT(request: Request, { params }: { params: { eventId: string } }) {
    console.log(request);
    try {
        const { eventId } = await params
        const body = await request.json()

        console.log(body);
        
        const event = await prisma.event.findUnique({
            where: {
                event_id: eventId
            }
        })

        if (event != null) {
            const updateEv = await prisma.event.update({
                where: {
                    event_id: eventId,
                },
                data: body
            })

            return new NextResponse(JSON.stringify(updateEv), { status: 200 })

        }
        else {
            const createEv = await prisma.event.create({
                data: body
            })

            return new NextResponse(JSON.stringify(createEv), {
                status: 201
            })
        }
    } catch (error) {
        console.error("Error while creating the event", error)
        return new NextResponse(JSON.stringify({ error: "Repository erro" }),
            { status: 500 }
        )
    }

    finally {
        await prisma.$disconnect()
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { eventId: string } }
  ) {
    try {
      
      const existingEvent = await prisma.event.findUnique({
        where: {
          event_id: params.eventId
        }
      })
  
      if (!existingEvent) {
        return NextResponse.json(
          { error: "Event not found" },
          { status: 404 }
        )
      }
  
      // 2. Delete the event
      const deletedEvent = await prisma.event.delete({
        where: {
          event_id: params.eventId
        }
      })
  
      return NextResponse.json(
        { 
          success: true,
          message: "Event deleted successfully",
          data: deletedEvent
        },
        { status: 200 }
      )
  
    } catch (error: any) {
      console.error("Deletion error:", error)
      return NextResponse.json(
        { 
          error: "Failed to delete event",
          details: error.message
        },
        { status: 500 }
      )
    } finally {
      await prisma.$disconnect()
    }
  }
