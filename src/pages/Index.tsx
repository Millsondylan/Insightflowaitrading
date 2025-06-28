
import { Link } from 'react-router-dom';
import { Brain, BookOpen, Book, Wallet, Shield, ArrowRight } from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'AI Strategy',
    description: 'Generate personalized trading strategies using advanced AI analysis',
    path: '/strategy',
    gradient: 'from-cyan-500 to-blue-600'
  },
  {
    icon: BookOpen,
    title: 'Smart Journal',
    description: 'Track your trades with AI-powered insights and reflections',
    path: '/journal',
    gradient: 'from-purple-500 to-pink-600'
  },
  {
    icon: Book,
    title: 'Academy',
    description: 'Learn trading fundamentals with interactive lessons and quizzes',
    path: '/academy',
    gradient: 'from-green-500 to-emerald-600'
  },
  {
    icon: Wallet,
    title: 'Wallet Hub',
    description: 'Monitor your crypto portfolio across multiple chains',
    path: '/wallet',
    gradient: 'from-orange-500 to-red-600'
  }
];

export default function Index() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white">
      {/* Hero Section */}
      <div className="text-center space-y-6 mb-16">
        <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
          Insight Flow
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto">
          AI-powered trading platform for the modern crypto investor
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Link
            to="/strategy"
            className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 flex items-center gap-2"
          >
            Get Started <ArrowRight size={20} />
          </Link>
          <Link
            to="/academy"
            className="px-8 py-3 border border-white/20 rounded-lg font-semibold hover:bg-white/10 transition-all duration-300"
          >
            Learn More
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <Link
              key={feature.path}
              to={feature.path}
              className="group p-6 bg-black/20 backdrop-blur-md border border-white/10 rounded-xl hover:border-white/20 transition-all duration-300 hover:scale-105"
            >
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-4 group-hover:shadow-lg transition-all duration-300`}>
                <Icon size={24} className="text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-white">
                {feature.title}
              </h3>
              <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">
                {feature.description}
              </p>
            </Link>
          );
        })}
      </div>

      {/* Status Indicator */}
      <div className="mt-16 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-full text-green-400">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          System Online
        </div>
      </div>
    </div>
  );
}
