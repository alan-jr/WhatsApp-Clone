"use client"

import { useState } from "react"
import { Search, MoreVertical, Archive, Filter, ChevronDown, BellOff } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useWhatsApp } from "@/context/whatsapp-context"
import type { Chat, Message } from "@/context/whatsapp-context"
import { useRouter } from "next/navigation"

interface ChatListProps {
  onSelectChat: (chatId: string) => void
  onProfileClick: () => void
  onCreateGroup: () => void
  onCreateCommunity: () => void
  onShowStarredMessages: () => void
}

export default function ChatList({
  onSelectChat,
  onProfileClick,
  onCreateGroup,
  onCreateCommunity,
  onShowStarredMessages,
}: ChatListProps) {
  const { chats, selectedChat, user, theme, markMessagesAsRead } = useWhatsApp()

  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const chatList = Object.values(chats)

  const filteredChats = chatList.filter(
    (chat: Chat) =>
      chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.messages.some((msg) => msg.content.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const handleSelectChat = (chatId: string) => {
    onSelectChat(chatId)
    markMessagesAsRead(chatId)
  }

  const bgColor = theme === "light" ? "bg-white" : "bg-[#111b21]"
  const headerBgColor = theme === "light" ? "bg-[#f0f2f5]" : "bg-[#202c33]"
  const textColor = theme === "light" ? "text-gray-800" : "text-[#e9edef]"
  const secondaryTextColor = theme === "light" ? "text-gray-600" : "text-[#8696a0]"
  const hoverBgColor = theme === "light" ? "hover:bg-gray-100" : "hover:bg-[#202c33]"
  const borderColor = theme === "light" ? "border-gray-200" : "border-[#222e35]"
  const inputBgColor = theme === "light" ? "bg-gray-100" : "bg-[#202c33]"

  return (
    <div className={`flex flex-col h-full ${bgColor}`}>
      {/* Header */}
      <div className={`flex items-center justify-between p-3 ${headerBgColor}`}>
        <Button variant="ghost" className="p-1 h-auto rounded-full" onClick={onProfileClick}>
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.avatar} alt="Your profile" />
            <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
        </Button>
        <div className="flex gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full text-[#aebac1]"
                  onClick={() => router.push("/status")}
                >
                  <svg
                    viewBox="0 0 24 24"
                    height="20"
                    width="20"
                    preserveAspectRatio="xMidYMid meet"
                    fill="currentColor"
                  >
                    <path d="M12.072 1.761a10.05 10.05 0 0 0-9.303 5.65.977.977 0 0 0 1.756.855 8.098 8.098 0 0 1 7.496-4.553.977.977 0 1 0 .051-1.952zM1.926 13.64a10.052 10.052 0 0 0 7.461 7.925.977.977 0 0 0 .471-1.895 8.097 8.097 0 0 1-6.012-6.386.977.977 0 0 0-1.92.356zm13.729 7.454a10.053 10.053 0 0 0 6.201-8.946.976.976 0 1 0-1.951-.081v.014a8.097 8.097 0 0 1-4.997 7.209.977.977 0 0 0 .727 1.813l.02-.009z"></path>
                    <path fill="#009588" d="M19 1.5a3 3 0 1 1 0 6 3 3 0 0 1 0-6z"></path>
                  </svg>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Status updates</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full text-[#aebac1]" onClick={onCreateGroup}>
                  <svg
                    viewBox="0 0 24 24"
                    height="20"
                    width="20"
                    preserveAspectRatio="xMidYMid meet"
                    fill="currentColor"
                  >
                    <path d="M19.005 3.175H4.674C3.642 3.175 3 3.789 3 4.821V21.02l3.544-3.514h12.461c1.033 0 2.064-1.06 2.064-2.093V4.821c-.001-1.032-1.032-1.646-2.064-1.646zm-4.989 9.869H7.041V11.1h6.975v1.944zm3-4H7.041V7.1h9.975v1.944z"></path>
                  </svg>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>New chat</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full text-[#aebac1]">
                <MoreVertical size={20} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className={`${theme === "light" ? "bg-white text-gray-800" : "bg-[#233138] text-[#d1d7db]"} border-none`}
            >
              <DropdownMenuItem
                className={`${theme === "light" ? "focus:bg-gray-100" : "focus:bg-[#182229]"}`}
                onClick={onCreateGroup}
              >
                New group
              </DropdownMenuItem>
              <DropdownMenuItem
                className={`${theme === "light" ? "focus:bg-gray-100" : "focus:bg-[#182229]"}`}
                onClick={onCreateCommunity}
              >
                New community
              </DropdownMenuItem>
              <DropdownMenuItem
                className={`${theme === "light" ? "focus:bg-gray-100" : "focus:bg-[#182229]"}`}
                onClick={onShowStarredMessages}
              >
                Starred messages
              </DropdownMenuItem>
              <DropdownMenuItem
                className={`${theme === "light" ? "focus:bg-gray-100" : "focus:bg-[#182229]"}`}
                onClick={() => router.push("/profile")}
              >
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem className={`${theme === "light" ? "focus:bg-gray-100" : "focus:bg-[#182229]"}`}>
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Search */}
      <div className={`p-2 ${bgColor}`}>
        <div className={`flex items-center ${inputBgColor} rounded-lg px-3 py-1.5`}>
          <Search size={18} className={secondaryTextColor + " mr-2"} />
          <Input
            type="text"
            placeholder="Search or start new chat"
            className={`bg-transparent border-none focus-visible:ring-0 ${textColor} placeholder:${secondaryTextColor} h-8`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Filter size={18} className={secondaryTextColor + " ml-2"} />
        </div>
      </div>

      {/* Archived */}
      <div className={`flex items-center px-4 py-3 ${hoverBgColor} cursor-pointer`}>
        <Archive size={18} className="text-[#00a884] mr-4" />
        <span className={textColor}>Archived</span>
        <ChevronDown size={18} className={`${secondaryTextColor} ml-auto`} />
      </div>

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto">
        {filteredChats.map((chat: any) => {
          const lastMessage = chat.messages[chat.messages.length - 1] || {}
          const unreadCount = chat.messages.filter((msg: any) => msg.sender === "them" && !msg.read).length

          return (
            <div
              key={chat.id}
              className={`flex items-center px-3 py-3 cursor-pointer border-t ${borderColor} ${selectedChat === chat.id ? (theme === "light" ? "bg-gray-200" : "bg-[#2a3942]") : hoverBgColor}`}
              onClick={() => handleSelectChat(chat.id)}
            >
              <Avatar className="h-12 w-12 mr-3">
                <AvatarImage src={chat.avatar} alt={chat.name} />
                <AvatarFallback>{chat.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between">
                  <span className={`font-medium ${textColor} truncate`}>{chat.name}</span>
                  <div className="flex items-center">
                    {chat.muted && <BellOff size={14} className={`${secondaryTextColor} mr-1`} />}
                    <span className={`text-xs ${unreadCount > 0 ? "text-[#00a884]" : secondaryTextColor}`}>
                      {lastMessage.time || ""}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between mt-1">
                  <span className={`text-sm ${secondaryTextColor} truncate`}>
                    {lastMessage.author ? `${lastMessage.author}: ${lastMessage.text}` : lastMessage.text || ""}
                  </span>
                  {unreadCount > 0 && (
                    <span className="bg-[#00a884] text-black text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

