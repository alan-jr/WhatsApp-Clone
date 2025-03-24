import React, { useState, useRef } from 'react';
import { Smile, Paperclip, Send, Mic, MapPin, BarChart2, GamepadIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { VoiceRecorder } from './VoiceRecorder';
import { MessageTranslation } from './MessageTranslation';
import { PollCreator } from './PollCreator';
import { LocationSharing } from './LocationSharing';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

interface ChatInputProps {
  onSendMessage: (content: string, type: string) => void;
  onSendVoice: (blob: Blob) => void;
  onCreatePoll: (poll: { question: string; options: string[]; expiresIn: number }) => void;
  onShareLocation: (location: { latitude: number; longitude: number; address?: string }) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  onSendVoice,
  onCreatePoll,
  onShareLocation,
}) => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [showPollCreator, setShowPollCreator] = useState(false);
  const [showLocationSharing, setShowLocationSharing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message.trim(), 'text');
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleEmojiSelect = (emoji: any) => {
    const input = inputRef.current;
    if (input) {
      const start = input.selectionStart || 0;
      const end = input.selectionEnd || 0;
      const newMessage = 
        message.substring(0, start) + 
        emoji.native + 
        message.substring(end);
      
      setMessage(newMessage);
      
      // Set cursor position after emoji
      setTimeout(() => {
        input.selectionStart = input.selectionEnd = start + emoji.native.length;
        input.focus();
      }, 0);
    }
  };

  return (
    <div className="p-4 border-t bg-background">
      {showPollCreator ? (
        <PollCreator
          onCreatePoll={(poll) => {
            onCreatePoll(poll);
            setShowPollCreator(false);
          }}
          onCancel={() => setShowPollCreator(false)}
        />
      ) : showLocationSharing ? (
        <LocationSharing
          onShareLocation={(location) => {
            onShareLocation(location);
            setShowLocationSharing(false);
          }}
          onCancel={() => setShowLocationSharing(false)}
        />
      ) : isRecording ? (
        <VoiceRecorder
          onSendVoice={(blob) => {
            onSendVoice(blob);
            setIsRecording(false);
          }}
        />
      ) : (
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="shrink-0">
                <Smile className="w-5 h-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent side="top" className="w-auto p-0">
              <Picker
                data={data}
                onEmojiSelect={handleEmojiSelect}
                theme="light"
                previewPosition="none"
              />
            </PopoverContent>
          </Popover>

          <Button
            variant="ghost"
            size="icon"
            className="shrink-0"
            onClick={() => setShowPollCreator(true)}
          >
            <BarChart2 className="w-5 h-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="shrink-0"
            onClick={() => setShowLocationSharing(true)}
          >
            <MapPin className="w-5 h-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="shrink-0"
          >
            <GamepadIcon className="w-5 h-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="shrink-0"
            onClick={() => setIsRecording(true)}
          >
            <Mic className="w-5 h-5" />
          </Button>

          <div className="flex-1 flex items-center gap-2">
            <Input
              ref={inputRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message"
              className="flex-1"
            />
          </div>

          {message.trim() && (
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0"
              onClick={handleSend}
            >
              <Send className="w-5 h-5" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}; 