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
    <div >
      {chunks.map((chunk) => (
        <div
          key={chunk.id}
          style={{ padding: "24px", borderRadius: "0.75rem", border: "1px solid #374151" }}
        >
          {chunk.type === "markdown" && (
            <ReactMarkdown>{chunk.content}</ReactMarkdown>
          )}
          {chunk.type === "prompt" && (
            <textarea placeholder="What's your takeaway?" style={{ width: "100%" }} />
          )}
          {chunk.aiCommentary && (
            <p >🧠 {chunk.aiCommentary}</p>
          )}
        </div>
      ))}
    </div>
  );
} 