"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Shuffle, Sparkles } from "lucide-react"

interface SurpriseMeAnimationProps {
  onSurpriseMe: () => void
  loading: boolean
}

export default function SurpriseMeAnimation({ onSurpriseMe, loading }: SurpriseMeAnimationProps) {
  const [isSpinning, setIsSpinning] = useState(false)

  const handleClick = () => {
    setIsSpinning(true)
    onSurpriseMe()

    // Reset animation after 2 seconds
    setTimeout(() => {
      setIsSpinning(false)
    }, 2000)
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleClick}
      disabled={loading}
      className={`
        text-gray-600 hover:text-orange-600 hover:bg-orange-50 transition-all duration-300 
        relative overflow-hidden group
        ${isSpinning ? "animate-pulse" : ""}
      `}
    >
      <div className="flex items-center gap-2 relative z-10">
        <Shuffle
          className={`h-4 w-4 transition-transform duration-500 ${
            isSpinning ? "animate-spin" : "group-hover:rotate-180"
          }`}
        />
        <span>Surprise Me</span>
        <Sparkles
          className={`h-3 w-3 text-amber-400 transition-all duration-300 ${
            isSpinning ? "animate-bounce" : "opacity-0 group-hover:opacity-100"
          }`}
        />
      </div>

      {/* Slot machine effect background */}
      {isSpinning && (
        <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 via-red-400/20 to-amber-400/20 animate-pulse"></div>
      )}
    </Button>
  )
}
