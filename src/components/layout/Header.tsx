export function Header(): React.JSX.Element {
  return (
    <header
      className={[
        'sticky top-0 z-50 flex items-center px-5 shrink-0',
        'bg-white/40 backdrop-blur-2xl',
        'border-b border-white/20',
      ].join(' ')}
      style={{ height: '56px' }}
    >
      {/* Gold music note icon */}
      <span
        className="mr-2 text-xl"
        aria-hidden="true"
        style={{ color: 'var(--color-accent-gold)' }}
      >
        ♫
      </span>

      {/* App title — Source Serif 4, bold */}
      <h1
        className="text-[24px] md:text-[28px] font-bold leading-none tracking-tight"
        style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-text-on-glass)' }}
      >
        ClassiTranspose
      </h1>
    </header>
  );
}
