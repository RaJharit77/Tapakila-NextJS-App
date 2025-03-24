import { prisma } from "@/lib/prisma";
import {sign, verify} from "jsonwebtoken";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const user = await prisma.admin.findUnique({
      where: {
        admin_mail: email
      },
    });

    if (!user) {
      return Response.json(
        { error: 'user not found' },
        { status: 404 }
      );
    }

    if (password !== user.admin_password) {
      return Response.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }

    // const accessToken = crypto.randomUUID().split('-').join('');
    const accessToken = sign(
      { email: user.admin_mail, password: user.admin_password },
      process.env.JWT_SECRET!,
    );

    // Renvoyer une réponse réussie
    return Response.json(
      { accessToken, redirectTo: '/' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erreur lors de la connexion :', error);
    return Response.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const token = request.headers.get("Authorization")?.split(" ")[1];
    if (!token) {
      return Response.json(
        { authenticated: false, message: "Aucune token reçu" },
        { status: 401 }
      );
    }

    try {
      const decoded = verify(token, process.env.JWT_SECRET!);
      return Response.json(
        { authenticated: true, user: decoded },
        { status: 200 }
      );
    } catch (error) {
      return Response.json(
        { authenticated: false, message: "Token Invalide" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Erreur lors de la vérification de l'authentification :", error);
    return Response.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}