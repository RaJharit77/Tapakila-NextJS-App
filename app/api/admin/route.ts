import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { verify } from "jsonwebtoken";

const checkAuth = (request: Request) => {
  const token = request.headers.get("Authorization")?.split(" ")[1];
  if (!token) return false;
  try {
    verify(token, process.env.JWT_SECRET!);
    return true;
  } catch {
    return false;
  }
};

export async function GET(request: Request) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const admins = await prisma.admin.findMany({
      select: {
        admin_id: true,
        admin_name: true,
        admin_mail: true,
        admin_role: true,
      },
    });
    return NextResponse.json(admins);
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { admin_name, admin_mail, admin_password, admin_role } = body;

    if (!admin_name || !admin_mail || !admin_password) {
      return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
    }

    const normalizedEmail = admin_mail.trim().toLowerCase();
    const existing = await prisma.admin.findUnique({
      where: { admin_mail: normalizedEmail },
    });

    if (existing) {
      return NextResponse.json({ error: "Cet email existe déjà" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(admin_password, 12);

    const newAdmin = await prisma.admin.create({
      data: {
        admin_id: "ADM-" + Math.random().toString(36).substring(2, 8).toUpperCase(),
        admin_name,
        admin_mail: normalizedEmail,
        admin_password: hashedPassword,
        admin_role: admin_role || "ADMIN",
      },
    });

    return NextResponse.json({
      id: newAdmin.admin_id,
      admin_id: newAdmin.admin_id,
      admin_name: newAdmin.admin_name,
      admin_mail: newAdmin.admin_mail,
      admin_role: newAdmin.admin_role,
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}