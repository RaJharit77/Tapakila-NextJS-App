// app/api/admins/route.ts
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { isUniqueViolation } from "@/lib/events";
import { AdminRole } from "@/generated/prisma";
import bcrypt from "bcrypt";
import { randomUUID } from "crypto";
import { NextResponse } from "next/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** POST /api/admins : création d'un admin (super admin uniquement) */
export async function POST(request: Request) {
  try {
    const auth = await requireAdmin(request, { superOnly: true });
    if (auth.error) return auth.error;

    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Body JSON invalide" }, { status: 400 });
    }

    const { admin_name, admin_mail, admin_password, admin_role } = body;

    if (typeof admin_name !== "string" || !admin_name.trim()) {
      return NextResponse.json({ error: "admin_name est requis" }, { status: 400 });
    }
    if (typeof admin_mail !== "string" || !EMAIL_RE.test(admin_mail.trim())) {
      return NextResponse.json({ error: "admin_mail invalide" }, { status: 400 });
    }
    if (typeof admin_password !== "string" || admin_password.length < 8) {
      return NextResponse.json(
        { error: "admin_password doit contenir au moins 8 caractères" },
        { status: 400 }
      );
    }
    if (admin_role !== undefined && !Object.values(AdminRole).includes(admin_role as AdminRole)) {
      return NextResponse.json(
        { error: `admin_role doit valoir : ${Object.values(AdminRole).join(", ")}` },
        { status: 400 }
      );
    }

    const email = admin_mail.trim().toLowerCase();
    const existing = await prisma.admin.findUnique({
      where: { admin_mail: email },
      select: { admin_id: true },
    });
    if (existing) {
      return NextResponse.json({ error: "Un admin avec cet email existe déjà" }, { status: 409 });
    }

    const created = await prisma.admin.create({
      data: {
        admin_id: "ADM" + randomUUID().split("-")[0],
        admin_name: admin_name.trim(),
        admin_mail: email,
        admin_password: await bcrypt.hash(admin_password, 12),
        admin_role: (admin_role as AdminRole | undefined) ?? AdminRole.ADMIN,
      },
      // le mot de passe n'est jamais renvoyé
      select: { admin_id: true, admin_name: true, admin_mail: true, admin_role: true },
    });

    return NextResponse.json({ admin: created, message: "Admin créé." }, { status: 201 });
  } catch (error) {
    if (isUniqueViolation(error)) {
      return NextResponse.json({ error: "Un admin avec cet email existe déjà" }, { status: 409 });
    }
    console.error("Erreur lors de la création de l'admin:", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}

/** GET /api/admins : liste des admins (super admin uniquement) */
export async function GET(request: Request) {
  try {
    const auth = await requireAdmin(request, { superOnly: true });
    if (auth.error) return auth.error;

    const admins = await prisma.admin.findMany({
      select: {
        admin_id: true,
        admin_name: true,
        admin_mail: true,
        admin_role: true,
        _count: { select: { event: true } },
      },
      orderBy: { admin_id: "asc" },
    });
    return NextResponse.json(admins, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération des admins:", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}
