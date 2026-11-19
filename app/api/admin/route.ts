import { prisma } from "@/lib/prisma";
import { sign, verify } from "jsonwebtoken";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

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
      console.log(`❌ Admin introuvable pour : ${email}`);
      return NextResponse.json({ error: "Email ou mot de passe incorrect" }, { status: 401 });
    }

    if (!user.admin_password.startsWith("$2")) {
      console.error("❌ Le mot de passe en base n'est pas un hash bcrypt valide.");
      return NextResponse.json({ error: "Configuration de sécurité invalide" }, { status: 500 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.admin_password);

    if (!isPasswordValid) {
      console.log(`❌ Mot de passe incorrect pour : ${email}`);
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
  try {
    const token = request.headers.get("Authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    try {
      const decoded = verify(token, process.env.JWT_SECRET!);
      return NextResponse.json({ authenticated: true, user: decoded }, { status: 200 });
    } catch {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}