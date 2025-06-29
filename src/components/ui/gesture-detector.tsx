import React, { useRef, useState, useEffect } from 'react';

export interface Touch {
  identifier: number;
  clientX: number;
  clientY: number;
  radiusX?: number;
  radiusY?: number;
  rotationAngle?: number;
  force?: number;
}

export interface GestureEvent {
  type: 'tap' | 'double-tap' | 'long-press' | 'swipe' | 'pinch' | 'rotate' | 'pan';
  touches: Touch[];
  center: { x: number; y: number };
  deltaX?: number;
  deltaY?: number;
  scale?: number;
  rotation?: number;
  velocity?: number;
  direction?: 'left' | 'right' | 'up' | 'down';
  target: EventTarget | null;
  originalEvent: React.TouchEvent | React.MouseEvent;
}

export interface GestureDetectorProps {
  children: React.ReactNode;
  onTap?: (event: GestureEvent) => void;
  onDoubleTap?: (event: GestureEvent) => void;
  onLongPress?: (event: GestureEvent) => void;
  onSwipe?: (event: GestureEvent) => void;
  onPinch?: (event: GestureEvent) => void;
  onRotate?: (event: GestureEvent) => void;
  onPan?: (event: GestureEvent) => void;
  options?: {
    tapThreshold?: number;
    doubleTapDelay?: number;
    longPressDelay?: number;
    swipeThreshold?: number;
    swipeVelocityThreshold?: number;
  };
}

export const GestureDetector: React.FC<GestureDetectorProps /> = ({
  children,
  onTap,
  onDoubleTap,
  onLongPress,
  onSwipe,
  onPinch,
  onRotate,
  onPan,
  options = {}
}) => {
  const {
    tapThreshold = 10,
    doubleTapDelay = 300,
    longPressDelay = 500,
    swipeThreshold = 50,
    swipeVelocityThreshold = 0.3
  } = options;

  const containerRef = useRef<HTMLDivElement />(null);
  const touchStartRef = useRef<{ x: number; y: number; time: number }>({ x: 0, y: 0, time: 0 });
  const touchesRef = useRef<Touch[] />([]);
  const lastTapTimeRef = useRef<number>(0);
  const longPressTimeoutRef = useRef<NodeJS.Timeout | null /></GestureDetectorProps>(null);
  const [isPanning, setIsPanning] = useState(false);

  const clearLongPressTimeout = () => {
    if (longPressTimeoutRef.current) {
      clearTimeout(longPressTimeoutRef.current);
      longPressTimeoutRef.current = null;
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    // Prevent default to avoid scrolling when handling gestures
    // But be careful not to prevent all scrolling when not needed
    if (onPinch || onRotate || isPanning) {
      e.preventDefault();
    }

    const touches = Array.from(e.touches);
    touchesRef.current = touches.map(t => ({
      identifier: t.identifier,
      clientX: t.clientX,
      clientY: t.clientY,
      radiusX: (t as any).radiusX,
      radiusY: (t as any).radiusY,
      rotationAngle: (t as any).rotationAngle,
      force: (t as any).force
    }));

    const touch = touches[0];
    const time = Date.now();
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time
    };

    // Start long press timer
    if (onLongPress) {
      clearLongPressTimeout();
      longPressTimeoutRef.current = setTimeout(() => {
        const dx = 0;
        const dy = 0;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < tapThreshold) {
          onLongPress({
            type: 'long-press',
            touches: touchesRef.current,
            center: { x: touch.clientX, y: touch.clientY },
            target: e.target,
            originalEvent: e
          });
        }
      }, longPressDelay);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchesRef.current.length === 0) return;

    const touches = Array.from(e.touches);
    const currentTouch = touches[0];
    const startTouch = touchStartRef.current;
    
    const deltaX = currentTouch.clientX - startTouch.x;
    const deltaY = currentTouch.clientY - startTouch.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    // If moved more than tap threshold, cancel long press
    if (distance > tapThreshold) {
      clearLongPressTimeout();
    }

    // Handle pan
    if (onPan && distance > tapThreshold) {
      if (!isPanning) {
        setIsPanning(true);
      }
      
      onPan({
        type: 'pan',
        touches: touches.map(t => ({
          identifier: t.identifier,
          clientX: t.clientX,
          clientY: t.clientY
        })),
        center: {
          x: currentTouch.clientX,
          y: currentTouch.clientY
        },
        deltaX,
        deltaY,
        target: e.target,
        originalEvent: e
      });
    }
    
    // Handle pinch
    if (onPinch && touches.length >= 2) {
      const touch1 = touches[0];
      const touch2 = touches[1];
      
      // Calculate current distance between fingers
      const currentDistance = Math.sqrt(
        Math.pow(touch1.clientX - touch2.clientX, 2) + 
        Math.pow(touch1.clientY - touch2.clientY, 2)
      );
      
      // Calculate initial distance between fingers
      const initialTouches = touchesRef.current;
      if (initialTouches.length >= 2) {
        const initialDistance = Math.sqrt(
          Math.pow(initialTouches[0].clientX - initialTouches[1].clientX, 2) + 
          Math.pow(initialTouches[0].clientY - initialTouches[1].clientY, 2)
        );
        
        const scale = currentDistance / initialDistance;
        
        onPinch({
          type: 'pinch',
          touches: touches.map(t => ({
            identifier: t.identifier,
            clientX: t.clientX,
            clientY: t.clientY
          })),
          center: {
            x: (touch1.clientX + touch2.clientX) / 2,
            y: (touch1.clientY + touch2.clientY) / 2
          },
          scale,
          target: e.target,
          originalEvent: e
        });
      }
    }
    
    // Handle rotate
    if (onRotate && touches.length >= 2) {
      const touch1 = touches[0];
      const touch2 = touches[1];
      
      // Calculate current angle
      const currentAngle = Math.atan2(
        touch2.clientY - touch1.clientY,
        touch2.clientX - touch1.clientX
      ) * 180 / Math.PI;
      
      // Calculate initial angle
      const initialTouches = touchesRef.current;
      if (initialTouches.length >= 2) {
        const initialAngle = Math.atan2(
          initialTouches[1].clientY - initialTouches[0].clientY,
          initialTouches[1].clientX - initialTouches[0].clientX
        ) * 180 / Math.PI;
        
        const rotation = currentAngle - initialAngle;
        
        onRotate({
          type: 'rotate',
          touches: touches.map(t => ({
            identifier: t.identifier,
            clientX: t.clientX,
            clientY: t.clientY
          })),
          center: {
            x: (touch1.clientX + touch2.clientX) / 2,
            y: (touch1.clientY + touch2.clientY) / 2
          },
          rotation,
          target: e.target,
          originalEvent: e
        });
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const startTouch = touchStartRef.current;
    const endTime = Date.now();
    const timeElapsed = endTime - startTouch.time;
    
    clearLongPressTimeout();
    
    // Only process if we started with touches
    if (touchesRef.current.length === 0) return;
    
    // Handle tap
    if (e.changedTouches.length > 0) {
      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - startTouch.x;
      const deltaY = touch.clientY - startTouch.y;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      
      if (distance < tapThreshold) {
        if (onTap) {
          onTap({
            type: 'tap',
            touches: [{
              identifier: touch.identifier,
              clientX: touch.clientX,
              clientY: touch.clientY
            }],
            center: { x: touch.clientX, y: touch.clientY },
            target: e.target,
            originalEvent: e
          });
        }
        
        // Handle double tap
        if (onDoubleTap) {
          const currentTime = Date.now();
          const timeSinceLastTap = currentTime - lastTapTimeRef.current;
          
          if (timeSinceLastTap < doubleTapDelay) {
            onDoubleTap({
              type: 'double-tap',
              touches: [{
                identifier: touch.identifier,
                clientX: touch.clientX,
                clientY: touch.clientY
              }],
              center: { x: touch.clientX, y: touch.clientY },
              target: e.target,
              originalEvent: e
            });
            lastTapTimeRef.current = 0; // Reset to prevent triple-tap
          } else {
            lastTapTimeRef.current = currentTime;
          }
        }
      }
      
      // Handle swipe
      if (onSwipe && timeElapsed < 300) {
        const velocity = distance / timeElapsed;
        
        if (distance >= swipeThreshold && velocity > swipeVelocityThreshold) {
          // Determine direction
          let direction: 'left' | 'right' | 'up' | 'down';
          
          if (Math.abs(deltaX) > Math.abs(deltaY)) {
            direction = deltaX > 0 ? 'right' : 'left';
          } else {
            direction = deltaY > 0 ? 'down' : 'up';
          }
          
          onSwipe({
            type: 'swipe',
            touches: [{
              identifier: touch.identifier,
              clientX: touch.clientX,
              clientY: touch.clientY
            }],
            center: { x: touch.clientX, y: touch.clientY },
            deltaX,
            deltaY,
            velocity,
            direction,
            target: e.target,
            originalEvent: e
          });
        }
      }
    }
    
    setIsPanning(false);
    touchesRef.current = [];
  };

  useEffect(() => {
    return () => {
      clearLongPressTimeout();
    };
  }, []);

  return (
    <Div ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      style={{ touchAction: 'none' }}>
      {children}
    </Div>
  );
};

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
}; 