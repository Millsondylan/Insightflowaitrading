import { useState } from "react";
import ReactMarkdown from "react-markdown";

type LessonChunk = {
  id: string;
  content: string;
  type: "markdown" | "prompt" | "quiz";
  aiCommentary?: string;
};

type Props = {
  lessonId: string;
  chunks: LessonChunk[];
};

export default function LessonPlayground({ lessonId, chunks }: Props) {
  const [completed, setCompleted] = useState<string[]>([]);

  return (
    <div className="space-y-6 theme-academy">
      {chunks.map((chunk) => (
        <div
          key={chunk.id}
          className="bg-black/30 p-6 rounded-xl border border-white/10 backdrop-blur-md space-y-2"
        >
          {chunk.type === "markdown" && (
            <reactmarkdown  >{chunk.content}</ReactMarkdown>
          )}
          {chunk.type === "prompt" && (
            <textarea placeholder="What's your takeaway?" className="w-full p-2 bg-white/10 rounded" />
          )}
          {chunk.aiCommentary && (
            <p className="italic text-white/70">🧠 {chunk.aiCommentary}</p>
          )}
        </div>
      ))}
    </div>
  );
} 
export const lovable = { component: true };
