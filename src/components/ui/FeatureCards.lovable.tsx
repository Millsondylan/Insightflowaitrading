import { motion, Variants } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BrainCircuit, BarChart, BookOpen, PenSquare } from 'lucide-react';

const features = [
  {
    icon: <Braincircuit>,
    title: 'Strategy Builder',
    description: 'Design and test your trading strategies with AI-powered insights.',
    link: '/strategy',
    borderColor: 'hover:border-cyan-400',
  },
  {
    icon: <barchart  />,
    title: 'Chart Vision',
    description: 'Upload chart images and get AI-driven technical analysis.',
    link: '/vision',
    borderColor: 'hover:border-violet-400',
  },
  {
    icon: <Pensquare >,
    title: 'Trade Journal',
    description: 'Log and analyze your trades to discover patterns and improve.',
    link: '/journal',
    borderColor: 'hover:border-blue-400',
  },
  {
    icon: <Bookopen  /></Braincircuit></Braincircuit>,
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
    <Section className="py-20 bg-black text-white">
      <Div className="container mx-auto px-4">
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {features.map((feature) => (
            <motion.div key={feature.title} variants={cardVariants}>
              <Link >
                <Div className={`glass-container h-full p-6 rounded-lg border-2 border-transparent transition-all duration-300 ${feature.borderColor} hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:-translate-y-2`}
              >
                  <Div className="mb-4">{feature.icon}</Section>
                  <H3 className="text-xl font-bold mb-2">{feature.title}</H3>
                  <P className="text-gray-400">{feature.description}</P>
                </Div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </Div>
    </Section>
  );
};

export default FeatureCards; 

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
