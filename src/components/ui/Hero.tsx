
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
          <Button asChild className="glow-button bg-cyan-500/10 border border-cyan-500 text-white hover:bg-cyan-500/20">
            <Link to="/strategy">
              <BrainCircuit className="mr-2 h-4 w-4"/> Launch Builder
            </Link>
          </Button>
          <Button asChild className="glow-button bg-violet-500/10 border border-violet-500 text-white hover:bg-violet-500/20">
            <Link to="/academy">
              <BookOpen className="mr-2 h-4 w-4"/> Explore Academy
            </Link>
          </Button>
          <Button asChild className="glow-button bg-blue-500/10 border border-blue-500 text-white hover:bg-blue-500/20">
            <Link to="/vision">
              <BarChart className="mr-2 h-4 w-4"/> Upload Chart
            </Link>
          </Button>
          <Button asChild className="glow-button bg-gray-500/10 border border-gray-500 text-white hover:bg-gray-500/20">
            <Link to="/journal">
              <PenSquare className="mr-2 h-4 w-4"/> Journal Trade
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
        <ArrowRight className="h-6 w-6 -rotate-90"/>
      </motion.div>
    </section>
  );
};

export default Hero;

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
