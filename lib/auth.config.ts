import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import type {NextAuthConfig} from "next-auth"


const authconfig : NextAuthConfig = {
    providers: [
        GitHub({
            clientId: process.env.AUTH_GITHUB_ID,
            clientSecret: process.env.AUT_GITHUB_SECRET
        }),
    ]
}

export default authconfig;