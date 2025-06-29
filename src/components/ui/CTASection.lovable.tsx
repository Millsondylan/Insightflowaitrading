import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import '@/styles/landing.css';

const CTASection = () => {
  return (
    <motion.section
      style={{ color: "white" }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 1 }}
    >
      <div style={{ width: "100%", marginLeft: "auto", marginRight: "auto" }}>
        <motion.h2
          style={{ fontWeight: "700" }}
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
          <Button
            asChild
            style={{ border: "1px solid #374151", color: "white" }}
          >
            <Link to="/strategy">
              Get Started <ArrowRight  />
            </Link>
          </Button>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default CTASection; 