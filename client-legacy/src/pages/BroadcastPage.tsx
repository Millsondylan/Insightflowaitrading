
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Radio, Send } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const mockChat = [
    { user: 'CryptoWhale', message: 'Great analysis on the current market.' },
    { user: 'StockSensei', message: 'What are your thoughts on the upcoming Fed meeting?' },
];

export default function BroadcastPage() {
  return (
    <div>
        <Link to="/academy" className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
            <ArrowLeft size={16}/>
            Back to Academy
        </Link>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Main Video Player */}
            <div className="lg:col-span-2 space-y-4">
                <div className="bg-black border border-white/10 rounded-xl aspect-video flex items-center justify-center">
                    <p className="text-gray-500">Live video stream would be here.</p>
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-white">Live Market Analysis with TraderPro</h1>
                    <p className="text-gray-400">Discussing Q3 earnings and macro trends.</p>
                </div>
            </div>

            {/* Chat Sidebar */}
            <div className="lg:col-span-1 bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm h-full flex flex-col">
                <div className="p-4 border-b border-white/10">
                    <h3 className="font-semibold text-white flex items-center gap-2">
                        <Radio size={18}/> Live Chat
                    </h3>
                </div>
                <div className="flex-grow p-4 space-y-4 overflow-y-auto">
                    {mockChat.map((chat, index) => (
                        <div key={index} className="text-sm">
                            <span className="font-semibold text-blue-400">{chat.user}: </span>
                            <span className="text-gray-300">{chat.message}</span>
                        </div>
                    ))}
                </div>
                <div className="p-4 border-t border-white/10 flex gap-2">
                    <Textarea placeholder="Say something..." className="bg-black/20 border-none text-sm" rows={1}/>
                    <Button><Send size={16}/></Button>
                </div>
            </div>
        </div>
    </div>
  );
}

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
