
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
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 theme-feed">
      {insights.map((insight, i) => (
        <div key={i}
          className="bg-black/30 p-6 rounded-xl border border-white/10 backdrop-blur-md text-white space-y-2">
          <h3 className="text-lg font-semibold">{insight.title}</h3>
          <p className="text-white/70 text-sm italic">{insight.summary}</p>
          {insight.tone && (
            <span className="text-xs px-2 py-1 bg-cyan-600 text-white rounded-full">
              {insight.tone}
            </span>
          )}
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
