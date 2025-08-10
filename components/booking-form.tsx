"use client"

import type React from "react"

import { useState } from "react"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { findOrCreatePatientByEmail, createAppointment } from "@/lib/storage"

const BookingSchema = z.object({
  name: z.string().min(2, "Le nom est requis"),
  email: z.string().email("Email invalide"),
  phone: z.string().min(7, "Le téléphone est requis"),
  service: z.string().min(1, "Sélectionnez un service"),
  date: z.string().min(1, "La date est requise"),
  time: z
    .string()
    .min(1, "L'heure est requise")
    .refine((t) => /^\d{2}:\d{2}$/.test(t) && ["00", "30"].includes(t.split(":")[1]), {
      message: "Choisissez :00 ou :30",
    }),
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

export function BookingForm() {
  const { toast } = useToast()
  const [submitting, setSubmitting] = useState(false)
  const [data, setData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    date: "",
    time: "",
    notes: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const parsed = BookingSchema.safeParse(data)
    if (!parsed.success) {
      const errs: Record<string, string> = {}
      parsed.error.issues.forEach((i) => (errs[i.path[0] as string] = i.message))
      setErrors(errs)
      return
    }
    setErrors({})
    setSubmitting(true)

    try {
      const patient = findOrCreatePatientByEmail(parsed.data.email, {
        name: parsed.data.name,
        phone: parsed.data.phone,
      })
      const iso = new Date(`${parsed.data.date}T${parsed.data.time}:00`).toISOString()
      createAppointment({
        patientId: patient.id,
        service: parsed.data.service,
        dateTime: iso,
        status: "Pending",
        notes: parsed.data.notes || "",
      })
      setSubmitting(false)
      setData({ name: "", email: "", phone: "", service: "", date: "", time: "", notes: "" })
      toast({
        title: "Demande envoyée",
        description: "Nous vous contacterons pour confirmer votre rendez-vous.",
      })
      const el = document.getElementById("reserver")
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" })
    } catch (err) {
      setSubmitting(false)
      const msg =
        err instanceof Error && err.message === "SLOT_TAKEN"
          ? "Ce créneau est déjà réservé. Choisissez un autre horaire."
          : "Impossible d'envoyer votre demande. Réessayez."
      toast({ title: "Échec de la réservation", description: msg, variant: "destructive" })
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Nom complet</Label>
          <Input
            id="name"
            value={data.name}
            onChange={(e) => setData((s) => ({ ...s, name: e.target.value }))}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
          />
          {errors.name ? (
            <p id="name-error" className="text-xs text-rose-600">
              {errors.name}
            </p>
          ) : null}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={data.email}
            onChange={(e) => setData((s) => ({ ...s, email: e.target.value }))}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          {errors.email ? (
            <p id="email-error" className="text-xs text-rose-600">
              {errors.email}
            </p>
          ) : null}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="phone">Téléphone</Label>
          <Input
            id="phone"
            value={data.phone}
            onChange={(e) => setData((s) => ({ ...s, phone: e.target.value }))}
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? "phone-error" : undefined}
            placeholder="+212 6 ..."
          />
          {errors.phone ? (
            <p id="phone-error" className="text-xs text-rose-600">
              {errors.phone}
            </p>
          ) : null}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="service">Service</Label>
          <Select value={data.service} onValueChange={(v) => setData((s) => ({ ...s, service: v }))}>
            <SelectTrigger id="service" aria-invalid={!!errors.service}>
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
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="date">Date souhaitée</Label>
          <Input
            id="date"
            type="date"
            value={data.date}
            onChange={(e) => setData((s) => ({ ...s, date: e.target.value }))}
            aria-invalid={!!errors.date}
          />
          {errors.date ? <p className="text-xs text-rose-600">{errors.date}</p> : null}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="time">Heure souhaitée</Label>
          <Input
            id="time"
            type="time"
            step={1800}
            value={data.time}
            onChange={(e) => setData((s) => ({ ...s, time: e.target.value }))}
            aria-invalid={!!errors.time}
          />
          {errors.time ? <p className="text-xs text-rose-600">{errors.time}</p> : null}
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="notes">Notes (optionnel)</Label>
        <Textarea
          id="notes"
          rows={3}
          placeholder="Douleurs, préférences, antécédents..."
          value={data.notes}
          onChange={(e) => setData((s) => ({ ...s, notes: e.target.value }))}
        />
      </div>
      <Button type="submit" disabled={submitting} className="bg-emerald-600 hover:bg-emerald-700">
        {submitting ? "Envoi..." : "Demander un rendez-vous"}
      </Button>
    </form>
  )
}
