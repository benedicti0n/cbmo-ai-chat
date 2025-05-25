import React, { useState } from 'react';
import { useThemeStore } from '@/stores/useThemeStore';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'right' | 'bottom' | 'left';
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const { theme } = useThemeStore();

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  };

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="inline-block"
      >
        {children}
      </div>
      {isVisible && (
        <div
          className={`absolute z-[60] px-3 py-1.5 text-xs font-medium rounded-md shadow-lg whitespace-nowrap ${positionClasses[position]
            } ${className || `${theme === "light" ? "bg-[#E1DBFE]" : "bg-[#231E40] text-white"} `}`}
        >
          {content}
          <div
            className={`absolute w-2 h-2 bg-inherit transform rotate-45 ${position === 'top' ? 'bottom-[-0.25rem] left-1/2 -translate-x-1/2'
              : position === 'right' ? 'left-[-0.25rem] top-1/2 -translate-y-1/2'
                : position === 'bottom' ? 'top-[-0.25rem] left-1/2 -translate-x-1/2'
                  : 'right-[-0.25rem] top-1/2 -translate-y-1/2'
              }`}
          />
        </div>
      )}
    </div>
  );
};

export default Tooltip;
