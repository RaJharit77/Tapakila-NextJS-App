import { auth } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicRoutes = new Set(["/", "/login", "/signup", "/about"]);

export default auth((req: NextRequest & { auth?: any }) => {
    const { pathname } = new URL(req.url);

    if (req.auth && publicRoutes.has(pathname)) {
        return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
});

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico|img).*)"],
};