const PROMPTS = [
  { icon: "✦", label: "What can you do?" },
  { icon: "⚡", label: "Write a haiku about code" },
  { icon: "🌐", label: "Explain quantum computing" },
  { icon: "🎨", label: "Give me a color palette idea" },
];

export default function SuggestedPrompts({ onSelect }) {
  return (
    <div className="px-4 pb-2">
      <p className="text-xs text-slate-400 font-medium mb-2 ml-1 tracking-wide uppercase">
        Try asking
      </p>
      <div className="flex flex-wrap gap-2">
        {PROMPTS.map((p) => (
          <button
            key={p.label}
            onClick={() => onSelect(p.label)}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-700 hover:bg-indigo-50 transition-all duration-200 shadow-sm font-medium"
          >
            <span>{p.icon}</span>
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}
