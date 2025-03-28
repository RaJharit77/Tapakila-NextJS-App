import { prisma } from "@/lib/prisma";
import { EventStatus } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const status = url.searchParams.get('status');
        const page = url.searchParams.get('page');
        
        let events = await prisma.event.findMany({
            include: {
                tickets: true,

            },
            take: 10,
            skip: page ? (parseInt(page) - 1) * 10 : 0
        });

        if(status){
            events = await prisma.event.findMany({
                where: {
                    event_status: status as EventStatus
                },
                include: {
                    tickets: true,
                }, 
                take: 10,
                skip: page ? (parseInt(page) - 1) * 10 : 0
            })
        }
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
               orderBy:{
                event_creation_date: 'desc'
               }
            })
            const lastEventId = lastCreatedEvent ? lastCreatedEvent.event_id : null
            const splited = lastEventId == null ? 1 :parseInt(lastEventId?.split("E").join(""))+ 1
            const event_id = `E${"0".repeat(5-splited.toString.length)}${splited}`
                console.log(lastCreatedEvent)

            if(!event_category || !event_image || !event_description){
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
                    event_id : event_id,
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
