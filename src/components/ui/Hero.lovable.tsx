import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
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
    <section style={{ color: "white" }}>
      <motion.div
        style={{ width: "100%", marginLeft: "auto", marginRight: "auto" }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          style={{ fontWeight: "700", marginBottom: "16px" }}
          variants={itemVariants}
        >
          Insight Flow
        </motion.h1>
        <motion.p style={{ marginBottom: "32px" }} variants={itemVariants}>
          Where AI meets strategy, vision, and mastery
        </motion.p>
        <motion.div
          style={{ display: "flex", justifyContent: "center" }}
          variants={itemVariants}
        >
          <Button asChild style={{ border: "1px solid #374151", color: "white" }}>
            <Link to="/strategy">
              <span style={{fontSize: '16px'}}>🧠</span> Launch Builder
            </Link>
          </Button>
          <Button asChild style={{ border: "1px solid #374151", color: "white" }}>
            <Link to="/academy">
              <BookOpen  /> Explore Academy
            </Link>
          </Button>
          <Button asChild style={{ border: "1px solid #374151", color: "white" }}>
            <Link to="/vision">
              <BarChart  /> Upload Chart
            </Link>
          </Button>
          <Button asChild style={{ border: "1px solid #374151", color: "white" }}>
            <Link to="/journal">
              <PenSquare  /> Journal Trade
            </Link>
          </Button>
        </motion.div>
      </motion.div>
      <motion.div
        style={{ color: "#9CA3AF" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        <ArrowRight  />
      </motion.div>
    </section>
  );
};

export default Hero; 