"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useWhatsApp } from "@/context/whatsapp-context"
import { ArrowLeft, ArrowDownLeft, ArrowUpRight, Phone, Video, Search, Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import Navigation from "./navigation"
import { useToast } from "@/hooks/use-toast"

export default function CallsPage() {
  const { calls, contacts, addCall } = useWhatsApp()
  const [isNewCallOpen, setIsNewCallOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  const filteredContacts = contacts.filter(
    (contact) => contact.name.toLowerCase().includes(searchQuery.toLowerCase()) || contact.phone.includes(searchQuery),
  )

  const handleMakeCall = (contact: any, callType: "audio" | "video") => {
    // Add call to history
    const newCall = {
      id: `call-${Date.now()}`,
      name: contact.name,
      avatar: contact.avatar,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      type: "outgoing",
      callType,
      missed: false,
    }

    addCall(newCall)
    setIsNewCallOpen(false)

    // Show toast notification
    toast({
      title: `${callType.charAt(0).toUpperCase() + callType.slice(1)} Call`,
      description: `Calling ${contact.name}...`,
    })
  }

  return (
    <div className="flex flex-col h-screen max-h-screen overflow-hidden">
      <div className="flex-1 overflow-y-auto bg-[#111b21]">
        <div className="flex items-center p-4">
          <Button variant="ghost" size="icon" className="mr-2 text-[#aebac1]" onClick={() => router.push("/chats")}>
            <ArrowLeft size={24} />
          </Button>
          <h1 className="text-xl font-bold text-[#e9edef]">Calls</h1>
          <Button variant="ghost" size="icon" className="ml-auto text-[#aebac1]" onClick={() => setIsNewCallOpen(true)}>
            <Plus size={24} />
          </Button>
        </div>

        {/* Call History */}
        <div className="px-4">
          {calls.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-[#8696a0]">No call history</p>
            </div>
          ) : (
            <div className="space-y-2">
              {calls.map((call) => (
                <div key={call.id} className="flex items-center p-3 hover:bg-[#202c33] rounded-md">
                  <Avatar className="h-12 w-12 mr-3">
                    <AvatarImage src={call.avatar} alt={call.name} />
                    <AvatarFallback>{call.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-medium text-[#e9edef]">{call.name}</div>
                    <div className="flex items-center text-xs">
                      {call.type === "incoming" ? (
                        <ArrowDownLeft size={14} className={call.missed ? "text-red-500" : "text-[#00a884]"} />
                      ) : (
                        <ArrowUpRight size={14} className="text-[#00a884]" />
                      )}
                      <span className={`ml-1 ${call.missed ? "text-red-500" : "text-[#8696a0]"}`}>{call.time}</span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-[#00a884]"
                    onClick={() => handleMakeCall({ name: call.name, avatar: call.avatar }, call.callType)}
                  >
                    {call.callType === "audio" ? <Phone size={20} /> : <Video size={20} />}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 md:relative">
        <Navigation />
      </div>

      {/* New Call Dialog */}
      <Dialog open={isNewCallOpen} onOpenChange={setIsNewCallOpen}>
        <DialogContent className="bg-[#111b21] text-[#e9edef] border-[#222e35]">
          <DialogHeader>
            <DialogTitle className="text-[#e9edef]">New Call</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            <div className="flex items-center bg-[#202c33] rounded-lg px-3 py-1.5">
              <Search size={18} className="text-[#aebac1] mr-2" />
              <Input
                type="text"
                placeholder="Search contacts"
                className="bg-transparent border-none focus-visible:ring-0 text-[#d1d7db] placeholder:text-[#8696a0] h-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
              {filteredContacts.map((contact) => (
                <div key={contact.id} className="flex items-center p-3 hover:bg-[#202c33] rounded-md">
                  <Avatar className="h-12 w-12 mr-3">
                    <AvatarImage src={contact.avatar} alt={contact.name} />
                    <AvatarFallback>{contact.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-medium text-[#e9edef]">{contact.name}</div>
                    <div className="text-xs text-[#8696a0]">{contact.phone}</div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-[#00a884]"
                      onClick={() => handleMakeCall(contact, "audio")}
                    >
                      <Phone size={20} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-[#00a884]"
                      onClick={() => handleMakeCall(contact, "video")}
                    >
                      <Video size={20} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

