import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { eventId: string } }) {
    const { eventId } = await params;
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

export async function DELETE(params: string) {
    try {
        const event = await prisma.event.delete({
            where: {
                event_id: params
            }
        })

        const verify = await prisma.event.findUnique({
            where: {
                event_id: params
            }
        })

        if (verify == null) {
            return NextResponse.json(
                { error: "that event doesn't exist" },
                { status: 500 }
            )
        } else {
            return new NextResponse(JSON.stringify(event), { status: 200, headers: { 'Content-Type': 'application/json' } })
        }

    }
    catch (error) {
        console.error("error fetching datas", error)
        return new NextResponse(JSON.stringify({ error: "Repository Error" }), { status: 500 })

    }
    finally {
        prisma.$disconnect()
    }
}
