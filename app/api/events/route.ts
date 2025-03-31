import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import type { EventStatus } from "@prisma/client";

interface EventWhereClause {
    event_status?: EventStatus;
    event_name?: { contains: string; mode: "insensitive" };
    event_place?: { contains: string; mode: "insensitive" };
    event_date?: {
        gte: Date;
        lt: Date;
    };
}

interface EventPostData {
    event_name: string;
    event_place: string;
    event_category: string;
    event_date: string;
    event_description?: string;
    event_organizer?: string;
    event_image?: string;
    admin_id: string;
}

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const status = url.searchParams.get('status');
        const page = url.searchParams.get('page');
        const pageSize = parseInt(url.searchParams.get('pageSize') || "10");
        const category = url.searchParams.get('category');
        const name = url.searchParams.get("name");
        const location = url.searchParams.get("location");
        const date = url.searchParams.get("date");

        
        let events = await prisma.event.findMany({
            include: {
                tickets: true,
            },
            take: pageSize ,
            skip: page ? (parseInt(page) - 1) * pageSize : 0
        });

        if(status || category || name || location || date){
            events = await prisma.event.findMany({
                where: {
                    ...(category && { event_category: category }),
                    ...(status && { event_status: status as EventStatus }),
                    ...(name && { event_name: { contains: name, mode: "insensitive" } }),
                    ...(location && { event_place: { contains: location, mode: "insensitive" } }),
                    ...(date && {
                        event_date: {
                            gte: new Date(date),
                            lt: new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000),
                        },
                    })
                },
                include: {
                    tickets: true,
                }, 
                take: pageSize,
                skip: page ? (parseInt(page) - 1) * pageSize : 0
            })
        }

        return new NextResponse(JSON.stringify(events), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error("Error fetching events:", error);
        return NextResponse.json(
            { error: "Failed to fetch events" },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}








export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { event_name, event_place, event_category, event_date, event_description, event_organizer, event_image, admin_id } = body
        const admin = await prisma.admin.findUnique({
            where:{
                admin_id : admin_id
            }
        }) 


        if (!event_name || !event_place || !event_category || !event_date || !admin_id) {
            return new NextResponse(JSON.stringify({ error: 'those field must be filled! ' }, ), {status: 400})
        }

        if(admin_id != admin?.admin_id){
            return new NextResponse(JSON.stringify({ error: 'Invalid admin' }), {status: 400})
        }
        if(isNaN(new Date(event_date).getTime())){
            return new NextResponse(JSON.stringify({ error: 'Invalid date, please use YYYY-MM-DD' }), {status: 400})
        }
        
        else {

        let status: EventStatus = "UPLOADED";
        const lastCreatedEvent = await prisma.event.findFirst({
            orderBy: { event_creation_date: "desc" },
            select: { event_id: true },
        });

        const lastEventNumber = lastCreatedEvent
            ? parseInt(lastCreatedEvent.event_id.slice(1))
            : 0;
        const newEventNumber = lastEventNumber + 1;
        const event_id = `E${newEventNumber.toString().padStart(5, "0")}`;

        if (!body.event_category || !body.event_image || !body.event_description) {
            status = "DRAFT";
        }
        const [year, month, day] = event_date.split('/');
        const date = new Date(`${year}-${month}-${day}`); 
        const newEvent = await prisma.event.create({
            data: {
                event_id,
                event_name,
                event_place,
                event_category,
                event_date: date,
                event_description: body.event_description,
                event_image: body.event_image,
                event_organizer: body.event_organizer ?? "",
                admin_id,
                event_creation_date: new Date(),
                event_status: status,
            },
        });

        return NextResponse.json(newEvent, { status: 201 });
    }} catch (error) {
        console.error("Error while creating the event:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}