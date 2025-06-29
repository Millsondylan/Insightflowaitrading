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
    <div >
      {segments.map((s, i) => (
        <div
          key={i}
          style={{ padding: "24px", borderRadius: "0.75rem", border: "1px solid #374151", color: "white" }}
        >
          <h3 style={{ fontWeight: "700" }}>{s.title}</h3>
          <p >🎙️ {s.script}</p>
        </div>
      ))}
    </div>
  );
} 