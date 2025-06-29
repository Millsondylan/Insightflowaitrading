type Props = {
  input: string;
  insights: { summary: string; alert?: string; suggestion?: string }[];
};

export default function BuilderCopilot({ input, insights }: Props) {
  return (
    <div >
      {insights.map((i, idx) => (
        <div
          key={idx}
          style={{ padding: "16px", borderRadius: "0.75rem", border: "1px solid #374151", color: "white" }}
        >
          <p >🧠 {i.summary}</p>
          {i.alert && <p >⚠️ {i.alert}</p>}
          {i.suggestion && (
            <p >💡 Suggestion: {i.suggestion}</p>
          )}
        </div>
      ))}
    </div>
  );
} 