type Entry = { date: string; text: string };
type Reflection = { summary: string; emotion: string; improvement?: string };

type Props = {
  entry: Entry;
  reflection: Reflection;
};

export default function JournalCompanion({ entry, reflection }: Props) {
  return (
    <div style={{ padding: "24px", borderRadius: "0.75rem", border: "1px solid #374151", color: "white" }}>
      <h3 style={{ fontWeight: "700" }}>📝 Entry — {entry.date}</h3>
      <p >{entry.text}</p>
      <hr  />
      <p >🧠 Summary: {reflection.summary}</p>
      <p >🎭 Emotion: {reflection.emotion}</p>
      {reflection.improvement && (
        <p >💡 Suggestion: {reflection.improvement}</p>
      )}
    </div>
  );
} 