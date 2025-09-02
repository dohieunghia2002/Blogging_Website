import NextAuth, { DefaultSession, DefaultUser } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      fullname: string
      penName: string
      email: string
      avatar?: string
    } & DefaultSession["user"]
    accessToken: string
  }

  interface User extends DefaultUser {
    id: string
    fullname: string
    penName: string
    email: string
    avatar?: string
    accessToken: string
    refreshToken: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    fullname: string
    penName: string
    email: string
    avatar?: string
    accessToken: string
    refreshToken: string
  }
}
