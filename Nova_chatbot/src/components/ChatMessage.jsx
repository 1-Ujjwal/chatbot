import NovaAvtar from "./NovaAvtar";

function UserAvatar() {
  return (
    <div className="w-7 h-7 rounded-xl bg-slate-700 flex items-center justify-center shrink-0 shadow-md">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="8" r="4" fill="white" fillOpacity="0.9" />
        <path
          d="M4 20c0-4 3.6-7 8-7s8 3 8 7"
          stroke="white"
          strokeOpacity="0.9"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

export default function ChatMessage({ message }) {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex items-end gap-2.5 message-enter ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      {isUser ? <UserAvatar /> : <NovaAvtar size="sm" />}

      <div
        className={`
          max-w-[72%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap shadow-sm
          ${
            isUser
              ? "bg-linear-to-br from-indigo-600 to-violet-700 text-white rounded-br-md shadow-indigo-200"
              : "bg-white border border-slate-100 text-slate-700 rounded-bl-md"
          }
        `}
      >
        {message.content}
      </div>
    </div>
  );
}
