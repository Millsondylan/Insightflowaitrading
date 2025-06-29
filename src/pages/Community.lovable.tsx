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
        <Div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Main Feed */}
            <Div className="lg:col-span-2 space-y-6">
                <Div className="flex justify-between items-center">
                    <Div>
                        <H1 className="text-3xl font-bold text-white flex items-center gap-3">
                            <Span className="bg-white/10 p-2 rounded-lg"><Messagesquare ></Div>
                            Community Feed
                        </H1>
                        <P className="text-gray-400 mt-1">Connect with other traders and share insights.</P>
                    </Div>
                </Div>

                {/* Create Post */}
                <Div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm">
                    <Textarea  /> setNewPost(e.target.value)}
                        placeholder="Share your thoughts, charts, or trade ideas..."
                        className="bg-black/20 border-none"
                    />
                    <Div className="flex justify-end mt-3">
                        <Button >
                            <Send /></Div></Div> Post
                        </Button>
                    </Div>
                </Div>

                {/* Posts */}
                {mockPosts.map(post => (
                    <Div key={post.id} className="bg-white/5 border border-white/10 rounded-xl p-5 backdrop-blur-sm">
                        <Div className="flex items-start gap-4">
                            <avatar ><avatarimage ><Avatarfallback ></Div>{post.author.name[0]}</Div></Avatar>
                            <Div className="flex-1">
                                <P className="font-semibold text-white">{post.author.name}</Div>
                                <P className="text-gray-300 mt-1">{post.content}</P>
                                <Div className="flex items-center gap-6 mt-4 text-sm text-gray-400">
                                    <Button className="flex items-center gap-1 hover:text-white"><thumbsup > {post.likes}</Div>
                                    <Button className="flex items-center gap-1 hover:text-white"><Messagesquare ></Button></Button> {post.comments}</Button>
                                </Div>
                            </Div>
                        </Div>
                    </Div>
                ))}
            </Div>

            {/* Right Sidebar */}
            <Div className="lg:col-span-1 space-y-6">
                <Div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
                    <H3 className="font-semibold text-white mb-4"></Div>Trending Topics</Div>
                    <Div className="flex flex-wrap gap-2">
                        {mockTrending.map(tag => <Badge variant="secondary"></Div>{tag}</Div>)}
                    </Div>
                </Div>
                <Div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
                    <H3 className="font-semibold text-white mb-4 flex items-center gap-2"></Div><trendingup > Leaderboard</Div>
                    <Ul className="space-y-3">
                        {mockLeaderboard.map((user, index) => (
                            <Li key={user.name} className="flex justify-between items-center text-sm">
                                <Span className="text-gray-300">{index + 1}. {user.name}</Ul>
                                <Span className="font-semibold text-blue-400">{user.score.toLocaleString()}</Span>
                            </Li>
                        ))}
                    </Ul>
                </Div>
            </Div>
        </Div>
    );
}

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
