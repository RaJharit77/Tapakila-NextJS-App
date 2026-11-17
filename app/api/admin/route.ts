import { prisma } from "@/lib/prisma";
import { sign, verify } from "jsonwebtoken";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!process.env.JWT_SECRET) {
      return NextResponse.json(
        { error: "Configuration serveur invalide (JWT_SECRET manquant)" },
        { status: 500 }
      );
    }

    const user = await prisma.admin.findUnique({
      where: { admin_mail: email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Adresse email ou mot de passe incorrect' },
        { status: 401 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.admin_password);
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Adresse email ou mot de passe incorrect' },
        { status: 401 }
      );
    }

    const accessToken = sign(
      { email: user.admin_mail, role: user.admin_role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return NextResponse.json(
      { accessToken, redirectTo: '/' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erreur lors de la connexion', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const token = request.headers.get("Authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ authenticated: false, message: "Aucun token reçu" }, { status: 401 });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return NextResponse.json({ error: "Erreur de configuration serveur" }, { status: 500 });
    }

    try {
      const decoded = verify(token, jwtSecret);
      return NextResponse.json({ authenticated: true, user: decoded }, { status: 200 });
    } catch {
      return NextResponse.json({ authenticated: false, message: "Token expiré ou invalide" }, { status: 401 });
    }
  } catch {
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}