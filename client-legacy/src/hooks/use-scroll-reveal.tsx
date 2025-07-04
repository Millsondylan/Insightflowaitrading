import { useEffect, useRef, useState } from 'react';

interface ScrollRevealOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export const useScrollReveal = (options: ScrollRevealOptions = {}) => {
  const elementRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (options.triggerOnce !== false) {
            observer.unobserve(element);
          }
        } else if (options.triggerOnce === false) {
          setIsVisible(false);
        }
      },
      {
        threshold: options.threshold || 0.1,
        rootMargin: options.rootMargin || '0px 0px -100px 0px',
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [options.threshold, options.rootMargin, options.triggerOnce]);

  return { elementRef, isVisible };
};

interface ScrollSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  animation?: "fade-in" | "slide-right" | "scale-in";
}

// Scroll section wrapper component
export const ScrollSection: React.FC<ScrollSectionProps> = ({ 
  children, 
  className = "", 
  delay = 0,
  animation = "fade-in"
}) => {
  const { elementRef, isVisible } = useScrollReveal();
  
  const animationClass = `scroll-${animation}`;
  
  return (
    <section ref={elementRef}
      className={`${animationClass} scroll-section ${isVisible ? 'visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </section>
  );
};

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};