import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
        return NextResponse.json({ message: "Tous les champs sont requis." }, { status: 400 });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 12);

        await prisma.user.create({
            data: {
                user_id: crypto.randomUUID(),
                user_name: name,
                user_email: email,
                user_password: hashedPassword,
            },
        });

        return NextResponse.json({ message: "Inscription réussie." });
    } catch {
        return NextResponse.json({ message: "Erreur lors de l'inscription." }, { status: 500 });
    }
}
