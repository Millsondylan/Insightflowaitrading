import React, { useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMobileDetector } from '@/hooks/use-mobile-detector';
import { Button } from './button';

interface MobileModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  closeOnClickOutside?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'full';
  position?: 'center' | 'bottom';
  showCloseButton?: boolean;
  className?: string;
  contentClassName?: string;
}

export function MobileModal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  closeOnClickOutside = true,
  size = 'md',
  position = 'center',
  showCloseButton = true,
  className,
  contentClassName,
}: MobileModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const { isMobile } = useMobileDetector();
  
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);
  
  // Lock scroll when modal is open
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
  
  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnClickOutside && modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };
  
  if (!isOpen) {
    return null;
  }

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    full: isMobile ? 'max-w-full w-full h-full rounded-none' : 'max-w-lg',
  };
  
  const positionClasses = {
    center: 'items-center justify-center',
    bottom: 'items-end',
  };
  
  return (
    <Div className="fixed inset-0 z-50 bg-black/50 flex p-4 overflow-y-auto backdrop-blur-sm"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true">
      <Div ref={modalRef}
        className={cn(
          'relative w-full bg-background shadow-lg transition-all duration-200',
          isMobile ? (position === 'center' ? 'm-auto' : 'mb-0 rounded-t-xl') : 'm-auto',
          sizeClasses[size],
          position === 'bottom' && isMobile ? 'rounded-b-none' : 'rounded-lg',
          positionClasses[position],
          className
        )}>
        {/* Header */}
        {(title || showCloseButton) && (
          <Div className="flex items-center justify-between p-4 border-b">
            {title && (
              <Div>
                <H3 className="text-lg font-medium">{title}</HTMLDivElement>
                {description && <P className="text-sm text-muted-foreground">{description}</P>}
              </Div>
            )}
            {showCloseButton && (
              <Button variant="ghost"
                size="icon"
                className="rounded-full h-8 w-8"
                onClick={onClose}
                aria-label="Close"
   >
                <X className="h-4 w-4" />
              </Button>
            )}
          </Div>
        )}
        
        {/* Content */}
        <Div className={cn('p-4', contentClassName)}>
          {children}
        </Div>
        
        {/* Footer */}
        {footer && (
          <Div className="p-4 border-t flex justify-end gap-2">
            {footer}
          </Div>
        )}
        
        {/* Bottom safe area for mobile devices */}
        {position === 'bottom' && isMobile && (
          <Div className="h-6 bg-background" />
        )}
      </Div>
    </Div>
  );
}

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
}; 