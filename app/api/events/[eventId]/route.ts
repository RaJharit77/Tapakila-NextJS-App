// app/api/events/[eventId]/route.ts
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { validateEventPayload } from "@/lib/events";
import { NextResponse } from "next/server";

type Ctx = { params: Promise<{ eventId: string }> };

/** GET /api/events/:eventId (public) : événement + tickets + statistiques */
export async function GET(_request: Request, { params }: Ctx) {
  try {
    const { eventId } = await params;
    const event = await prisma.event.findUnique({
      where: { event_id: eventId },
      include: { tickets: true },
    });
    if (!event) return NextResponse.json({ error: "Event not found" }, { status: 404 });

    const count = (s: string) => event.tickets.filter((t) => t.ticket_status === s).length;
    return NextResponse.json(
      {
        ...event,
        stats: {
          total: event.tickets.length,
          available: count("AVAILABLE"),
          reserved: count("RESERVED"),
          sold: count("SOLD"),
          isSoldOut: event.tickets.length > 0 && count("AVAILABLE") === 0,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching event:", error);
    return NextResponse.json({ error: "Failed to fetch event" }, { status: 500 });
  }
}

/**
 * PUT / PATCH /api/events/:eventId : modification partielle (seuls les champs envoyés changent).
 * Un admin ne modifie que SES événements ; le super admin peut tout modifier.
 */
async function updateEvent(request: Request, { params }: Ctx) {
  try {
    const auth = await requireAdmin(request);
    if (auth.error) return auth.error;

    const { eventId } = await params;
    const existing = await prisma.event.findUnique({
      where: { event_id: eventId },
      select: { admin_id: true },
    });
    if (!existing) return NextResponse.json({ error: "Event not found" }, { status: 404 });

    if (auth.admin.admin_role !== "SUPER_ADMIN" && existing.admin_id !== auth.admin.admin_id) {
      return NextResponse.json({ error: "Vous ne pouvez modifier que vos événements" }, { status: 403 });
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Body JSON invalide" }, { status: 400 });
    }

    const validation = validateEventPayload(body, "update");
    if (validation.error) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const updated = await prisma.event.update({
      where: { event_id: eventId },
      data: validation.data,
    });
    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("Error while updating the event:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
export const PUT = updateEvent;
export const PATCH = updateEvent;

/**
 * DELETE /api/events/:eventId
 * Refusé (409) s'il reste des tickets vendus ou réservés : annulez plutôt l'événement
 * (PATCH { "event_status": "CANCLED" }). Les tickets AVAILABLE sont supprimés avec l'événement.
 */
export async function DELETE(request: Request, { params }: Ctx) {
  try {
    const auth = await requireAdmin(request);
    if (auth.error) return auth.error;

    const { eventId } = await params;
    const existing = await prisma.event.findUnique({
      where: { event_id: eventId },
      select: { admin_id: true },
    });
    if (!existing) return NextResponse.json({ error: "Event not found" }, { status: 404 });

    if (auth.admin.admin_role !== "SUPER_ADMIN" && existing.admin_id !== auth.admin.admin_id) {
      return NextResponse.json({ error: "Vous ne pouvez supprimer que vos événements" }, { status: 403 });
    }

    const engaged = await prisma.ticket.count({
      where: { event_id: eventId, ticket_status: { in: ["SOLD", "RESERVED"] } },
    });
    if (engaged > 0) {
      return NextResponse.json(
        {
          error: "Suppression impossible : des tickets sont vendus ou réservés",
          details: { engagedTickets: engaged, hint: 'PATCH { "event_status": "CANCLED" }' },
        },
        { status: 409 }
      );
    }

    const [, deleted] = await prisma.$transaction([
      prisma.ticket.deleteMany({ where: { event_id: eventId } }),
      prisma.event.delete({ where: { event_id: eventId } }),
    ]);
    return NextResponse.json(deleted, { status: 200 });
  } catch (error) {
    console.error("Error deleting event:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
