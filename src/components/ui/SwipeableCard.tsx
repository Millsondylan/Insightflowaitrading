
import React from 'react';
import { motion } from 'framer-motion';

interface SwipeableCardProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  className?: string;
}

const SwipeableCard = ({ 
  children, 
  onSwipeLeft, 
  onSwipeRight, 
  className = '' 
}: SwipeableCardProps) => {
  const handleDragEnd = (event: any, info: any) => {
    const { offset, velocity } = info;
    
    // Determine swipe direction based on offset and velocity
    if (offset.x > 100 || velocity.x > 500) {
      // Swiped right
      onSwipeRight?.();
    } else if (offset.x < -100 || velocity.x < -500) {
      // Swiped left
      onSwipeLeft?.();
    }
  };

  return (
    <motion.div
      className={`bg-white rounded-lg shadow-lg p-6 cursor-grab active:cursor-grabbing ${className}`}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.2}
      onDragEnd={handleDragEnd}
      whileDrag={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
      
      {/* Swipe indicators */}
      {onSwipeLeft && (
        <motion.div
          className="absolute top-4 right-4 opacity-0 pointer-events-none"
          animate={{ opacity: 0 }}
        >
          <span className="text-red-500 text-sm font-medium">Swipe left to dismiss</span>
        </motion.div>
      )}
      
      {onSwipeRight && (
        <motion.div
          className="absolute top-4 left-4 opacity-0 pointer-events-none"
          animate={{ opacity: 0 }}
        >
          <span className="text-green-500 text-sm font-medium">Swipe right to accept</span>
        </motion.div>
      )}
    </motion.div>
  );
};

export default SwipeableCard;

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
