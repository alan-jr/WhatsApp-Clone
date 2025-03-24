"use client"

import { useEffect, useState } from 'react'
import confetti from 'canvas-confetti'

interface MessageEffectProps {
  type: 'confetti' | 'hearts' | 'sparkles'
  duration?: number
}

export function MessageEffect({ type, duration = 2000 }: MessageEffectProps) {
  const [isActive, setIsActive] = useState(true)

  useEffect(() => {
    if (!isActive) return

    switch (type) {
      case 'confetti':
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        })
        break
      case 'hearts':
        confetti({
          particleCount: 50,
          spread: 60,
          shapes: ['heart'],
          colors: ['#ff0000', '#ff69b4', '#ff1493']
        })
        break
      case 'sparkles':
        confetti({
          particleCount: 80,
          spread: 100,
          shapes: ['star'],
          colors: ['#ffd700', '#ffff00', '#ffa500']
        })
        break
    }

    const timer = setTimeout(() => {
      setIsActive(false)
    }, duration)

    return () => clearTimeout(timer)
  }, [type, duration, isActive])

  return null // This component only handles effects, no visual elements
} 