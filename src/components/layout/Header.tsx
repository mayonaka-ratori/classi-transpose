import { useTranslation } from '../../i18n';

export function Header(): React.JSX.Element {
  const { lang, t, toggle } = useTranslation();

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
          {t.app.title}
        </h1>
      </div>

      {/* Right: JP | EN language toggle */}
      <button
        type="button"
        onClick={toggle}
        aria-label={lang === 'ja' ? 'Switch to English' : '日本語に切り替え'}
        className={[
          'flex items-center gap-1 px-3 py-1.5 rounded-full',
          'text-xs font-semibold',
          'bg-white/40 backdrop-blur-md border border-white/30 shadow-sm',
          'transition-all duration-200 hover:bg-white/60 hover:scale-105 active:scale-95',
          'focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent-rose)]/50 focus-visible:ring-offset-2',
        ].join(' ')}
      >
        <span style={{ color: lang === 'ja' ? 'var(--color-accent-rose)' : 'var(--color-text-tertiary)', fontWeight: lang === 'ja' ? 700 : 500 }}>
          {t.header.langJa}
        </span>
        <span style={{ color: 'var(--color-text-tertiary)' }}>|</span>
        <span style={{ color: lang === 'en' ? 'var(--color-accent-rose)' : 'var(--color-text-tertiary)', fontWeight: lang === 'en' ? 700 : 500 }}>
          {t.header.langEn}
        </span>
      </button>
    </header>
  );
}
