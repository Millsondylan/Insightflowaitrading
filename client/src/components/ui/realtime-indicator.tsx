
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface RealtimeIndicatorProps {
  isConnected?: boolean;
  className?: string;
  showText?: boolean;
}

export function RealtimeIndicator({ 
  isConnected = false, 
  className, 
  showText = true 
}: RealtimeIndicatorProps) {
  const [isBlinking, setIsBlinking] = useState(false);

  useEffect(() => {
    if (isConnected) {
      const interval = setInterval(() => {
        setIsBlinking(prev => !prev);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isConnected]);

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative">
        <div
          className={cn(
            "w-2 h-2 rounded-full transition-all duration-300",
            isConnected 
              ? isBlinking 
                ? "bg-green-500 shadow-lg shadow-green-500/50" 
                : "bg-green-400"
              : "bg-red-500"
          )}
        />
        {isConnected && (
          <div
            className={cn(
              "absolute inset-0 w-2 h-2 rounded-full bg-green-500 animate-ping",
              isBlinking ? "opacity-75" : "opacity-0"
            )}
          />
        )}
      </div>
      {showText && (
        <span className={cn(
          "text-xs font-medium",
          isConnected ? "text-green-600" : "text-red-600"
        )}>
          {isConnected ? "Connected" : "Disconnected"}
        </span>
      )}
    </div>
  );
}

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
