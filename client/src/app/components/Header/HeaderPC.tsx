"use client"

import React from "react"
import { useSession, signIn, signOut } from "next-auth/react"
import logo from "@/app/assets/logo.png"
import Link from "next/link"

export default function HeaderPC() {
  const { data: session, status } = useSession()

  return (
    <header className="w-full bg-blue-600 text-white shadow-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img src={logo.src} alt="logo" className="h-10 w-auto" />
          <span className="text-xl font-bold">MyBlog</span>
        </div>

        {/* Nav */}
        <nav className="flex items-center gap-6">
          <Link href="/">Home</Link>
          <Link href="/about">About</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/contact">Contact</Link>
        </nav>

        {/* Auth state */}
        <div className="flex items-center gap-4">
          {status === "loading" && <span>Loading...</span>}

          {status === "unauthenticated" && (
            <>
              <button
                onClick={() => signIn()}
                className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-gray-100"
              >
                Sign In
              </button>
            </>
          )}

          {status === "authenticated" && (
            <>
              <span className="hidden sm:inline">
                Hello, {session.user?.penName ?? session.user?.fullname}
              </span>
              <button
                onClick={() => signOut()}
                className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold hover:bg-red-600"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
