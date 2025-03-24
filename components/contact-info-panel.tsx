"use client"

import { ArrowLeft, BellOff, Bell, Star, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useWhatsApp } from "@/context/whatsapp-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"

interface ContactInfoPanelProps {
  chatId: string
  onClose: () => void
}

export default function ContactInfoPanel({ chatId, onClose }: ContactInfoPanelProps) {
  const { chats, theme, toggleMuteChat, deleteChat } = useWhatsApp()
  const { toast } = useToast()

  const chat = chats[chatId]

  const textColor = theme === 'light' ? 'text-gray-800' : 'text-[#e9edef]'
  const secondaryTextColor = theme === 'light' ? 'text-gray-600' : 'text-[#8696a0]'
  const headerBgColor = theme === 'light' ? 'bg-[#f0f2f5]' : 'bg-[#202c33]'
  const bgColor = theme === 'light' ? 'bg-white' : 'bg-[#111b21]'
  const sectionBgColor = theme === 'light' ? 'bg-gray-100' : 'bg-[#111b21]'
  const dividerColor = theme === 'light' ? 'bg-gray-200' : 'bg-[#222e35]'

  const handleToggleMute = () => {
    toggleMuteChat(chatId)
    toast({
      title: chat.muted ? "Chat unmuted" : "Chat muted",
      description: chat.muted ? "You will now receive notifications" : "Notifications are now muted"
    })
  }

  const handleDeleteChat = () => {
    deleteChat(chatId)
    toast({
      title: "Chat deleted",
      description: "Chat has been deleted"
    })
    onClose()
  }

  if (!chat) return null

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
          Contact Info
        </div>
      </div>

      {/* Profile */}
      <div className={`flex flex-col items-center p-6 ${sectionBgColor}`}>
        <Avatar className="h-32 w-32 mb-4">
          <AvatarImage src={chat.avatar} alt={chat.name} />
          <AvatarFallback>{chat.name.substring(0, 2)}</AvatarFallback>
        </Avatar>
        <div className={`text-xl font-medium ${textColor}`}>{chat.name}</div>
        <div className={`text-sm ${secondaryTextColor}`}>{chat.online}</div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* About */}
        <div className={`p-4 ${sectionBgColor} mt-2`}>
          <div className={`text-sm ${secondaryTextColor} mb-1`}>About</div>
          <div className={textColor}>{chat.about || "Hey there! I am using WhatsApp."}</div>
        </div>

        {/* Media */}
        <div className={`p-4 ${sectionBgColor} mt-2`}>
          <div className={`text-sm ${secondaryTextColor} mb-1`}>Media, links and docs</div>
          <div className={`text-sm ${textColor}`}>None</div>
        </div>

        {/* Actions */}
        <div className={`mt-2 divide-y ${dividerColor}`}>
          <Button
            variant="ghost"
            className={`w-full justify-start p-4 gap-4 rounded-none ${textColor} hover:bg-[#202c33]`}
            onClick={handleToggleMute}
          >
            {chat.muted ? <BellOff size={24} /> : <Bell size={24} />}
            {chat.muted ? "Unmute notifications" : "Mute notifications"}
          </Button>
          <Button
            variant="ghost"
            className={`w-full justify-start p-4 gap-4 rounded-none ${textColor} hover:bg-[#202c33]`}
          >
            <Star size={24} />
            Starred messages
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start p-4 gap-4 rounded-none text-red-500 hover:bg-[#202c33]"
            onClick={handleDeleteChat}
          >
            <Trash size={24} />
            Delete chat
          </Button>
        </div>
      </div>
    </div>
  )
} 