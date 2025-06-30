import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageSquare, ThumbsUp, TrendingUp, Send } from 'lucide-react';

const mockPosts = [
    {
        id: '1',
        author: { name: 'CryptoWhale', avatar: '/avatars/01.png' },
        content: 'Big moves in BTC today. Looks like we are heading for a new ATH. Who is riding the wave?',
        likes: 125,
        comments: 23,
    },
    {
        id: '2',
        author: { name: 'StockSensei', avatar: '/avatars/02.png' },
        content: 'My analysis on TSLA suggests a short-term pullback before the next leg up. Waiting for confirmation.',
        likes: 88,
        comments: 12,
    },
];

const mockTrending = ['#BTC', '#ETH', '#Earnings', '#FedMeeting'];
const mockLeaderboard = [
    { name: 'CryptoWhale', score: 12500 },
    { name: 'StockSensei', score: 11200 },
    { name: 'TradingPro', score: 9800 },
];

export default function CommunityPage() {
    const [newPost, setNewPost] = useState('');

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Main Feed */}
            <div className="lg:col-span-2 space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                            <span className="bg-white/10 p-2 rounded-lg"><Messagesquare ></span>
                            Community Feed
                        </h1>
                        <p className="text-gray-400 mt-1">Connect with other traders and share insights.</p>
                    </div>
                </div>

                {/* Create Post */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm">
                    <Textarea  /> setNewPost(e.target.value)}
                        placeholder="Share your thoughts, charts, or trade ideas..."
                        className="bg-black/20 border-none"
                    />
                    <div className="flex justify-end mt-3">
                        <button  >
                            <send  > Post
                        </Button>
                    </div>
                </div>

                {/* Posts */}
                {mockPosts.map(post => (
                    <div key={post.id} className="bg-white/5 border border-white/10 rounded-xl p-5 backdrop-blur-sm">
                        <div className="flex items-start gap-4">
                            <avatar  ><avatarimage  ><avatarfallback  >{post.author.name[0]}</AvatarFallback></Avatar>
                            <div className="flex-1">
                                <p className="font-semibold text-white">{post.author.name}</p>
                                <p className="text-gray-300 mt-1">{post.content}</p>
                                <div className="flex items-center gap-6 mt-4 text-sm text-gray-400">
                                    <button className="flex items-center gap-1 hover:text-white"><thumbsup  > {post.likes}</button>
                                    <button className="flex items-center gap-1 hover:text-white"><messagesquare  > {post.comments}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-1 space-y-6">
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
                    <h3 className="font-semibold text-white mb-4">Trending Topics</h3>
                    <div className="flex flex-wrap gap-2">
                        {mockTrending.map(tag => <badge variant="secondary" >{tag}</Badge>)}
                    </div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
                    <h3 className="font-semibold text-white mb-4 flex items-center gap-2"><trendingup  > Leaderboard</h3>
                    <ul className="space-y-3">
                        {mockLeaderboard.map((user, index) => (
                            <li key={user.name} className="flex justify-between items-center text-sm">
                                <span className="text-gray-300">{index + 1}. {user.name}</span>
                                <span className="font-semibold text-blue-400">{user.score.toLocaleString()}</span>
                            </li>
                        ))}
                    </ul>
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
