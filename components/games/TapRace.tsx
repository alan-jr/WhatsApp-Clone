"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { useWhatsApp } from "@/context/whatsapp-context"

interface TapRaceProps {
  chatId: string
  onGameEnd?: () => void
  duration?: number // in seconds
}

export function TapRace({ chatId, onGameEnd, duration = 10 }: TapRaceProps) {
  const { sendMessage } = useWhatsApp()
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(duration)
  const [isPlaying, setIsPlaying] = useState(false)
  const [highScore, setHighScore] = useState(0)

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isPlaying && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)
    } else if (timeLeft === 0 && isPlaying) {
      endGame()
    }
    return () => clearInterval(timer)
  }, [isPlaying, timeLeft])

  const startGame = () => {
    setScore(0)
    setTimeLeft(duration)
    setIsPlaying(true)
    sendMessage(chatId, {
      content: "🎮 Started a new Tap Race! Tap as fast as you can! ⚡",
      type: 'game'
    })
  }

  const handleTap = () => {
    if (isPlaying) {
      setScore(prev => prev + 1)
    }
  }

  const endGame = () => {
    setIsPlaying(false)
    if (score > highScore) {
      setHighScore(score)
    }
    sendMessage(chatId, {
      content: `🎮 Game Over! Score: ${score} taps in ${duration} seconds! ${score > highScore ? '🏆 New High Score!' : ''}`,
      type: 'game'
    })
    if (onGameEnd) onGameEnd()
  }

  return (
    <div className="flex flex-col items-center gap-4 p-4 bg-secondary rounded-lg">
      <div className="text-lg font-bold mb-2">
        {isPlaying ? (
          <>
            Time: {timeLeft}s | Score: {score}
          </>
        ) : (
          <>
            High Score: {highScore} taps
          </>
        )}
      </div>
      
      <Button
        variant={isPlaying ? "default" : "outline"}
        className={`w-32 h-32 rounded-full text-xl ${isPlaying ? 'bg-primary hover:bg-primary/90' : ''}`}
        onClick={isPlaying ? handleTap : startGame}
        disabled={timeLeft === 0}
      >
        {isPlaying ? (
          <span className="text-4xl">👆</span>
        ) : (
          "Start Game 🎮"
        )}
      </Button>

      {!isPlaying && score > 0 && (
        <div className="text-center mt-4">
          <p className="text-lg">Last Score: {score} taps</p>
          <p className="text-sm text-muted-foreground">
            ({(score / duration).toFixed(1)} taps per second)
          </p>
        </div>
      )}
    </div>
  )
} 