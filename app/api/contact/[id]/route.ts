import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params
        const message = await prisma.message.findUnique({
            where: {
                message_id: id
            },
            include: {
                user: true
            }
        })

        if (message == null) {
            return new NextResponse(JSON.stringify({ error: "Message not found" }), { status: 404 })
        }
        return new NextResponse(JSON.stringify(message), { status: 200, headers: { 'Content-Type': 'application/json' } })
    }
    catch (e) {
        console.error("Error finding the message ", e)
        return new NextResponse(JSON.stringify({ error: "Repository erro" }),
            { status: 500 }
        )
    } finally {
        await prisma.$disconnect()
    }
}
