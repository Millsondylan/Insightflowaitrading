import React, { useState } from 'react';
import { Link } from 'react-router-dom';

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
        <div >
            {/* Main Feed */}
            <div >
                <div style={{ display: "flex", alignItems: "center" }}>
                    <div>
                        <h1 style={{ fontSize: "1.875rem", fontWeight: "700", color: "white", display: "flex", alignItems: "center" }}>
                            <span ><MessageSquare  /></span>
                            Community Feed
                        </h1>
                        <p style={{ color: "#9CA3AF" }}>Connect with other traders and share insights.</p>
                    </div>
                </div>

                {/* Create Post */}
                <div style={{ border: "1px solid #374151", borderRadius: "0.75rem", padding: "16px" }}>
                    <Textarea
                        value={newPost}
                        onChange={(e) => setNewPost(e.target.value)}
                        placeholder="Share your thoughts, charts, or trade ideas..."
                        
                    />
                    <div style={{ display: "flex" }}>
                        <Button >
                            <Send size={16}  /> Post
                        </Button>
                    </div>
                </div>

                {/* Posts */}
                {mockPosts.map(post => (
                    <div key={post.id} style={{ border: "1px solid #374151", borderRadius: "0.75rem" }}>
                        <div style={{ display: "flex" }}>
                            <Avatar><AvatarImage src={post.author.avatar} /><AvatarFallback>{post.author.name[0]}</AvatarFallback></Avatar>
                            <div >
                                <p style={{ color: "white" }}>{post.author.name}</p>
                                <p >{post.content}</p>
                                <div style={{ display: "flex", alignItems: "center", color: "#9CA3AF" }}>
                                    <button style={{ display: "flex", alignItems: "center" }}><ThumbsUp size={16} /> {post.likes}</button>
                                    <button style={{ display: "flex", alignItems: "center" }}><MessageSquare size={16} /> {post.comments}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Right Sidebar */}
            <div >
                <div style={{ border: "1px solid #374151", borderRadius: "0.75rem", padding: "24px" }}>
                    <h3 style={{ color: "white", marginBottom: "16px" }}>Trending Topics</h3>
                    <div style={{ display: "flex" }}>
                        {mockTrending.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                    </div>
                </div>
                <div style={{ border: "1px solid #374151", borderRadius: "0.75rem", padding: "24px" }}>
                    <h3 style={{ color: "white", marginBottom: "16px", display: "flex", alignItems: "center" }}><span style={{fontSize: '16px'}}>📈</span> Leaderboard</h3>
                    <ul >
                        {mockLeaderboard.map((user, index) => (
                            <li key={user.name} style={{ display: "flex", alignItems: "center" }}>
                                <span >{index + 1}. {user.name}</span>
                                <span >{user.score.toLocaleString()}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
