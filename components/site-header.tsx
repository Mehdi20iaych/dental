"use client"

import Link from "next/link"
import { Stethoscope, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ScrollAnchor } from "@/components/scroll-anchor"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur border-b">
      <div className="mx-auto max-w-6xl h-14 px-4 md:px-6 flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Stethoscope className="h-5 w-5 text-emerald-700" />
          <span>Clinique Dentaire Sourires</span>
        </Link>
        <nav className="ml-auto hidden md:flex items-center gap-6 text-sm">
          <ScrollAnchor href="#services" className="text-muted-foreground hover:text-foreground">
            Services
          </ScrollAnchor>
          <ScrollAnchor href="#reserver" className="text-muted-foreground hover:text-foreground">
            Réserver
          </ScrollAnchor>
          <ScrollAnchor href="#contact" className="text-muted-foreground hover:text-foreground">
            Contact
          </ScrollAnchor>
          <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
            <ScrollAnchor href="#reserver">Prendre RDV</ScrollAnchor>
          </Button>
        </nav>
        <div className="md:hidden ml-auto">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Ouvrir le menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <div className="grid gap-4 mt-6">
                <ScrollAnchor href="#services" className="text-sm">
                  Services
                </ScrollAnchor>
                <ScrollAnchor href="#reserver" className="text-sm">
                  Réserver
                </ScrollAnchor>
                <ScrollAnchor href="#contact" className="text-sm">
                  Contact
                </ScrollAnchor>
                <Link href="/admin/login" className="text-xs text-muted-foreground">
                  Espace personnel
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
