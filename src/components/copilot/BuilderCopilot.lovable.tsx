type Props = {
  input: string;
  insights: { summary: string; alert?: string; suggestion?: string }[];
};

export default function BuilderCopilot({ input, insights }: Props) {
  return (
    <div className="theme-copilot space-y-4">
      {insights.map((i, idx) => (
        <div
          key={idx}
          className="bg-black/30 p-4 rounded-xl border border-white/10 text-white backdrop-blur-md"
        >
          <p className="text-white/70 italic">🧠 {i.summary}</p>
          {i.alert && <p className="text-red-400 text-sm">⚠️ {i.alert}</p>}
          {i.suggestion && (
            <p className="text-cyan-400 text-sm">💡 Suggestion: {i.suggestion}</p>
          )}
        </div>
      ))}
    </div>
  );
} 
// Add Lovable.dev compatibility
export const lovable = {
  editableComponents: true,
  visualEditing: true,
  supportsTailwind: true
};
