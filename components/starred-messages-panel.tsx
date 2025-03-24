"use client"

import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useWhatsApp } from "@/context/whatsapp-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface StarredMessagesPanelProps {
  onClose: () => void
}

export default function StarredMessagesPanel({ onClose }: StarredMessagesPanelProps) {
  const { getStarredMessages, chats, theme } = useWhatsApp()

  const starredMessages = getStarredMessages()

  const textColor = theme === 'light' ? 'text-gray-800' : 'text-[#e9edef]'
  const secondaryTextColor = theme === 'light' ? 'text-gray-600' : 'text-[#8696a0]'
  const headerBgColor = theme === 'light' ? 'bg-[#f0f2f5]' : 'bg-[#202c33]'
  const bgColor = theme === 'light' ? 'bg-white' : 'bg-[#111b21]'

  return (
    <div className={`flex flex-col h-full ${bgColor}`}>
      {/* Header */}
      <div className={`flex items-center p-4 ${headerBgColor}`}>
        <Button 
          variant="ghost" 
          size="icon" 
          className="mr-4 text-[#aebac1]"
          onClick={onClose}
        >
          <ArrowLeft size={24} />
        </Button>
        <div className={`font-medium ${textColor}`}>
          Starred Messages
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {starredMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className={`text-lg font-medium mb-2 ${textColor}`}>No starred messages</div>
            <div className={`text-sm ${secondaryTextColor}`}>Tap and hold on any message to star it</div>
          </div>
        ) : (
          <div className="space-y-4">
            {starredMessages.map((msg) => {
              const chat = chats[msg.chatId]
              return (
                <div key={msg.id} className="flex items-start space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={chat.avatar} alt={chat.name} />
                    <AvatarFallback>{chat.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className={`font-medium ${textColor}`}>{chat.name}</div>
                    <div className={`${textColor}`}>{msg.text}</div>
                    <div className={`text-xs ${secondaryTextColor}`}>{msg.time}</div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
} 