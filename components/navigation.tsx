"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { MessageSquare, Phone, CircleUser, Image } from "lucide-react"
import { useWhatsApp } from "@/context/whatsapp-context"

export default function Navigation() {
  const pathname = usePathname()
  const { theme } = useWhatsApp()

  const bgColor = theme === "light" ? "bg-white" : "bg-[#202c33]"
  const textColor = theme === "light" ? "text-gray-800" : "text-[#aebac1]"
  const activeColor = theme === "light" ? "text-[#00a884]" : "text-[#00a884]"

  return (
    <div
      className={`${bgColor} flex justify-around py-3 border-t ${theme === "light" ? "border-gray-300" : "border-[#222e35]"}`}
    >
      <Link href="/chats" className={`flex flex-col items-center ${pathname === "/chats" ? activeColor : textColor}`}>
        <MessageSquare size={24} />
        <span className="text-xs mt-1">Chats</span>
      </Link>
      <Link href="/status" className={`flex flex-col items-center ${pathname === "/status" ? activeColor : textColor}`}>
        <Image size={24} />
        <span className="text-xs mt-1">Status</span>
      </Link>
      <Link href="/calls" className={`flex flex-col items-center ${pathname === "/calls" ? activeColor : textColor}`}>
        <Phone size={24} />
        <span className="text-xs mt-1">Calls</span>
      </Link>
      <Link
        href="/profile"
        className={`flex flex-col items-center ${pathname === "/profile" ? activeColor : textColor}`}
      >
        <CircleUser size={24} />
        <span className="text-xs mt-1">Profile</span>
      </Link>
    </div>
  )
}

