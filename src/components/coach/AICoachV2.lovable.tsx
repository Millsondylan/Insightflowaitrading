import { Trade, reviewTrade } from "@/lib/coach/reviewTrade";

type Props = {
  trades: Trade[];
};

export default function AICoachV2({ trades }: Props) {
  const reviews = trades.map(reviewTrade);

  return (
    <div >
      {reviews.map((r, i) => (
        <div
          key={i}
          style={{ borderRadius: "0.75rem", padding: "24px", border: "1px solid #374151", color: "white" }}
        >
          <p >🧠 {r.summary}</p>
          <span style={{ color: "white" }}>
            🎭 {r.emotion}
          </span>
          <ul >
            {r.suggestions.map((s, j) => (
              <li key={j}>✅ {s}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
} 