"use client"

import { useMemo, useState, useEffect } from "react"
import { addDays, formatISO } from "./utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { getAppointments, getPatients, deleteAppointment } from "@/lib/storage"
import { AppointmentForm } from "@/components/appointment-form"
import type { Appointment } from "@/lib/types"
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react"
import { formatTime24 } from "@/lib/format"

type Segment = { start: string; end: string }
const defaultSegments: Segment[] = [
  { start: "08:30", end: "12:00" },
  { start: "13:30", end: "17:30" },
  { start: "18:30", end: "21:30" },
]
const DEFAULT_INTERVAL_MIN = 30

function toISO(date: string, time: string) {
  return new Date(`${date}T${time}:00`).toISOString()
}

function parseYMD(s: string) {
  const [y, m, d] = s.split("-").map(Number)
  return { y, m, d }
}

function isInSlot(apptISO: string, slotStart: Date, intervalMin: number) {
  const t = new Date(apptISO).getTime()
  const start = slotStart.getTime()
  const end = start + intervalMin * 60_000
  return t >= start && t < end
}

function* iterateSlots(date: string, segments: Segment[], intervalMin: number) {
  for (const seg of segments) {
    let cur = new Date(`${date}T${seg.start}:00`)
    const end = new Date(`${date}T${seg.end}:00`)
    while (cur < end) {
      yield {
        time: cur.toTimeString().slice(0, 5),
        start: new Date(cur),
        iso: cur.toISOString(),
      }
      cur = new Date(cur.getTime() + intervalMin * 60_000)
    }
  }
}

export default function SchedulePage() {
  const today = new Date()
  const [date, setDate] = useState<string>(today.toISOString().slice(0, 10))
  const [intervalMin] = useState<number>(DEFAULT_INTERVAL_MIN)
  const [refreshKey, setRefreshKey] = useState(0)

  const patients = getPatients()
  const appointments = getAppointments()

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "dc_appointments") setRefreshKey((k) => k + 1)
    }
    window.addEventListener("storage", onStorage)
    return () => window.removeEventListener("storage", onStorage)
  }, [])

  const apptsByDay = useMemo(() => {
    const { y, m, d } = parseYMD(date)
    return appointments.filter((a) => {
      const t = new Date(a.dateTime)
      return t.getFullYear() === y && t.getMonth() + 1 === m && t.getDate() === d
    })
  }, [appointments, date, refreshKey])

  const slots = useMemo(() => {
    return Array.from(iterateSlots(date, defaultSegments, intervalMin))
  }, [date, intervalMin])

  const rows = useMemo(() => {
    return slots.map((slot) => {
      const booking = apptsByDay.find((a) => isInSlot(a.dateTime, slot.start, intervalMin))
      const patient = booking ? patients.find((p) => p.id === booking.patientId) : undefined
      return { slot, booking, patient }
    })
  }, [slots, apptsByDay, patients, intervalMin])

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-2xl font-semibold flex items-center gap-2">
          <CalendarDays className="h-6 w-6 text-emerald-700" />
          Calendrier
        </h1>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            aria-label="Jour précédent"
            onClick={() => setDate((d) => addDays(d, -1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-[160px]"
            aria-label="Choisir une date"
          />
          <Button variant="outline" size="icon" aria-label="Jour suivant" onClick={() => setDate((d) => addDays(d, 1))}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Grille quotidienne</CardTitle>
            <div className="flex items-center gap-2 text-xs">
              <span className="inline-flex items-center gap-1">
                <span className="inline-block h-3 w-3 rounded bg-emerald-100 ring-1 ring-emerald-300" /> libre
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="inline-block h-3 w-3 rounded bg-amber-100 ring-1 ring-amber-300" /> réservé
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[90px]">Heure</TableHead>
                  <TableHead className="w-[120px]">Statut</TableHead>
                  <TableHead>Nom</TableHead>
                  <TableHead className="w-[140px]">Téléphone</TableHead>
                  <TableHead className="w-[220px]">Service</TableHead>
                  <TableHead className="w-[200px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map(({ slot, booking, patient }, idx) => {
                  const isBooked = !!booking
                  return (
                    <TableRow key={`${slot.iso}-${idx}`} className="align-top">
                      <TableCell className="font-medium">{formatTime24(slot.start.toISOString())}</TableCell>
                      <TableCell>
                        {isBooked ? (
                          <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                            réservé
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
                            libre
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>{patient ? patient.name : isBooked ? "Patient inconnu" : "-"}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {patient?.phone || (isBooked ? "-" : "-")}
                      </TableCell>
                      <TableCell className="truncate">{booking?.service || "-"}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-2">
                          {isBooked ? (
                            <>
                              <AppointmentForm
                                appointment={booking as Appointment}
                                trigger={
                                  <Button variant="outline" size="sm">
                                    Modifier
                                  </Button>
                                }
                                onSaved={() => {
                                  setRefreshKey((k) => k + 1)
                                }}
                              />
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => {
                                  if (confirm("Supprimer ce rendez-vous ?")) {
                                    deleteAppointment((booking as Appointment).id)
                                    setRefreshKey((k) => k + 1)
                                    setDate((d) => formatISO(new Date(d)))
                                  }
                                }}
                              >
                                Supprimer
                              </Button>
                            </>
                          ) : (
                            <AppointmentForm
                              trigger={<Button size="sm">Réserver</Button>}
                              defaultDateTime={toISO(date, slot.time)}
                              onSaved={() => setRefreshKey((k) => k + 1)}
                            />
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
                {rows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-sm text-muted-foreground">
                      Aucun créneau pour cette journée.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="text-xs text-muted-foreground mt-3">
            Créneaux de 30 minutes — Matin 08:30–12:00, Après-midi 13:30–17:30, Soir 18:30–21:30.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// util marker (file uses utils.ts in same folder)
export const utils = 0
