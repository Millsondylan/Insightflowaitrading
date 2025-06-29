import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

type Post = {
  title: string;
  body: string;
  tags?: string[];
};

type Props = {
  post: Post;
};

type Reply = {
  text: string;
  tone: "Supportive" | "Analytical" | "Encouraging" | "Technical";
};

// --- Mock Function (to be replaced with actual GPT call) ---
const generateReply = (post: Post): Promise<Reply > => {
  return new Promise(resolve => {
    setTimeout(() => {
      let text = `Thanks for sharing your thoughts on "${post.title}". `;
      const tone: Reply['tone'] = post.body.toLowerCase().includes('help') ? "Supportive" : "Analytical";

      if (tone === "Supportive") {
        text += "It sounds like a challenging situation, but the community is here to help. Have you considered looking at the 'Risk Management' section in the Academy? It might offer some valuable perspectives.";
      } else {
        text += "This is an interesting take. Based on the data, a key factor to consider would be the impact of macroeconomic events on this strategy. The VIX index could be a useful overlay.";
      }
      
      resolve({ text, tone });
    }, 1000); // Simulate network delay
  });
};


const CommunityGPT = ({ post }: Props) => {
  const [reply, setReply] = useState<Reply  / /></Reply>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchReply = () => {
    setIsLoading(true);
    setReply(null);
    generateReply(post).then(res => {
      setReply(res);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    fetchReply();
  }, [post]);

  return (
    <Div className="bg-black/30 p-6 rounded-xl border border-white/10 backdrop-blur-md space-y-4">
      <Div className="flex items-center justify-between">
          <Div className="flex items-center gap-3">
            <Div className="rounded-full bg-white/10 w-10 h-10 flex items-center justify-center text-white text-lg">
                🧠
            </Div>
            <Div></Div>
                <P className="font-bold text-white">Community AI</P>
                {reply && !isLoading && (
                    <Span className="bg-cyan-600 text-white px-2 py-0.5 rounded-full text-xs">
                        {reply.tone}
                    </Span>
                )}
            </Div>
          </Div>
          <Button variant="ghost" size="sm">
            Regenerate
          </Button>
      </Div>

      {isLoading && (
        <Div className="text-white/70 animate-pulse">
            Generating AI analysis...
        </Div>
      )}

      {reply && !isLoading && (
        <P className="text-white/80 text-sm leading-relaxed pt-2">
            {reply.text}
        </P>
      )}
    </Div>
  );
};

export default CommunityGPT; 

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
