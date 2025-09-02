import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_API}/auth/login`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            email: credentials?.email,
                            password: credentials?.password,
                        }),
                    })

                    const result = await res.json()
                    if (!res.ok) return null

                    return {
                        id: result.data.id,              // lưu ý: không phải result.data.user.id, vì backend của bạn trả { id, fullname, ... }
                        fullname: result.data.fullname,
                        penName: result.data.penName,
                        email: result.data.email,
                        avatar: result.data.avatar,
                        accessToken: result.data.accessToken,
                        refreshToken: result.data.refreshToken, // 👈 thêm refreshToken để đúng type User
                    }
                } catch (error) {
                    console.error("Authorize error", error)
                    return null
                }
            }

        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.accessToken = (user as any).accessToken
                token.fullname = (user as any).fullname
                token.penName = (user as any).penName
            }
            return token
        },
        async session({ session, token }) {
            session.user = {
                ...session.user,
                id: token.id,
                fullname: token.fullname,
                penName: token.penName,
                email: token.email,
                avatar: token.avatar,
            }
            session.accessToken = token.accessToken
            return session
        }

    },
    pages: {
        signIn: "/login", // custom login page
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
