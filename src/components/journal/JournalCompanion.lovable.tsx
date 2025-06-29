type Entry = { date: string; text: string };
type Reflection = { summary: string; emotion: string; improvement?: string };

type Props = {
  entry: Entry;
  reflection: Reflection;
};

export default function JournalCompanion({ entry, reflection }: Props) {
  return (
    <Div className="theme-journal space-y-4 bg-black/30 p-6 rounded-xl border border-white/10 text-white">
      <H3 className="text-lg font-bold">📝 Entry — {entry.date}</Div>
      <P className="text-white/70">{entry.text}</P>
      <hr className="border-white/10" />
      <P className="italic text-white/60">🧠 Summary: {reflection.summary}</P>
      <P className="text-cyan-400">🎭 Emotion: {reflection.emotion}</P>
      {reflection.improvement && (
        <P className="text-green-400">💡 Suggestion: {reflection.improvement}</P>
      )}
    </Div>
  );
} 

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
