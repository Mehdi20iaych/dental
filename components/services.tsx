import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const services = [
  {
    img: "/images/services/cleaning.png",
    title: "Détartrage et contrôle",
    desc: "Examens, détartrage et radiographies pour garder un sourire sain.",
    tag: "Le plus demandé",
  },
  {
    img: "/images/services/filling.png",
    title: "Plombages",
    desc: "Restaurations esthétiques pour traiter les caries.",
  },
  {
    img: "/images/services/ortho.png",
    title: "Orthodontie",
    desc: "Aligneurs transparents et appareils pour un alignement parfait.",
  },
  {
    img: "/images/services/whitening.png",
    title: "Blanchiment",
    desc: "Un sourire plus éclatant en toute sécurité.",
  },
  {
    img: "/images/services/cosmetic.png",
    title: "Esthétique dentaire",
    desc: "Facettes, collage et relooking du sourire.",
  },
  {
    img: "/images/services/root-canal.png",
    title: "Traitement canalaire",
    desc: "Soulagez la douleur et sauvez la dent avec l'endodontie moderne.",
  },
]

export function Services() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {services.map((s, idx) => (
        <Card key={idx} className="h-full overflow-hidden">
          <div className="relative h-36 w-full">
            <Image
              src={s.img || "/placeholder.svg"}
              alt={s.title}
              width={600}
              height={240}
              className="h-full w-full object-cover"
            />
          </div>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{s.title}</CardTitle>
              {s.tag ? <Badge variant="secondary">{s.tag}</Badge> : null}
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{s.desc}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
