"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { z } from "zod"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { createPatient, updatePatient } from "@/lib/storage"
import type { Patient } from "@/lib/types"

const Schema = z.object({
  name: z.string().min(2, "Le nom est requis"),
  email: z.string().email("Email invalide"),
  phone: z.string().optional(),
  notes: z.string().optional(),
})

export function PatientForm({
  trigger,
  patient,
  onSaved,
}: {
  trigger: React.ReactNode
  patient?: Patient
  onSaved?: () => void
}) {
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState({
    name: patient?.name || "",
    email: patient?.email || "",
    phone: patient?.phone || "",
    notes: patient?.notes || "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (patient) {
      setData({ name: patient.name, email: patient.email, phone: patient.phone || "", notes: patient.notes || "" })
    }
  }, [patient, open])

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
      if (patient) {
        updatePatient(patient.id, parsed.data)
        toast({ title: "Patient mis à jour" })
      } else {
        createPatient(parsed.data)
        toast({ title: "Patient créé" })
      }
      setLoading(false)
      setOpen(false)
      onSaved?.()
    }, 300)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{patient ? "Modifier le patient" : "Nouveau patient"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="p-name">Nom complet</Label>
            <Input id="p-name" value={data.name} onChange={(e) => setData((s) => ({ ...s, name: e.target.value }))} />
            {errors.name ? <p className="text-xs text-rose-600">{errors.name}</p> : null}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="p-email">Email</Label>
            <Input
              id="p-email"
              type="email"
              value={data.email}
              onChange={(e) => setData((s) => ({ ...s, email: e.target.value }))}
            />
            {errors.email ? <p className="text-xs text-rose-600">{errors.email}</p> : null}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="p-phone">Téléphone</Label>
            <Input
              id="p-phone"
              value={data.phone}
              onChange={(e) => setData((s) => ({ ...s, phone: e.target.value }))}
              placeholder="+212 6 ..."
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="p-notes">Notes</Label>
            <Textarea
              id="p-notes"
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
