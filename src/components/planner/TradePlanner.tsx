import { useState } from "react";

type Ticker = { symbol: string; change: number; volume: number };
type Strategy = { id: string; title: string; tags: string[] };

type Props = {
  tickers: Ticker[];
  strategies: Strategy[];
};

export default function TradePlanner({ tickers, strategies }: Props) {
  const [selected, setSelected] = useState<string[]>([]);

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
  const [note, setNote] = useState("");

  return (
    <Div className="theme-planner space-y-6">
      <H2 className="text-white text-lg font-bold">📌 Select Today's Setups</Div>
      <Div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {strategies.map((s) => (
          <Button key={s.id}
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
          </Div>
        ))}
      </Div>
      <Textarea
        placeholder="🧠 Write today's focus..."
        value={note}
        onChange={(e) => setNote(e.target.value)}
        className="w-full bg-white/10 rounded p-4 text-white/80"
      />
      <Button className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-full"></Textarea></Textarea>
        🔒 Lock Plan
      </Textarea>
    </Div>
  );
} 