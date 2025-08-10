export default function PolitiquesPage() {
  return (
    <div className="mx-auto max-w-3xl p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Politiques de la clinique</h1>
      <p className="text-muted-foreground">
        Nous nous engageons à offrir des soins de qualité dans le respect de votre temps et de votre vie privée.
      </p>
      <ul className="list-disc pl-6 space-y-2 text-sm">
        <li>Annulation : merci de prévenir 24h à l&apos;avance.</li>
        <li>Retard : au-delà de 10 minutes de retard, le rendez-vous peut être reprogrammé.</li>
        <li>Confidentialité : vos données ne sont jamais partagées sans votre consentement.</li>
      </ul>
    </div>
  )
}
