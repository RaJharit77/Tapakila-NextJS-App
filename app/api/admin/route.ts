import { prisma } from "@/lib/prisma";
import { sign, verify } from "jsonwebtoken";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (body.isAdminCreate) {
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
    }

    const { email, password } = body;
    if (!email || !password) {
      return NextResponse.json({ error: "Email et mot de passe requis" }, { status: 400 });
    }

    if (!process.env.JWT_SECRET) {
      return NextResponse.json({ error: "Configuration serveur invalide" }, { status: 500 });
    }

    const user = await prisma.admin.findFirst({
      where: {
        admin_mail: {
          equals: email.trim().toLowerCase(),
          mode: "insensitive",
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Email ou mot de passe incorrect" }, { status: 401 });
    }

    if (!user.admin_password.startsWith("$2")) {
      return NextResponse.json({ error: "Configuration de sécurité invalide" }, { status: 500 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.admin_password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Email ou mot de passe incorrect" }, { status: 401 });
    }

    const accessToken = sign(
      { email: user.admin_mail, role: user.admin_role, id: user.admin_id },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    return NextResponse.json({ accessToken, redirectTo: "/" }, { status: 200 });
  } catch (error) {
    console.error("Erreur serveur POST admin:", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const token = request.headers.get("Authorization")?.split(" ")[1];
  if (token) {
    try {
      const decoded = verify(token, process.env.JWT_SECRET!);
      if (request.headers.get("Accept") === "application/json" && !request.url.includes("auth")) {
        const admins = await prisma.admin.findMany({
          select: { admin_id: true, admin_name: true, admin_mail: true, admin_role: true },
        });
        return NextResponse.json(admins);
      }
      return NextResponse.json({ authenticated: true, user: decoded }, { status: 200 });
    } catch {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }
  }

  return NextResponse.json({ authenticated: false }, { status: 401 });
}