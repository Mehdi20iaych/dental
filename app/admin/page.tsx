"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { getAppointments, getPatients } from "@/lib/storage"

export default function AdminDashboardPage() {
  const patients = getPatients()
  const appointments = getAppointments()

  const stats = useMemo(() => {
    const today = new Date()
    const todays = appointments.filter((a) => {
      const d = new Date(a.dateTime)
      return (
        d.getFullYear() === today.getFullYear() && d.getMonth() === today.getMonth() && d.getDate() === today.getDate()
      )
    })
    const pending = appointments.filter((a) => a.status === "Pending")
    const confirmed = appointments.filter((a) => a.status === "Confirmed")
    return {
      totalPatients: patients.length,
      totalAppointments: appointments.length,
      todays: todays.length,
      pending: pending.length,
      confirmed: confirmed.length,
    }
  }, [patients, appointments])

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Tableau de bord</h1>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/admin/appointments">Gérer les rendez-vous</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/admin/patients">Gérer les patients</Link>
          </Button>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Patients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalPatients}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Rendez-vous</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalAppointments}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Aujourd&apos;hui</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.todays}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">En attente / Confirmés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {stats.pending} / {stats.confirmed}
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="text-sm text-muted-foreground">
        Démo: les données sont stockées dans votre navigateur. Pour la production, connectez une base (Neon, Supabase).
      </div>
    </div>
  )
}
