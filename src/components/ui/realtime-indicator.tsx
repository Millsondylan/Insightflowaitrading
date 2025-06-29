import React, { useState, useEffect } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Loader2, Mic, Wifi, BrainCircuit } from 'lucide-react';

const indicatorVariants = cva(
  "flex items-center gap-1.5 text-xs font-medium rounded-full px-2 py-1 transition-all",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        realtime: "bg-green-500/10 text-green-500 border border-green-500/20",
        voice: "bg-blue-500/10 text-blue-500 border border-blue-500/20",
        ai: "bg-purple-500/10 text-purple-500 border border-purple-500/20",
        loading: "bg-amber-500/10 text-amber-500 border border-amber-500/20",
        error: "bg-red-500/10 text-red-500 border border-red-500/20",
      },
      size: {
        sm: "text-[10px] px-1.5 py-0.5",
        default: "text-xs px-2 py-1",
        lg: "text-sm px-2.5 py-1.5",
      },
      position: {
        inline: "",
        "top-left": "fixed top-2 left-2 z-50",
        "top-right": "fixed top-2 right-2 z-50",
        "bottom-left": "fixed bottom-2 left-2 z-50",
        "bottom-right": "fixed bottom-2 right-2 z-50",
        "top-center": "fixed top-2 left-1/2 -translate-x-1/2 z-50",
        "bottom-center": "fixed bottom-2 left-1/2 -translate-x-1/2 z-50",
      },
      pulse: {
        true: "animate-pulse",
        false: "",
      },
      fadeOut: {
        true: "",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      position: "inline",
      pulse: false,
      fadeOut: false,
    },
  }
);

export interface RealtimeIndicatorProps extends
  React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof indicatorVariants> {
  isActive: boolean;
  showIcon?: boolean;
  activeText?: string;
  inactiveText?: string;
  autoHide?: boolean;
  autoHideDelay?: number;
  showCountdown?: boolean;
}

export const RealtimeIndicator = React.forwardRef<HTMLDivElement, RealtimeIndicatorProps>(
  ({
    className,
    variant = "realtime",
    size = "default",
    position = "top-right",
    pulse = true,
    fadeOut = true,
    isActive,
    showIcon = true,
    activeText = "Live",
    inactiveText,
    autoHide = false,
    autoHideDelay = 3000,
    showCountdown = false,
    ...props
  }, ref) => {
    const [visible, setVisible] = useState(isActive);
    const [countdown, setCountdown] = useState(autoHideDelay / 1000);
    
    // Handle visibility based on active state and auto-hide
    useEffect(() => {
      if (isActive) {
        setVisible(true);
        setCountdown(autoHideDelay / 1000);
      } else if (!inactiveText) {
        if (autoHide) {
          const timer = setTimeout(() => {
            setVisible(false);
          }, autoHideDelay);
          return () => clearTimeout(timer);
        }
      }
    }, [isActive, autoHide, autoHideDelay, inactiveText]);
    
    // Handle countdown timer
    useEffect(() => {
      let interval: NodeJS.Timeout | null = null;
      
      if (showCountdown && autoHide && isActive) {
        interval = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              if (interval) clearInterval(interval);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
      
      return () => {
        if (interval) clearInterval(interval);
      };
    }, [showCountdown, autoHide, isActive, autoHideDelay]);
    
    if (!visible && !inactiveText) return null;
    
    const iconMap = {
      realtime: <Wifi className="w-3 h-3" />,
      voice: <Mic className="w-3 h-3" />,
      ai: <BrainCircuit className="w-3 h-3" />,
      loading: <Loader2 className="w-3 h-3 animate-spin" />,
      error: <Wifi className="w-3 h-3" />,
      default: <Wifi className="w-3 h-3" />
    };
    
    const displayIcon = iconMap[variant as keyof typeof iconMap] || iconMap.default;
    
    return (
      <Div ref={ref}
        className={cn(
          indicatorVariants({
            variant: isActive ? variant : "default",
            size,
            position,
            pulse: isActive && pulse,
            fadeOut: !isActive && fadeOut
          }),
          !isActive && "opacity-60",
          className
        )}
        {...props}
    >
        {showIcon && displayIcon}
        <Span>
          {isActive 
            ? (showCountdown && autoHide ? `${activeText} (${countdown}s)` : activeText) 
            : (inactiveText || "")}
        </HTMLDivElement>
      </Div>
    );
  }
);

RealtimeIndicator.displayName = "RealtimeIndicator";

// Specialized Indicators
export const VoiceIndicator = (props: Omit<RealtimeIndicatorProps, 'variant'>) => (
  <RealtimeIndicator variant="voice" activeText="Voice active" {...props} />
);

export const AIIndicator = (props: Omit<RealtimeIndicatorProps, 'variant'>) => (
  <RealtimeIndicator variant="ai" activeText="AI processing" {...props} />
);

export const LoadingIndicator = (props: Omit<RealtimeIndicatorProps, 'variant'>) => (
  <RealtimeIndicator variant="loading" activeText="Loading" {...props} /></RealtimeIndicatorProps></RealtimeIndicatorProps>
);

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
}; 