"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { AdminNav } from "@/components/admin-nav"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [authed, setAuthed] = useState<boolean | null>(null)

  useEffect(() => {
    const isAuthed = typeof window !== "undefined" && localStorage.getItem("dc_admin_authed") === "true"
    setAuthed(isAuthed)
    if (!isAuthed && pathname !== "/admin/login") {
      router.replace("/admin/login")
    }
  }, [pathname, router])

  if (pathname === "/admin/login") {
    return <>{children}</>
  }

  if (authed === null) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-muted-foreground">
        Vérification de l&apos;accès...
      </div>
    )
  }

  if (!authed) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Connectez-vous pour accéder au panneau d&apos;administration.</p>
        <Button asChild>
          <Link href="/admin/login">Aller à la connexion</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-[260px_1fr]">
      <aside className="hidden lg:block border-r">
        <AdminNav />
      </aside>
      <div className="flex flex-col min-h-screen">
        <header className="h-14 border-b flex items-center px-4 justify-between">
          <div className="lg:hidden">
            <AdminNav compact />
          </div>
          <div className="text-sm text-muted-foreground">Administration Clinique</div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                localStorage.removeItem("dc_admin_authed")
                localStorage.removeItem("dc_admin_user")
                window.location.href = "/admin/login"
              }}
            >
              Se déconnecter
            </Button>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
