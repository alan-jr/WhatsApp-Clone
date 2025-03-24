import React, { useState } from 'react';
import { Languages } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MessageTranslationProps {
  content: string;
  onTranslate: (translatedText: string) => void;
}

const LANGUAGES = [
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'ar', name: 'Arabic' },
];

export const MessageTranslation: React.FC<MessageTranslationProps> = ({
  content,
  onTranslate,
}) => {
  const [isTranslating, setIsTranslating] = useState(false);

  const translateText = async (targetLang: string) => {
    setIsTranslating(true);
    try {
      // Replace this with your preferred translation API
      const response = await fetch('https://api.translation-service.com/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_TRANSLATION_API_KEY}`,
        },
        body: JSON.stringify({
          text: content,
          target_language: targetLang,
        }),
      });

      const data = await response.json();
      onTranslate(data.translatedText);
    } catch (error) {
      console.error('Translation error:', error);
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={`p-1.5 rounded-full hover:bg-secondary transition-colors ${
            isTranslating ? 'opacity-50 cursor-wait' : ''
          }`}
          disabled={isTranslating}
        >
          <Languages className="w-4 h-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {LANGUAGES.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => translateText(lang.code)}
            className="cursor-pointer"
          >
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}; 