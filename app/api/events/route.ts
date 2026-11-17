// app/api/events/route.ts
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import {
  isEventStatus,
  isUniqueViolation,
  nextEventId,
  parseEventDate,
  validateEventPayload,
} from "@/lib/events";
import type { Prisma } from "@/generated/prisma";
import { NextResponse } from "next/server";

function toInt(value: string | null, fallback: number, max = Number.MAX_SAFE_INTEGER) {
  const n = parseInt(value ?? "", 10);
  return Number.isNaN(n) || n < 1 ? fallback : Math.min(n, max);
}

/**
 * GET /api/events (public)
 * Query : page, pageSize, status, category, name, location, date, upcoming=true,
 *         order=asc|desc (tri par date), includeTickets=false
 * Réponse : tableau d'événements (comme avant) + header X-Total-Count
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = toInt(searchParams.get("page"), 1);
    const pageSize = toInt(searchParams.get("pageSize"), 10, 100);
    const status = searchParams.get("status");
    const category = searchParams.get("category");
    const name = searchParams.get("name");
    const location = searchParams.get("location");
    const date = searchParams.get("date");
    const upcoming = searchParams.get("upcoming") === "true";
    const order = searchParams.get("order") === "desc" ? "desc" : "asc";
    const includeTickets = searchParams.get("includeTickets") !== "false";

    if (status && !isEventStatus(status)) {
      return NextResponse.json({ error: "status invalide" }, { status: 400 });
    }

    let dateFilter: Prisma.DateTimeFilter | undefined;
    if (date) {
      const d = parseEventDate(date);
      if (!d) return NextResponse.json({ error: "date invalide" }, { status: 400 });
      dateFilter = { gte: d, lt: new Date(d.getTime() + 86_400_000) };
    } else if (upcoming) {
      dateFilter = { gte: new Date() };
    }

    const where: Prisma.EventWhereInput = {
      ...(status && { event_status: status as Prisma.EventWhereInput["event_status"] }),
      ...(category && { event_category: { equals: category, mode: "insensitive" } }),
      ...(name && { event_name: { contains: name, mode: "insensitive" } }),
      ...(location && { event_place: { contains: location, mode: "insensitive" } }),
      ...(dateFilter && { event_date: dateFilter }),
    };

    const [events, total] = await prisma.$transaction([
      prisma.event.findMany({
        where,
        include: includeTickets ? { tickets: true } : undefined,
        orderBy: { event_date: order },
        take: pageSize,
        skip: (page - 1) * pageSize,
      }),
      prisma.event.count({ where }),
    ]);

    return NextResponse.json(events, {
      status: 200,
      headers: { "X-Total-Count": String(total) },
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}

/** POST /api/events : création (admin ou super admin). admin_id vient du token, jamais du body. */
export async function POST(request: Request) {
  try {
    const auth = await requireAdmin(request);
    if (auth.error) return auth.error;

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Body JSON invalide" }, { status: 400 });
    }

    const validation = validateEventPayload(body, "create");
    if (validation.error) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }
    const data = validation.data;

    // Un événement incomplet reste en brouillon, sauf statut explicite
    const status =
      data.event_status ??
      (data.event_category && data.event_image && data.event_description ? "UPLOADED" : "DRAFT");

    // Retry en cas de collision d'ID (deux créations simultanées)
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const event = await prisma.event.create({
          data: {
            event_id: await nextEventId(prisma),
            event_name: data.event_name!,
            event_date: data.event_date!,
            event_place: data.event_place!,
            event_category: data.event_category,
            event_description: data.event_description,
            event_image: data.event_image,
            event_organizer: data.event_organizer ?? auth.admin.admin_name,
            event_tickets_limit_by_user_by_type: data.event_tickets_limit_by_user_by_type,
            event_status: status,
            admin_id: auth.admin.admin_id,
          },
        });
        return NextResponse.json(event, { status: 201 });
      } catch (error) {
        if (!isUniqueViolation(error) || attempt === 2) throw error;
      }
    }
  } catch (error) {
    console.error("Error while creating the event:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
