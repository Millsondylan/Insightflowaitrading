import React, { useState, useRef, useEffect } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

const modalSnapVariants = cva(
  "fixed left-0 w-full bg-background shadow-lg rounded-t-xl transition-all duration-300 ease-out z-50 overflow-hidden",
  {
    variants: {
      position: {
        bottom: "bottom-0",
        top: "top-0 rounded-b-xl rounded-t-none",
      },
      size: {
        auto: "",
        sm: "max-h-[25%]",
        md: "max-h-[50%]",
        lg: "max-h-[75%]",
        full: "max-h-[calc(100%-2rem)]",
      },
      fullWidth: {
        true: "max-w-full",
        false: "max-w-md mx-auto",
      },
    },
    defaultVariants: {
      position: "bottom",
      size: "md",
      fullWidth: false,
    },
  }
);

export interface SnapPosition {
  initial: number; // Initial height percentage (0-100)
  snap: number[];  // Array of snap positions in percentage (0-100)
  current: number; // Current snap position index
}

export interface ModalSnapProps extends 
  React.HTMLAttributes<HTMLDivElement>, 
  VariantProps<typeof modalSnapVariants> {
  isOpen: boolean;
  onClose: () => void;
  onSnap?: (position: number) => void;
  snapPositions?: number[]; // Array of percentages (0-100)
  initialSnapIndex?: number;
  showHandle?: boolean;
  allowClose?: boolean;
  backdrop?: boolean;
  backdropBlur?: boolean;
}

export const ModalSnap = React.forwardRef<HTMLDivElement, ModalSnapProps>(
  ({
    className,
    children,
    isOpen,
    onClose,
    onSnap,
    position = "bottom",
    size = "md",
    fullWidth = false,
    snapPositions = [25, 50, 90],
    initialSnapIndex = 1,
    showHandle = true,
    allowClose = true,
    backdrop = true,
    backdropBlur = true,
    ...props
  }, ref) => {
    const [currentSnapIndex, setCurrentSnapIndex] = useState(initialSnapIndex);
    const [isDragging, setIsDragging] = useState(false);
    const [startY, setStartY] = useState(0);
    const [currentHeight, setCurrentHeight] = useState(snapPositions[initialSnapIndex] || 50);
    const contentRef = useRef<HTMLDivElement>(null);
    const dragHandleRef = useRef<HTMLDivElement>(null);
    
    // Reset to initial state when modal opens
    useEffect(() => {
      if (isOpen) {
        setCurrentSnapIndex(initialSnapIndex);
        setCurrentHeight(snapPositions[initialSnapIndex] || 50);
      }
    }, [isOpen, initialSnapIndex, snapPositions]);
    
    useEffect(() => {
      // Listen for window resize to adjust modal if needed
      const handleResize = () => {
        if (isOpen && !isDragging) {
          setCurrentHeight(snapPositions[currentSnapIndex] || 50);
        }
      };
      
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, [isOpen, isDragging, currentSnapIndex, snapPositions]);
    
    const handleDragStart = (e: React.TouchEvent | React.MouseEvent) => {
      setIsDragging(true);
      setStartY(e instanceof TouchEvent ? e.touches[0].clientY : (e as React.MouseEvent).clientY);
    };
    
    const handleDrag = (e: TouchEvent | MouseEvent) => {
      if (!isDragging || !contentRef.current) return;
      
      const clientY = e instanceof TouchEvent ? e.touches[0].clientY : e.clientY;
      const deltaY = clientY - startY;
      const windowHeight = window.innerHeight;
      
      let newHeight: number;
      if (position === "bottom") {
        // For bottom modal, drag down decreases height
        newHeight = currentHeight - (deltaY / windowHeight) * 100;
      } else {
        // For top modal, drag up increases height
        newHeight = currentHeight + (deltaY / windowHeight) * 100;
      }
      
      // Clamp height between min and max values
      newHeight = Math.max(snapPositions[0] || 10, Math.min(snapPositions[snapPositions.length - 1] || 90, newHeight));
      
      setCurrentHeight(newHeight);
      setStartY(clientY);
    };
    
    const handleDragEnd = () => {
      setIsDragging(false);
      
      // Find the closest snap position
      let closestDistance = Infinity;
      let closestIndex = 0;
      
      snapPositions.forEach((position, index) => {
        const distance = Math.abs(position - currentHeight);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });
      
      // If closest position is the smallest and distance is significant, close the modal
      if (closestIndex === 0 && allowClose && closestDistance < 15) {
        onClose();
        return;
      }
      
      setCurrentSnapIndex(closestIndex);
      setCurrentHeight(snapPositions[closestIndex]);
      
      if (onSnap) {
        onSnap(snapPositions[closestIndex]);
      }
    };
    
    // Setup event listeners for drag
    useEffect(() => {
      if (!isOpen) return;
      
      const handleDocumentMouseMove = (e: MouseEvent) => handleDrag(e);
      const handleDocumentMouseUp = () => handleDragEnd();
      const handleDocumentTouchMove = (e: TouchEvent) => handleDrag(e);
      const handleDocumentTouchEnd = () => handleDragEnd();
      
      if (isDragging) {
        document.addEventListener('mousemove', handleDocumentMouseMove);
        document.addEventListener('mouseup', handleDocumentMouseUp);
        document.addEventListener('touchmove', handleDocumentTouchMove, { passive: false });
        document.addEventListener('touchend', handleDocumentTouchEnd);
      }
      
      return () => {
        document.removeEventListener('mousemove', handleDocumentMouseMove);
        document.removeEventListener('mouseup', handleDocumentMouseUp);
        document.removeEventListener('touchmove', handleDocumentTouchMove);
        document.removeEventListener('touchend', handleDocumentTouchEnd);
      };
    }, [isOpen, isDragging]);
    
    // Prevent body scroll when modal is open
    useEffect(() => {
      if (isOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
      
      return () => {
        document.body.style.overflow = '';
      };
    }, [isOpen]);
    
    if (!isOpen) return null;
    
    return (
      <>
        {/* Backdrop */}
        {backdrop && (
          <Div 
            className={cn(
              "fixed inset-0 bg-background/80 z-40 transition-opacity",
              backdropBlur && "backdrop-blur-sm",
              !isOpen && "opacity-0 pointer-events-none"
            )}
            onClick={allowClose ? onClose : undefined}
          />
        )}
        
        {/* Modal */}
        <Div ref={ref}
          className={cn(
            modalSnapVariants({ position, size, fullWidth }),
            "transform",
            !isOpen && "translate-y-full",
            className
          )}
          style={{ height: `${currentHeight}%` }}
          {...props}>
          {/* Drag handle */}
          {showHandle && (
            <Div ref={dragHandleRef}
              className="flex items-center justify-center h-6 w-full cursor-grab active:cursor-grabbing"
              onMouseDown={handleDragStart}
              onTouchStart={handleDragStart}
  >
              <Div className="w-12 h-1.5 bg-muted-foreground/30 rounded-full" / />
          )}
          
          {/* Close button */}
          {allowClose && (
            <Button onClick={onClose}
              className="absolute top-2 right-2 p-1 rounded-sm opacity-70 hover:opacity-100 focus:outline-none focus:ring-1"
              aria-label="Close"
  >
              <X className="w-4 h-4" />
            </HTMLDivElement>
          )}
          
          {/* Content */}
          <Div ref={contentRef}
            className="overflow-y-auto overscroll-contain h-full"
>
            <Div className="p-4">
              {children}
            </Div>
          </Div>
        </Div>
      </>
    );
  }
);

ModalSnap.displayName = "ModalSnap";

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
}; 