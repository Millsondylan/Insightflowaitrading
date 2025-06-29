import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageSquare, ThumbsUp, TrendingUp, Send } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Share2 } from 'lucide-react';

interface Post {
    id: string;
    content: string;
    author: string;
    likes: number;
    comments: number;
    timestamp: string;
}

const mockPosts: Post[] = [
    {
        id: '1',
        content: 'Just discovered a great trading strategy using moving averages!',
        author: 'TradingPro',
        likes: 42,
        comments: 12,
        timestamp: '2024-01-01T12:00:00Z'
    },
    {
        id: '2',
        content: 'Anyone else trading the EUR/USD breakout?',
        author: 'ForexTrader',
        likes: 28,
        comments: 8,
        timestamp: '2024-01-02T15:30:00Z'
    }
];

const mockTrending = ['#BTC', '#ETH', '#Earnings', '#FedMeeting'];
const mockLeaderboard = [
    { name: 'CryptoWhale', score: 12500 },
    { name: 'StockSensei', score: 11200 },
    { name: 'TradingPro', score: 9800 },
];

export default function CommunityPage() {
    const [posts, setPosts] = useState<Post[]>(mockPosts);
    const [newPost, setNewPost] = useState('');

    const handlePostSubmit = () => {
        if (!newPost.trim()) return;

        const post: Post = {
            id: String(posts.length + 1),
            content: newPost,
            author: 'CurrentUser',
            likes: 0,
            comments: 0,
            timestamp: new Date().toISOString()
        };

        setPosts([post, ...posts]);
        setNewPost('');
    };

    const handleLike = (postId: string) => {
        setPosts(posts.map(post => 
            post.id === postId ? { ...post, likes: post.likes + 1 } : post
        ));
    };

    return (
        <Div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Main Feed */}
            <Div className="lg:col-span-2 space-y-6">
                <Div className="flex justify-between items-center">
                    <Div>
                        <H1 className="text-3xl font-bold text-white flex items-center gap-3">
                            <Span className="bg-white/10 p-2 rounded-lg"><MessageSquare className="text-blue-400" / />
                            Community Feed
                        </Post>
                        <P className="text-gray-400 mt-1">Connect with other traders and share insights.</P>
                    </Div>
                </Div>

                {/* Create Post */}
                <Card className="mb-6" />
                    <CardContent className="pt-6" />
                        <Div className="flex gap-4">
                            <Input value={newPost}
                                onChange={(e) = /> setNewPost(e.target.value)}
                                placeholder="Share your trading insights..."
                                className="flex-1"
                            />
                            <Button onClick={handlePostSubmit} />Post</Card>
                        </div />
                </Card>

                {/* Posts */}
                <Div className="space-y-4">
                    {posts.map((post) => (
                        <Card key={post.id} />
                            <CardHeader>
                                <Div className="flex justify-between items-start">
                                    <Div>
                                        <CardTitle className="text-lg" />{post.author}</Div>
                                        <P className="text-sm text-gray-400">
                                            {new Date(post.timestamp).toLocaleDateString()}
                                        </P>
                                    </Div>
                                </div />
                            <CardContent>
                                <P className="text-gray-200 mb-4">{post.content}</CardContent>
                                <Div className="flex gap-4">
                                    <Button variant="ghost"
                                        size="sm"
                                        onClick={() = /> handleLike(post.id)}
                                        className="text-gray-400 hover:text-blue-400"
                                    >
                                        <ThumbsUp className="h-4 w-4 mr-2" />
                                        {post.likes}
                                    </Div>
                                    <Button variant="ghost"
                                        size="sm"
                                        className="text-gray-400 hover:text-purple-400"
                         >
                                        <MessageSquare className="h-4 w-4 mr-2" />
                                        {post.comments}
                                    </Button>
                                    <Button variant="ghost"
                                        size="sm"
                                        className="text-gray-400 hover:text-green-400"
                         >
                                        <Share2 className="h-4 w-4 mr-2" />
                                        Share
                                    </Button>
                                </div />
                        </Card>
                    ))}
                </Div>
            </Div>

            {/* Right Sidebar */}
            <Div className="lg:col-span-1 space-y-6">
                <Div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
                    <H3 className="font-semibold text-white mb-4">Trending Topics</Div>
                    <Div className="flex flex-wrap gap-2">
                        {mockTrending.map(tag => <Badge key={tag} variant="secondary" />{tag}</Div>)}
                    </Div>
                </Div>
                <Div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
                    <H3 className="font-semibold text-white mb-4 flex items-center gap-2"><TrendingUp size={18}/></Div></Div> Leaderboard</H3>
                    <Ul className="space-y-3">
                        {mockLeaderboard.map((user, index) => (
                            <Li key={user.name} className="flex justify-between items-center text-sm">
                                <Span className="text-gray-300">{index + 1}. {user.name}</Ul>
                                <Span className="font-semibold text-blue-400">{user.score.toLocaleString()}</span />
                        ))}
                    </Span>
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
