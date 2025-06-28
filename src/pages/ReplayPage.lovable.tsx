import React from 'react';
import { useParams, Link } from 'react-router-dom';

export default function ReplayPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <div>
      <Link to={`/vault/${id}`} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
        <ArrowLeft size={16} />
        Back to Strategy Details
      </Link>

      <div className="bg-white/5 border border-white/10 rounded-xl p-8 backdrop-blur-sm aspect-video flex flex-col justify-between">
        <header className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">Replay for Strategy #{id}</h1>
            <Button variant="ghost"><span style={{fontSize: '16px'}}>⚙️</span> </Button>
        </header>
        
        <div className="flex-grow flex items-center justify-center">
            <p className="text-gray-500 text-lg">Chart and replay visualization would be here.</p>
        </div>

        <footer className="bg-black/20 p-4 rounded-lg flex items-center justify-center gap-4">
            <Button variant="ghost"><FastForward className="transform -scale-x-100" size={20} /></Button>
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 rounded-full w-16 h-16">
                <Play size={24} />
            </Button>
            <Button variant="ghost"><FastForward size={20} /></Button>
        </footer>
      </div>
    </div>
  );
} 