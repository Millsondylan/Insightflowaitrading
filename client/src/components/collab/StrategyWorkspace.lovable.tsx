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
    <div className="theme-vault space-y-6">
      <div className="flex items-center gap-2">
        {users.map((u) => (
          <span key={u.id}
            className="px-3 py-1 text-xs rounded-full text-white"
            style={{ backgroundColor: u.color }}>
            🧑‍💻 {u.name}
          </div>
        ))}
      </div>
      <Input value={strategy.title}
        onChange={(e) => onUpdate({ ...strategy, title: e.target.value })}
        className="bg-white/10 p-2 rounded w-full text-white text-lg font-bold"
      />
      <Textarea
        value={strategy.notes}
        onChange={(e) => onUpdate({ ...strategy, notes: e.target.value })}
        placeholder="Strategy notes..."
        className="bg-white/5 p-4 rounded w-full text-white/80"
      />
      <div className="space-y-2">
        {strategy.rules.map((rule, i) => (
          <Input key={i}
            value={rule}
            onChange={(e) => {
              const newRules = [...strategy.rules];
              newRules[i] = e.target.value;
              onUpdate({ ...strategy, rules: newRules });
            }}
            className="bg-white/5 p-2 rounded w-full text-white"
          />
        ))}
      </Input>
    </div>
  );
} 

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
