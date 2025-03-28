import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

enum EventStatus {
    UPLOADED = "UPLOADED",
    DRAFT = "DRAFT"
}

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const status = url.searchParams.get('status');
        const page = url.searchParams.get('page');
        const name = url.searchParams.get('name');
        const location = url.searchParams.get('location');
        const date = url.searchParams.get('date');
        
        let whereClause: any = {};
        
        if (status) {
            whereClause.event_status = status as EventStatus;
        }
        
        if (name) {
            whereClause.event_name = { contains: name, mode: 'insensitive' };
        }
        
        if (location) {
            whereClause.event_place = { contains: location, mode: 'insensitive' };
        }
        
        if (date) {
            const [day, month, year] = date.split('/');
            const formattedDate = `${year}-${month}-${day}`;
            whereClause.event_date = {
                gte: new Date(formattedDate),
                lt: new Date(new Date(formattedDate).getTime() + 24 * 60 * 60 * 1000)
            };
        }

        const events = await prisma.event.findMany({
            where: whereClause,
            include: {
                tickets: true,
            },
            take: 10,
            skip: page ? (parseInt(page) - 1) * 10 : 0
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
        const { event_name, event_place, event_category, event_date, event_description, event_organizer, event_image, admin_id } = body
        if (!event_name || !event_place || !event_category || !event_date) {
            return new NextResponse(JSON.stringify({ error: 'those field must be filled! ' }))
        }
        else {

            let status = "UPLOADED" as EventStatus
            const lastCreatedEvent = await prisma.event.findFirst({
                orderBy: {
                    event_creation_date: 'desc'
                }
            })
            const lastEventId = lastCreatedEvent ? lastCreatedEvent.event_id : null
            const splited = lastEventId == null ? 1 : parseInt(lastEventId?.split("E").join("")) + 1
            const event_id = `E${"0".repeat(5 - splited.toString.length)}${splited}`
            console.log(lastCreatedEvent)

            if (!event_category || !event_image || !event_description) {
                status = "DRAFT" as EventStatus
            }



            const newEv = await prisma.event.create({
                data: {
                    event_name,
                    event_place,
                    event_category,
                    event_date,
                    event_description,
                    event_image,
                    event_organizer,
                    event_id: event_id,
                    admin_id,
                    event_creation_date: new Date().toISOString(),
                    event_status: status
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
