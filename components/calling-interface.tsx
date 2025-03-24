"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Button } from "./ui/button"
import { Phone, Mic, Video, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface CallingInterfaceProps {
  contact: {
    name: string
    avatar: string
    status?: string
  }
  isVideo?: boolean
  onEnd: () => void
}

export default function CallingInterface({ contact, isVideo = false, onEnd }: CallingInterfaceProps) {
  const [callDuration, setCallDuration] = useState(0)
  const [callStatus, setCallStatus] = useState<"calling" | "connected">("calling")

  useEffect(() => {
    // Simulate call connection after 2 seconds
    const connectionTimer = setTimeout(() => {
      setCallStatus("connected")
    }, 2000)

    // Start call duration timer when connected
    let durationTimer: NodeJS.Timer
    if (callStatus === "connected") {
      durationTimer = setInterval(() => {
        setCallDuration((prev) => prev + 1)
      }, 1000)
    }

    return () => {
      clearTimeout(connectionTimer)
      if (durationTimer) clearInterval(durationTimer)
    }
  }, [callStatus])

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="fixed inset-0 bg-[#111b21] flex flex-col items-center justify-between p-6 z-50">
      {/* Contact Info */}
      <div className="flex flex-col items-center mt-12">
        <Avatar className={cn(
          "h-32 w-32 mb-4",
          callStatus === "calling" && "animate-pulse"
        )}>
          <AvatarImage src={contact.avatar} alt={contact.name} />
          <AvatarFallback>{contact.name.substring(0, 2)}</AvatarFallback>
        </Avatar>
        <h2 className="text-2xl font-semibold text-[#e9edef] mb-2">{contact.name}</h2>
        <p className="text-[#8696a0]">
          {callStatus === "calling" ? "Calling..." : formatDuration(callDuration)}
        </p>
      </div>

      {/* Call Controls */}
      <div className="flex items-center gap-8 mb-12">
        <Button
          variant="ghost"
          size="icon"
          className="h-14 w-14 rounded-full bg-[#202c33] hover:bg-[#283841]"
          onClick={() => {
            // Toggle microphone
          }}
        >
          <Mic className="h-6 w-6 text-[#aebac1]" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-14 w-14 rounded-full bg-[#ef4444] hover:bg-[#dc2626]"
          onClick={onEnd}
        >
          <Phone className="h-6 w-6 text-white rotate-225" />
        </Button>
        {isVideo && (
          <Button
            variant="ghost"
            size="icon"
            className="h-14 w-14 rounded-full bg-[#202c33] hover:bg-[#283841]"
            onClick={() => {
              // Toggle video
            }}
          >
            <Video className="h-6 w-6 text-[#aebac1]" />
          </Button>
        )}
      </div>
    </div>
  )
} 