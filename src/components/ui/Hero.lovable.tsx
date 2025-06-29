import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, BrainCircuit, BarChart, BookOpen, PenSquare } from 'lucide-react';
import '@/styles/landing.css';

const Hero = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section className="hero-section text-white">
      <motion.div
        className="container mx-auto text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="text-6xl md:text-8xl font-bold text-glowing-cyan mb-4 text-glow-cyan"
          variants={itemVariants}
        >
          Insight Flow
        </motion.h1>
        <motion.p className="text-xl md:text-2xl text-gray-300 mb-8" variants={itemVariants}>
          Where AI meets strategy, vision, and mastery
        </motion.p>
        <motion.div
          className="flex flex-wrap justify-center gap-4"
          variants={itemVariants}
        >
          <button  style={{ border: "1px solid #E5E7EB", color: "white" }}>
            <link to="/strategy" >
              <braincircuit  > Launch Builder
            </Link>
          </Button>
          <button  style={{ border: "1px solid #E5E7EB", color: "white" }}>
            <link to="/academy" >
              <bookopen  > Explore Academy
            </Link>
          </Button>
          <button  style={{ border: "1px solid #E5E7EB", color: "white" }}>
            <link to="/vision" >
              <barchart  > Upload Chart
            </Link>
          </Button>
          <button  style={{ border: "1px solid #E5E7EB", color: "white" }}>
            <link to="/journal" >
              <pensquare  > Journal Trade
            </Link>
          </Button>
        </motion.div>
      </motion.div>
      <motion.div
        className="absolute bottom-10 text-gray-400 scroll-invitation"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        <arrowright  >
      </motion.div>
    </section>
  );
};

export default Hero; 
export const lovable = { component: true };
