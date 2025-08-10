"use client"

import { useMemo, useState } from "react"
import { Search, Trash2, Edit3, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PatientForm } from "@/components/patient-form"
import { getPatients, deletePatient } from "@/lib/storage"
import { useToast } from "@/hooks/use-toast"

export default function PatientsPage() {
  const { toast } = useToast()
  const [query, setQuery] = useState("")
  const [refreshKey, setRefreshKey] = useState(0)
  const patients = useMemo(() => getPatients(), [refreshKey])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return patients
    return patients.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.email.toLowerCase().includes(q) ||
        (p.phone || "").toLowerCase().includes(q),
    )
  }, [patients, query])

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-2xl font-semibold">Patients</h1>
        <div className="flex gap-2">
          <PatientForm
            trigger={
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                New Patient
              </Button>
            }
            onSaved={() => setRefreshKey((k) => k + 1)}
          />
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or phone"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead className="w-[140px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell>{p.email}</TableCell>
                    <TableCell>{p.phone || "-"}</TableCell>
                    <TableCell className="max-w-[280px] truncate">{p.notes || "-"}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <PatientForm
                          patient={p}
                          trigger={
                            <Button variant="outline" size="sm">
                              <Edit3 className="mr-2 h-4 w-4" />
                              Edit
                            </Button>
                          }
                          onSaved={() => setRefreshKey((k) => k + 1)}
                        />
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            if (confirm("Delete this patient? Their appointments will also be removed.")) {
                              deletePatient(p.id)
                              toast({ title: "Patient deleted" })
                              setRefreshKey((k) => k + 1)
                            }
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-sm text-muted-foreground">
                      No patients found.
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
