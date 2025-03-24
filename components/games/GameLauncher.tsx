"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { TicTacToe } from './TicTacToe'
import { TapRace } from './TapRace'
import { 
  Gamepad2, 
  Hand, 
  Timer,
  X,
} from 'lucide-react'

interface GameLauncherProps {
  chatId: string
  onClose: () => void
}

type GameType = 'tic-tac-toe' | 'tap-race' | null

const GAMES = [
  {
    id: 'tic-tac-toe',
    name: 'Tic Tac Toe',
    description: 'Classic X and O game',
    icon: X
  },
  {
    id: 'tap-race',
    name: 'Tap Race',
    description: 'Test your tapping speed',
    icon: Hand
  }
]

export function GameLauncher({ chatId, onClose }: GameLauncherProps) {
  const [selectedGame, setSelectedGame] = useState<GameType>(null)

  const renderGame = () => {
    switch (selectedGame) {
      case 'tic-tac-toe':
        return <TicTacToe chatId={chatId} onGameEnd={() => setSelectedGame(null)} />
      case 'tap-race':
        return <TapRace chatId={chatId} onGameEnd={() => setSelectedGame(null)} />
      default:
        return (
          <div className="grid grid-cols-2 gap-4">
            {GAMES.map((game) => (
              <Button
                key={game.id}
                variant="outline"
                className="h-32 flex flex-col items-center justify-center gap-2 p-4"
                onClick={() => setSelectedGame(game.id as GameType)}
              >
                <game.icon className="h-8 w-8" />
                <div className="text-sm font-medium">{game.name}</div>
                <div className="text-xs text-muted-foreground text-center">
                  {game.description}
                </div>
              </Button>
            ))}
          </div>
        )
    }
  }

  return (
    <div className="p-4 bg-background rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Gamepad2 className="h-5 w-5" />
          <h2 className="text-lg font-bold">
            {selectedGame ? GAMES.find(g => g.id === selectedGame)?.name : 'Games'}
          </h2>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {renderGame()}
    </div>
  )
} 