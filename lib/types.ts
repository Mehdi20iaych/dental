export type Patient = {
  id: string
  name: string
  email: string
  phone?: string
  notes?: string
  createdAt: string
}

export type AppointmentStatus = "Pending" | "Confirmed" | "Completed" | "Canceled"

export type Appointment = {
  id: string
  patientId: string
  service: string
  dateTime: string // ISO
  status: AppointmentStatus
  notes?: string
  createdAt: string
}
