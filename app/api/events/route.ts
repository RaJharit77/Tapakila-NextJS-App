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
        const status = url.searchParams.get("status") as EventStatus | null;
        const page = url.searchParams.get("page");
        const name = url.searchParams.get("name");
        const location = url.searchParams.get("location");
        const date = url.searchParams.get("date");

        const whereClause: EventWhereClause = {};

        if (status) {
            whereClause.event_status = status;
        }

        if (name) {
            whereClause.event_name = { contains: name, mode: "insensitive" };
        }

        if (location) {
            whereClause.event_place = { contains: location, mode: "insensitive" };
        }

        if (date) {
            const [day, month, year] = date.split("/");
            const formattedDate = new Date(`${year}-${month}-${day}`);
            whereClause.event_date = {
                gte: formattedDate,
                lt: new Date(formattedDate.getTime() + 24 * 60 * 60 * 1000),
            };
        }

        const events = await prisma.event.findMany({
            where: whereClause,
            include: {
                tickets: true,
            },
            take: 10,
            skip: page ? (parseInt(page) - 1) * 10 : 0,
        });

        return NextResponse.json(events);
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
        const body: EventPostData = await request.json();
        const { event_name, event_place, event_category, event_date, admin_id } = body;

        if (!event_name || !event_place || !event_category || !event_date || !admin_id) {
            return NextResponse.json(
                { error: "Required fields are missing" },
                { status: 400 }
            );
        }

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

        const newEvent = await prisma.event.create({
            data: {
                event_id,
                event_name,
                event_place,
                event_category,
                event_date: new Date(event_date),
                event_description: body.event_description,
                event_image: body.event_image,
                event_organizer: body.event_organizer ?? "",
                admin_id,
                event_creation_date: new Date(),
                event_status: status,
            },
        });

        return NextResponse.json(newEvent, { status: 201 });
    } catch (error) {
        console.error("Error while creating the event:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}