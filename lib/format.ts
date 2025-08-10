export function formatDateTime(iso: string, locale = "fr-MA") {
  try {
    const d = new Date(iso)
    return new Intl.DateTimeFormat(locale, {
      dateStyle: "medium",
      timeStyle: "short",
      hour12: false,
    }).format(d)
  } catch {
    return iso
  }
}

export function formatTime24(iso: string, locale = "fr-MA") {
  try {
    const d = new Date(iso)
    return new Intl.DateTimeFormat(locale, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(d)
  } catch {
    return iso
  }
}
