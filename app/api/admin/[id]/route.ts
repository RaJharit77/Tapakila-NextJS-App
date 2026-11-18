import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { verify } from "jsonwebtoken";
import { AdminRole } from "@/generated/prisma";

const checkAuth = (request: NextRequest) => {
    const token = request.headers.get("Authorization")?.split(" ")[1];
    if (!token) return false;
    try {
        verify(token, process.env.JWT_SECRET!);
        return true;
    } catch {
        return false;
    }
};

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, context: RouteContext) {
    if (!checkAuth(request)) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    try {
        const { id } = await context.params;

        const admin = await prisma.admin.findUnique({
            where: { admin_id: id },
            select: { admin_id: true, admin_name: true, admin_mail: true, admin_role: true },
        });

        if (!admin) return NextResponse.json({ error: "Admin introuvable" }, { status: 404 });
        return NextResponse.json(admin);
    } catch (error) {
        console.error("Erreur GET admin:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

export async function PUT(request: NextRequest, context: RouteContext) {
    if (!checkAuth(request)) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    try {
        const { id } = await context.params;
        const body = await request.json();
        const { admin_name, admin_mail, admin_password, admin_role } = body;

        const updateData: {
            admin_name?: string;
            admin_mail?: string;
            admin_role?: AdminRole;
            admin_password?: string;
        } = {
            admin_name,
            admin_mail: admin_mail?.trim().toLowerCase(),
            admin_role,
        };

        if (admin_password && admin_password.trim() !== "") {
            updateData.admin_password = await bcrypt.hash(admin_password, 12);
        }

        const updated = await prisma.admin.update({
            where: { admin_id: id },
            data: updateData,
        });

        return NextResponse.json({
            id: updated.admin_id,
            admin_id: updated.admin_id,
            admin_name: updated.admin_name,
            admin_mail: updated.admin_mail,
            admin_role: updated.admin_role,
        });
    } catch (error) {
        console.error("Erreur PUT admin:", error);
        return NextResponse.json({ error: "Erreur lors de la modification" }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
    if (!checkAuth(request)) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    try {
        const { id } = await context.params;

        await prisma.admin.delete({ where: { admin_id: id } });
        return NextResponse.json({ id });
    } catch (error) {
        console.error("Erreur DELETE admin:", error);
        return NextResponse.json({ error: "Erreur lors de la suppression" }, { status: 500 });
    }
}