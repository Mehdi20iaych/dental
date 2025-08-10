"use client"

import type { Appointment, AppointmentStatus, Patient } from "./types"

const KEYS = {
  patients: "dc_patients",
  appointments: "dc_appointments",
}

function isBrowser() {
  return typeof window !== "undefined"
}

function uid() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    // @ts-ignore
    return crypto.randomUUID()
  }
  return `id_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

function read<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback
  const raw = localStorage.getItem(key)
  if (!raw) return fallback
  try {
    const data = JSON.parse(raw)
    return data as T
  } catch {
    return fallback
  }
}

function write<T>(key: string, value: T) {
  if (!isBrowser()) return
  localStorage.setItem(key, JSON.stringify(value))
}

function seedIfEmpty() {
  const patients = read<Patient[]>(KEYS.patients, [])
  const appointments = read<Appointment[]>(KEYS.appointments, [])
  if (patients.length === 0) {
    const p1: Patient = {
      id: uid(),
      name: "Sophia Anderson",
      email: "sophia@example.com",
      phone: "+1 (555) 010-5678",
      notes: "Allergic to penicillin.",
      createdAt: new Date().toISOString(),
    }
    const p2: Patient = {
      id: uid(),
      name: "Marcus Lee",
      email: "marcus@example.com",
      phone: "+1 (555) 010-8910",
      createdAt: new Date().toISOString(),
      notes: "",
    }
    write(KEYS.patients, [p1, p2])

    const a1: Appointment = {
      id: uid(),
      patientId: p1.id,
      service: "Routine Cleaning",
      dateTime: new Date(Date.now() + 86400000).toISOString(),
      status: "Confirmed",
      notes: "Prefers morning appointments.",
      createdAt: new Date().toISOString(),
    }
    const a2: Appointment = {
      id: uid(),
      patientId: p2.id,
      service: "Orthodontics Consultation",
      dateTime: new Date(Date.now() + 2 * 86400000).toISOString(),
      status: "Pending",
      notes: "",
      createdAt: new Date().toISOString(),
    }
    write(KEYS.appointments, [a1, a2])
  }
}

// Initialize seed on module load (client only)
if (typeof window !== "undefined") {
  seedIfEmpty()
}

// Patients API
export function getPatients(): Patient[] {
  return read<Patient[]>(KEYS.patients, [])
}

export function createPatient(input: Omit<Patient, "id" | "createdAt">): Patient {
  const patients = getPatients()
  const exists = patients.find((p) => p.email.toLowerCase() === input.email.toLowerCase())
  if (exists) return exists
  const p: Patient = { id: uid(), createdAt: new Date().toISOString(), ...input }
  const next = [p, ...patients]
  write(KEYS.patients, next)
  return p
}

export function updatePatient(id: string, patch: Partial<Omit<Patient, "id" | "createdAt">>) {
  const patients = getPatients()
  const next = patients.map((p) => (p.id === id ? { ...p, ...patch } : p))
  write(KEYS.patients, next)
}

export function deletePatient(id: string) {
  const patients = getPatients().filter((p) => p.id !== id)
  write(KEYS.patients, patients)
  // Cascade: remove appointments for patient
  const apps = getAppointments().filter((a) => a.patientId !== id)
  write(KEYS.appointments, apps)
}

export function findOrCreatePatientByEmail(email: string, data?: { name?: string; phone?: string }): Patient {
  const patients = getPatients()
  const found = patients.find((p) => p.email.toLowerCase() === email.toLowerCase())
  if (found) return found
  return createPatient({ email, name: data?.name || email.split("@")[0], phone: data?.phone, notes: "" })
}

// Appointments API
export function getAppointments(): Appointment[] {
  return read<Appointment[]>(KEYS.appointments, [])
}

export function isSlotTaken(dateTime: string, excludeId?: string) {
  const all = getAppointments()
  return all.some((a) => a.dateTime === dateTime && a.id !== excludeId)
}

export function createAppointment(input: {
  patientId: string
  service: string
  dateTime: string
  status?: AppointmentStatus
  notes?: string
}): Appointment {
  if (isSlotTaken(input.dateTime)) {
    throw new Error("SLOT_TAKEN")
  }
  const a: Appointment = {
    id: uid(),
    createdAt: new Date().toISOString(),
    status: input.status || "Pending",
    notes: input.notes || "",
    patientId: input.patientId,
    service: input.service,
    dateTime: input.dateTime,
  }
  const all = getAppointments()
  write(KEYS.appointments, [a, ...all])
  return a
}

export function updateAppointment(id: string, patch: Partial<Omit<Appointment, "id" | "createdAt">>) {
  if (patch.dateTime && isSlotTaken(patch.dateTime, id)) {
    throw new Error("SLOT_TAKEN")
  }
  const all = getAppointments()
  const next = all.map((a) => (a.id === id ? { ...a, ...patch } : a))
  write(KEYS.appointments, next)
}

export function deleteAppointment(id: string) {
  const next = getAppointments().filter((a) => a.id !== id)
  write(KEYS.appointments, next)
}
