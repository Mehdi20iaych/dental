"use client"

import type React from "react"

import { useCallback } from "react"

export function ScrollAnchor({
  href,
  children,
  className,
  offset = 72, // approx sticky header height
}: {
  href: string
  children: React.ReactNode
  className?: string
  offset?: number
}) {
  const onClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (!href || !href.startsWith("#")) return
      e.preventDefault()
      const id = href.replace("#", "")
      const el = document.getElementById(id)
      if (el) {
        const y = el.getBoundingClientRect().top + window.pageYOffset - offset
        window.scrollTo({ top: y, behavior: "smooth" })
        // update the hash without jumping
        history.replaceState(null, "", `#${id}`)
      } else {
        // element not on this page: navigate to home with hash
        window.location.href = `/#${id}`
      }
    },
    [href, offset],
  )

  return (
    <a href={href} onClick={onClick} className={className}>
      {children}
    </a>
  )
}
