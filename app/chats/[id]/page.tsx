"use client"

import { useState, useRef } from "react"
import { Mic, Paperclip, X, Image as ImageIcon, Video, FileText, MapPin, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { useWhatsApp } from "@/context/whatsapp-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function ChatPage({ params }: { params: { id: string } }) {
  const { sendMessage } = useWhatsApp()
  const [newMessage, setNewMessage] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [showAttachments, setShowAttachments] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const { toast } = useToast()

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      sendMessage(params.id, {
        type: 'text',
        content: newMessage
      })
      setNewMessage("")
      toast({
        title: "Message sent",
        description: "Your message has been sent successfully",
      })
    }
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      
      const audioChunks: BlobPart[] = []
      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data)
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/mp3' })
        const audioUrl = URL.createObjectURL(audioBlob)
        // Here you would typically upload the audio and send it as a message
        console.log('Audio recorded:', audioUrl)
      }

      mediaRecorder.start()
      setIsRecording(true)
      
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    } catch (error) {
      console.error('Error accessing microphone:', error)
      toast({
        title: "Error",
        description: "Could not access microphone",
        variant: "destructive",
      })
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop())
    }
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current)
    }
    setIsRecording(false)
    setRecordingTime(0)
  }

  const handleAttachment = (type: string) => {
    const input = document.createElement('input')
    input.type = 'file'
    
    switch (type) {
      case 'image':
        input.accept = 'image/*'
        break
      case 'video':
        input.accept = 'video/*'
        break
      case 'document':
        input.accept = '.pdf,.doc,.docx,.txt'
        break
    }

    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        // Here you would typically upload the file and send it as a message
        console.log('File selected:', file)
        toast({
          title: "File attached",
          description: `${file.name} ready to send`,
        })
      }
    }

    input.click()
  }

  return (
    <div className="flex flex-col h-screen bg-[#111b21]">
      {/* ... existing header code ... */}

      {/* ... existing messages code ... */}

      <div className="p-4 bg-[#202c33] border-t border-[#222e35]">
        <div className="flex items-center space-x-4">
          <DropdownMenu open={showAttachments} onOpenChange={setShowAttachments}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-[#aebac1] hover:bg-[#2a3942]">
                <Paperclip size={24} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-[#233138] border-[#233138] text-[#e9edef]">
              <DropdownMenuItem onClick={() => handleAttachment('image')} className="cursor-pointer">
                <ImageIcon className="mr-2 h-4 w-4" />
                <span>Image</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAttachment('video')} className="cursor-pointer">
                <Video className="mr-2 h-4 w-4" />
                <span>Video</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAttachment('document')} className="cursor-pointer">
                <FileText className="mr-2 h-4 w-4" />
                <span>Document</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAttachment('location')} className="cursor-pointer">
                <MapPin className="mr-2 h-4 w-4" />
                <span>Location</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex-1">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message"
              className="bg-[#2a3942] border-none focus-visible:ring-0 text-[#d1d7db] placeholder:text-[#8696a0]"
            />
          </div>

          {isRecording ? (
            <div className="flex items-center space-x-2">
              <span className="text-red-500 animate-pulse">●</span>
              <span className="text-[#aebac1]">{recordingTime}s</span>
              <Button
                variant="ghost"
                size="icon"
                className="text-red-500 hover:bg-[#2a3942]"
                onClick={stopRecording}
              >
                <X size={24} />
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="text-[#aebac1] hover:bg-[#2a3942]"
              onClick={newMessage.trim() ? handleSendMessage : startRecording}
            >
              {newMessage.trim() ? (
                <Send size={24} />
              ) : (
                <Mic size={24} />
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
} 