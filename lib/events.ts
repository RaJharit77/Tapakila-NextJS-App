// lib/events.ts
import type { EventStatus } from "@/generated/prisma";

export const EVENT_STATUSES: readonly EventStatus[] = ["CANCLED", "UPLOADED", "DRAFT"];

export const isEventStatus = (v: unknown): v is EventStatus =>
  typeof v === "string" && (EVENT_STATUSES as readonly string[]).includes(v);

export function isUniqueViolation(error: unknown): boolean {
  return typeof error === "object" && error !== null && (error as { code?: string }).code === "P2002";
}

/** Accepte "2026-12-25", "2026/12/25" ou une date ISO complète. */
export function parseEventDate(value: unknown): Date | null {
  if (typeof value !== "string") return null;
  const d = new Date(value.trim().replace(/\//g, "-"));
  return Number.isNaN(d.getTime()) ? null : d;
}

export interface EventPayload {
  event_name?: string;
  event_date?: Date;
  event_place?: string;
  event_organizer?: string;
  event_description?: string | null;
  event_image?: string | null;
  event_category?: string | null;
  event_status?: EventStatus;
  event_tickets_limit_by_user_by_type?: number;
}

type Validation = { data: EventPayload; error?: undefined } | { data?: undefined; error: string };

/**
 * Valide le body d'un événement et ne garde que les champs autorisés
 * (évite le mass-assignment : admin_id, event_id, event_creation_date ne sont jamais modifiables).
 */
export function validateEventPayload(body: unknown, mode: "create" | "update"): Validation {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { error: "Body JSON invalide" };
  }
  const b = body as Record<string, unknown>;
  const data: EventPayload = {};

  for (const key of ["event_name", "event_place", "event_organizer"] as const) {
    const v = b[key];
    if (v === undefined) continue;
    if (typeof v !== "string" || !v.trim()) return { error: `${key} doit être une chaîne non vide` };
    data[key] = v.trim();
  }

  for (const key of ["event_description", "event_category"] as const) {
    const v = b[key];
    if (v === undefined) continue;
    if (v === null) { data[key] = null; continue; }
    if (typeof v !== "string") return { error: `${key} doit être une chaîne ou null` };
    data[key] = v.trim() || null;
  }

  if (b.event_image !== undefined) {
    if (b.event_image === null || b.event_image === "") {
      data.event_image = null;
    } else if (typeof b.event_image === "string") {
      try {
        const url = new URL(b.event_image);
        if (!["http:", "https:"].includes(url.protocol)) throw new Error();
        data.event_image = b.event_image;
      } catch {
        return { error: "event_image doit être une URL http(s) valide" };
      }
    } else {
      return { error: "event_image doit être une URL ou null" };
    }
  }

  if (b.event_date !== undefined) {
    const d = parseEventDate(b.event_date);
    if (!d) return { error: "event_date invalide (formats : YYYY-MM-DD, YYYY/MM/DD ou ISO)" };
    data.event_date = d;
  }

  if (b.event_status !== undefined) {
    if (!isEventStatus(b.event_status)) {
      return { error: `event_status doit valoir : ${EVENT_STATUSES.join(", ")}` };
    }
    data.event_status = b.event_status;
  }

  if (b.event_tickets_limit_by_user_by_type !== undefined) {
    const n = b.event_tickets_limit_by_user_by_type;
    if (typeof n !== "number" || !Number.isInteger(n) || n < 1 || n > 100) {
      return { error: "event_tickets_limit_by_user_by_type doit être un entier entre 1 et 100" };
    }
    data.event_tickets_limit_by_user_by_type = n;
  }

  if (mode === "create") {
    for (const key of ["event_name", "event_place", "event_date", "event_category"] as const) {
      if (!data[key]) return { error: `${key} est requis` };
    }
  } else if (Object.keys(data).length === 0) {
    return { error: "Aucun champ valide à modifier" };
  }

  return { data };
}

/** Prochain ID au format de votre API : E00001, E00002... */
export async function nextEventId(db: {
  event: { findFirst: (args: object) => Promise<{ event_id: string } | null> };
}): Promise<string> {
  const last = await db.event.findFirst({
    where: { event_id: { startsWith: "E" } },
    orderBy: { event_id: "desc" },
    select: { event_id: true },
  });
  const n = last ? parseInt(last.event_id.slice(1), 10) : 0;
  return `E${String((Number.isNaN(n) ? 0 : n) + 1).padStart(5, "0")}`;
}
