"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { ArrowLeft, MoreVertical, Search, Phone, Video, Star, Trash, Smile, Reply, Gamepad2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useWhatsApp } from "@/context/whatsapp-context"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { GameLauncher } from './games/GameLauncher'
import { MessageEffect } from './effects/MessageEffect'
import { AnimatedAvatar } from './features/AnimatedAvatar'
import type { MessageData, Call } from "@/context/whatsapp-context"

const EMOJI_LIST = ["😊", "😂", "❤️", "👍", "😍", "🎉", "🔥", "✨", "🙌", "👏"]

interface Message {
  id: string;
  content: string;
  sender: 'me' | string;
  time: string;
  starred: boolean;
  reactions?: { [key: string]: string[] };
  replyTo?: {
    id: string;
    content: string;
    sender: string;
  };
}

interface Chat {
  id: string;
  name: string;
  avatar: string;
  online: string;
  messages: Message[];
  muted: boolean;
}

type Chats = {
  [key: string]: Chat;
};

interface ChatAreaProps {
  chatId: string
  onBackClick: () => void
  onShowContactInfo: () => void
}

export default function ChatArea({ chatId, onBackClick, onShowContactInfo }: ChatAreaProps) {
  const { chats, sendMessage, addCall, theme, deleteMessage, starMessage, unstarMessage, clearMessages, deleteChat, toggleMuteChat, setChats } = useWhatsApp();
  const [newMessage, setNewMessage] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [selectedMessages, setSelectedMessages] = useState<string[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [showEmojiList, setShowEmojiList] = useState(false);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { toast } = useToast();
  const [showGames, setShowGames] = useState(false)
  const [messageEffect, setMessageEffect] = useState<{
    type: 'confetti' | 'hearts' | 'sparkles'
    timestamp: number
  } | null>(null)
  const [activeCall, setActiveCall] = useState<{
    contact: { name: string; avatar: string }
    isVideo: boolean
  } | null>(null)
  
  const chat = chats[chatId];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat?.messages]);

  const handleEmojiSelect = (emoji: string) => {
    setNewMessage(prev => prev + emoji);
    setShowEmojiList(false);
  };

  const handleReaction = (messageId: string, emoji: string) => {
    // Update the message's reactions
    setChats((prev: Chats) => ({
      ...prev,
      [chatId]: {
        ...prev[chatId],
        messages: prev[chatId].messages.map((msg: Message) => {
          if (msg.id === messageId) {
            const reactions = msg.reactions || {};
            const users = reactions[emoji] || [];
            return {
              ...msg,
              reactions: {
                ...reactions,
                [emoji]: users.includes('me') ? users.filter((u: string) => u !== 'me') : [...users, 'me']
              }
            };
          }
          return msg;
        })
      }
    }));
  };

  const handleReply = (message: Message) => {
    setReplyingTo(message);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    const messageData: MessageData = {
      content: newMessage,
      type: 'text',
      replyTo: replyingTo ? {
        id: replyingTo.id,
        content: replyingTo.content,
        sender: replyingTo.sender,
        time: replyingTo.time,
        starred: replyingTo.starred
      } : undefined
    }

    // Check for special commands
    if (newMessage.startsWith('/effect ')) {
      const effect = newMessage.split(' ')[1]
      if (['confetti', 'hearts', 'sparkles'].includes(effect)) {
        messageData.type = 'effect'
        setMessageEffect({
          type: effect as 'confetti' | 'hearts' | 'sparkles',
          timestamp: Date.now()
        })
      }
    }

    sendMessage(chatId, messageData)
    setNewMessage('')
    setReplyingTo(null)
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCall = (isVideo: boolean = false) => {
    const newCall: Call = {
      id: `call-${Date.now()}`,
      name: chat.name,
      avatar: chat.avatar,
      type: "outgoing",
      time: new Date().toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true,
        timeZone: 'UTC'
      }),
      callType: isVideo ? "video" : "audio",
      missed: false
    }
    addCall(newCall)
    setActiveCall({
      contact: {
        name: chat.name,
        avatar: chat.avatar
      },
      isVideo
    })
  };

  const handleMessageAction = (messageId: string, action: 'star' | 'unstar' | 'delete') => {
    if (action === 'star') {
      starMessage(chatId, messageId);
      toast({
        title: "Message starred",
        description: "Message added to starred messages"
      });
    } else if (action === 'unstar') {
      unstarMessage(chatId, messageId);
      toast({
        title: "Message unstarred",
        description: "Message removed from starred messages"
      });
    } else if (action === 'delete') {
      deleteMessage(chatId, messageId);
      toast({
        title: "Message deleted",
        description: "Message has been deleted"
      });
    }
  };

  const handleClearMessages = () => {
    clearMessages(chatId);
    toast({
      title: "Chat cleared",
      description: "All messages have been cleared"
    });
  };

  const handleDeleteChat = () => {
    deleteChat(chatId);
    toast({
      title: "Chat deleted",
      description: "Chat has been deleted"
    });
    onBackClick();
  };

  const handleToggleMute = () => {
    toggleMuteChat(chatId);
    toast({
      title: chat.muted ? "Chat unmuted" : "Chat muted",
      description: chat.muted ? "You will now receive notifications" : "Notifications are now muted"
    });
  };

  const toggleMessageSelection = (messageId: string) => {
    if (selectedMessages.includes(messageId)) {
      setSelectedMessages(prev => prev.filter(id => id !== messageId));
    } else {
      setSelectedMessages(prev => [...prev, messageId]);
    }
  };

  const handleBulkAction = (action: 'star' | 'delete') => {
    selectedMessages.forEach(messageId => {
      if (action === 'star') {
        starMessage(chatId, messageId);
      } else if (action === 'delete') {
        deleteMessage(chatId, messageId);
      }
    });
    
    toast({
      title: action === 'star' ? "Messages starred" : "Messages deleted",
      description: action === 'star' 
        ? "Selected messages added to starred messages" 
        : "Selected messages have been deleted"
    });
    
    setSelectedMessages([]);
    setIsSelectionMode(false);
  };

  if (!chat) {
    return <div className={`flex-grow ${theme === 'light' ? 'bg-gray-200' : 'bg-[#222e35]'} flex items-center justify-center`}>Chat not found</div>;
  }

  const bgColor = theme === 'light' ? 'bg-[#efeae2]' : 'bg-[#0b141a]';
  const headerBgColor = theme === 'light' ? 'bg-[#f0f2f5]' : 'bg-[#202c33]';
  const inputBgColor = theme === 'light' ? 'bg-white' : 'bg-[#2a3942]';
  const textColor = theme === 'light' ? 'text-gray-800' : 'text-[#e9edef]';
  const secondaryTextColor = theme === 'light' ? 'text-gray-600' : 'text-[#8696a0]';
  const myMessageBgColor = theme === 'light' ? 'bg-[#d9fdd3]' : 'bg-[#005c4b]';
  const theirMessageBgColor = theme === 'light' ? 'bg-white' : 'bg-[#202c33]';

  return (
    <div className={`flex flex-col h-full ${bgColor}`}>
      {/* Header */}
      <div className={`flex items-center p-2 ${headerBgColor}`}>
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden mr-1 text-[#aebac1]"
          onClick={onBackClick}
        >
          <ArrowLeft size={24} />
        </Button>
        <div 
          className="flex items-center flex-1 cursor-pointer"
          onClick={onShowContactInfo}
        >
          <Avatar className="h-10 w-10 mr-3">
            <AvatarImage src={chat.avatar} alt={chat.name} />
            <AvatarFallback>{chat.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className={`font-medium ${textColor}`}>{chat.name}</div>
            <div className={`text-xs ${secondaryTextColor}`}>{chat.online}</div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full text-[#aebac1]"
            onClick={() => handleCall(true)}
          >
            <Video size={20} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full text-[#aebac1]"
            onClick={() => handleCall()}
          >
            <Phone size={20} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full text-[#aebac1]"
            onClick={() => setShowSearch(true)}
          >
            <Search size={20} />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full text-[#aebac1]">
                <MoreVertical size={20} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className={`${theme === 'light' ? 'bg-white text-gray-800' : 'bg-[#233138] text-[#d1d7db]'} border-none`}>
              <DropdownMenuItem 
                className={`${theme === 'light' ? 'focus:bg-gray-100' : 'focus:bg-[#182229]'}`}
                onClick={onShowContactInfo}
              >
                Contact info
              </DropdownMenuItem>
              <DropdownMenuItem 
                className={`${theme === 'light' ? 'focus:bg-gray-100' : 'focus:bg-[#182229]'}`}
                onClick={() => setIsSelectionMode(true)}
              >
                Select messages
              </DropdownMenuItem>
              <DropdownMenuItem 
                className={`${theme === 'light' ? 'focus:bg-gray-100' : 'focus:bg-[#182229]'}`}
                onClick={onBackClick}
              >
                Close chat
              </DropdownMenuItem>
              <DropdownMenuItem 
                className={`${theme === 'light' ? 'focus:bg-gray-100' : 'focus:bg-[#182229]'}`}
                onClick={handleToggleMute}
              >
                {chat.muted ? 'Unmute notifications' : 'Mute notifications'}
              </DropdownMenuItem>
              <DropdownMenuItem 
                className={`${theme === 'light' ? 'focus:bg-gray-100' : 'focus:bg-[#182229]'}`}
                onClick={handleClearMessages}
              >
                Clear messages
              </DropdownMenuItem>
              <DropdownMenuItem 
                className={`${theme === 'light' ? 'focus:bg-gray-100' : 'focus:bg-[#182229]'}`}
                onClick={handleDeleteChat}
              >
                Delete chat
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Selection mode header */}
      {isSelectionMode && (
        <div className={`flex items-center p-2 ${headerBgColor}`}>
          <Button 
            variant="ghost" 
            size="icon" 
            className="mr-1 text-[#aebac1]"
            onClick={() => {
              setIsSelectionMode(false);
              setSelectedMessages([]);
            }}
          >
            <ArrowLeft size={24} />
          </Button>
          <div className={`flex-1 ${textColor}`}>
            {selectedMessages.length} selected
          </div>
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full text-[#aebac1]"
              onClick={() => handleBulkAction('star')}
              disabled={selectedMessages.length === 0}
            >
              <Star size={20} />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full text-[#aebac1]"
              onClick={() => handleBulkAction('delete')}
              disabled={selectedMessages.length === 0}
            >
              <Trash size={20} />
            </Button>
          </div>
        </div>
      )}
      
      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto p-3 bg-repeat"
        style={{
          backgroundImage: theme === 'light'
            ? 'url("/light-chat-bg.png")'
            : 'url("/dark-chat-bg.png")'
        }}
      >
        {chat.messages.map((message: Message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'} mb-4`}
            onClick={() => isSelectionMode && toggleMessageSelection(message.id)}
          >
            <div 
              className={`
                relative max-w-[65%] p-2 rounded-lg group
                ${message.sender === 'me' ? myMessageBgColor : theirMessageBgColor}
                ${isSelectionMode ? 'cursor-pointer' : ''}
                ${selectedMessages.includes(message.id) ? 'opacity-50' : ''}
              `}
            >
              {message.replyTo && (
                <div className={`p-2 rounded mb-1 text-sm ${message.sender === 'me' ? 'bg-[#1f2c34]' : 'bg-[#1f2c34]'}`}>
                  <div className="font-medium text-[#00a884]">{message.replyTo.sender === 'me' ? 'You' : chat.name}</div>
                  <div className="text-[#e9edef]">{message.replyTo.content}</div>
                </div>
              )}
              <div className={`${textColor} text-base break-words`}>{message.content}</div>
              <div className={`text-xs ${secondaryTextColor} text-right mt-1`}>
                {message.time}
                {message.starred && <Star size={12} className="inline ml-1" />}
              </div>
              
              {/* Reactions */}
              {message.reactions && Object.entries(message.reactions).length > 0 && (
                <div className="absolute -bottom-6 right-2 flex items-center gap-1 z-10">
                  {Object.entries(message.reactions).map(([emoji, users]) => (
                    users.length > 0 && (
                      <div 
                        key={emoji} 
                        className={`
                          ${theme === 'light' ? 'bg-white' : 'bg-[#202c33]'} 
                          rounded-full px-2 py-0.5 text-xs flex items-center shadow-sm cursor-pointer
                          hover:scale-110 transition-transform duration-200
                        `}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReaction(message.id, emoji);
                        }}
                      >
                        <span className="mr-1">{emoji}</span>
                        <span className={secondaryTextColor}>{users.length}</span>
                      </div>
                    )
                  ))}
                </div>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 h-6 w-6 transition-opacity duration-200"
                  >
                    <MoreVertical size={14} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleReply(message)}>
                    <Reply className="mr-2" size={16} />
                    Reply
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleMessageAction(message.id, message.starred ? 'unstar' : 'star')}>
                    <Star className="mr-2" size={16} />
                    {message.starred ? 'Unstar message' : 'Star message'}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleMessageAction(message.id, 'delete')}>
                    <Trash className="mr-2" size={16} />
                    Delete message
                  </DropdownMenuItem>
                  {EMOJI_LIST.map(emoji => (
                    <DropdownMenuItem key={emoji} onClick={() => handleReaction(message.id, emoji)}>
                      {emoji} React
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
        {messageEffect && (
          <MessageEffect 
            key={messageEffect.timestamp}
            type={messageEffect.type} 
          />
        )}
      </div>
      
      {/* Reply preview */}
      {replyingTo && (
        <div className={`p-2 ${headerBgColor} border-t border-[#2a3942] flex items-center`}>
          <div className="flex-1">
            <div className="text-sm text-[#00a884]">
              Replying to {replyingTo.sender === 'me' ? 'yourself' : chat.name}
            </div>
            <div className="text-sm text-[#e9edef] truncate">{replyingTo.content}</div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-[#aebac1]"
            onClick={() => setReplyingTo(null)}
          >
            <ArrowLeft size={20} />
          </Button>
        </div>
      )}

      {/* Input */}
      <div className={`p-2 ${headerBgColor}`}>
        <div className={`flex items-center rounded-lg p-1 ${inputBgColor}`}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-[#aebac1]"
              >
                <Smile size={20} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <div className="grid grid-cols-5 gap-1 p-2">
                {EMOJI_LIST.map(emoji => (
                  <Button
                    key={emoji}
                    variant="ghost"
                    className="text-xl"
                    onClick={() => handleEmojiSelect(emoji)}
                  >
                    {emoji}
                  </Button>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <textarea
            className={`flex-1 resize-none outline-none p-2 ${inputBgColor} ${textColor}`}
            placeholder="Type a message"
            rows={1}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <Button
            variant="ghost"
            size="icon"
            className="text-[#aebac1] hover:text-white hover:bg-[#3c454c]"
            onClick={() => setShowGames(prev => !prev)}
          >
            <Gamepad2 className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {showGames && (
        <div className="absolute bottom-20 right-4 z-50">
          <GameLauncher 
            chatId={chatId} 
            onClose={() => setShowGames(false)} 
          />
        </div>
      )}
    </div>
  );
} 