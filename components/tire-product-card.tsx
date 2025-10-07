"use client"

import Link from "next/link"
import { TireProductCardProps } from "@/types"

export function TireProductCard({
  name,
  image,
  bgColor = "bg-white",
  link = "#",
}: TireProductCardProps) {
  const CardContent = (
    <div className={`rounded-lg border border-gray-200 ${bgColor} overflow-hidden h-full`}>
      <div className="aspect-[4/3] w-full bg-white relative">
        <img
          src={image || "/placeholder.svg"}
          alt={name}
          className="h-full w-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-x-0 bottom-0 bg-black/50 px-3 py-2">
          <p className="text-white text-sm sm:text-base font-medium line-clamp-2">{name}</p>
        </div>
      </div>
    </div>
  )

  if (!link || link === "#") {
    return CardContent
  }

  return <Link href={link} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg">{CardContent}</Link>
}


