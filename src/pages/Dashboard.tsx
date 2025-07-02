
import { BarChart3, TrendingUp, DollarSign, Activity } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Trading Dashboard</h1>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-900 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Portfolio Value</p>
                <p className="text-2xl font-bold text-white">$125,430</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-400" />
            </div>
          </div>
          
          <div className="bg-gray-900 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Today's P&L</p>
                <p className="text-2xl font-bold text-green-400">+$2,450</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-400" />
            </div>
          </div>
          
          <div className="bg-gray-900 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Win Rate</p>
                <p className="text-2xl font-bold text-white">68.5%</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-400" />
            </div>
          </div>
          
          <div className="bg-gray-900 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active Trades</p>
                <p className="text-2xl font-bold text-white">12</p>
              </div>
              <Activity className="h-8 w-8 text-purple-400" />
            </div>
          </div>
        </div>

        {/* Placeholder for charts and other dashboard content */}
        <div className="bg-gray-900 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-white mb-4">Market Overview</h2>
          <p className="text-gray-400">Dashboard content will be implemented here</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
