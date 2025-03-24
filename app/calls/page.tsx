"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Phone, PhoneIncoming, PhoneOutgoing, Video } from "lucide-react"
import Navigation from "@/components/navigation"
import { useWhatsApp } from "@/context/whatsapp-context"
import CallingInterface from "@/components/calling-interface"
import type { Call } from "@/context/whatsapp-context"

export default function CallsPage() {
  const { calls, addCall } = useWhatsApp()
  const [activeCall, setActiveCall] = useState<{
    contact: { name: string; avatar: string }
    isVideo: boolean
  } | null>(null)

  const handleCall = (call: Call, isVideo: boolean = false) => {
    const newCall: Call = {
      id: `call-${Date.now()}`,
      name: call.name,
      avatar: call.avatar,
      type: "outgoing",
      time: new Date().toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true,
        timeZone: 'UTC'
      }),
      missed: false,
      callType: isVideo ? "video" : "audio"
    }
    addCall(newCall)
    
    setActiveCall({
      contact: {
        name: call.name,
        avatar: call.avatar
      },
      isVideo
    })
  }

  const handleEndCall = () => {
    setActiveCall(null)
  }

  return (
    <main className="flex flex-col h-screen max-h-screen overflow-hidden bg-[#111b21]">
      <div className="flex-1 overflow-y-auto p-4 pb-20 md:pb-4">
        <h1 className="text-xl font-bold text-[#e9edef] mb-4">Calls</h1>

        <div className="space-y-4">
          {calls.map((call) => (
            <div
              key={call.id}
              className="flex items-center p-3 hover:bg-[#202c33] rounded-lg cursor-pointer"
            >
              <Avatar className="h-12 w-12 mr-4">
                <AvatarImage src={call.avatar} alt={call.name} />
                <AvatarFallback>{call.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="font-medium text-[#e9edef]">{call.name}</div>
                <div className="flex items-center text-sm">
                  {call.type === "incoming" ? (
                    <PhoneIncoming size={14} className={call.missed ? "text-red-500" : "text-[#00a884]"} />
                  ) : (
                    <PhoneOutgoing size={14} className="text-[#00a884]" />
                  )}
                  <span className="ml-2 text-[#8696a0]">{call.time}</span>
                  <span className="ml-2 text-[#8696a0]">({call.callType})</span>
                </div>
              </div>
              <div className="flex gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-[#00a884] hover:bg-[#202c33]"
                  onClick={() => handleCall(call, false)}
                >
                  <Phone size={20} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-[#00a884] hover:bg-[#202c33]"
                  onClick={() => handleCall(call, true)}
                >
                  <Video size={20} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 md:relative z-40 bg-[#202c33] border-t border-[#222e35]">
        <Navigation />
      </div>

      {activeCall && (
        <CallingInterface
          contact={activeCall.contact}
          isVideo={activeCall.isVideo}
          onEnd={handleEndCall}
        />
      )}
    </main>
  )
}

