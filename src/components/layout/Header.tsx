export function Header(): React.JSX.Element {
  return (
    <header
      className={[
        'sticky top-0 z-50 flex items-center justify-between px-5 shrink-0',
        'bg-white/40 backdrop-blur-2xl',
        'border-b border-white/20',
      ].join(' ')}
      style={{ minHeight: '56px', paddingTop: 'env(safe-area-inset-top)' }}
    >
      {/* Left: gold music note + app title */}
      <div className="flex items-center gap-2">
        <span
          className="text-xl"
          aria-hidden="true"
          style={{ color: 'var(--color-accent-gold)' }}
        >
          ♫
        </span>
        <h1
          className="text-[24px] md:text-[28px] font-bold leading-none tracking-tight"
          style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-text-on-glass)' }}
        >
          ClassiTranspose
        </h1>
      </div>
    </header>
  );
}
