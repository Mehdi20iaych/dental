"use client"

import type React from "react"

import { useEffect, useMemo, useState } from "react"
import { z } from "zod"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { createAppointment, getPatients, updateAppointment } from "@/lib/storage"
import type { Appointment } from "@/lib/types"

const Schema = z.object({
  patientId: z.string().min(1, "Patient requis"),
  service: z.string().min(1, "Service requis"),
  date: z.string().min(1, "Date requise"),
  time: z
    .string()
    .min(1, "Heure requise")
    .refine((t) => /^\d{2}:\d{2}$/.test(t) && ["00", "30"].includes(t.split(":")[1]), {
      message: "Heure sur :00 ou :30",
    }),
  status: z.enum(["Pending", "Confirmed", "Completed", "Canceled"]),
  notes: z.string().optional(),
})

const services = [
  "Détartrage et contrôle",
  "Plombage",
  "Consultation orthodontie",
  "Traitement canalaire",
  "Blanchiment",
  "Esthétique dentaire",
]

export function AppointmentForm({
  trigger,
  appointment,
  onSaved,
  defaultDateTime,
  defaultPatientId,
}: {
  trigger: React.ReactNode
  appointment?: Appointment
  onSaved?: () => void
  defaultDateTime?: string
  defaultPatientId?: string
}) {
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const patients = getPatients()
  const initial = useMemo(() => {
    if (appointment) {
      const dt = new Date(appointment.dateTime)
      const yyyy = dt.toISOString().slice(0, 10)
      const hh = dt.toTimeString().slice(0, 5)
      return {
        patientId: appointment.patientId,
        service: appointment.service,
        date: yyyy,
        time: hh,
        status: appointment.status as "Pending" | "Confirmed" | "Completed" | "Canceled",
        notes: appointment.notes || "",
      }
    }
    return {
      patientId: defaultPatientId || patients[0]?.id || "",
      service: "",
      date: defaultDateTime ? new Date(defaultDateTime).toISOString().slice(0, 10) : "",
      time: defaultDateTime ? new Date(defaultDateTime).toTimeString().slice(0, 5) : "",
      status: "Pending" as const,
      notes: "",
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appointment, open, defaultDateTime, defaultPatientId])

  const [data, setData] = useState(initial)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    setData(initial)
  }, [initial])

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const parsed = Schema.safeParse(data)
    if (!parsed.success) {
      const errs: Record<string, string> = {}
      parsed.error.issues.forEach((i) => (errs[i.path[0] as string] = i.message))
      setErrors(errs)
      return
    }
    setErrors({})
    setLoading(true)
    setTimeout(() => {
      try {
        const iso = new Date(`${data.date}T${data.time}:00`).toISOString()
        if (appointment) {
          updateAppointment(appointment.id, {
            patientId: data.patientId,
            service: data.service,
            dateTime: iso,
            status: data.status,
            notes: data.notes,
          })
          toast({ title: "Rendez-vous mis à jour" })
        } else {
          createAppointment({
            patientId: data.patientId,
            service: data.service,
            dateTime: iso,
            status: data.status,
            notes: data.notes,
          })
          toast({ title: "Rendez-vous créé" })
        }
        setLoading(false)
        setOpen(false)
        onSaved?.()
      } catch (err) {
        setLoading(false)
        const msg =
          err instanceof Error && err.message === "SLOT_TAKEN"
            ? "Ce créneau est déjà réservé."
            : "Impossible d&apos;enregistrer."
        toast({ title: "Échec de l&apos;enregistrement", description: msg, variant: "destructive" })
      }
    }, 300)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{appointment ? "Modifier le rendez-vous" : "Nouveau rendez-vous"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="a-patient">Patient</Label>
            <Select value={data.patientId} onValueChange={(v) => setData((s) => ({ ...s, patientId: v }))}>
              <SelectTrigger id="a-patient">
                <SelectValue placeholder="Sélectionner un patient" />
              </SelectTrigger>
              <SelectContent>
                {patients.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name} ({p.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.patientId ? <p className="text-xs text-rose-600">{errors.patientId}</p> : null}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="a-service">Service</Label>
            <Select value={data.service} onValueChange={(v) => setData((s) => ({ ...s, service: v }))}>
              <SelectTrigger id="a-service">
                <SelectValue placeholder="Choisir un service" />
              </SelectTrigger>
              <SelectContent>
                {services.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.service ? <p className="text-xs text-rose-600">{errors.service}</p> : null}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="a-date">Date</Label>
              <Input
                id="a-date"
                type="date"
                value={data.date}
                onChange={(e) => setData((s) => ({ ...s, date: e.target.value }))}
              />
              {errors.date ? <p className="text-xs text-rose-600">{errors.date}</p> : null}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="a-time">Heure</Label>
              <Input
                id="a-time"
                type="time"
                step={1800}
                value={data.time}
                onChange={(e) => setData((s) => ({ ...s, time: e.target.value }))}
              />
              {errors.time ? <p className="text-xs text-rose-600">{errors.time}</p> : null}
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="a-status">Statut</Label>
            <Select value={data.status} onValueChange={(v) => setData((s) => ({ ...s, status: v as any }))}>
              <SelectTrigger id="a-status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pending">En attente</SelectItem>
                <SelectItem value="Confirmed">Confirmé</SelectItem>
                <SelectItem value="Completed">Terminé</SelectItem>
                <SelectItem value="Canceled">Annulé</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="a-notes">Notes</Label>
            <Textarea
              id="a-notes"
              rows={3}
              value={data.notes}
              onChange={(e) => setData((s) => ({ ...s, notes: e.target.value }))}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
