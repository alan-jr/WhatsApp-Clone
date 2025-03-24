"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { useWhatsApp } from "@/context/whatsapp-context"

interface TicTacToeProps {
  chatId: string
  onGameEnd?: () => void
}

export function TicTacToe({ chatId, onGameEnd }: TicTacToeProps) {
  const { sendMessage } = useWhatsApp()
  const [board, setBoard] = useState(Array(9).fill(null))
  const [isXNext, setIsXNext] = useState(true)
  const [winner, setWinner] = useState<string | null>(null)

  const calculateWinner = (squares: Array<string | null>) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
      [0, 4, 8], [2, 4, 6] // Diagonals
    ]

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i]
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a]
      }
    }
    return null
  }

  const handleClick = (i: number) => {
    if (winner || board[i]) return

    const newBoard = board.slice()
    newBoard[i] = isXNext ? 'X' : 'O'
    setBoard(newBoard)
    setIsXNext(!isXNext)

    const gameWinner = calculateWinner(newBoard)
    if (gameWinner) {
      setWinner(gameWinner)
      sendMessage(chatId, {
        content: `🎮 Game Over! ${gameWinner} wins! 🏆`,
        type: 'game'
      })
      if (onGameEnd) onGameEnd()
    } else if (!newBoard.includes(null)) {
      setWinner('draw')
      sendMessage(chatId, {
        content: "🎮 Game Over! It's a draw! 🤝",
        type: 'game'
      })
      if (onGameEnd) onGameEnd()
    } else {
      // Send the move to chat
      sendMessage(chatId, {
        content: `🎮 Made a move: ${isXNext ? 'X' : 'O'} at position ${i + 1}`,
        type: 'game'
      })
    }
  }

  const renderSquare = (i: number) => (
    <Button
      variant="outline"
      className="w-16 h-16 text-2xl font-bold"
      onClick={() => handleClick(i)}
      disabled={!!winner || !!board[i]}
    >
      {board[i]}
    </Button>
  )

  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setIsXNext(true)
    setWinner(null)
    sendMessage(chatId, {
      content: "🎮 Started a new game of Tic-Tac-Toe! 🎲",
      type: 'game'
    })
  }

  return (
    <div className="flex flex-col items-center gap-4 p-4 bg-secondary rounded-lg">
      <div className="text-lg font-bold mb-2">
        {winner
          ? winner === 'draw'
            ? "It's a draw! 🤝"
            : `Winner: ${winner} 🏆`
          : `Next player: ${isXNext ? 'X' : 'O'}`}
      </div>
      <div className="grid grid-cols-3 gap-2">
        {Array(9).fill(null).map((_, i) => (
          <div key={i}>{renderSquare(i)}</div>
        ))}
      </div>
      <Button 
        variant="default"
        onClick={resetGame}
        className="mt-4"
      >
        New Game 🎲
      </Button>
    </div>
  )
} 