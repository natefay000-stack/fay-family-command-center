import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface CardGridProps {
  children: ReactNode
  columns?: "auto" | 2 | 3 | 4
  gap?: number
  minCardWidth?: number
  className?: string
}

export function CardGrid({ children, columns = "auto", gap = 12, minCardWidth = 300, className }: CardGridProps) {
  const gridStyle =
    columns === "auto"
      ? {
          display: "grid",
          gridTemplateColumns: `repeat(auto-fill, minmax(${minCardWidth}px, 1fr))`,
          gap: `${gap}px`,
        }
      : {
          display: "grid",
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: `${gap}px`,
        }

  return (
    <div className={cn("w-full", className)} style={gridStyle}>
      {children}
    </div>
  )
}
