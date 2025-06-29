type Insight = {
  type: "market" | "strategy" | "mindset";
  title: string;
  summary: string;
  tone?: string;
};

type Props = {
  insights: Insight[];
};

export default function InsightFeed({ insights }: Props) {
  return (
    <div >
      {insights.map((insight, i) => (
        <div
          key={i}
          style={{ padding: "24px", borderRadius: "0.75rem", border: "1px solid #374151", color: "white" }}
        >
          <h3 >{insight.title}</h3>
          <p >{insight.summary}</p>
          {insight.tone && (
            <span style={{ color: "white" }}>
              {insight.tone}
            </span>
          )}
        </div>
      ))}
    </div>
  );
} 