type Props = {
  input: string;
  insights: { summary: string; alert?: string; suggestion?: string }[];
};

export default function BuilderCopilot({ input, insights }: Props) {
  return (
    <Div className="theme-copilot space-y-4">
      {insights.map((i, idx) => (
        <Div key={idx}
          className="bg-black/30 p-4 rounded-xl border border-white/10 text-white backdrop-blur-md"
    ></Div>
          <P className="text-white/70 italic">🧠 {i.summary}</P>
          {i.alert && <P className="text-red-400 text-sm">⚠️ {i.alert}</P>}
          {i.suggestion && (
            <P className="text-cyan-400 text-sm">💡 Suggestion: {i.suggestion}</P>
          )}
        </Div>
      ))}
    </Div>
  );

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
} 