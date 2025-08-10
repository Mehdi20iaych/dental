import Image from "next/image"
import Link from "next/link"
import { ScrollAnchor } from "@/components/scroll-anchor"

import { SiteHeader } from "@/components/site-header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BookingForm } from "@/components/booking-form"
import { Services } from "@/components/services"

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <Image
              src="/images/hero-smile.jpg"
              alt="Gros plan d'un sourire éclatant montrant des dents blanches"
              width={1600}
              height={900}
              className="h-full w-full object-cover opacity-35"
              priority
            />
          </div>
          <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
            <div className="grid gap-10 md:grid-cols-2 md:items-center">
              <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                  Des soins dentaires doux et modernes pour toute la famille
                </h1>
                <p className="text-muted-foreground text-lg">
                  Du détartrage à l&apos;orthodontie, nous rendons la santé bucco-dentaire simple, confortable et
                  pratique.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
                    <ScrollAnchor href="#reserver">Prendre rendez-vous</ScrollAnchor>
                  </Button>
                  <Button asChild variant="outline">
                    <ScrollAnchor href="#services">Découvrir nos services</ScrollAnchor>
                  </Button>
                </div>
                <div className="grid grid-cols-3 gap-6 pt-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold">4.9/5</div>
                      <div className="text-sm text-muted-foreground">Avis patients</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold">24/7</div>
                      <div className="text-sm text-muted-foreground">Réservation en ligne</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold">15+ ans</div>
                      <div className="text-sm text-muted-foreground">D&apos;expérience</div>
                    </CardContent>
                  </Card>
                </div>
              </div>
              <div className="bg-background/70 backdrop-blur rounded-xl border p-6 md:p-8 shadow-sm" id="reserver">
                <h2 className="text-xl font-semibold mb-2">Réserver un rendez-vous</h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Donnez-nous quelques informations et nous vous confirmerons votre rendez-vous.
                </p>
                <BookingForm />
                <p className="text-xs text-muted-foreground mt-3">
                  En réservant, vous acceptez nos{" "}
                  <Link href="/politiques" className="underline">
                    politiques
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t" id="services">
          <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold">Nos Services</h2>
                <p className="text-muted-foreground">Des soins complets, centrés sur le patient</p>
              </div>
              <Link
                href="#contact"
                className="text-emerald-700 hover:text-emerald-800 underline-offset-4 hover:underline"
              >
                Une question ? Contactez-nous
              </Link>
            </div>
            <Services />
          </div>
        </section>

        <section className="border-t bg-muted/30" id="contact">
          <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
            <div className="grid gap-8 md:grid-cols-3">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">Appel ou Email</h3>
                <p className="text-muted-foreground">Nous sommes à votre écoute.</p>
                <div className="text-sm">
                  <div className="font-medium">Téléphone</div>
                  <a href="tel:+212600000000" className="text-emerald-700 hover:underline">
                    +212 6 00 00 00 00
                  </a>
                </div>
                <div className="text-sm">
                  <div className="font-medium">Email</div>
                  <a href="mailto:bonjour@clinique-sourires.ma" className="text-emerald-700 hover:underline">
                    bonjour@clinique-sourires.ma
                  </a>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">Nous rendre visite</h3>
                <p className="text-muted-foreground">123 Av. du Sourire, Centre-ville, Casablanca</p>
                <Image
                  src="/images/location.png"
                  alt="Localisation de la clinique dentaire à Casablanca"
                  height={180}
                  width={320}
                  className="rounded-md border w-full h-auto object-cover"
                />
                <div>
                  <Link
                    href="https://maps.google.com?q=Casablanca%20Clinique%20Dentaire%20Sourires"
                    className="text-xs underline text-emerald-700"
                    target="_blank"
                  >
                    Ouvrir dans Google Maps
                  </Link>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">Horaires</h3>
                <ul className="text-sm text-muted-foreground">
                  <li>Lun–Ven : 08:00 – 18:00</li>
                  <li>Sam : 09:00 – 14:00</li>
                  <li>Dim : Fermé</li>
                </ul>
                <div>
                  <Link href="/admin/login" className="text-xs text-muted-foreground underline">
                    Espace personnel (staff)
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
