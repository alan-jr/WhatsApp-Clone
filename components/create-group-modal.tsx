"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useWhatsApp } from "@/context/whatsapp-context"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface CreateGroupModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function CreateGroupModal({ isOpen, onClose }: CreateGroupModalProps) {
  const [groupName, setGroupName] = useState("")
  const [selectedContacts, setSelectedContacts] = useState<string[]>([])
  const { contacts, createGroup, setSelectedChat } = useWhatsApp()
  const router = useRouter()
  const { toast } = useToast()

  const handleContactToggle = (contactId: string) => {
    setSelectedContacts((prev) =>
      prev.includes(contactId) ? prev.filter((id) => id !== contactId) : [...prev, contactId],
    )
  }

  const handleCreateGroup = () => {
    if (!groupName.trim()) {
      toast({
        title: "Group name required",
        description: "Please enter a name for your group",
        variant: "destructive",
      })
      return
    }

    if (selectedContacts.length === 0) {
      toast({
        title: "No contacts selected",
        description: "Please select at least one contact for your group",
        variant: "destructive",
      })
      return
    }

    const newGroupId = createGroup(groupName, selectedContacts)

    toast({
      title: "Group created",
      description: `${groupName} has been created successfully`,
    })

    onClose()
    setGroupName("")
    setSelectedContacts([])

    if (newGroupId) {
      setSelectedChat(newGroupId)
      router.push("/chats")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#111b21] text-[#e9edef] border-[#222e35]">
        <DialogHeader>
          <DialogTitle className="text-[#e9edef]">Create New Group</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label htmlFor="group-name" className="text-[#aebac1]">
              Group Name
            </Label>
            <Input
              id="group-name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Enter group name"
              className="bg-[#2a3942] border-none focus-visible:ring-0 text-[#d1d7db] placeholder:text-[#8696a0]"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[#aebac1]">Select Contacts</Label>
            <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
              {contacts.map((contact) => (
                <div key={contact.id} className="flex items-center space-x-3 p-2 hover:bg-[#202c33] rounded-md">
                  <Checkbox
                    id={`contact-${contact.id}`}
                    checked={selectedContacts.includes(contact.id)}
                    onCheckedChange={() => handleContactToggle(contact.id)}
                    className="border-[#aebac1] data-[state=checked]:bg-[#00a884] data-[state=checked]:border-[#00a884]"
                  />
                  <Label
                    htmlFor={`contact-${contact.id}`}
                    className="flex items-center space-x-3 cursor-pointer flex-1"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={contact.avatar} alt={contact.name} />
                      <AvatarFallback>{contact.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{contact.name}</div>
                      <div className="text-xs text-[#8696a0]">{contact.phone}</div>
                    </div>
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
            <Button onClick={handleCreateGroup} className="bg-[#00a884] text-white hover:bg-[#008f72]">
              Create Group
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

