import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface NavigationProps {
  onClose?: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ onClose }) => {
  const router = useRouter();

  const handleBack = () => {
    if (onClose) {
      onClose();
    } else {
      router.back();
    }
  };

  return (
    <div className="flex items-center gap-4 p-4 bg-background border-b">
      <Button
        variant="ghost"
        size="icon"
        onClick={handleBack}
        className="shrink-0"
      >
        <ArrowLeft className="w-5 h-5" />
      </Button>
      
      <div className="flex-1">
        <h1 className="text-lg font-semibold">Status</h1>
        <p className="text-sm text-muted-foreground">
          Share updates with your contacts
        </p>
      </div>
    </div>
  );
};

export default Navigation; 