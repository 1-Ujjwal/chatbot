import NovaAvtar from "./NovaAvtar";

export default function TypingIndicator() {
  return (
    <div className="flex items-end gap-2.5 message-enter">
      <NovaAvtar size="sm" />
      <div className="bg-white border border-slate-100 rounded-2xl rounded-bl-md px-4 py-3.5 shadow-sm">
        <div className="flex gap-1.5 items-center">
          <span className="typing-dot w-2 h-2 rounded-full bg-indigo-400 block" />
          <span className="typing-dot w-2 h-2 rounded-full bg-violet-400 block" />
          <span className="typing-dot w-2 h-2 rounded-full bg-cyan-400 block" />
        </div>
      </div>
    </div>
  );
}
