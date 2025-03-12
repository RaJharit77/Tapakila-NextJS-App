import { auth } from "@/app/api/auth/[...nextauth]/route"; // Importe la fonction `auth` depuis ton fichier de configuration
import { NextResponse } from "next/server";

export default auth((req) => {
    const {pathname} = new URL(req.url);

    const publicRoutes = [
        "/login",
        "/signup",
    ]

    if(req.auth && publicRoutes.includes(pathname)){
        return  NextResponse.redirect(new URL("/", req.url).toString(), 302);
    }

    if(!req.auth && !publicRoutes.includes(pathname)){
        return  NextResponse.redirect(new URL("/login", req.url).toString(), 302);
    }

    return NextResponse.next()
});

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico|login|signup|about).*)"]};