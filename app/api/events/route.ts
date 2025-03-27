import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const events = await prisma.event.findMany({
            include: {
                tickets: true,
            },
        });
        return new NextResponse(JSON.stringify(events), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error("Error fetching events:", error);
        return new NextResponse(JSON.stringify({ error: "Failed to fetch events" }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    } finally {
        await prisma.$disconnect();
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { event_name, event_place, event_category, event_date, event_description, event_organizer, event_id, event_image, admin_id } = body
        if (!event_name || !event_place || !event_category || !event_date) {
            return new NextResponse(JSON.stringify({ error: 'those field must be filled! ' }))
        }
        else {
            const newEv = await prisma.event.create({
                data: {
                    event_name,
                    event_place,
                    event_category,
                    event_date,
                    event_description,
                    event_image,
                    event_organizer,
                    event_id,
                    admin_id
                }

            })

            return new NextResponse(JSON.stringify(newEv), {
                status: 201
            })
        }
    }
    catch (error) {
        console.error("Error while creating the event", error)
        return new NextResponse(JSON.stringify({ error: "Repository error" }),
            { status: 500 }
        )
    }

    finally {
        await prisma.$disconnect()
    }
}
