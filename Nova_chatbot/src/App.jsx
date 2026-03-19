import { useState, useRef, useEffect } from "react";
import ChatMessage from "./components/ChatMessage";
import TypingIndicator from "./components/TypingIndicator";
import SuggestedPrompts from "./components/SuggestedPrompt";
import NovaAvatar from "./components/NovaAvtar";

const SYSTEM_PROMPT = `You are Nova, a brilliantly sharp and warm AI assistant. You're helpful, concise, and occasionally witty. Keep responses conversational — avoid walls of text unless the user genuinely needs depth. Use markdown-style formatting sparingly. You have a calm, confident personality.`;

const INITIAL_MESSAGE = {
  role: "assistant",
  content:
    "Hey, I'm Nova ✦\nYour AI companion. Ask me anything — I'm all yours.",
};

const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY || "";

export default function App() {
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);
  const isFirstMessage = messages.length === 1;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const autoResize = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 140) + "px";
  };

  const sendMessage = async (text = input) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    setError(null);
    const userMsg = { role: "user", content: trimmed };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    setLoading(true);

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1024,
          system: SYSTEM_PROMPT,
          messages: updated.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error?.message || `HTTP ${res.status}`);
      }

      const data = await res.json();
      const reply =
        data?.content?.find((b) => b.type === "text")?.text ||
        "Hmm, I had trouble with that.";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (e) {
      setError(e.message || "Something went wrong.");
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "⚠️ " + (e.message || "Request failed. Please try again."),
        },
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => textareaRef.current?.focus(), 80);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([INITIAL_MESSAGE]);
    setError(null);
    setTimeout(() => textareaRef.current?.focus(), 80);
  };

  const noApiKey = !API_KEY;

  return (
    <div className="min-h-screen w-full bg-slate-50 bg-noise flex items-center justify-center p-4 overflow-hidden">
      {/* Background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-violet-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-100/20 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-lg h-170 flex flex-col bg-white/75 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-slate-300/50 border border-white/80 overflow-hidden">
        {/* Header */}
        <header className="shrink-0 px-5 py-4 flex items-center justify-between border-b border-slate-100/80 bg-white/60 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <NovaAvatar size="md" />
            <div>
              <h1 className="font-display text-base font-700 text-slate-800 tracking-tight">
                Nova
              </h1>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400" />
                <span className="text-xs text-slate-400 font-medium">
                  Online · AI Assistant
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {messages.length > 1 && (
              <button
                onClick={clearChat}
                className="text-xs text-slate-400 hover:text-slate-700 px-3 py-1.5 rounded-xl hover:bg-slate-100 transition-all duration-200 font-medium"
              >
                Clear
              </button>
            )}
          </div>
        </header>

        {/* API Key Warning */}
        {noApiKey && (
          <div className="shrink-0 mx-4 mt-3 px-4 py-3 bg-amber-50 border border-amber-200 rounded-2xl">
            <p className="text-xs text-amber-700 font-medium">
              ⚠️ No API key found. Add{" "}
              <code className="font-mono bg-amber-100 px-1 rounded">
                VITE_ANTHROPIC_API_KEY
              </code>{" "}
              to your{" "}
              <code className="font-mono bg-amber-100 px-1 rounded">.env</code>{" "}
              file.
            </p>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4 scroll-smooth">
          {messages.map((msg, i) => (
            <ChatMessage key={i} message={msg} />
          ))}
          {loading && <TypingIndicator />}
          <div ref={bottomRef} />
        </div>

        {/* Suggested prompts (only on first message) */}
        {isFirstMessage && !loading && (
          <SuggestedPrompts onSelect={(p) => sendMessage(p)} />
        )}

        {/* Input area */}
        <div className="shrink-0 p-4 border-t border-slate-100/80 bg-white/60 backdrop-blur-sm">
          <div className="flex items-end gap-2 bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-sm focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-100/60 transition-all duration-200">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                autoResize();
              }}
              onKeyDown={handleKey}
              placeholder="Ask Nova anything…"
              rows={1}
              disabled={loading || noApiKey}
              className="flex-1 resize-none bg-transparent text-sm text-slate-800 placeholder-slate-400 outline-none leading-relaxed disabled:opacity-50 font-sans"
              style={{ scrollbarWidth: "none", overflowY: "auto" }}
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading || noApiKey}
              aria-label="Send message"
              className="w-8 h-8 rounded-xl bg-linear-to-br from-indigo-600 to-violet-700 flex items-center justify-center shrink-0 shadow-md shadow-indigo-300/40 hover:opacity-90 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
            >
              <svg
                className="w-3.5 h-3.5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                />
              </svg>
            </button>
          </div>
          <p className="text-center text-slate-400 text-xs mt-2.5 tracking-wide">
            Enter to send · Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
}
