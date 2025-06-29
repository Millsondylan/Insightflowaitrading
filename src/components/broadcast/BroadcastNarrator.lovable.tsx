type BroadcastSegment = {
  type: "vault" | "market" | "replay";
  title: string;
  script: string;
};

type Props = {
  segments: BroadcastSegment[];
};

export default function BroadcastNarrator({ segments }: Props) {
  return (
    <div className="theme-broadcast space-y-6">
      {segments.map((s, i) => (
        <Div key={i}
          className="bg-black/30 p-6 rounded-xl border border-white/10 backdrop-blur-md space-y-2 text-white shadow"
      >
          <h3 className="text-lg font-bold">{s.title}</h3>
          <p className="text-white/70 leading-relaxed italic">🎙️ {s.script}</p>
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
