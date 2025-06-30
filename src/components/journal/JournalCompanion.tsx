type Entry = { date: string; text: string };
type Reflection = { summary: string; emotion: string; improvement?: string };

type Props = {
  entry: Entry;
  reflection: Reflection;
};

export default function JournalCompanion({ entry, reflection }: Props) {
  return (
    <div className="theme-journal space-y-4 bg-black/30 p-6 rounded-xl border border-white/10 text-white">
      <h3 className="text-lg font-bold">📝 Entry — {entry.date}</h3>
      <p className="text-white/70">{entry.text}</p>
      <hr className="border-white/10" />
      <p className="italic text-white/60">🧠 Summary: {reflection.summary}</p>
      <p className="text-cyan-400">🎭 Emotion: {reflection.emotion}</p>
      {reflection.improvement && (
        <p className="text-green-400">💡 Suggestion: {reflection.improvement}</p>
      )}
    </div>
  );
} 