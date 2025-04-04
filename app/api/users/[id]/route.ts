import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        
        if (!id || typeof id !== 'string') {
            return new NextResponse(
                JSON.stringify({ error: "Invalid user ID" }),
                { status: 400 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { user_id: id },
            include: {
                tickets: true,
                messages: true
            }
        });

        if (!user) {
            return new NextResponse(
                JSON.stringify({ error: "User not found" }),
                { status: 404 }
            );
        }

        return new NextResponse(JSON.stringify(user), { 
            status: 200, 
            headers: { 'Content-Type': 'application/json' } 
        });
    } catch (error) {
        console.error("Error finding the user:", error);
        return new NextResponse(
            JSON.stringify({ 
                error: "Internal server error",
                details: error instanceof Error ? error.message : String(error)
            }),
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const body = await request.json();

        if (!id || typeof id !== 'string') {
            return new NextResponse(
                JSON.stringify({ error: "Invalid user ID" }),
                { status: 400 }
            );
        }

        const userExists = await prisma.user.findUnique({
            where: { user_id: id }
        });

        if (!userExists) {
            return new NextResponse(
                JSON.stringify({ error: "User not found" }),
                { status: 404 }
            );
        }

        const { user_name, user_address, user_city } = body;
        const updateData: Record<string, any> = {};

        if (user_name) updateData.user_name = user_name;
        if (user_address !== undefined) updateData.user_address = user_address || null; 
        if (user_city !== undefined) updateData.user_city = user_city || null;

        if (Object.keys(updateData).length === 0) {
            return new NextResponse(
                JSON.stringify({ error: "No valid fields to update" }),
                { status: 400 }
            );
        }

        const updatedUser = await prisma.user.update({
            where: { user_id: id },
            data: updateData
        });

        return new NextResponse(JSON.stringify(updatedUser), { 
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error("Error updating user:", error);
        return new NextResponse(
            JSON.stringify({ 
                error: "Internal server error",
                details: error instanceof Error ? error.message : String(error)
            }),
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}


// ============ ADMIN============ : only admin can delete user or the user itself
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {

        const { id } = await params
        const userToDelete = await prisma.user.findUnique({
            where: {
                user_id: id
            }
        })

        if (userToDelete == null) {
            return new NextResponse(JSON.stringify({ error: "User not found" }), { status: 404 })
        }
        else {
            const userDeleted = await prisma.user.delete({
                where: {
                    user_id: userToDelete.user_id
                }
            })

            return new NextResponse(JSON.stringify(userDeleted), { status: 200 })
        }
    } catch (e) {
        console.error("Error while deleting the user", e)
        return new NextResponse(JSON.stringify({ error: "Repository error" }),
            { status: 500 }
        )


    } finally {
        await prisma.$disconnect()
    }
}