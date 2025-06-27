import { ReactNode } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface BlockRevealProps {
  children: ReactNode;
  variant?: 'fade' | 'slide-up' | 'slide-right';
  delay?: number;
  className?: string;
}

const variantsMap = {
  fade: { hidden: { opacity: 0 }, visible: { opacity: 1 } },
  'slide-up': {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  },
  'slide-right': {
    hidden: { opacity: 0, x: -40 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
  },
};

const BlockReveal = ({ children, variant = 'slide-up', delay = 0.1, className }: BlockRevealProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '0px 0px -100px 0px' });
  const variants = variantsMap[variant];

  return (
    <motion.div
      ref={ref}
      variants={variants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default BlockReveal; 