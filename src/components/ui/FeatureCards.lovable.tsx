import { motion, Variants } from 'framer-motion';
import { Link } from 'react-router-dom';

const features = [
  {
    icon: <span style={{fontSize: '16px'}}>🧠</span>,
    title: 'Strategy Builder',
    description: 'Design and test your trading strategies with AI-powered insights.',
    link: '/strategy',
    borderColor: 'hover:border-cyan-400',
  },
  {
    icon: <BarChart  />,
    title: 'Chart Vision',
    description: 'Upload chart images and get AI-driven technical analysis.',
    link: '/vision',
    borderColor: 'hover:border-violet-400',
  },
  {
    icon: <PenSquare  />,
    title: 'Trade Journal',
    description: 'Log and analyze your trades to discover patterns and improve.',
    link: '/journal',
    borderColor: 'hover:border-blue-400',
  },
  {
    icon: <BookOpen style={{ color: "#9CA3AF" }} />,
    title: 'Academy',
    description: 'Learn from a curated knowledge base of trading concepts and strategies.',
    link: '/academy',
    borderColor: 'hover:border-gray-400',
  },
];

const FeatureCards = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  };

  const cardVariants: Variants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
  };

  return (
    <section style={{ backgroundColor: "black", color: "white" }}>
      <div style={{ width: "100%", marginLeft: "auto", marginRight: "auto", paddingLeft: "16px", paddingRight: "16px" }}>
        <motion.div
          
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {features.map((feature) => (
            <motion.div key={feature.title} variants={cardVariants}>
              <Link to={feature.link}>
                <div
                  className={`glass-container h-full p-6 rounded-lg border-2 border-transparent transition-all duration-300 ${feature.borderColor} hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:-translate-y-2`}
                >
                  <div style={{ marginBottom: "16px" }}>{feature.icon}</div>
                  <h3 style={{ fontWeight: "700" }}>{feature.title}</h3>
                  <p style={{ color: "#9CA3AF" }}>{feature.description}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeatureCards; 