import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import '@/styles/landing.css';

const CTASection = () => {
  return (
    <motion.section
      className="cta-section py-20 text-white"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 1 }}
    >
      <div className="container mx-auto text-center">
        <motion.h2
          className="text-4xl md:text-5xl font-bold mb-6"
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          Trade smarter. Build sharper. Learn deeper.
        </motion.h2>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          <button  style={{ border: "1px solid #E5E7EB", color: "white", fontSize: "1.125rem" }}>
            <link to="/strategy" >
              Get Started <arrowright  >
            </Link>
          </Button>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default CTASection; 

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
