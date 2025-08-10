import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t">
      <div className="mx-auto max-w-6xl px-6 py-8 text-sm text-muted-foreground flex flex-col md:flex-row gap-2 items-center md:justify-between">
        <div>
          {"©"} {new Date().getFullYear()} Clinique Dentaire Sourires. Tous droits réservés.
        </div>
        <div className="flex items-center gap-4">
          <Link href="/confidentialite" className="hover:underline">
            Confidentialité
          </Link>
          <Link href="/conditions" className="hover:underline">
            Conditions
          </Link>
          <Link href="/admin/login" className="hover:underline">
            Espace personnel
          </Link>
        </div>
      </div>
    </footer>
  )
}
