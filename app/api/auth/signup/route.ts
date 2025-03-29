import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

interface SignupRequest {
    name: string;
    email: string;
    password: string;
}

export async function POST(req: Request) {
    try {
        const { name, email, password }: SignupRequest = await req.json();

        if (!name || !email || !password) {
            return NextResponse.json(
                { message: "Tous les champs sont requis." },
                { status: 400 }
            );
        }

        const existingUser = await prisma.user.findUnique({
            where: { user_email: email },
            select: { user_id: true }
        });

        if (existingUser) {
            return NextResponse.json(
                { message: "Un utilisateur avec cet email existe déjà." },
                { status: 409 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const userId = crypto.randomUUID();

        const user = await prisma.user.create({
            data: {
                user_id: userId,
                user_name: name,
                user_email: email,
                user_password: hashedPassword,
                user_first_login_date: new Date(),
            },
            select: {
                user_id: true,
                user_name: true,
                user_email: true,
                user_first_login_date: true,
            },
        });

        return NextResponse.json(
            {
                user,
                message: "Inscription réussie."
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Erreur d'inscription:", error);
        return NextResponse.json(
            { message: "Une erreur est survenue lors de l'inscription." },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}