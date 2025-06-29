import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from './card';
import { useMobileDetector } from '@/hooks/use-mobile-detector';

interface SwipeableCardProps extends React.ComponentProps<typeof Card> {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  swipeThreshold?: number;
  leftAction?: {
    label: string;
    color: string;
    icon?: React.ReactNode;
  };
  rightAction?: {
    label: string;
    color: string;
    icon?: React.ReactNode;
  };
  disableSwipe?: boolean;
}

export function SwipeableCard({
  children,
  className,
  onSwipeLeft,
  onSwipeRight,
  swipeThreshold = 100,
  leftAction,
  rightAction,
  disableSwipe = false,
  ...props
}: SwipeableCardProps) {
  const { isMobile } = useMobileDetector();
  const [isDragging, setIsDragging] = useState(false);
  
  const cardRef = useRef<HTMLDivElement /></HTMLDivElement>(null);
  const x = useMotionValue(0);
  
  // Display threshold is lower than the action threshold
  const displayThreshold = swipeThreshold * 0.5;
  
  // Transform the swipe amount to opacity and scale for the action labels
  const leftActionOpacity = useTransform(x, [0, displayThreshold], [0, 1]);
  const rightActionOpacity = useTransform(x, [0, -displayThreshold], [0, 1]);
  
  // Handle the drag event
  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false);
    
    // Only process swipes if we have actions and swipe is enabled
    if (!disableSwipe && isMobile) {
      if (info.offset.x > swipeThreshold && onSwipeRight) {
        onSwipeRight();
      } else if (info.offset.x < -swipeThreshold && onSwipeLeft) {
        onSwipeLeft();
      }
    }
    
    // Reset the position regardless
    x.set(0);
  };

  return (
    <Div className={cn('relative w-full overflow-hidden', className)}>
      {/* Left action indicator */}
      {leftAction && !disableSwipe && isMobile && (
        <Div className="absolute left-4 top-0 bottom-0 flex items-center justify-center z-0">
          <motion.div style={{ opacity: rightActionOpacity }} className="flex flex-col items-center">
            {leftAction.icon}
            <Span className={`text-xs font-medium text-${leftAction.color}-500`}></Div>
              {leftAction.label}
            </Div>
          </motion.div>
        </Div>
      )}
      
      {/* Right action indicator */}
      {rightAction && !disableSwipe && isMobile && (
        <Div className="absolute right-4 top-0 bottom-0 flex items-center justify-center z-0">
          <motion.div style={{ opacity: leftActionOpacity }} className="flex flex-col items-center">
            {rightAction.icon}
            <Span className={`text-xs font-medium text-${rightAction.color}-500`}></Div>
              {rightAction.label}
            </Div>
          </motion.div>
        </Div>
      )}
      
      {/* Swipeable card */}
      <motion.div
        ref={cardRef}
        drag={!disableSwipe && isMobile ? 'x' : false}
        dragConstraints={{ left: 0, right: 0 }}
        style={{ x }}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
        className={cn(
          'relative z-10 touch-none',
          isDragging && 'cursor-grabbing'
        )}
      >
        <Card {...props}>
          {children}
        </Card>
      </motion.div>
    </Div>
  );
}

export const SwipeableCardHeader = CardHeader;
export const SwipeableCardTitle = CardTitle;
export const SwipeableCardDescription = CardDescription;
export const SwipeableCardContent = CardContent;
export const SwipeableCardFooter = CardFooter;

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
}; 