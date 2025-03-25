import { prisma } from "@/lib/prisma";
import { randomUUID } from "crypto";

export async function GET(request: Request) {
    try {

        const url = new URL(request.url)
        const page = parseInt(url.searchParams.get("page") || '1', 10)
        const pageSize = parseInt(url.searchParams.get("pageSize") || '10', 10)

        const offset = (page - 1) * pageSize
        const users = await prisma.user.findMany({
            take: pageSize,
            skip: offset,
            include: {
                tickets: true
            }
        });

        return new Response(JSON.stringify(users), { status: 200, headers: { "Content-Type": "application/json" } })
    }

    catch (error) {
        console.error("Error while fetching data", error)
        return new Response(JSON.stringify({ error: "Repository error" }),
            { status: 500 }
        )
    } finally {
        await prisma.$disconnect()
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { user_name, user_email, user_password, ...rest } = body;
        if (!user_name || !user_email || !user_password) {
            return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
        }

        const number = "USR" + randomUUID().split("-")[0]
        const userId = number.toString().padStart(4, "0")

        const newUser = await prisma.user.create({
            data: {
                user_id: userId,
                user_name,
                user_email,
                user_password,
                user_first_login_date: new Date(),
                ...rest
            }
        });
        return new Response(JSON.stringify(newUser), { status: 201 });

    } catch (error) {
        console.error("Error while creating the event", error)
        return new Response(JSON.stringify({ error: "Repository erro" }),
            { status: 500 }
        )
    } finally {
        await prisma.$disconnect()
    }
}