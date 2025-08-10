"use client"

import type React from "react"

import { useRouter } from "next/navigation"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

export default function AdminLoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Identifiants de démonstration
    setTimeout(() => {
      if (email.trim().toLowerCase() === "admin@clinic.test" && password === "admin123") {
        localStorage.setItem("dc_admin_authed", "true")
        localStorage.setItem("dc_admin_user", JSON.stringify({ email }))
        toast({ title: "Bienvenue", description: "Connexion réussie." })
        router.replace("/admin")
      } else {
        toast({ title: "Identifiants invalides", description: "Veuillez réessayer.", variant: "destructive" })
      }
      setLoading(false)
    }, 400)
  }

  return (
    <div className="min-h-screen grid place-items-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Connexion Staff</CardTitle>
          <CardDescription>Accédez au panneau d&apos;administration.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@clinic.test"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Mot de passe</Label>
                <Link href="/" className="ml-auto text-xs underline">
                  Retour au site
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? "Connexion..." : "Se connecter"}
            </Button>
            <p className="text-xs text-muted-foreground">Démo : admin@clinic.test / admin123</p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
