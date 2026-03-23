/**
 * AmbientBackground
 * 3 animated gradient blobs that float behind all content.
 * Fixed position, -z-10, pointer-events-none.
 */
export function AmbientBackground(): React.JSX.Element {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{
        zIndex: 0,
        background: 'linear-gradient(135deg, #FBF9F6 0%, #F5EDE3 50%, #E8DDD0 100%)',
      }}
    >
      {/* Blob 1 — Rose (opacity 0.10 → 0.18) */}
      <div
        className="absolute rounded-full animate-blob-float-1 will-change-transform"
        style={{
          top: '-200px',
          left: '-200px',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(194,24,91,0.18), transparent 70%)',
          filter: 'blur(80px)',
        }}
      />

      {/* Blob 2 — Gold (opacity 0.08 → 0.15) */}
      <div
        className="absolute rounded-full animate-blob-float-2 will-change-transform"
        style={{
          top: '30%',
          right: '-150px',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(184,134,11,0.15), transparent 70%)',
          filter: 'blur(100px)',
        }}
      />

      {/* Blob 3 — Indigo (opacity 0.07 → 0.13) */}
      <div
        className="absolute rounded-full animate-blob-float-3 will-change-transform"
        style={{
          bottom: '-100px',
          left: '20%',
          width: '550px',
          height: '550px',
          background: 'radial-gradient(circle, rgba(92,107,192,0.13), transparent 70%)',
          filter: 'blur(90px)',
        }}
      />
    </div>
  );
}
