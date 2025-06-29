import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Clock, LockOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PlanType } from '@/lib/subscription/subscriptionPlans';
import confetti from 'canvas-confetti';

interface AccessStatusProps {
  status: 'pending' | 'success' | 'failure';
  plan?: PlanType;
  expiryDate?: string;
  message?: string;
  className?: string;
  onAnimationComplete?: () => void;
}

const AccessStatus: React.FC<accessStatusProps> = ({
  status,
  plan,
  expiryDate,
  message,
  className,
  onAnimationComplete
}) => {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (status === 'success') {
      setShowConfetti(true);
      
      // Fire confetti when success status is shown
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const colors = ['#3b82f6', '#10b981', '#6366f1'];
      
      const fireConfetti = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 70,
          origin: { x: 0 },
          colors
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 70,
          origin: { x: 1 },
          colors
        });
        
        if (Date.now() < animationEnd) {
          requestAnimationFrame(fireConfetti);
        }
      };
      
      fireConfetti();
      
      // Clean up
      const timer = setTimeout(() => {
        setShowConfetti(false);
        onAnimationComplete?.();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [status, onAnimationComplete]);

  // Format expiry date, if provided
  const formattedExpiry = expiryDate ? new Date(expiryDate).toLocaleDateString() : '';

  return (
    <animatePresence mode="wait">
      <motion.div
        key={status}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
        className={cn(
          "p-6 rounded-lg border text-center",
          status === 'pending' && "bg-blue-900/10 border-blue-500/30",
          status === 'success' && "bg-green-900/10 border-green-500/30",
          status === 'failure' && "bg-red-900/10 border-red-500/30",
          className
        )}
      >
        <Div className="flex flex-col items-center space-y-4">
          {/* Status Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="relative"
          >
            {status === 'pending' && (
              <Clock className="h-16 w-16 text-blue-400" />
            )}
            {status === 'success' && (
              <>
                <motion.div
                  className="absolute inset-0 rounded-full bg-green-500/20"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [1, 0, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 1,
                  }}
                />
                <LockOpen className="h-16 w-16 text-green-400" />
              </>
            )}
            {status === 'failure' && (
              <XCircle className="h-16 w-16 text-red-400" /></Div></Div>
            )}
          </motion.div>

          {/* Status Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="space-y-2"
          >
            <H3 className={cn(
              "text-xl font-bold",
              status === 'pending' && "text-blue-400",
              status === 'success' && "text-green-400",
              status === 'failure' && "text-red-400",
            )}>
              {status === 'pending' && 'Verifying Payment'}
              {status === 'success' && 'Access Granted!'}
              {status === 'failure' && 'Verification Failed'}
            </H3>
            
            {message && (
              <P className="text-gray-300">{message}</P>
            )}
            
            {status === 'success' && plan && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="mt-4 space-y-2"
              >
                <P className="font-medium text-green-300">
                  {plan.charAt(0).toUpperCase() + plan.slice(1)} Plan Activated
                </P>
                {formattedExpiry && (
                  <P className="text-sm text-gray-400">
                    Expires: {formattedExpiry}
                  </P>
                )}
              </motion.div>
            )}
          </motion.div>
        </Div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AccessStatus;

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
}; 