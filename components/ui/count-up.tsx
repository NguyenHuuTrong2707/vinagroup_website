"use client"

import { useEffect, useRef, useState } from "react"

interface CountUpProps {
  end: number
  durationMs?: number
  decimals?: number
  prefix?: string
  suffix?: string
  useGrouping?: boolean
}

export function CountUp({
  end,
  durationMs = 1500,
  decimals = 0,
  prefix = "",
  suffix = "",
  useGrouping = false,
}: CountUpProps) {
  const [value, setValue] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)
  const startRef = useRef<number | null>(null)
  const containerRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setHasStarted(true)
            observer.disconnect()
          }
        })
      },
      { threshold: 0.4 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!hasStarted) return

    const step = (timestamp: number) => {
      if (startRef.current === null) startRef.current = timestamp
      const progress = Math.min(1, (timestamp - startRef.current) / durationMs)
      const current = end * progress
      setValue(current)
      if (progress < 1) requestAnimationFrame(step)
    }

    const raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [hasStarted, durationMs, end])

  const formatted = (() => {
    const fixed = value.toFixed(decimals)
    if (!useGrouping) return fixed
    const number = Number(fixed)
    return number.toLocaleString("vi-VN", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
  })()

  return (
    <span ref={containerRef}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  )
}






