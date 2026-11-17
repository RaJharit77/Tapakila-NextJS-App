// lib/admin-auth.ts
import { prisma } from "@/lib/prisma";
import { verify, type JwtPayload } from "jsonwebtoken";
import { NextResponse } from "next/server";
import type { AdminRole } from "@/generated/prisma";

export interface AuthenticatedAdmin {
  admin_id: string;
  admin_name: string;
  admin_mail: string;
  admin_role: AdminRole;
}

type AuthResult =
  | { admin: AuthenticatedAdmin; error?: undefined }
  | { admin?: undefined; error: NextResponse };

const fail = (message: string, status: number) => ({
  error: NextResponse.json({ error: message }, { status }),
});

/**
 * Vérifie le header `Authorization: Bearer <jwt>` (même token que votre route de login admin),
 * recharge l'admin depuis la base (le rôle est donc toujours à jour) et contrôle le rôle.
 */
export async function requireAdmin(
  request: Request,
  options: { superOnly?: boolean } = {}
): Promise<AuthResult> {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error("JWT_SECRET n'est pas défini");
    return fail("Configuration serveur invalide", 500);
  }

  const [scheme, token] = request.headers.get("Authorization")?.split(" ") ?? [];
  if (scheme !== "Bearer" || !token) return fail("Authentification requise", 401);

  let email: string | undefined;
  try {
    const decoded = verify(token, secret);
    email = typeof decoded === "object" ? (decoded as JwtPayload).email : undefined;
  } catch {
    return fail("Token invalide ou expiré", 401);
  }
  if (!email) return fail("Token invalide", 401);

  const admin = await prisma.admin.findUnique({
    where: { admin_mail: email },
    select: { admin_id: true, admin_name: true, admin_mail: true, admin_role: true },
  });
  if (!admin) return fail("Admin introuvable", 401);

  if (options.superOnly && admin.admin_role !== "SUPER_ADMIN") {
    return fail("Accès réservé au super admin", 403);
  }
  return { admin };
}
