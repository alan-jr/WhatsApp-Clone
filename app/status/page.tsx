"use client"

import { useState, useRef } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useWhatsApp } from "@/context/whatsapp-context"
import { ArrowLeft, Plus, Image as ImageIcon, Video, X, MoreVertical, Bell, BellOff, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import Navigation from "@/components/navigation"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Sample statuses from other users
const SAMPLE_STATUSES: Status[] = [
  {
    id: "s1",
    userId: "contact1",
    name: "Surya Kumar",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Surya",
    content: "https://images.pexels.com/photos/3621344/pexels-photo-3621344.jpeg",
    type: "image",
    caption: "Cycling in the woods! 🚴‍♂️",
    time: "Today, 9:30 AM",
    viewed: false
  },
  {
    id: "s2",
    userId: "contact2",
    name: "Priya Rangan",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
    content: "https://images.pexels.com/photos/1144687/pexels-photo-1144687.jpeg",
    type: "image",
    caption: "My photography skills are improving! 📸",
    time: "Today, 6:15 PM",
    viewed: false
  },
  {
    id: "s3",
    userId: "contact3",
    name: "Karthik Raja",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Karthik",
    content: "https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg",
    type: "image",
    caption: "Saptu sollunga 👨‍🍳",
    time: "Today, 2:45 PM",
    viewed: true
  },
  {
    id: "s4",
    userId: "contact4",
    name: "Meena Kumari",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Meena",
    content: "https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg",
    type: "image",
    caption: "Nature is beautiful! 🌿",
    time: "Today, 11:20 AM",
    viewed: false
  },
  {
    id: "s5",
    userId: "contact5",
    name: "Anbu Selvan",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Anbu",
    content: "https://images.pexels.com/photos/2983101/pexels-photo-2983101.jpeg",
    type: "image",
    caption: "KFC la oru pudii 🍔",
    time: "Today, 3:45 PM",
    viewed: false
  },
  {
    id: "s6",
    userId: "contact6",
    name: "Deepak",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lakshmi",
    content: "https://images.pexels.com/photos/2608517/pexels-photo-2608517.jpeg",
    type: "image",
    caption: "Pongal celebration at office 🎉",
    time: "Today, 1:30 PM",
    viewed: false
  }
]

interface MediaPreview {
  type: 'image' | 'video';
  url: string;
  file: File;
}

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
  muted?: boolean;
}

// Status media display component
const StatusMediaDisplay = ({ status }: { status: Status }) => {
  if (status.type === 'image') {
    return (
      <div className="relative aspect-video">
        <Image
          src={status.content}
          alt={status.caption || "Status"}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
        />
        {status.caption && (
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
            <p className="text-white">{status.caption}</p>
          </div>
        )}
      </div>
    )
  }
  return (
    <div className="p-6 text-center">
      <p className="text-xl text-[#e9edef]">{status.content}</p>
    </div>
  )
}

export default function StatusPage() {
  const { statuses, user, addStatus, markStatusAsViewed, deleteStatus } = useWhatsApp()
  const [isAddStatusOpen, setIsAddStatusOpen] = useState(false)
  const [newStatus, setNewStatus] = useState("")
  const [viewingStatus, setViewingStatus] = useState<Status | null>(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const [mutedStatuses, setMutedStatuses] = useState<Set<string>>(new Set())

  // Add scroll handler
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop
    setIsScrolled(scrollTop > 20)
  }

  const handleDeleteStatus = (statusId: string) => {
    deleteStatus(statusId)
    toast({
      title: "Status deleted",
      description: "Your status has been deleted successfully",
    })
  }

  const handleAddStatus = () => {
    if (!newStatus.trim()) {
      toast({
        title: "Content required",
        description: "Please add text for your status",
        variant: "destructive",
      })
      return
    }

    // Add the status
    addStatus(newStatus, 'text')
    setNewStatus("")
    setIsAddStatusOpen(false)

    toast({
      title: "Status updated",
      description: "Your status has been posted successfully",
    })
  }

  const handleViewStatus = (status: Status) => {
    setViewingStatus(status)
    if (status.id && !status.viewed) {
      markStatusAsViewed(status.id)
    }
  }

  // Combine WhatsApp context statuses with sample statuses
  const myStatuses = (statuses as Status[]).filter(status => status.userId === "me")
  const otherStatuses = SAMPLE_STATUSES // Only use sample statuses

  // Add mute/unmute function
  const toggleMuteStatus = (userId: string) => {
    setMutedStatuses(prev => {
      const newMuted = new Set(prev)
      if (newMuted.has(userId)) {
        newMuted.delete(userId)
        toast({
          title: "Status unmuted",
          description: "You will now see notifications for this status",
        })
      } else {
        newMuted.add(userId)
        toast({
          title: "Status muted",
          description: "You won't receive notifications for this status",
        })
      }
      return newMuted
    })
  }

  return (
    <div className="flex flex-col h-screen max-h-screen bg-[#111b21]">
      <div 
        className="flex-1 overflow-y-auto pb-16" 
        onScroll={handleScroll}
      >
        <div className="p-4">
          <div className="flex items-center mb-6">
            <Button variant="ghost" size="icon" className="mr-2 text-[#aebac1]" onClick={() => router.push("/chats")}>
              <ArrowLeft size={24} />
            </Button>
            <h1 className="text-xl font-bold text-[#e9edef]">Status</h1>
          </div>

          {/* My Status */}
          <div className="mb-6">
            <h2 className="text-sm font-medium text-[#8696a0] mb-3">My Status</h2>
            <div className="flex items-center">
              <div className="relative">
                <Avatar className="h-14 w-14 border-2 border-[#00a884]">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <Button
                  variant="default"
                  size="icon"
                  className="absolute -right-2 -bottom-2 h-8 w-8 rounded-full bg-[#00a884] hover:bg-[#008f72]"
                  onClick={() => setIsAddStatusOpen(true)}
                >
                  <Plus size={18} />
                </Button>
              </div>
              <div className="ml-4">
                <div className="font-medium text-[#e9edef]">My Status</div>
                <div className="text-xs text-[#8696a0]">
                  {myStatuses.length > 0
                    ? `${myStatuses.length} status update${myStatuses.length > 1 ? "s" : ""}`
                    : "Add text status"}
                </div>
              </div>
            </div>

            {myStatuses.length > 0 && (
              <div className="mt-3 space-y-2">
                {myStatuses.map((status) => (
                  <div
                    key={status.id}
                    className="flex items-center p-2 hover:bg-[#202c33] rounded-md"
                  >
                    <div
                      className="flex-1 cursor-pointer"
                      onClick={() => handleViewStatus(status as Status)}
                    >
                      <div className="text-sm text-[#e9edef]">{status.content}</div>
                      <div className="text-xs text-[#8696a0]">{status.time}</div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-[#aebac1]">
                          <MoreVertical size={20} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-[#233138] border-[#233138] text-[#e9edef]">
                        <DropdownMenuItem
                          className="hover:bg-[#182229] cursor-pointer text-red-500"
                          onClick={() => handleDeleteStatus(status.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* All Updates */}
          {otherStatuses.length > 0 && (
            <div>
              <h2 className="text-sm font-medium text-[#8696a0] mb-3">All Updates</h2>
              <div className="space-y-3">
                {otherStatuses.map((status) => (
                  <div
                    key={status.id}
                    className={`flex items-center p-2 hover:bg-[#202c33] rounded-md ${
                      mutedStatuses.has(status.userId) ? 'opacity-60' : ''
                    }`}
                  >
                    <div
                      className="flex-1 flex items-center cursor-pointer"
                      onClick={() => handleViewStatus(status as Status)}
                    >
                      <div className="relative">
                        <Avatar
                          className={`h-12 w-12 mr-3 border-2 ${status.viewed ? "border-[#8696a0]" : "border-[#00a884]"}`}
                        >
                          {status.type === 'image' ? (
                            <div className="w-full h-full relative">
                              <Image
                                src={status.content}
                                alt={status.name}
                                fill
                                className="object-cover rounded-full"
                              />
                            </div>
                          ) : (
                            <>
                              <AvatarImage src={status.avatar} alt={status.name} />
                              <AvatarFallback>{status.name.substring(0, 2)}</AvatarFallback>
                            </>
                          )}
                        </Avatar>
                      </div>
                      <div>
                        <div className="flex items-center">
                          <span className="font-medium text-[#e9edef]">{status.name}</span>
                          {mutedStatuses.has(status.userId) && (
                            <BellOff size={14} className="ml-2 text-[#8696a0]" />
                          )}
                        </div>
                        <div className="text-xs text-[#8696a0] flex items-center">
                          <span>{status.time}</span>
                          {status.type === 'image' && (
                            <span className="ml-2 text-[#00a884]">Photo</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-[#aebac1]">
                          <MoreVertical size={20} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-[#233138] border-[#233138] text-[#e9edef]">
                        <DropdownMenuItem
                          className="hover:bg-[#182229] cursor-pointer"
                          onClick={() => toggleMuteStatus(status.userId)}
                        >
                          {mutedStatuses.has(status.userId) ? (
                            <>
                              <BellOff className="mr-2 h-4 w-4" />
                              <span>Unmute</span>
                            </>
                          ) : (
                            <>
                              <Bell className="mr-2 h-4 w-4" />
                              <span>Mute</span>
                            </>
                          )}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Navigation */}
      <div className={`fixed bottom-0 left-0 right-0 bg-[#202c33] border-t border-[#222e35] p-4 transition-all duration-200 ${
        isScrolled ? 'shadow-lg shadow-black/25' : ''
      }`}>
        <Navigation />
      </div>

      {/* Add Status Dialog */}
      <Dialog open={isAddStatusOpen} onOpenChange={setIsAddStatusOpen}>
        <DialogContent className="bg-[#111b21] text-[#e9edef] border-[#222e35]">
          <DialogHeader>
            <DialogTitle className="text-[#e9edef]">Update Status</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label htmlFor="status-text" className="text-[#aebac1]">
                What's on your mind?
              </Label>
              <Input
                id="status-text"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                placeholder="Type your status..."
                className="bg-[#2a3942] border-none focus-visible:ring-0 text-[#d1d7db] placeholder:text-[#8696a0]"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <Button
                variant="outline"
                onClick={() => setIsAddStatusOpen(false)}
                className="border-[#aebac1] text-[#aebac1] hover:bg-[#202c33] hover:text-[#e9edef]"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleAddStatus} 
                className="bg-[#00a884] text-white hover:bg-[#008f72]"
                disabled={!newStatus.trim()}
              >
                Post Status
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Status Dialog */}
      <Dialog open={!!viewingStatus} onOpenChange={() => setViewingStatus(null)}>
        <DialogContent className="bg-[#111b21] text-[#e9edef] border-[#222e35] max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#e9edef]">View Status</DialogTitle>
          </DialogHeader>

          <div className="flex items-center mb-4">
            <Avatar className="h-10 w-10 mr-3">
              <AvatarImage src={viewingStatus?.avatar} alt={viewingStatus?.name} />
              <AvatarFallback>{viewingStatus?.name?.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center">
                <span className="font-medium">{viewingStatus?.name}</span>
                {viewingStatus && mutedStatuses.has(viewingStatus.userId) && (
                  <BellOff size={14} className="ml-2 text-[#8696a0]" />
                )}
              </div>
              <div className="text-xs text-[#8696a0]">{viewingStatus?.time}</div>
            </div>
          </div>

          <div className="bg-[#202c33] rounded-lg overflow-hidden">
            {viewingStatus && <StatusMediaDisplay status={viewingStatus} />}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

