"use client"

import { useState } from "react"
import ChatList from "./chat-list"
import ChatArea from "./chat-area"
import EmptyState from "./empty-state"
import ProfilePanel from "./profile-panel"
import { useWhatsApp } from "@/context/whatsapp-context"
import CreateGroupModal from "./create-group-modal"
import CreateCommunityModal from "./create-community-modal"
import Navigation from "./navigation"
import StarredMessagesPanel from "./starred-messages-panel"
import ContactInfoPanel from "./contact-info-panel"

export default function WhatsAppInterface() {
  const { selectedChat, setSelectedChat, theme } = useWhatsApp()
  const [showProfile, setShowProfile] = useState(false)
  const [showCreateGroup, setShowCreateGroup] = useState(false)
  const [showCreateCommunity, setShowCreateCommunity] = useState(false)
  const [showStarredMessages, setShowStarredMessages] = useState(false)
  const [showContactInfo, setShowContactInfo] = useState(false)

  const bgColor = theme === "light" ? "bg-gray-100" : "bg-[#111b21]"
  const borderColor = theme === "light" ? "border-gray-300" : "border-[#222e35]"

  return (
    <div className={`flex flex-col h-screen max-h-screen overflow-hidden ${bgColor}`}>
      <div className="flex-1 overflow-hidden flex flex-col relative">
        <div className="flex-1 flex overflow-hidden">
          <div
            className={`flex-none ${selectedChat ? "hidden md:block" : ""} w-full md:w-[400px] border-r ${borderColor}`}
          >
            <ChatList
              onSelectChat={setSelectedChat}
              onProfileClick={() => setShowProfile(true)}
              onCreateGroup={() => setShowCreateGroup(true)}
              onCreateCommunity={() => setShowCreateCommunity(true)}
              onShowStarredMessages={() => setShowStarredMessages(true)}
            />
          </div>

          <div className={`flex-grow ${!selectedChat ? "hidden md:flex" : "flex"}`}>
            {selectedChat ? (
              <ChatArea
                chatId={selectedChat}
                onBackClick={() => setSelectedChat(null)}
                onShowContactInfo={() => setShowContactInfo(true)}
              />
            ) : (
              <EmptyState />
            )}
          </div>

          {showProfile && (
            <div className="absolute inset-0 z-10 md:relative md:z-0 md:w-[400px] bg-[#111b21]">
              <ProfilePanel onClose={() => setShowProfile(false)} />
            </div>
          )}

          {showStarredMessages && (
            <div className="absolute inset-0 z-10 md:relative md:z-0 md:w-[400px] bg-[#111b21]">
              <StarredMessagesPanel onClose={() => setShowStarredMessages(false)} />
            </div>
          )}

          {showContactInfo && selectedChat && (
            <div className="absolute inset-0 z-10 md:relative md:z-0 md:w-[400px] bg-[#111b21]">
              <ContactInfoPanel chatId={selectedChat} onClose={() => setShowContactInfo(false)} />
            </div>
          )}
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 md:relative">
        <Navigation />
      </div>

      <CreateGroupModal isOpen={showCreateGroup} onClose={() => setShowCreateGroup(false)} />

      <CreateCommunityModal isOpen={showCreateCommunity} onClose={() => setShowCreateCommunity(false)} />
    </div>
  )
}

