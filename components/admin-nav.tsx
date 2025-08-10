"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutGrid, CalendarDays, Users } from "lucide-react"
import { cn } from "@/lib/utils"

export function AdminNav({ compact = false }: { compact?: boolean }) {
  const pathname = usePathname()
  const items = [
    { href: "/admin", label: "Tableau de bord", icon: LayoutGrid },
    { href: "/admin/schedule", label: "Calendrier", icon: CalendarDays },
    { href: "/admin/appointments", label: "Rendez-vous", icon: CalendarDays },
    { href: "/admin/patients", label: "Patients", icon: Users },
  ]
  const Nav = (
    <nav className={cn("grid gap-2 p-4", compact && "p-0")}>
      {items.map((i) => {
        const active = pathname === i.href
        const Icon = i.icon
        return (
          <Link
            key={i.href}
            href={i.href}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-muted",
              active ? "bg-muted font-medium" : "text-muted-foreground",
            )}
          >
            <Icon className="h-4 w-4" />
            {i.label}
          </Link>
        )
      })}
    </nav>
  )
  if (compact) return Nav
  return (
    <div className="h-full">
      <div className="h-14 border-b flex items-center px-4 font-semibold">Administration</div>
      {Nav}
    </div>
  )
}
