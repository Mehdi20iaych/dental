"use client"

import { useMemo, useState } from "react"
import { Calendar, Filter, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AppointmentForm } from "@/components/appointment-form"
import { getAppointments, getPatients, updateAppointment, deleteAppointment } from "@/lib/storage"
import { formatDateTime } from "@/lib/format"
import { useToast } from "@/hooks/use-toast"

const statusColors: Record<string, string> = {
  Pending: "bg-amber-100 text-amber-800",
  Confirmed: "bg-emerald-100 text-emerald-800",
  Completed: "bg-gray-200 text-gray-800",
  Canceled: "bg-rose-100 text-rose-800",
}
const statusLabel: Record<string, string> = {
  Pending: "En attente",
  Confirmed: "Confirmé",
  Completed: "Terminé",
  Canceled: "Annulé",
}

export default function AppointmentsPage() {
  const { toast } = useToast()
  const [refreshKey, setRefreshKey] = useState(0)
  const [statusFilter, setStatusFilter] = useState<string>("Tous")
  const [q, setQ] = useState("")
  const appointments = useMemo(() => getAppointments(), [refreshKey])
  const patients = useMemo(() => getPatients(), [refreshKey])

  const rows = useMemo(() => {
    const byId = new Map(patients.map((p) => [p.id, p]))
    let list = appointments.map((a) => ({
      ...a,
      patient: byId.get(a.patientId),
    }))
    if (statusFilter !== "Tous") {
      list = list.filter((a) => a.status === statusFilter)
    }
    const qq = q.trim().toLowerCase()
    if (qq) {
      list = list.filter(
        (a) =>
          a.service.toLowerCase().includes(qq) ||
          (a.patient?.name.toLowerCase().includes(qq) ?? false) ||
          (a.patient?.email.toLowerCase().includes(qq) ?? false),
      )
    }
    return list
  }, [appointments, patients, statusFilter, q])

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-2xl font-semibold">Rendez-vous</h1>
        <AppointmentForm
          trigger={
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nouveau rendez-vous
            </Button>
          }
          onSaved={() => setRefreshKey((k) => k + 1)}
        />
      </div>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-col md:flex-row gap-3 md:items-center">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Label className="sr-only" htmlFor="status">
                Statut
              </Label>
              <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v)}>
                <SelectTrigger id="status" className="w-[180px]">
                  <SelectValue placeholder="Filtrer par statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tous">Tous</SelectItem>
                  <SelectItem value="Pending">En attente</SelectItem>
                  <SelectItem value="Confirmed">Confirmé</SelectItem>
                  <SelectItem value="Completed">Terminé</SelectItem>
                  <SelectItem value="Canceled">Annulé</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2 md:ml-auto">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par patient ou service"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="w-full md:w-[280px]"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Date &amp; heure</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead className="w-[220px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell className="font-medium">
                      {a.patient ? (
                        <div className="flex flex-col">
                          <span>{a.patient.name}</span>
                          <span className="text-xs text-muted-foreground">{a.patient.email}</span>
                        </div>
                      ) : (
                        "Inconnu"
                      )}
                    </TableCell>
                    <TableCell>{a.service}</TableCell>
                    <TableCell>{formatDateTime(a.dateTime)}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded px-2 py-1 text-xs font-medium ${statusColors[a.status] || ""}`}
                      >
                        {statusLabel[a.status] || a.status}
                      </span>
                    </TableCell>
                    <TableCell className="max-w-[280px] truncate">{a.notes || "-"}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-2">
                        <AppointmentForm
                          appointment={a}
                          trigger={
                            <Button variant="outline" size="sm">
                              Modifier
                            </Button>
                          }
                          onSaved={() => setRefreshKey((k) => k + 1)}
                        />
                        <Select
                          value={a.status}
                          onValueChange={(next) => {
                            try {
                              updateAppointment(a.id, { status: next as any })
                              toast({ title: "Statut mis à jour", description: `Marqué ${statusLabel[next]}.` })
                              setRefreshKey((k) => k + 1)
                            } catch (e) {
                              toast({
                                title: "Erreur",
                                description: "Impossible de mettre à jour.",
                                variant: "destructive",
                              })
                            }
                          }}
                        >
                          <SelectTrigger className="w-[160px]" aria-label="Changer le statut">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Pending">En attente</SelectItem>
                            <SelectItem value="Confirmed">Confirmé</SelectItem>
                            <SelectItem value="Completed">Terminé</SelectItem>
                            <SelectItem value="Canceled">Annulé</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            if (confirm("Supprimer ce rendez-vous ?")) {
                              deleteAppointment(a.id)
                              setRefreshKey((k) => k + 1)
                              toast({ title: "Rendez-vous supprimé" })
                            }
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Supprimer
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {rows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-sm text-muted-foreground">
                      Aucun rendez-vous.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
