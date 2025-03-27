import { prisma } from '@/lib/prisma';
import { randomUUID } from 'crypto';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const data = await request.json();

        const { user_id, subject, message } = data;

        if (!subject || !message) {
            return NextResponse.json(
                { error: 'Tous les champs sont requis.' },
                { status: 400 }
            );
        }

        const idMessage = "M" + randomUUID().replace(/-/g, '');

        const content = await prisma.message.create({
            data: {
                message_id: idMessage,
                message_date: new Date(),
                message_content: message,
                message_subject: subject,
                user_id: user_id,
            },
        })

        return NextResponse.json(content, { status: 201 });

    } catch (error) {
        console.error('Error while sending the review:', error);
        return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 });
    } finally {
        await prisma.$disconnect()
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
