import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
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

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const body = await request.json();
        const { id } = await params;

        const updatedMessage = await prisma.message.update({
            where: { message_id: id },
            data: {
                message_subject: body.message_subject,
                message_content: body.message_content,
            }
        });

        return new NextResponse(JSON.stringify(updatedMessage), { status: 200 });
    } catch (e) {
        console.error("Error updating message:", e);
        return new NextResponse(
            JSON.stringify({ error: "Repository error" }),
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {

    try {
        const { id } = await params
        const foudMessage = await prisma.message.findUnique({
            where: {
                message_id: id
            }
        })
        if (foudMessage) {
            const deleted = await prisma.message.delete({
                where: {
                    message_id: id
                }
            })

            return new NextResponse(JSON.stringify(deleted), { status: 200 })
        } else {
            return new NextResponse(JSON.stringify({ error: "Message not found" }), { status: 404 })
        }


    } catch (e) {
        console.error("Error finding the message ", e)
        return new NextResponse(JSON.stringify({ error: "Repository erro" }),
            { status: 500 }
        )
    } finally {
        await prisma.$disconnect()
    }
}