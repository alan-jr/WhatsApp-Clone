"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useWhatsApp } from "@/context/whatsapp-context"
import { ArrowLeft, Camera } from "lucide-react"
import { useRouter } from "next/navigation"
import Navigation from "@/components/navigation"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

// Sample data for the usage graph
const usageData = [
  { day: 'Mon', minutes: 45 },
  { day: 'Tue', minutes: 30 },
  { day: 'Wed', minutes: 60 },
  { day: 'Thu', minutes: 25 },
  { day: 'Fri', minutes: 45 },
  { day: 'Sat', minutes: 90 },
  { day: 'Sun', minutes: 75 },
]

export default function ProfilePage() {
  const { user, updateUser } = useWhatsApp()
  const [isEditing, setIsEditing] = useState(false)
  const [editedUser, setEditedUser] = useState({
    name: user.name,
    status: user.status || "Hey there! I'm using WhatsApp",
    avatar: user.avatar
  })
  const router = useRouter()
  const { toast } = useToast()

  const handleSave = () => {
    updateUser(editedUser)
    setIsEditing(false)
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully",
    })
  }

  return (
    <div className="flex flex-col h-screen bg-[#111b21]">
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <div className="flex items-center mb-6">
            <Button variant="ghost" size="icon" className="mr-2 text-[#aebac1]" onClick={() => router.push("/chats")}>
              <ArrowLeft size={24} />
            </Button>
            <h1 className="text-xl font-bold text-[#e9edef]">Profile</h1>
          </div>

          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-[#202c33]">
              <TabsTrigger value="profile" className="text-[#aebac1]">Profile</TabsTrigger>
              <TabsTrigger value="stats" className="text-[#aebac1]">Stats</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <div className="flex flex-col items-center mt-6">
                <div className="relative">
                  <Avatar className="h-40 w-40">
                    <AvatarImage src={editedUser.avatar} alt={editedUser.name} />
                    <AvatarFallback>{editedUser.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <Button
                      variant="default"
                      size="icon"
                      className="absolute bottom-2 right-2 bg-[#00a884] hover:bg-[#008f72]"
                    >
                      <Camera size={20} />
                    </Button>
                  )}
                </div>

                <div className="w-full max-w-md mt-8 space-y-4">
                  {isEditing ? (
                    <>
                      <div>
                        <Label htmlFor="name" className="text-[#aebac1]">Name</Label>
                        <Input
                          id="name"
                          value={editedUser.name}
                          onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                          className="bg-[#2a3942] border-none text-[#e9edef]"
                        />
                      </div>
                      <div>
                        <Label htmlFor="status" className="text-[#aebac1]">Status</Label>
                        <Input
                          id="status"
                          value={editedUser.status}
                          onChange={(e) => setEditedUser({ ...editedUser, status: e.target.value })}
                          className="bg-[#2a3942] border-none text-[#e9edef]"
                        />
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => setIsEditing(false)}
                          variant="outline"
                          className="flex-1 border-[#aebac1] text-[#aebac1]"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleSave}
                          className="flex-1 bg-[#00a884] text-white hover:bg-[#008f72]"
                        >
                          Save
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <Label className="text-[#aebac1]">Name</Label>
                        <p className="text-[#e9edef] text-lg">{editedUser.name}</p>
                      </div>
                      <div>
                        <Label className="text-[#aebac1]">Status</Label>
                        <p className="text-[#e9edef]">{editedUser.status}</p>
                      </div>
                      <Button
                        onClick={() => setIsEditing(true)}
                        className="w-full bg-[#00a884] text-white hover:bg-[#008f72]"
                      >
                        Edit Profile
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="stats">
              <div className="mt-6 space-y-6">
                {/* Usage Graph */}
                <div className="bg-[#202c33] p-4 rounded-lg">
                  <h3 className="text-[#aebac1] mb-4">Daily Usage</h3>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={usageData}>
                        <XAxis 
                          dataKey="day" 
                          stroke="#aebac1"
                          tick={{ fill: '#aebac1' }}
                        />
                        <YAxis 
                          stroke="#aebac1"
                          tick={{ fill: '#aebac1' }}
                          label={{ 
                            value: 'Minutes', 
                            angle: -90, 
                            position: 'insideLeft',
                            fill: '#aebac1'
                          }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#233138',
                            border: 'none',
                            borderRadius: '8px',
                            color: '#e9edef'
                          }}
                        />
                        <Bar 
                          dataKey="minutes" 
                          fill="#00a884"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Existing stats cards */}
                <div className="bg-[#202c33] p-4 rounded-lg">
                  <h3 className="text-[#aebac1] mb-2">Messages</h3>
                  <p className="text-2xl font-bold text-[#e9edef]">53</p>
                  <p className="text-sm text-[#8696a0]">Total messages sent and received</p>
                </div>

                <div className="bg-[#202c33] p-4 rounded-lg">
                  <h3 className="text-[#aebac1] mb-2">Calls</h3>
                  <p className="text-2xl font-bold text-[#e9edef]">29</p>
                  <p className="text-sm text-[#8696a0]">67 minutes total</p>
                </div>

                <div className="bg-[#202c33] p-4 rounded-lg">
                  <h3 className="text-[#aebac1] mb-2">Status Updates</h3>
                  <p className="text-2xl font-bold text-[#e9edef]">12</p>
                  <p className="text-sm text-[#8696a0]">Status updates shared</p>
                </div>

                <div className="bg-[#202c33] p-4 rounded-lg">
                  <h3 className="text-[#aebac1] mb-2">Groups</h3>
                  <p className="text-2xl font-bold text-[#e9edef]">4</p>
                  <p className="text-sm text-[#8696a0]">Active group chats</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <div className="bg-[#202c33] border-t border-[#222e35] p-4">
        <Navigation />
      </div>
    </div>
  )
}

