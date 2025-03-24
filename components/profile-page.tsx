"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useWhatsApp } from "@/context/whatsapp-context"
import { ArrowLeft, Edit, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import Navigation from "./navigation"
import { useToast } from "@/hooks/use-toast"

export default function ProfilePage() {
  const { user, updateUser } = useWhatsApp()
  const [name, setName] = useState(user.name)
  const [about, setAbout] = useState(user.about)
  const [phone, setPhone] = useState(user.phone)
  const [isEditing, setIsEditing] = useState(false)
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

    setIsEditing(false)

    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully",
    })
  }

  return (
    <div className="flex flex-col h-screen max-h-screen overflow-hidden">
      <div className="flex-1 overflow-y-auto bg-[#111b21]">
        <div className="flex items-center p-4 bg-[#202c33]">
          <Button variant="ghost" size="icon" className="mr-2 text-[#aebac1]" onClick={() => router.push("/chats")}>
            <ArrowLeft size={24} />
          </Button>
          <h1 className="text-xl font-medium text-[#e9edef]">Profile</h1>
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto text-[#aebac1]"
            onClick={() => setIsEditing(!isEditing)}
          >
            <Edit size={20} />
          </Button>
        </div>

        {/* Profile Info */}
        <div className="flex flex-col items-center p-6">
          <Avatar className="h-32 w-32 mb-4">
            <AvatarImage src={user.avatar} alt="Your profile" />
            <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <Button
            variant="outline"
            size="sm"
            className="text-[#aebac1] border-[#aebac1] hover:bg-[#202c33] hover:text-[#e9edef]"
          >
            <Edit className="mr-2 h-4 w-4" /> Change Profile Photo
          </Button>
        </div>

        {/* Details */}
        <div className="p-4 space-y-4">
          <div className="text-[#e9edef]">
            <Label className="block text-sm font-medium text-[#aebac1] mb-1">Your name</Label>
            {isEditing ? (
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full rounded-md bg-[#202c33] border-none text-[#d1d7db] shadow-sm focus:ring-0 focus:border-[#00a884] p-2"
              />
            ) : (
              <div className="p-2 bg-[#202c33] rounded-md">{user.name}</div>
            )}
          </div>

          <div className="text-[#e9edef]">
            <Label className="block text-sm font-medium text-[#aebac1] mb-1">About</Label>
            {isEditing ? (
              <Input
                type="text"
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                className="mt-1 block w-full rounded-md bg-[#202c33] border-none text-[#d1d7db] shadow-sm focus:ring-0 focus:border-[#00a884] p-2"
              />
            ) : (
              <div className="p-2 bg-[#202c33] rounded-md">{user.about}</div>
            )}
          </div>

          <div className="text-[#e9edef]">
            <Label className="block text-sm font-medium text-[#aebac1] mb-1">Phone</Label>
            {isEditing ? (
              <Input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1 block w-full rounded-md bg-[#202c33] border-none text-[#d1d7db] shadow-sm focus:ring-0 focus:border-[#00a884] p-2"
              />
            ) : (
              <div className="p-2 bg-[#202c33] rounded-md">{user.phone}</div>
            )}
          </div>

          {isEditing && (
            <div className="flex justify-end space-x-2 pt-2">
              <Button
                variant="outline"
                onClick={() => {
                  setName(user.name)
                  setAbout(user.about)
                  setPhone(user.phone)
                  setIsEditing(false)
                }}
                className="border-[#aebac1] text-[#aebac1] hover:bg-[#202c33] hover:text-[#e9edef]"
              >
                Cancel
              </Button>
              <Button onClick={handleSaveProfile} className="bg-[#00a884] text-white hover:bg-[#008f72]">
                Save
              </Button>
            </div>
          )}
        </div>

        <div className="p-4 mt-4">
          <Button variant="destructive" className="w-full justify-start">
            <LogOut className="mr-2 h-4 w-4" /> Log out
          </Button>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 md:relative">
        <Navigation />
      </div>
    </div>
  )
}

