export default function NovaAvtar({ size = "md" }) {
  const sizes = {
    sm: "w-7 h-7 text-xs",
    md: "w-9 h-9 text-sm",
    lg: "w-12 h-12 text-base",
  };
  return (
    <div
      className={`${sizes[size]} rounded-xl bg-linear-to-br from-indigo-500 via-violet-500 to-cyan-400 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/30`}
    >
      <svg width="55%" height="55%" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 2L14.5 9H22L16 13.5L18.5 20.5L12 16L5.5 20.5L8 13.5L2 9H9.5L12 2Z"
          fill="white"
          fillOpacity="0.95"
        />
      </svg>
    </div>
  );
}
