import '@/styles/vision.css';
import { motion } from 'framer-motion';

interface PatternTagProps {
  label: string;
}

const PatternTag = ({ label }: PatternTagProps) => {
  return (
    <motion.div
      className="pattern-tag"
      whileHover={{ y: -2 }}
    >
      {label}
    </motion.div>
  );
};

export default PatternTag;

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
}; 