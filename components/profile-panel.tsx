"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useState } from "react"
import { Edit, LogOut } from "lucide-react"
import { useWhatsApp } from "@/context/whatsapp-context"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export default function ProfilePanel({ onClose }: { onClose: () => void }) {
  const { user, updateUser } = useWhatsApp()
  const [name, setName] = useState(user.name)
  const [about, setAbout] = useState(user.about)
  const [phone, setPhone] = useState(user.phone)
  const router = useRouter()
  const { toast } = useToast()

  const handleSaveProfile = () => {
    if (!name.trim()) {
      toast({
        title: "Name required",
        description: "Please enter your name",
        variant: "destructive",
      })
      return
    }

    updateUser({
      name,
      about,
      phone,
    })

    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully",
    })

    onClose()
  }

  return (
    <div className="flex flex-col h-full bg-[#111b21]">
      {/* Header */}
      <div className="flex items-center justify-between p-3 bg-[#202c33]">
        <Button variant="ghost" className="text-[#aebac1]" onClick={onClose}>
          Back
        </Button>
        <span className="text-[#e9edef] font-medium">Profile</span>
        <div></div>
      </div>

      {/* Profile Info */}
      <div className="flex flex-col items-center p-4">
        <Avatar className="h-32 w-32 mb-4">
          <AvatarImage src={user.avatar} alt="Your profile" />
          <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
        </Avatar>
        <Button variant="outline" size="sm" className="text-[#aebac1] border-[#aebac1] hover:bg-[#202c33]">
          <Edit className="mr-2 h-4 w-4" /> Edit
        </Button>
      </div>

      {/* Details */}
      <div className="p-4">
        <div className="text-[#e9edef] mb-2">
          <label className="block text-sm font-medium text-[#aebac1]">Your name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md bg-[#202c33] border-none text-[#d1d7db] shadow-sm focus:ring-0 focus:border-[#00a884] p-2"
          />
        </div>
        <div className="text-[#e9edef] mb-2">
          <label className="block text-sm font-medium text-[#aebac1]">About</label>
          <input
            type="text"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            className="mt-1 block w-full rounded-md bg-[#202c33] border-none text-[#d1d7db] shadow-sm focus:ring-0 focus:border-[#00a884] p-2"
          />
        </div>
        <div className="text-[#e9edef] mb-2">
          <label className="block text-sm font-medium text-[#aebac1]">Phone</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-1 block w-full rounded-md bg-[#202c33] border-none text-[#d1d7db] shadow-sm focus:ring-0 focus:border-[#00a884] p-2"
          />
        </div>

        <div className="flex justify-end space-x-2 mt-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-[#aebac1] text-[#aebac1] hover:bg-[#202c33] hover:text-[#e9edef]"
          >
            Cancel
          </Button>
          <Button onClick={handleSaveProfile} className="bg-[#00a884] text-white hover:bg-[#008f72]">
            Save
          </Button>
        </div>
      </div>

      <div className="mt-auto p-4">
        <Button
          variant="destructive"
          className="w-full justify-start"
          onClick={() => {
            toast({
              title: "Logged out",
              description: "You have been logged out successfully",
            })
            router.push("/")
          }}
        >
          <LogOut className="mr-2 h-4 w-4" /> Log out
        </Button>
      </div>
    </div>
  )
}

