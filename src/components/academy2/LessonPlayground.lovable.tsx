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
    <Div className="space-y-6 theme-academy">
      {chunks.map((chunk) => (
        <Div key={chunk.id}
          className="bg-black/30 p-6 rounded-xl border border-white/10 backdrop-blur-md space-y-2"
    >
          {chunk.type === "markdown" && (
            <Reactmarkdown  />{chunk.content}</Div>
          )}
          {chunk.type === "prompt" && (
            <Textarea placeholder="What's your takeaway?" className="w-full p-2 bg-white/10 rounded" />
          )}
          {chunk.aiCommentary && (
            <P className="italic text-white/70">🧠 {chunk.aiCommentary}</Textarea>
          )}
        </Div>
      ))}
    </Div>
  );
} 

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
