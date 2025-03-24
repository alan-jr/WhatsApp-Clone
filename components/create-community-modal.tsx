"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useWhatsApp } from "@/context/whatsapp-context"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Textarea } from "@/components/ui/textarea"

interface CreateCommunityModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function CreateCommunityModal({ isOpen, onClose }: CreateCommunityModalProps) {
  const [communityName, setCommunityName] = useState("")
  const [description, setDescription] = useState("")
  const [selectedGroups, setSelectedGroups] = useState<string[]>([])
  const { chats, createCommunity } = useWhatsApp()
  const router = useRouter()
  const { toast } = useToast()

  const groups = Object.values(chats).filter((chat: any) => chat.isGroup)

  const handleGroupToggle = (groupId: string) => {
    setSelectedGroups((prev) =>
      prev.includes(groupId) ? prev.filter(id => id !== groupId) : [...prev, groupId]
    )
  }

  const handleCreateCommunity = () => {
    if (!communityName.trim()) {
      toast({
        title: "Community name required",
        description: "Please enter a name for your community",
        variant: "destructive",
      })
      return
    }

    if (selectedGroups.length === 0) {
      toast({
        title: "No groups selected",
        description: "Please select at least one group for your community",
        variant: "destructive",
      })
      return
    }

    createCommunity(communityName, description, selectedGroups)

    toast({
      title: "Community created",
      description: `${communityName} has been created successfully`,
    })

    onClose()
    setCommunityName("")
    setDescription("")
    setSelectedGroups([])
    router.push("/chats")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#111b21] text-[#e9edef] border-[#222e35]">
        <DialogHeader>
          <DialogTitle className="text-[#e9edef]">Create New Community</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label htmlFor="community-name" className="text-[#aebac1]">
              Community Name
            </Label>
            <Input
              id="community-name"
              value={communityName}
              onChange={(e) => setCommunityName(e.target.value)}
              placeholder="Enter community name"
              className="bg-[#2a3942] border-none focus-visible:ring-0 text-[#d1d7db] placeholder:text-[#8696a0]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-[#aebac1]">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter community description"
              className="bg-[#2a3942] border-none focus-visible:ring-0 text-[#d1d7db] placeholder:text-[#8696a0]"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[#aebac1]">Select Groups</Label>
            <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
              {groups.map((group: any) => (
                <div key={group.id} className="flex items-center space-x-3 p-2 hover:bg-[#202c33] rounded-md">
                  <Checkbox
                    id={`group-${group.id}`}
                    checked={selectedGroups.includes(group.id)}
                    onCheckedChange={() => handleGroupToggle(group.id)}
                    className="border-[#aebac1] data-[state=checked]:bg-[#00a884] data-[state=checked]:border-[#00a884]"
                  />
                  <Label
                    htmlFor={`group-${group.id}`}
                    className="flex items-center space-x-3 cursor-pointer flex-1"
                  >
                    <div className="font-medium">{group.name}</div>
                    <div className="text-xs text-[#8696a0]">{group.members.length} members</div>
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="border-[#aebac1] text-[#aebac1] hover:bg-[#202c33] hover:text-[#e9edef]"
            >
              Cancel
            </Button>
            <Button onClick={handleCreateCommunity} className="bg-[#00a884] text-white hover:bg-[#008f72]">
              Create Community
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 