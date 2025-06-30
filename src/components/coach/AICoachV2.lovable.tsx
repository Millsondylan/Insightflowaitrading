import { Trade, reviewTrade } from "@/lib/coach/reviewTrade";

type Props = {
  trades: Trade[];
};

export default function AICoachV2({ trades }: Props) {
  const reviews = trades.map(reviewTrade);

  return (
    <div className="space-y-6 theme-coach">
      {reviews.map((r, i) => (
        <Div key={i}
          className="bg-black/30 rounded-xl p-6 border border-white/10 backdrop-blur-md text-white space-y-2 shadow"
       >
          <p className="italic text-white/80">🧠 {r.summary}</p>
          <span className="inline-block px-2 py-1 rounded-full text-xs bg-cyan-600 text-white">
            🎭 {r.emotion}
          </span>
          <ul className="list-disc pl-6 text-white/70">
            {r.suggestions.map((s, j) => (
              <li key={j}>✅ {s}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
} 

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
