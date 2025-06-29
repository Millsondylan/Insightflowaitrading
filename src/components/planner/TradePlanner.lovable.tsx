import { useState } from "react";

type Ticker = { symbol: string; change: number; volume: number };
type Strategy = { id: string; title: string; tags: string[] };

type Props = {
  tickers: Ticker[];
  strategies: Strategy[];
};

export default function TradePlanner({ tickers, strategies }: Props) {
  const [selected, setSelected] = useState<string[]>([]);
  const [note, setNote] = useState("");

  return (
    <div >
      <h2 style={{ color: "white", fontWeight: "700" }}>📌 Select Today's Setups</h2>
      <div >
        {strategies.map((s) => (
          <button
            key={s.id}
            onClick={() =>
              setSelected((prev) =>
                prev.includes(s.id) ? prev.filter((x) => x !== s.id) : [...prev, s.id]
              )
            }
            className={`p-4 rounded-xl border ${
              selected.includes(s.id)
                ? "border-cyan-600 bg-cyan-900/50 text-white"
                : "border-white/10 bg-white/5 text-white/60"
            }`}
          >
            ✅ {s.title}
          </button>
        ))}
      </div>
      <textarea
        placeholder="🧠 Write today's focus..."
        value={note}
        onChange={(e) => setNote(e.target.value)}
        style={{ width: "100%", padding: "16px" }}
      />
      <button style={{ color: "white" }}>
        🔒 Lock Plan
      </button>
    </div>
  );
} 