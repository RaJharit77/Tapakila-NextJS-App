// app/api/auth/signup/route.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        const { name, email, password } = await req.json();

        // Validation des données
        if (!name || !email || !password) {
            return NextResponse.json(
                { message: "Tous les champs sont requis." },
                { status: 400 }
            );
        }

        // Vérifier si l'utilisateur existe déjà
        const existingUser = await prisma.user.findUnique({
            where: { user_email: email },
        });

        if (existingUser) {
            return NextResponse.json(
                { message: "Un utilisateur avec cet email existe déjà." },
                { status: 409 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await prisma.user.create({
            data: {
                user_id: crypto.randomUUID(),
                user_name: name,
                user_email: email,
                user_password: hashedPassword,
                user_first_login_date: new Date(),
            },
        });

        

        const { user_password, ...userWithoutPassword } = user;

        return NextResponse.json(
            { user: userWithoutPassword, message: "Inscription réussie." },
            { status: 201 }
        );
    } catch (error) {
        console.error("Erreur d'inscription:", error);
        return NextResponse.json(
            { message: "Une erreur est survenue lors de l'inscription." },
            { status: 500 }
        );
    }
}
