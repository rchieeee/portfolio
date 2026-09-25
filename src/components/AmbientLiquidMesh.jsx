export default function AmbientLiquidMesh() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-20 overflow-hidden select-none"
    >
      {/* ── Blob 1: Luminous Sky / Cyan (Top-Right) ── */}
      <div
        className="liquid-blob absolute -top-24 -right-24 h-[550px] w-[550px] sm:h-[700px] sm:w-[700px] rounded-full bg-gradient-to-br from-sky-400/35 via-cyan-400/25 to-blue-500/20 blur-[120px] dark:from-sky-500/20 dark:via-cyan-600/15 dark:to-blue-700/10 dark:blur-[140px]"
        style={{
          animation: 'liquidDrift1 22s ease-in-out infinite alternate',
        }}
      />

      {/* ── Blob 2: Ethereal Indigo / Purple (Mid-Left) ── */}
      <div
        className="liquid-blob absolute top-[35%] -left-32 h-[500px] w-[500px] sm:h-[650px] sm:w-[650px] rounded-full bg-gradient-to-tr from-indigo-400/30 via-purple-400/20 to-pink-400/15 blur-[120px] dark:from-indigo-600/18 dark:via-purple-700/14 dark:to-violet-800/10 dark:blur-[140px]"
        style={{
          animation: 'liquidDrift2 26s ease-in-out infinite alternate',
        }}
      />

      {/* ── Blob 3: Warm Amber / Peach Glow (Bottom-Right) ── */}
      <div
        className="liquid-blob absolute top-[70%] -right-20 h-[500px] w-[500px] sm:h-[650px] sm:w-[650px] rounded-full bg-gradient-to-tl from-amber-300/25 via-rose-300/20 to-orange-300/15 blur-[130px] dark:from-amber-600/15 dark:via-rose-700/12 dark:to-indigo-950/15 dark:blur-[150px]"
        style={{
          animation: 'liquidDrift3 28s ease-in-out infinite alternate',
        }}
      />

      {/* ── Blob 4: Emerald / Cyan Refraction Anchor (Center) ── */}
      <div
        className="liquid-blob absolute top-[15%] left-[25%] h-[400px] w-[400px] sm:h-[520px] sm:w-[520px] rounded-full bg-gradient-to-br from-emerald-400/20 via-teal-300/15 to-transparent blur-[110px] dark:from-emerald-500/12 dark:via-teal-600/10 dark:to-transparent dark:blur-[130px]"
        style={{
          animation: 'liquidDrift1 20s ease-in-out infinite alternate-reverse',
        }}
      />
    </div>
  )
}
