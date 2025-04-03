import { prisma } from '@/lib/prisma';
import { randomUUID } from 'crypto';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const data = await request.json();

        const { user_id, subject, message } = data;

        if (!subject || !message) {
            return NextResponse.json(
                { error: 'Subject and message are required.' },
                { status: 400 }
            );
        }

        const userExists = await prisma.user.findUnique({
            where: { user_id }
        });

        if (!userExists) {
            return NextResponse.json(
                { error: 'User not found.' },
                { status: 404 }
            );
        }

        const messageId = "MSG" + randomUUID().replace(/-/g, '').substring(0, 12);

        const newMessage = await prisma.message.create({
            data: {
                message_id: messageId,
                message_subject: subject,
                message_content: message,
                message_date: new Date(),
                user_id: user_id
            },
            include: {
                user: {
                    select: {
                        user_name: true,
                        user_email: true
                    }
                }
            }
        });

        return NextResponse.json({
            message: "Message sent successfully",
            data: newMessage
        }, { status: 201 });

    } catch (error) {
        console.error('Error while sending message:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const page = parseInt(url.searchParams.get('page') || '1', 10);
        const pageSize = parseInt(url.searchParams.get('pageSize') || '10', 10);


        const messages = await prisma.message.findMany({
            take: pageSize,
            skip: (page - 1) * pageSize,

            include: {
                user: true
            }
        });

        return NextResponse.json(messages, { status: 200 });
    } catch (error) {
        console.error('Error while fetching the messages:', error);
        return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 });
    } finally {
        await prisma.$disconnect()
    }

}
