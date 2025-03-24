"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

interface Status {
  id: string;
  userId: string;
  name: string;
  avatar: string;
  time: string;
  content: string;
  type: string;
  caption?: string;
  viewed: boolean;
}

interface User {
  id: string
  name: string
  avatar: string
  about: string
  status: Status[]
}

export interface MessageData {
  content: string
  replyTo?: Message
  type?: 'text' | 'game' | 'effect'
}

export interface Message extends MessageData {
  id: string
  sender: string
  time: string
  starred: boolean
}

export interface Chat {
  id: string
  name: string
  avatar: string
  lastMessage: string
  time: string
  unread: number
  online: string
  messages: Message[]
  muted: boolean
}

export interface Call {
  id: string
  name: string
  avatar: string
  type: 'incoming' | 'outgoing'
  time: string
  missed: boolean
  callType: 'audio' | 'video'
}

// Initial data
const formatTime = () => {
  const now = new Date();
  return now.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true,
    timeZone: 'UTC'  // Use UTC to ensure consistent formatting
  });
};

const INITIAL_TIMESTAMP = "9:00 AM"; // Use a fixed timestamp for initial data

const INITIAL_CHATS: Record<string, Chat> = {
  "1": {
    id: "1",
    name: "Family Group 👨‍👩‍👧‍👦",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=FamilyGroup",
    lastMessage: "Mom: Don't forget about Sunday lunch! 🍝",
    time: INITIAL_TIMESTAMP,
    unread: 3,
    online: "5 participants",
    muted: false,
    messages: [
      {
        id: "fam1",
        content: "Hey everyone! Just a reminder about Sunday lunch at our place 🏠",
        sender: "Mom",
        time: INITIAL_TIMESTAMP,
        starred: false
      },
      {
        id: "fam2",
        content: "What time should we come?",
        sender: "me",
        time: INITIAL_TIMESTAMP,
        starred: false
      },
      {
        id: "fam3",
        content: "Around 1 PM would be perfect! I'm making lasagna 😊",
        sender: "Mom",
        time: INITIAL_TIMESTAMP,
        starred: false
      },
      {
        id: "fam4",
        content: "Can I bring anything?",
        sender: "Sarah",
        time: INITIAL_TIMESTAMP,
        starred: false
      },
      {
        id: "fam5",
        content: "Maybe some dessert? 🍰",
        sender: "Mom",
        time: INITIAL_TIMESTAMP,
        starred: false
      }
    ]
  },
  "2": {
    id: "2",
    name: "Book Club 📚",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=BookClub",
    lastMessage: "What did everyone think of chapter 5? 🤔",
    time: INITIAL_TIMESTAMP,
    unread: 5,
    online: "8 participants",
    muted: false,
    messages: [
      {
        id: "book1",
        content: "Just finished chapter 5 - wow, what a plot twist! 😱",
        sender: "Emily",
        time: INITIAL_TIMESTAMP,
        starred: false
      },
      {
        id: "book2",
        content: "I know right? I didn't see that coming at all!",
        sender: "me",
        time: INITIAL_TIMESTAMP,
        starred: true
      },
      {
        id: "book3",
        content: "The character development is incredible",
        sender: "James",
        time: INITIAL_TIMESTAMP,
        starred: false
      },
      {
        id: "book4",
        content: "What do you think will happen next? Any theories? 🤔",
        sender: "Emily",
        time: INITIAL_TIMESTAMP,
        starred: false
      }
    ]
  },
  "3": {
    id: "3",
    name: "Travel Planning ✈️",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=TravelGroup",
    lastMessage: "I found some great flight deals! 🎉",
    time: INITIAL_TIMESTAMP,
    unread: 2,
    online: "4 participants",
    muted: false,
    messages: [
      {
        id: "travel1",
        content: "Hey everyone! I found some amazing deals for our summer trip ✈️",
        sender: "Alex",
        time: INITIAL_TIMESTAMP,
        starred: false
      },
      {
        id: "travel2",
        content: "Share the links! 👀",
        sender: "me",
        time: INITIAL_TIMESTAMP,
        starred: false
      },
      {
        id: "travel3",
        content: "Round trip to Barcelona for $500! Should we book it?",
        sender: "Alex",
        time: INITIAL_TIMESTAMP,
        starred: true
      },
      {
        id: "travel4",
        content: "That's an incredible deal! When are the dates?",
        sender: "Maria",
        time: INITIAL_TIMESTAMP,
        starred: false
      },
      {
        id: "travel5",
        content: "July 15-29. Perfect for summer break! 🌞",
        sender: "Alex",
        time: INITIAL_TIMESTAMP,
        starred: false
      }
    ]
  },
  "4": {
    id: "4",
    name: "Alice Smith",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice",
    lastMessage: "See you at the coffee shop! ☕",
    time: INITIAL_TIMESTAMP,
    unread: 1,
    online: "online",
    muted: false,
    messages: [
      {
        id: "alice1",
        content: "Hey! Are you free for coffee today? ☕",
        sender: "Alice Smith",
        time: INITIAL_TIMESTAMP,
        starred: false
      },
      {
        id: "alice2",
        content: "Yes! What time works for you?",
        sender: "me",
        time: INITIAL_TIMESTAMP,
        starred: false
      },
      {
        id: "alice3",
        content: "How about 3 PM at our usual spot?",
        sender: "Alice Smith",
        time: INITIAL_TIMESTAMP,
        starred: false
      },
      {
        id: "alice4",
        content: "Perfect! See you there 😊",
        sender: "me",
        time: INITIAL_TIMESTAMP,
        starred: false
      },
      {
        id: "alice5",
        content: "See you at the coffee shop! ☕",
        sender: "Alice Smith",
        time: INITIAL_TIMESTAMP,
        starred: false
      }
    ]
  },
  "5": {
    id: "5",
    name: "Work Project Team 💼",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=WorkTeam",
    lastMessage: "Updated the presentation slides 📊",
    time: INITIAL_TIMESTAMP,
    unread: 4,
    online: "6 participants",
    muted: false,
    messages: [
      {
        id: "work1",
        content: "I've just pushed the latest changes to the main branch 👨‍💻",
        sender: "David",
        time: INITIAL_TIMESTAMP,
        starred: true
      },
      {
        id: "work2",
        content: "Great! I'll review it this afternoon",
        sender: "me",
        time: INITIAL_TIMESTAMP,
        starred: false
      },
      {
        id: "work3",
        content: "Don't forget we have the client meeting tomorrow at 10 AM 📅",
        sender: "Sarah",
        time: INITIAL_TIMESTAMP,
        starred: true
      },
      {
        id: "work4",
        content: "I've updated the presentation slides with the latest metrics",
        sender: "David",
        time: INITIAL_TIMESTAMP,
        starred: false
      },
      {
        id: "work5",
        content: "Could everyone review them before tomorrow? 🙏",
        sender: "Sarah",
        time: INITIAL_TIMESTAMP,
        starred: false
      }
    ]
  },
  "6": {
    id: "6",
    name: "Gym Buddies 💪",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=GymBuddies",
    lastMessage: "New workout plan for this week! 🏋️‍♂️",
    time: INITIAL_TIMESTAMP,
    unread: 2,
    online: "3 participants",
    muted: false,
    messages: [
      {
        id: "gym1",
        content: "Morning! Ready for leg day? 🦵",
        sender: "Mike",
        time: INITIAL_TIMESTAMP,
        starred: false
      },
      {
        id: "gym2",
        content: "Always ready! What time are you heading to the gym?",
        sender: "me",
        time: INITIAL_TIMESTAMP,
        starred: false
      },
      {
        id: "gym3",
        content: "I've created a new workout plan for this week, check it out! 💪",
        sender: "Mike",
        time: INITIAL_TIMESTAMP,
        starred: true
      },
      {
        id: "gym4",
        content: "Looks intense! I'm in 💪",
        sender: "Chris",
        time: INITIAL_TIMESTAMP,
        starred: false
      },
      {
        id: "gym5",
        content: "Let's crush it! See you guys at 6 PM 🏋️‍♂️",
        sender: "Mike",
        time: INITIAL_TIMESTAMP,
        starred: false
      }
    ]
  }
}

const INITIAL_CONTACTS = [
  {
    id: "1",
    name: "John Doe",
    avatar: "/placeholder.svg?height=200&width=200",
    phone: "+1 234-567-8901",
    about: "Hey there! I'm using WhatsApp.",
  },
  {
    id: "4",
    name: "Alice Smith",
    avatar: "/placeholder.svg?height=200&width=200",
    phone: "+1 345-678-9012",
    about: "Available",
  },
  {
    id: "5",
    name: "Bob Johnson",
    avatar: "/placeholder.svg?height=200&width=200",
    phone: "+1 456-789-0123",
    about: "At work",
  },
  {
    id: "6",
    name: "Emma Wilson",
    avatar: "/placeholder.svg?height=200&width=200",
    phone: "+1 567-890-1234",
    about: "Busy",
  },
  {
    id: "7",
    name: "Michael Brown",
    avatar: "/placeholder.svg?height=200&width=200",
    phone: "+1 678-901-2345",
    about: "Available",
  },
  {
    id: "8",
    name: "Olivia Davis",
    avatar: "/placeholder.svg?height=200&width=200",
    phone: "+1 789-012-3456",
    about: "At the gym",
  },
]

const INITIAL_STATUSES: Status[] = []

const INITIAL_CALLS: Call[] = [
  {
    id: "1",
    name: "Arthur Morgan",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    type: "outgoing",
    time: "Today, 10:30 AM",
    missed: false,
    callType: "audio"
  },
  {
    id: "2",
    name: "Freddtnathan",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice",
    type: "incoming",
    time: "Yesterday, 2:15 PM",
    missed: true,
    callType: "video"
  },
  {
    id: "3",
    name: "Micah",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob",
    type: "outgoing",
    time: "Yesterday, 11:45 AM",
    missed: false,
    callType: "audio"
  }
]

const INITIAL_COMMUNITIES = [
  {
    id: "1",
    name: "Room-74",
    avatar: "/placeholder.svg?height=200&width=200",
    description: "Community for our neighborhood",
    groups: ["2"],
  },
]

const INITIAL_USER = {
  name: "Your Name",
  avatar: "/placeholder.svg?height=200&width=200",
  about: "Available",
  phone: "+1 123-456-7890",
}

// Context type
type WhatsAppContextType = {
  chats: Record<string, Chat>
  contacts: User[]
  statuses: Status[]
  calls: Call[]
  communities: any[]
  user: User
  selectedChat: string | null
  theme: "light" | "dark"
  setTheme: (theme: "light" | "dark") => void
  setSelectedChat: (chatId: string | null) => void
  setChats: (chats: Record<string, Chat> | ((prev: Record<string, Chat>) => Record<string, Chat>)) => void
  sendMessage: (chatId: string, messageData: MessageData) => void
  createGroup: (name: string, members: string[]) => string
  addStatus: (content: string, type: string, caption?: string) => void
  updateUser: (userData: Partial<User>) => void
  markStatusAsViewed: (statusId: string) => void
  addCall: (call: Call) => void
  markMessagesAsRead: (chatId: string) => void
  starMessage: (chatId: string, messageId: string) => void
  unstarMessage: (chatId: string, messageId: string) => void
  getStarredMessages: () => any[]
  deleteMessage: (chatId: string, messageId: string) => void
  clearMessages: (chatId: string) => void
  deleteChat: (chatId: string) => void
  toggleMuteChat: (chatId: string) => void
  createCommunity: (name: string, description: string, groups: string[]) => void
  uploadProfileImage: (imageUrl: string) => void
  markChatAsRead: (chatId: string) => void
  addChat: (chat: Chat) => void
  deleteStatus: (statusId: string) => void
  updateChat: (chatId: string, message: string) => void
}

// Create context
const WhatsAppContext = createContext<WhatsAppContextType | undefined>(undefined)

// Provider component
export const WhatsAppProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User>({
    id: "me",
    name: "John Doe",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    about: "Available",
    status: []
  })

  const [chats, setChats] = useState<Record<string, Chat>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('chats')
      return saved ? JSON.parse(saved) : INITIAL_CHATS
    }
    return INITIAL_CHATS
  })

  const contacts = INITIAL_CONTACTS.map((c: { id: string; name: string; avatar: string; phone: string; about: string }) => ({
    ...c,
    status: []
  }))

  const [statuses, setStatuses] = useState<Status[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("whatsapp-statuses")
      if (saved) {
        try {
          const parsedStatuses = JSON.parse(saved)
          return Array.isArray(parsedStatuses) ? parsedStatuses as Status[] : INITIAL_STATUSES
        } catch {
          return INITIAL_STATUSES
        }
      }
    }
    return INITIAL_STATUSES
  })

  const [calls, setCalls] = useState<Call[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("whatsapp-calls")
      if (saved) {
        try {
          const parsedCalls = JSON.parse(saved)
          return Array.isArray(parsedCalls) ? parsedCalls as Call[] : INITIAL_CALLS
        } catch {
          return INITIAL_CALLS
        }
      }
    }
    return INITIAL_CALLS
  })

  const [communities, setCommunities] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("whatsapp-communities")
      return saved ? JSON.parse(saved) : INITIAL_COMMUNITIES
    }
    return INITIAL_COMMUNITIES
  })

  const [selectedChat, setSelectedChat] = useState<string | null>(null)

  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("whatsapp-theme")
      return saved ? JSON.parse(saved) : "dark"
    }
    return "dark"
  })

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("whatsapp-chats", JSON.stringify(chats))
      localStorage.setItem("whatsapp-contacts", JSON.stringify(contacts))
      localStorage.setItem("whatsapp-statuses", JSON.stringify(statuses))
      localStorage.setItem("whatsapp-calls", JSON.stringify(calls))
      localStorage.setItem("whatsapp-communities", JSON.stringify(communities))
      localStorage.setItem("whatsapp-user", JSON.stringify(user))
      localStorage.setItem("whatsapp-theme", JSON.stringify(theme))
    }
  }, [chats, contacts, statuses, calls, communities, user, theme])

  // Function to send a message
  const sendMessage = (chatId: string, messageData: MessageData) => {
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      content: messageData.content,
      sender: 'me',
      time: formatTime(),
      starred: false,
      replyTo: messageData.replyTo,
      type: messageData.type
    }

    setChats(prev => ({
      ...prev,
      [chatId]: {
        ...prev[chatId],
        messages: [...prev[chatId].messages, newMessage],
        lastMessage: messageData.content,
        time: formatTime()
      }
    }))
  }

  // Function to create a new group
  const createGroup = (name: string, memberIds: string[]) => {
    if (!name.trim() || memberIds.length === 0) return ""

    const groupId = `group-${Date.now()}`
    const members = memberIds.map((id) => {
      const contact = contacts.find((c) => c.id === id)
      return contact ? contact.name : id
    })

    members.push("Me")

    const newGroup: Chat = {
      id: groupId,
      name,
      avatar: "/placeholder.svg?height=200&width=200",
      online: "online",
      messages: [],
      muted: false,
      lastMessage: "",
      time: new Date().toLocaleTimeString(),
      unread: 0
    }

    setChats((prev) => ({
      ...prev,
      [groupId]: newGroup
    }))

    return groupId
  }

  // Function to add a new status
  const addStatus = (content: string, type: string, caption?: string) => {
    if (!content.trim() && type === "text") return

    const newStatus: Status = {
      id: `status-${Date.now()}`,
      userId: "me",
      name: user.name,
      avatar: user.avatar,
      time: `Today, ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
      content,
      type,
      caption,
      viewed: false,
    }

    setStatuses((prevStatuses: Status[]) => [newStatus, ...prevStatuses])
  }

  // Function to update user profile
  const updateUser = (userData: Partial<User>) => {
    setUser((prev) => ({
      ...prev,
      ...userData,
    }))
  }

  // Function to mark status as viewed
  const markStatusAsViewed = (statusId: string) => {
    setStatuses((prev) => prev.map((status) => (status.id === statusId ? { ...status, viewed: true } : status)))
  }

  // Function to add a call
  const addCall = (call: Call) => {
    setCalls((prevCalls: Call[]) => [call, ...prevCalls])
  }

  // Function to mark messages as read
  const markMessagesAsRead = (chatId: string) => {
    setChats((prev) => {
      if (!prev[chatId]) return prev

      return {
        ...prev,
        [chatId]: {
          ...prev[chatId],
          messages: prev[chatId].messages.map((msg: any) => ({
            ...msg,
            read: true,
          })),
        },
      }
    })
  }

  // Function to star a message
  const starMessage = (chatId: string, messageId: string) => {
    setChats((prev) => {
      if (!prev[chatId]) return prev

      return {
        ...prev,
        [chatId]: {
          ...prev[chatId],
          messages: prev[chatId].messages.map((msg: any) => (msg.id === messageId ? { ...msg, starred: true } : msg)),
        },
      }
    })
  }

  // Function to unstar a message
  const unstarMessage = (chatId: string, messageId: string) => {
    setChats((prev) => {
      if (!prev[chatId]) return prev

      return {
        ...prev,
        [chatId]: {
          ...prev[chatId],
          messages: prev[chatId].messages.map((msg: any) => (msg.id === messageId ? { ...msg, starred: false } : msg)),
        },
      }
    })
  }

  // Function to get all starred messages
  const getStarredMessages = () => {
    const starredMessages: {
      id: string;
      content: string;
      sender: string;
      time: string;
      starred: boolean;
      chatId: string;
      chatName: string;
    }[] = []

    Object.values(chats).forEach((chat: Chat) => {
      chat.messages.forEach((msg: Message) => {
        if (msg.starred) {
          starredMessages.push({
            ...msg,
            chatId: chat.id,
            chatName: chat.name,
          })
        }
      })
    })

    return starredMessages
  }

  // Function to delete a message
  const deleteMessage = (chatId: string, messageId: string) => {
    setChats((prev) => {
      if (!prev[chatId]) return prev

      return {
        ...prev,
        [chatId]: {
          ...prev[chatId],
          messages: prev[chatId].messages.filter((msg: any) => msg.id !== messageId),
        },
      }
    })
  }

  // Function to clear all messages in a chat
  const clearMessages = (chatId: string) => {
    setChats((prev) => {
      if (!prev[chatId]) return prev

      return {
        ...prev,
        [chatId]: {
          ...prev[chatId],
          messages: [],
        },
      }
    })
  }

  // Function to delete a chat
  const deleteChat = (chatId: string) => {
    setChats((prev) => {
      const newChats = { ...prev }
      delete newChats[chatId]
      return newChats
    })

    if (selectedChat === chatId) {
      setSelectedChat(null)
    }
  }

  // Function to toggle mute status of a chat
  const toggleMuteChat = (chatId: string) => {
    setChats((prev) => {
      if (!prev[chatId]) return prev

      return {
        ...prev,
        [chatId]: {
          ...prev[chatId],
          muted: !prev[chatId].muted,
        },
      }
    })
  }

  // Function to create a new community
  const createCommunity = (name: string, description: string, groupIds: string[]) => {
    if (!name.trim()) return

    const communityId = `community-${Date.now()}`

    const newCommunity = {
      id: communityId,
      name,
      avatar: "/placeholder.svg?height=200&width=200",
      description,
      groups: groupIds,
    }

    setCommunities((prev: typeof INITIAL_COMMUNITIES) => [...prev, newCommunity])
  }

  // Function to upload a profile image
  const uploadProfileImage = (imageUrl: string) => {
    setUser((prev: User) => ({
      ...prev,
      avatar: imageUrl,
    }))
  }

  const markChatAsRead = (chatId: string) => {
    setChats((prev: Record<string, Chat>) => ({
      ...prev,
      [chatId]: {
        ...prev[chatId],
        unread: 0
      }
    }))
  }

  const addChat = (chat: Chat) => {
    setChats(prev => ({
      ...prev,
      [chat.id]: {
        ...chat,
        messages: chat.messages || [],
        lastMessage: chat.lastMessage || '',
        time: chat.time || INITIAL_TIMESTAMP,
        unread: chat.unread || 0,
        muted: chat.muted || false
      }
    }))
  }

  const deleteStatus = (statusId: string) => {
    setStatuses((prevStatuses: Status[]) => prevStatuses.filter((status: Status) => status.id !== statusId))
  }

  const updateChat = (chatId: string, message: string) => {
    setChats(prev => ({
      ...prev,
      [chatId]: {
        ...prev[chatId],
        lastMessage: message,
        time: formatTime(),
        unread: prev[chatId].unread + 1
      }
    }))
  }

  return (
    <WhatsAppContext.Provider
      value={{
        chats,
        contacts,
        statuses,
        calls,
        communities,
        user,
        selectedChat,
        theme,
        setTheme,
        setSelectedChat,
        setChats,
        sendMessage,
        createGroup,
        addStatus,
        updateUser,
        markStatusAsViewed,
        addCall,
        markMessagesAsRead,
        starMessage,
        unstarMessage,
        getStarredMessages,
        deleteMessage,
        clearMessages,
        deleteChat,
        toggleMuteChat,
        createCommunity,
        uploadProfileImage,
        markChatAsRead,
        addChat,
        deleteStatus,
        updateChat,
      }}
    >
      {children}
    </WhatsAppContext.Provider>
  )
}

// Custom hook to use the context
export function useWhatsApp() {
  const context = useContext(WhatsAppContext)
  if (context === undefined) {
    throw new Error("useWhatsApp must be used within a WhatsAppProvider")
  }
  return context
}

export { WhatsAppContext }

