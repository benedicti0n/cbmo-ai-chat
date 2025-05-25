import { useEffect, useRef, useState } from 'react';
import { Button } from './button';
import { Loader2 } from 'lucide-react';

interface CustomModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
  theme?: 'light' | 'dark';
}

export function CustomModal({
  isOpen,
  onClose,
  title,
  description,
  onConfirm,
  confirmText = 'Delete',
  cancelText = 'Cancel',
  theme = 'light',
}: CustomModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Close modal when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    // Add event listener if modal is open
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
    } else {
      document.body.style.overflow = 'unset';
    }

    // Clean up
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
      <div
        ref={modalRef}
        className={`relative w-full max-w-md p-6 rounded-lg shadow-xl transform transition-all border border-[#6A4DFC] ${theme === 'light' ? 'bg-[#E1DBFE]' : 'bg-[#231E40]'}`}
      >
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="mb-6 text-sm">{description}</p>

        <div className="flex justify-end space-x-3">
          <Button
            variant="default"
            onClick={onClose}
          >
            {cancelText}
          </Button>
          <Button
            variant="ghost"
            onClick={async () => {
              setIsLoading(true);
              await onConfirm();
              onClose();
              setIsLoading(false);
            }}
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
