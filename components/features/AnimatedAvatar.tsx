"use client"

import { useState, useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface AnimatedAvatarProps {
  imageUrl: string
  videoUrl?: string
  name: string
  size?: 'sm' | 'md' | 'lg'
  onHover?: () => void
}

const sizeClasses = {
  sm: 'h-8 w-8',
  md: 'h-12 w-12',
  lg: 'h-16 w-16'
}

export function AnimatedAvatar({ 
  imageUrl, 
  videoUrl, 
  name, 
  size = 'md',
  onHover 
}: AnimatedAvatarProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)

  const handleMouseEnter = () => {
    setIsHovered(true)
    if (onHover) onHover()
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
  }

  return (
    <div 
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Avatar className={sizeClasses[size]}>
        <AvatarImage src={imageUrl} alt={name} className={isHovered && videoUrl ? 'opacity-0' : 'opacity-100'} />
        <AvatarFallback>{name.substring(0, 2)}</AvatarFallback>
      </Avatar>
      
      {videoUrl && isHovered && (
        <video
          src={videoUrl}
          autoPlay
          loop
          muted
          playsInline
          className={`absolute top-0 left-0 w-full h-full rounded-full object-cover transition-opacity duration-200 ${isVideoLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoadedData={() => setIsVideoLoaded(true)}
        />
      )}
    </div>
  )
} 