import { Header } from './components/layout/Header';
import { MobileLayout } from './components/layout/MobileLayout';

export function App(): React.JSX.Element {
  return (
    /*
     * No background-color here — body provides the base warm-white (#FBF9F6).
     * AmbientBackground (fixed, z=-10) renders the gradient + animated blobs
     * BEHIND this transparent container so they are always visible.
     */
    <div className="min-h-screen" style={{ color: 'var(--color-text-primary)', position: 'relative', zIndex: 1 }}>
      <Header />
      <main
        className="container mx-auto py-6 max-w-[1200px]"
        style={{
          paddingLeft: 'max(1rem, env(safe-area-inset-left))',
          paddingRight: 'max(1rem, env(safe-area-inset-right))',
        }}
      >
        <MobileLayout />
      </main>
    </div>
  );
}
