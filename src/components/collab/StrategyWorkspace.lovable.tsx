type User = { id: string; name: string; color: string };
type Strategy = {
  title: string;
  rules: string[];
  notes: string;
};

type Props = {
  users: User[];
  strategy: Strategy;
  onUpdate: (strategy: Strategy) => void;
};

export default function StrategyWorkspace({ users, strategy, onUpdate }: Props) {
  return (
    <div >
      <div style={{ display: "flex", alignItems: "center" }}>
        {users.map((u) => (
          <span
            key={u.id}
            style={{ color: "white" }}
            style={{ backgroundColor: u.color }}
          >
            🧑‍💻 {u.name}
          </span>
        ))}
      </div>
      <input
        value={strategy.title}
        onChange={(e) => onUpdate({ ...strategy, title: e.target.value })}
        style={{ width: "100%", color: "white", fontWeight: "700" }}
      />
      <textarea
        value={strategy.notes}
        onChange={(e) => onUpdate({ ...strategy, notes: e.target.value })}
        placeholder="Strategy notes..."
        style={{ padding: "16px", width: "100%" }}
      />
      <div >
        {strategy.rules.map((rule, i) => (
          <input
            key={i}
            value={rule}
            onChange={(e) => {
              const newRules = [...strategy.rules];
              newRules[i] = e.target.value;
              onUpdate({ ...strategy, rules: newRules });
            }}
            style={{ width: "100%", color: "white" }}
          />
        ))}
      </div>
    </div>
  );
} 